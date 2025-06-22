use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("GMTRzthGWTAucZQP9dZpMPr4QwmZ6fqhTgTGyqEh22La");

#[program]
pub mod hashdash {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        decimals: u8,
        total_supply: Option<u64>,
    ) -> Result<()> {
        // Set default total supply to 1 billion tokens (with 9 decimals) if not provided or 0
        let mut supply = total_supply.unwrap_or(0);
        if supply == 0 {
            supply = 1_000_000_000_000_000_000;
        }
        // Enforce decimals == 9
        require!(decimals == 9, ErrorCode::InvalidDecimals);
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.token_mint = ctx.accounts.token_mint.key();
        state.token_vault = ctx.accounts.token_vault.key();
        state.sol_vault = ctx.accounts.sol_vault.key();
        state.name = name;
        state.symbol = symbol;
        state.decimals = decimals;
        state.total_supply = supply;
        state.sol_balance = 0;
        state.launch_fee = 1_000_000_000; // 1 SOL in lamports
        state.trading_fee_bps = 30; // 0.3%
        // Mint the full supply to the vault
        let mint_bump = *ctx.bumps.get("mint_authority").ok_or(ErrorCode::MissingBump)?;
        let bump_slice = [mint_bump];
        let seeds: &[&[&[u8]]] = &[&[b"mint_authority", &bump_slice]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.token_mint.to_account_info(),
                to: ctx.accounts.token_vault.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            seeds,
        );
        token::mint_to(cpi_ctx, supply)?;
        // Revoke mint authority after minting
        let cpi_ctx_revoke = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::SetAuthority {
                account_or_mint: ctx.accounts.token_mint.to_account_info(),
                current_authority: ctx.accounts.mint_authority.to_account_info(),
            },
            seeds,
        );
        token::set_authority(
            cpi_ctx_revoke,
            token::spl_token::instruction::AuthorityType::MintTokens,
            None,
        )?;
        emit!(InitializeEvent {
            authority: ctx.accounts.authority.key(),
            token_mint: ctx.accounts.token_mint.key(),
        });
        Ok(())
    }

    pub fn buy(ctx: Context<Buy>, sol_amount: u64, min_tokens_out: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        require!(sol_amount > 0, ErrorCode::InvalidAmount);
        require!(ctx.accounts.user_token_account.owner == ctx.accounts.user.key(), ErrorCode::InvalidTokenAccount);
        require!(ctx.accounts.user_token_account.mint == ctx.accounts.token_mint.key(), ErrorCode::InvalidTokenMint);
        // Calculate trading fee
        let fee = (sol_amount as u128)
            .checked_mul(state.trading_fee_bps as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)? as u64;
        let sol_amount_after_fee = sol_amount.checked_sub(fee).ok_or(ErrorCode::MathOverflow)?;
        // Constant product formula: (x + dx) * (y - dy) = k
        // Solve for dx (tokens out) given dy (SOL in):
        // dx = x - k / (y + dy)
        let x = ctx.accounts.token_vault.amount as u128;
        let y = state.sol_balance as u128;
        let dy = sol_amount_after_fee as u128;
        let k = x.checked_mul(y).ok_or(ErrorCode::MathOverflow)?;
        let new_y = y.checked_add(dy).ok_or(ErrorCode::MathOverflow)?;
        let new_x = k.checked_div(new_y).ok_or(ErrorCode::MathOverflow)?;
        let token_amount = x.checked_sub(new_x).ok_or(ErrorCode::MathOverflow)? as u64;
        require!(token_amount > 0, ErrorCode::InsufficientLiquidity);
        require!(ctx.accounts.token_vault.amount >= token_amount, ErrorCode::InsufficientLiquidity);
        // Slippage protection
        require!(token_amount >= min_tokens_out, ErrorCode::SlippageExceeded);
        // Transfer SOL from user to contract
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.sol_vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, sol_amount)?;
        // Transfer tokens from vault to user
        let vault_bump = *ctx.bumps.get("token_vault_authority").ok_or(ErrorCode::MissingBump)?;
        let bump_slice = [vault_bump];
        let seeds: &[&[&[u8]]] = &[&[b"token_vault_authority", &bump_slice]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.token_vault.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.token_vault_authority.to_account_info(),
            },
            seeds,
        );
        token::transfer(cpi_ctx, token_amount)?;
        // Update state
        state.sol_balance = state.sol_balance.checked_add(sol_amount_after_fee).ok_or(ErrorCode::MathOverflow)?;
        emit!(BuyEvent {
            user: ctx.accounts.user.key(),
            token_amount,
            sol_amount,
        });
        Ok(())
    }

    pub fn sell(ctx: Context<Sell>, token_amount: u64, min_sol_out: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        require!(token_amount > 0, ErrorCode::InvalidAmount);
        require!(ctx.accounts.user_token_account.owner == ctx.accounts.user.key(), ErrorCode::InvalidTokenAccount);
        require!(ctx.accounts.user_token_account.mint == ctx.accounts.token_mint.key(), ErrorCode::InvalidTokenMint);
        require!(ctx.accounts.user_token_account.amount >= token_amount, ErrorCode::InsufficientTokenBalance);
        // Constant product formula: (x - dx) * (y + dy) = k
        // Solve for dy (SOL out) given dx (tokens in):
        // dy = k / (x - dx) - y
        let x = ctx.accounts.token_vault.amount as u128;
        let y = state.sol_balance as u128;
        let dx = token_amount as u128;
        let k = x.checked_mul(y).ok_or(ErrorCode::MathOverflow)?;
        let new_x = x.checked_add(dx).ok_or(ErrorCode::MathOverflow)?;
        let new_y = k.checked_div(new_x).ok_or(ErrorCode::MathOverflow)?;
        let sol_amount = new_y.checked_sub(y).ok_or(ErrorCode::MathOverflow)? as u64;
        // Calculate the trading fee
        let fee = (sol_amount as u128)
            .checked_mul(state.trading_fee_bps as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)? as u64;
        let sol_amount_after_fee = sol_amount.checked_sub(fee).ok_or(ErrorCode::MathOverflow)?;
        require!(sol_amount_after_fee > 0, ErrorCode::InsufficientLiquidity);
        // Slippage protection
        require!(sol_amount_after_fee >= min_sol_out, ErrorCode::SlippageExceeded);
        // Transfer tokens from user to vault
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.token_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, token_amount)?;
        // Transfer SOL from vault to user
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.sol_vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, sol_amount_after_fee)?;
        // Update state
        state.sol_balance = state.sol_balance.checked_sub(sol_amount).ok_or(ErrorCode::MathOverflow)?;
        emit!(SellEvent {
            user: ctx.accounts.user.key(),
            token_amount,
            sol_amount: sol_amount_after_fee,
        });
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        require!(
            ctx.accounts.authority.key() == state.authority,
            ErrorCode::Unauthorized
        );
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        let sol_vault = &ctx.accounts.sol_vault;
        let destination = &ctx.accounts.destination;
        // Only allow withdraw up to the sol_balance
        require!(
            amount <= state.sol_balance,
            ErrorCode::InsufficientLiquidity
        );
        // Transfer SOL from the vault to the destination
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: sol_vault.to_account_info(),
                to: destination.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;
        state.sol_balance = state
            .sol_balance
            .checked_sub(amount)
            .ok_or(ErrorCode::MathOverflow)?;
        emit!(WithdrawEvent {
            authority: ctx.accounts.authority.key(),
            amount,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 32 + 32 + 32 + 4 + 4 + 1 + 8 + 8 + 8 + 2,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, State>,
    #[account(
        init,
        payer = authority,
        mint::decimals = 9,
        mint::authority = mint_authority,
    )]
    pub token_mint: Account<'info, Mint>,
    /// CHECK: PDA authority for minting
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: UncheckedAccount<'info>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = token_mint,
        associated_token::authority = token_vault_authority,
    )]
    pub token_vault: Account<'info, TokenAccount>,
    /// CHECK: PDA authority for token vault
    #[account(
        seeds = [b"token_vault_authority"],
        bump
    )]
    pub token_vault_authority: UncheckedAccount<'info>,
    /// CHECK: This is the SOL vault (PDA)
    #[account(
        mut,
        seeds = [b"sol_vault"],
        bump
    )]
    pub sol_vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    /// CHECK: PDA authority for minting
    pub mint_authority: UncheckedAccount<'info>,
    /// CHECK: This is the SOL vault (PDA)
    #[account(mut)]
    pub sol_vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Sell<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    /// CHECK: This is the SOL vault (PDA)
    #[account(mut)]
    pub sol_vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub sol_vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub destination: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct State {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub token_vault: Pubkey,
    pub sol_vault: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub sol_balance: u64,
    pub launch_fee: u64,
    pub trading_fee_bps: u16,
}

#[event]
pub struct BuyEvent {
    pub user: Pubkey,
    pub token_amount: u64,
    pub sol_amount: u64,
}

#[event]
pub struct SellEvent {
    pub user: Pubkey,
    pub token_amount: u64,
    pub sol_amount: u64,
}

#[event]
pub struct InitializeEvent {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
}

#[event]
pub struct WithdrawEvent {
    pub authority: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow or underflow")]
    MathOverflow,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
    #[msg("Missing bump seed")]
    MissingBump,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    #[msg("Invalid token mint")]
    InvalidTokenMint,
    #[msg("Insufficient token balance")]
    InsufficientTokenBalance,
    #[msg("Invalid decimals")]
    InvalidDecimals,
    #[msg("Slippage exceeded")]
    SlippageExceeded,
}

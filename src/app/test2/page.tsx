"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        const ws = new WebSocket("wss://pumpportal.fun/api/data");

        ws.onopen = () => {
            let payload = {
                method: "subscribeTokenTrade",
                keys: ["9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump"],
            };
            ws.send(JSON.stringify(payload));
        };

        ws.onmessage = (event) => {
            console.log(JSON.parse(event.data));
            setData(JSON.parse(event.data));
        };

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h1>Data</h1>
            <ul>{data && JSON.stringify(data)}</ul>
        </div>
    );
}

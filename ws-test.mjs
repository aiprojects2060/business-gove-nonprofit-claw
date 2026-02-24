import WebSocket from 'ws';
import fs from 'fs';

const ws = new WebSocket('ws://localhost:18789', { headers: { Origin: "http://localhost:5173" } });

ws.on('open', () => {
    console.log('connected');
    ws.send(JSON.stringify({
        type: "req",
        method: "connect",
        id: "1",
        params: {
            client: {
                id: "openclaw-control-ui",
                version: "1.0.0",
                mode: "ui",
                platform: "desktop",
                displayName: "Mission Control UI"
            },
            minProtocol: 3,
            maxProtocol: 3,
            role: "operator",
            scopes: ["operator.read"],
            auth: { token: "55d242a826837d850d1a4a7092e9a6ffaac91054d915b77c" }
        }
    }));
});

ws.on('message', function message(data) {
  const dt = data.toString();
  console.log('incoming: %s', dt);

    if (dt.includes('event":"tick"')) {
        ws.send(JSON.stringify({
            type: "req",
            method: "agents.list",
            id: "list-agents-req-1",
            params: {}
        }));
    }

    if (dt.includes('"id":"list-agents-req-1"')) {
        fs.writeFileSync('agents_list.json', dt);
        console.log("Wrote agents list to agents_list.json");
        process.exit(0);
    }
});

ws.on('close', (code, reason) => {
    console.log('closed', code, reason.toString());
});

ws.on('error', (err) => {
    console.log('error', err);
});

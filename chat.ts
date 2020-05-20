import {
  WebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";

let sockets: WebSocket[] = new Array();

export const chat = async (ws: WebSocket): Promise<void> => {
  sockets.push(ws);
  broadcast("Someone is connected.");

  for await (const event of ws) {
    if (isWebSocketCloseEvent(event)) {
      sockets = sockets.filter((socket) => socket !== ws);
      broadcast("Someone is disconnected.");
      break;
    }

    const message = typeof event === "string" ? event : "";
    broadcast(message);
  }
};

const broadcast = async (message: string): Promise<void> => {
  if (!message) {
    return;
  }
  await Promise.all(sockets.map((socket) => socket.send(message)));
};

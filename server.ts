import { listenAndServe } from "https://deno.land/std/http/mod.ts";
import {
  acceptWebSocket,
  acceptable,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import { chat } from "./chat.ts";

listenAndServe({ port: 3000 }, async (req) => {
  if (req.method === "GET" && req.url === "/") {
    const file = await Deno.open("./index.html");
    req.respond({
      status: 200,
      body: file,
    }).then(() => Deno.close(file.rid));
  } else if (req.method === "GET" && req.url === "/bye") {
    req.respond({
      status: 200,
      body: "Bye World.",
    });
  } else if (req.method === "GET" && req.url === "/chat") {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      })
        .then((ws: WebSocket) => {
          chat(ws);
        });
    }
  } else {
    req.respond({
      status: 404,
      body: "not found",
    });
  }
});

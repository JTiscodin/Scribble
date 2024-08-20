import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
  console.log("New cliend connected");

  ws.on("message", (message: string) => {
    console.log("recieved msg: " + message);
    ws.send("Server recieved your message " + message);
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});

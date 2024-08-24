import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";
import { RoomMode, SocketMessages } from "./types";
import { Game } from "./Game";
import { Room } from "./Room";

const app = new Hono();

app.get("/", (c) => c.json({ msg: "Hello Cloudflare Workers!" }));

const activeRooms: Room[] = [];

app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onError(evt, ws) {
        console.log(evt);
      },
      onOpen: (evt, ws) => {
        console.log("open");
        console.log(evt, ws);
      },
      onClose: async (evt, ws) => {
        ws.close();
        console.log(evt);
      },
      onMessage: (event, ws) => {
        const data = JSON.parse(event.data)
        switch (data.msg) {
          case SocketMessages.CREATE_ROOM:
            const room = new Room({
              host: {
                username: event.data.username,
                socket: ws as unknown as WebSocket,
              },
              name: "new room",
              mode: RoomMode.Private,
            });
            console.log("created a room");
            activeRooms.push(room);
            break;
          default:
            console.log(event.data);
        }
        ws.send("received msg: " + event.data);
      },
    };
  })
);

app.post("/start-game", async (c) => {
  //parsing the body to json and then using it
  const body = await c.req.json();
  console.log(body);
  return c.text("started game");
});

app.get("/activeRooms", async (c) => {
  return c.json({ rooms: activeRooms });
});

//Custom Error Message
app.onError((err, c) => {
  console.log(`${err}`);
  return c.text("some error occurred");
});

//Custom not found msg
app.notFound((c) => {
  return c.text("Didn't find the page", 404);
});

export default app;

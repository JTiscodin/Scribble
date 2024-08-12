import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";

const app = new Hono();

app.get("/", (c) => c.json({ msg: "Hello Cloudflare Workers!" }));

app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onOpen: (evt, ws) => {
        console.log("open");
        console.log(evt, ws);
      },
      onClose: async (evt, ws) => {
        // console.log(evt)
      },
      onMessage: (event, ws) => {
        console.log(event.data);
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

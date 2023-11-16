import WebSocket from "ws";

const url =
  "wss://halva.xelene.me/games/runner?vk_access_token_settings=&vk_app_id=51737879&vk_are_notifications_enabled=0&vk_is_app_user=0&vk_is_favorite=0&vk_language=ru&vk_platform=mobile_web&vk_ref=other&vk_ts=1700136634&vk_user_id=695014677&sign=-TRKbfOkWy8fbanWCgVIwn7D5d0X_FzmOn1WJacpJmQ&v=2";

let balance, socket;

while (true) {
  await start(url);
}

async function start(url) {
  await new Promise((resolve, reject) => {
    socket = new WebSocket(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        Origin: "*",
        "Sec-WebSocket-Extensions": "permessage-deflate",
      },
    });
    socket.on("message", (ctx) => {
      ctx = JSON.parse(ctx);

      switch (ctx.message) {
        case "time":
          console.log(`[ TIME ] ${ctx.data}`);
          break;
        case "object":
          const name = ctx.data.split(":")[1];
          if (name.startsWith("buster") || name.startsWith("bonus")) {
            socket.send(ctx.data.split("/")[0]);
          }
          break;
        case "balance":
          balance = ctx.data;
          break;
      }
    });

    socket.on("error", reject);
    socket.on("open", () => console.log("[ * ] OPENED!"));
    socket.on("close", () => {
        console.log(`[ * ] CLOSED!\n[ BALANCE ] ${balance}`)
        resolve();
    });
  });
}

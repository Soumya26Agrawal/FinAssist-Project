import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import dbConnect from "./db/db.js";
import { client } from "./redis/client.js";
// import agenda from "./agends.js";

dbConnect().then(async () => {
  app.listen(process.env.PORT, function expressConnect() {
    console.log("Express is listening at port " + process.env.PORT);
  });
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  console.log("Redis connected");
});

console.log("hello");
// (async function () {
//         await agenda.every('* * * * *', 'print hello');
// })()

// (async function () {
//     try {
//         await agenda.start(); // ✅ Start Agenda before scheduling jobs
//         console.log("✅ Agenda started successfully");

//         await agenda.every(' */1 * * * *', 'print hello'); // ✅ Schedule job
//         console.log("✅ 'print hello' job scheduled successfully");
//     } catch (err) {
//         console.error("❌ Error in Agenda setup:", err);
//     }
// })();

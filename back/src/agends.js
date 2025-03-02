// import dotenv from "dotenv";
// dotenv.config();
// import Agenda from "agenda";
// import { DB_NAME } from "./constants.js";

// const mongoConnectionString = `${process.env.MONGO_URI}/${DB_NAME}`;
// const agenda = new Agenda({
//   db: { address: mongoConnectionString, collection: "agendaJobs" },
// });

// agenda.define("print hello", async () => {
//   console.log("hello");
// });

// // ✅ Start Agenda
// //   (async function () {
// //     try {
// //         await agenda.start();
// //         console.log("✅ Agenda started successfully");
// //     } catch (err) {
// //         console.error("❌ Error starting Agenda:", err);
// //     }
// // })();

// export default agenda;

// //   const sayhello = async () => {
// //     const job=await agenda.every('* * * * *', 'print hello');  // Schedule job

// // if (job) {
// //     res.json({ message: 'Recurring income scheduled successfully!' });
// //   } else {
// //     res.status(500).json({ error: 'Failed to schedule job' });
// //   }

// // res.json({ message: 'Recurring income scheduled!' });
// //   };

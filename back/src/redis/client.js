import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";

export const client = createClient({
  username: "default",
  password: process.env.REDISPASSWORD,
  socket: {
    // host: "redis-14535.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    // port: 14535,
     host: 'redis-19391.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
     port: 19391
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();

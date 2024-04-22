/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-03-28 21:32:44
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-03-29 00:14:26
 * @FilePath: /connected-advisor/src/data/mongodb_client.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// MongoDB URL and database name
const MONGO_URL = process.env.MONGO_URL || ""; // Use the environment variable
const DB_NAME = "ConnectedAdvisor";

// Function to connect to the database
async function connectToDatabase() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  return client.db(DB_NAME);
}

// API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Received request:", req.method, req.body);
  if (req.method === "POST") {
    try {
      const db = await connectToDatabase();
      console.log("Database connected");
      const collection = db.collection("connections");
      const result = await collection.insertOne(req.body);
      console.log("Document inserted", result);
      res.status(200).json({ ...result, _id: result.insertedId });
    } catch (error) {
      console.error("Error occurred:", error);
      res
        .status(500)
        .json({ error: "Unable to connect to the database or insert data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

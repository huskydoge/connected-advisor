import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB URL and database name
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = "ConnectedAdvisor";
const COLLECTION_NAME = "AdvisorTable";

// Function to connect to the database
async function connectToDatabase() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  return client.db(DB_NAME);
}

// API handler function to update advisor information
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Received request:", req.method, req.body);
  if (req.method === "PUT") {
    // Ensure the request method is PUT for updating
    try {
      const db = await connectToDatabase();
      console.log("Database connected");
      const collection = db.collection(COLLECTION_NAME);

      // Extract _id from request body and convert it to ObjectId
      const { _id, ...updateData } = req.body;
      if (!_id) {
        res.status(400).json({ error: "Missing _id in request body" });
        return;
      }

      // Perform the update operation
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );

      if (result.modifiedCount === 0) {
        res
          .status(404)
          .json({ message: "No matching document found to update" });
      } else {
        console.log("Document updated", result);
        res.status(200).json(result);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

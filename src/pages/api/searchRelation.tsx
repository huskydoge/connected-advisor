import { MongoClient, ObjectId } from "mongodb";

// MongoDB URL and database name
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = "ConnectedAdvisor";
const COLLECTION_NAME = "relations";

async function connectToDatabase() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  return { db, client };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  console.log("Received request:", req.method, req.body);

  const rel_id = req.body["oid"];

  if (!rel_id) {
    res.status(400).json({ message: "Missing required parameters" });
    return;
  }

  try {
    const { db, client } = await connectToDatabase();

    const collection = db.collection(COLLECTION_NAME);

    const results = await collection
      .find({ _id: new ObjectId(rel_id) })
      .toArray();

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No matching connections found" });
    }

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
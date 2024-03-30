import { MongoClient } from "mongodb";

// MongoDB URL and database name
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = "ConnectedAdvisor";
const COLLECTION_NAME = "papers";

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

  const { oid, name } = req.body;

  if (!oid && !name) {
    res.status(400).json({ message: "Missing query parameters" });
    return;
  }

  try {
    const { db, client } = await connectToDatabase();

    let result;
    if (oid) {
      result = await db
        .collection(COLLECTION_NAME)
        .findOne({ _id: new ObjectId(oid) });
    } else if (name) {
      // 使用正则表达式实现模糊搜索
      result = await db
        .collection(COLLECTION_NAME)
        .find({
          name: { $regex: new RegExp(name, "i") },
        })
        .toArray();
    }

    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No matching document found" });
    }

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

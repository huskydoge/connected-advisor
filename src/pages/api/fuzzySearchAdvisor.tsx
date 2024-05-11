/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-02-22 23:30:57
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-05-11 19:45:27
 * @FilePath: /connected-advisor/src/pages/api/searchAdvisorByName.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MongoClient, ObjectId } from "mongodb";

// MongoDB URL and database query_text
const MONGO_URL = process.env.MONGO_URL || "";
const DB_NAME = "ConnectedAdvisor";
const COLLECTION_NAME = "AdvisorTable";

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

  let query_text = name;
  // console.log("oid", oid);
  // console.log("query_text", query_text);

  if (!oid && !query_text) {
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
    } else if (query_text) {
      let words = query_text.split(/\s+/); // 拆分输入的query_text为单词数组

      let regexPattern = words.map((word) => `(?=.*${word})`).join("");

      let regexQuery = new RegExp(regexPattern, "i");
      result = await db
        .collection(COLLECTION_NAME)
        .find({
          $or: [
            { name: { $regex: regexQuery } },
            { tags: { $regex: regexQuery } },
            { position: { $regex: regexQuery } },
            { affiliation: { $regex: regexQuery } },
          ],
        })
        .toArray();
    }

    if (result) {
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

/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-04-24 10:38:45
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 10:49:09
 * @FilePath: /connected-advisor/src/pages/api/searchPaperByList.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-04-24 10:38:45
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 10:38:54
 * @FilePath: /connected-advisor/src/pages/api/searchPaperByList.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "";
const DB_NAME = "ConnectedAdvisor";
const COLLECTION_NAME = "tmp-papers";

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

  const ids = req.body.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ message: "Missing or invalid parameters" });
    return;
  }

  try {
    const { db, client } = await connectToDatabase();

    const objectIds = ids.map((id) => new ObjectId(id));
    const results = await db
      .collection(COLLECTION_NAME)
      .find({ _id: { $in: objectIds } })
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

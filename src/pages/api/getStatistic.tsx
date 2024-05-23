/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-04-24 19:47:21
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 22:02:32
 * @FilePath: /connected-advisor/src/pages/api/getStatistic.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// pages/api/statistics.tsx

import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// 环境变量中获取 MongoDB 的连接 URL
const MONGO_URL = process.env.MONGO_URL || "";
const DB_NAME = "ConnectedAdvisor";

async function connectToDatabase() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  return { db, client };
}

async function getStatistics() {
  const { db, client } = await connectToDatabase();

  try {
    const advisors = await db.collection("advisors").find().toArray();

    const affiliationCounts = {};
    const positionCounts = {};
    const tagCounts = {};

    advisors.forEach((advisor) => {
      let affiliation = advisor.affiliation;
      let position = advisor.position;
      let tags = advisor.tags;

      // Count affiliations
      if (affiliation) {
        affiliationCounts[affiliation] =
          (affiliationCounts[affiliation] || 0) + 1;
      }

      // Count positions
      if (position) {
        positionCounts[position] = (positionCounts[position] || 0) + 1;
      }

      // Count tags
      if (tags && Array.isArray(tags)) {
        tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return { affiliationCounts, positionCounts, tagCounts };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  } finally {
    client.close();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const statistics = await getStatistics();
  if (statistics) {
    res.status(200).json(statistics);
  } else {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
}

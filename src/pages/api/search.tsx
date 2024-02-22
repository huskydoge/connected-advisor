// pages/api/search.tsx
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/elasticSearch"; // 引入你之前设置的 Elasticsearch 客户端实例

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 从请求中获取查询参数
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    // 向 Elasticsearch 发送搜索请求
    // @ts-ignore
    const { body } = await client.search({
      index: "your-index-name", // 替换成你的索引名
      body: {
        query: {
          multi_match: {
            // 或者使用 match, term 或其他适合你数据的查询
            // @ts-ignore
            query: query,
            fields: ["name", "description"], // 根据你的数据结构调整
          },
        },
      },
    });

    // 返回搜索结果
    res.status(200).json(body.hits.hits);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error executing search" });
  }
}

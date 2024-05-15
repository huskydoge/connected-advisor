/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-05-12 10:08:24
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-05-14 21:43:16
 * @FilePath: /connected-advisor/src/pages/api/openai/createMessage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NextApiRequest, NextApiResponse } from "next";

export default async function createMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, tools } = req.body;
  console.log("createMessage", messages, tools);
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  const body = JSON.stringify({
    messages,
    model: "gpt-4o",
    stream: false,
    tool_choice: "auto",
    tools,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

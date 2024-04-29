// pages/api/image.tsx

export default async function handler(req, res) {
  const { imageUrl } = req.query;
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg"); // 根据实际内容类型设置
    res.setHeader("Access-Control-Allow-Origin", "*"); // 或者指定具体的域名
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch image" });
  }
}

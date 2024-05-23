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

async function getAdvisorDetails(advisorId: string) {
  const { db, client } = await connectToDatabase();

  try {
    const advisor = await db
      .collection("AdvisorTable")
      .find({ _id: new ObjectId(advisorId) })
      .toArray();
    if (!advisor) {
      return null;
    }

    const connectionIds = advisor[0].connections.map(
      (id: string) => new ObjectId(id)
    );
    const connections = await db
      .collection("connections")
      .find({
        _id: { $in: connectionIds },
      })
      .toArray();

    // 首先收集所有需要查询的relation ID和paper ID
    const relationIds = [];
    const paperIds = [];

    for (const conn of connections) {
      relationIds.push(...conn.relations.map((id) => new ObjectId(id)));
      paperIds.push(
        ...conn["collaborate-papers"].map((paper) => new ObjectId(paper))
      );
    }

    // 使用 $in 操作符一次性查询所有relations
    const relations = await db
      .collection("relations")
      .find({
        _id: { $in: relationIds },
      })
      .toArray();

    console.log("relations", relations);

    // 使用 $in 操作符一次性查询所有papers
    const papers = await db
      .collection("papers")
      .find({
        _id: { $in: paperIds },
      })
      .toArray();

    console.log("papers", papers);

    let finalConnections = [];

    for (const conn of connections) {
      const relationDetails = conn.relations.map((relId: string) => {
        // 在已查询的关系数组中找到匹配的关系对象
        const rel = relations.find((relation) => relation._id.equals(relId));
        if (!rel) {
          return null;
        }
        if (rel["id-1"] === advisorId) {
          return {
            type: rel.type,
            role: rel["role-1"],
            duration: rel.duration,
          };
        } else {
          return {
            type: rel.type,
            role: rel["role-2"],
            duration: rel.duration,
          };
        }
      });
      const collaborateDetails = conn["collaborate-papers"].map(
        (paperId: string) => {
          if (!paperId) {
            return null;
          }
          const paper = papers.find((paper) => paper._id.equals(paperId));
          return {
            papername: paper?.name,
            year: paper?.year,
            url: paper?.url,
          };
        }
      );

      let connected_advisor_id;

      if (conn["id-1"] === advisorId) {
        connected_advisor_id = conn["id-2"];
      } else {
        connected_advisor_id = conn["id-1"];
      }

      let tmp = {
        _id: connected_advisor_id,
        relations: relationDetails,
        collaborations: collaborateDetails,
        lastestCollaboration: Math.max(
          ...collaborateDetails.map((collab: any) => collab.year)
        )
          ? Math.max(...collaborateDetails.map((collab: any) => collab.year))
          : 2024, // TODO
        relationFactor: 1,
      };

      if (tmp["lastestCollaboration"] === -Infinity) {
        tmp["lastestCollaboration"] = 2024;
      }

      console.log("tmp", tmp);

      finalConnections.push(tmp);
    }

    let finalAdvisor = {
      _id: advisor[0]._id,
      name: advisor[0].name,
      department: advisor[0].department,
      tags: advisor[0].tags,
      affiliation: advisor[0].affiliation,
      position: advisor[0].position,
      connections: finalConnections,
      picture: advisor[0].picture,
      twitter: advisor[0].contacts.twitter,
      email: advisor[0].contacts.email,
      homepage: advisor[0].homepage,
      github: advisor[0].github,
      description: advisor[0].descriptions,
    };
    return finalAdvisor;
  } catch (error) {
    console.error("Error fetching advisor details:", error);
    return null;
  } finally {
    client.close();
  }
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
  console.log("query_text", query_text);

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

      let regexPatterns = words.map((word) => `(?=.*${word})`);

      let regexQuery = new RegExp(regexPatterns.join("|"), "i");

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

    const detailedResults = await Promise.all(
      result.map(async (advisor) => {
        return await getAdvisorDetails(advisor._id);
      })
    );

    if (detailedResults) {
      res.status(200).json(detailedResults);
    } else {
      res.status(404).json({ message: "No matching document found" });
    }

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

import { MongoClient, ObjectId } from "mongodb";

// MongoDB URL and database name
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = "ConnectedAdvisor";
const COLLECTION_NAME = "connections";
const ADVISOR_COLLECTION = "advisors"; // The collection name where advisors are stored

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

  const { name1, name2 } = req.body;
  if (!name1 || !name2) {
    res
      .status(400)
      .json({ message: "Missing required parameters name1 or name2" });
    return;
  }

  try {
    const { db, client } = await connectToDatabase();

    // Generate regex patterns for fuzzy matching of names
    const regex1 = new RegExp(name1.split(" ").join("|"), "i"); // Creates a regex that matches any part of the name
    const regex2 = new RegExp(name2.split(" ").join("|"), "i");

    // Retrieve advisor IDs using regex match
    const advisors = await Promise.all([
      db.collection(ADVISOR_COLLECTION).findOne({ name: { $regex: regex1 } }),
      db.collection(ADVISOR_COLLECTION).findOne({ name: { $regex: regex2 } }),
    ]);

    if (!advisors[0] || !advisors[1]) {
      client.close();
      res.status(404).json({ message: "One or both advisors not found" });
      return;
    }

    const id1 = advisors[0]._id.toString();
    const id2 = advisors[1]._id.toString();

    // Find the connection between the two advisors
    const conn = await db.collection(COLLECTION_NAME).findOne({
      $or: [
        { $and: [{ "id-1": id1 }, { "id-2": id2 }] },
        { $and: [{ "id-1": id2 }, { "id-2": id1 }] },
      ],
    });

    if (!conn) {
      client.close();
      res
        .status(404)
        .json({ message: "No connection found between the given advisors" });
      return;
    }

    // Extract relations and paper IDs
    const relationIds = conn.relations.map((id) => new ObjectId(id));
    const paperIds = conn["collaborate-papers"].map(
      (paper) => new ObjectId(paper)
    );

    // Fetch all related data in parallel
    const [relations, papers] = await Promise.all([
      db
        .collection("relations")
        .find({ _id: { $in: relationIds } })
        .toArray(),
      db
        .collection("papers")
        .find({ _id: { $in: paperIds } })
        .toArray(),
    ]);

    // remove _id
    const clear_relations = relations.map((relation) => ({
      type: relation.type,
      "role-1": relation["role-1"],
      "role-2": relation["role-2"],
      duration: relation.duration,
    }));

    // Replace ids with actual data
    conn.relations = clear_relations;
    conn["collaborate-papers"] = papers;

    // remove _id field
    const conn_cleared = {
      "id-1": conn["id-1"],
      "id-2": conn["id-2"],
      relations: conn.relations,
      "collaborate-papers": conn["collaborate-papers"],
    };

    res.status(200).json(conn_cleared);
    console.log("Connection details sent successfully");
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

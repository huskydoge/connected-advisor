const addRelations = async (selectedNameOne, selectedNameTwo, relations) => {
  const relation_list = relations.map((relation) => {
    console.log(relation, selectedNameOne._id, selectedNameTwo._id);
    return {
      type: relation.type,
      "id-1": selectedNameOne._id,
      "id-2": selectedNameTwo._id,
      "role-1": relation.role1,
      "role-2": relation.role2,
      duration: {
        start: relation.start,
        end: relation.end,
      },
    };
  });

  let relation_ids = [];
  for (let relation of relation_list) {
    const response = await fetch("/api/addRelation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(relation),
    });
    if (!response.ok) {
      console.error("Failed to add relation", relation);
      return false;
    } else {
      relation_ids.push((await response.json())._id);
    }
  }
  console.log("Relation IDs:", relation_ids);
  return relation_ids;
};

const fetchRelations = async (selectedNameOne, selectedNameTwo) => {
  console.log(selectedNameOne, selectedNameTwo);
  console.log(selectedNameOne?._id, selectedNameTwo?._id);
  if (!selectedNameOne || !selectedNameTwo) {
    alert("Both persons must be selected to form a connection.");
    return;
  }
  const response = await fetch("/api/fuzzySearchRelation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "id-1": selectedNameOne?._id,
      "id-2": selectedNameTwo?._id,
    }),
  });
  const existingRelations = await response.json();
  if (!response.ok) {
    return [];
  } else {
    return existingRelations;
  }
};

const fetchRelationById = async (relation_id) => {
  const response = await fetch("/api/searchRelation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oid: relation_id }),
  });
  if (!response.ok) {
    console.error("Failed to fetch relation", relation_id);
    return null;
  } else {
    return (await response.json())[0];
  }
};

export { addRelations, fetchRelations, fetchRelationById };

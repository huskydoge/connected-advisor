const fetchPaperById = async (id: string) => {
  const response = await fetch("/api/searchPaper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oid: id }),
  });
  const data = await response.json();
  // console.log("Search paper by id:", data);
  return data;
};

export { fetchPaperById };

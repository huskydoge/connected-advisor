const fetchSearchDetailsById = async (id) => {
  const response = await fetch("/api/searchAdvisor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oid: id }),
  });
  const data = await response.json();
  // console.log("Search details by id:", data);
  return data;
};

const updateAdvisor = async (formattedData) => {
  try {
    const response = await fetch("/api/updateAdvisor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      // Throw an error with the response status to handle it in the catch block
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Submit result:", result);

    // Optionally, return the result to the caller for further processing
    return result;
  } catch (error) {
    console.error("Submit error:", error);
    // Optionally, throw the error again to let the caller handle it
    throw error;
  }
};

const fetchAdvisorByIdLst = async (advisor_id_lst) => {
  console.log("input advisor_id_lst", advisor_id_lst);

  const response = await fetch("/api/searchAdvisorByLst", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: advisor_id_lst }),
  });
  if (!response.ok) {
    console.error("Failed to fetch advisor by id");
    return null;
  }
  const advisor_lst = await response.json();
  // console.log("Successfully fetched advisor by id", advisor_lst);
  return advisor_lst;
};

const fetchAdvisorDetails = async (advisorId) => {
  // console.log("Fetch advisor details for advisor ID:", advisorId);
  try {
    const response = await fetch("/api/getAdvisorDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ advisor_id: advisorId }),
    });

    // if (!response.ok) {
    //   // Throw an error with the response status to handle it in the catch block
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    const result = await response.json();
    // console.log("Fetch advisor details:", result);

    // Optionally, return the result to the caller for further processing
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    // Optionally, throw the error again to let the caller handle it
    throw error;
  }
};

export {
  fetchSearchDetailsById,
  updateAdvisor,
  fetchAdvisorByIdLst,
  fetchAdvisorDetails,
};
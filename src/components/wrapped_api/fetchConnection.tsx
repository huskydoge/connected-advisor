/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-03-31 08:40:39
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 10:14:28
 * @FilePath: /connected-advisor/src/components/wrapped_api/fetchConnection.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fetchConnection = async (selectedNameOne, selectedNameTwo) => {
  console.log(selectedNameOne?._id, selectedNameTwo?._id);
  const response = await fetch("/api/fuzzySearchConnection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "id-1": selectedNameOne?._id,
      "id-2": selectedNameTwo?._id,
    }),
  });
  const existingConnection = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch connection");
    return null;
  } else {
    return existingConnection;
  }
};

const fetchConnectionById = async (connection_id) => {
  const response = await fetch("/api/searchConnection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oid: connection_id }),
  });
  const connection = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch connection by id");
    return null;
  } else {
    // console.log("Successfully fetched connection by id", connection);
    return connection;
  }
};

const fetchConnectionByIdLst = async (connection_id_lst) => {
  // console.log("input connection_id_lst", connection_id_lst);
  const response = await fetch("/api/searchConnection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: connection_id_lst }),
  });
  if (!response.ok) {
    console.error("Failed to fetch connection by id");
    return null;
  }
  const connection_lst = await response.json();
  // console.log("Successfully fetched connection by id", connection_lst);
  return connection_lst;
};

const addOrUpdateConnection = async (connectionData) => {
  // TODO make sure it return correct id. If existing, then return existing id
  const response = await fetch("/api/addConnection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connectionData),
  });
  if (!response.ok) {
    console.error("Failed to add/update connection");
    return null;
  } else {
    console.log("Connection added/updated successfully");
    const connection_id = (await response.json())._id;
    return connection_id;
  }
};

export {
  fetchConnection,
  addOrUpdateConnection,
  fetchConnectionById,
  fetchConnectionByIdLst,
};

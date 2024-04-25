/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-03-31 10:11:04
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-25 22:08:31
 * @FilePath: /connected-advisor/src/components/wrapped_api/fetchPaper.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

const fetchPaperByLst = async (id_lst) => {
  if (id_lst.length === 0) {
    return [];
  }
  const response = await fetch("/api/searchPaperByList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: id_lst }),
  });
  const data = await response.json();
  // console.log("Search paper by id:", data);
  return data;
};

export { fetchPaperById, fetchPaperByLst };

/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-04-24 20:26:13
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 20:27:32
 * @FilePath: /connected-advisor/src/components/wrapped_api/fetchStatistics.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fetchStatistics = async (id: string) => {
  const response = await fetch("/api/getStatistic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  // console.log("Search paper by id:", data);
  return data;
};

export { fetchStatistics };

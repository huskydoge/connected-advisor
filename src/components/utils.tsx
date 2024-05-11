/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-04-22 22:41:28
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-05-11 09:25:32
 * @FilePath: /connected-advisor/src/components/utils.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useRouter } from "next/router";
import { Connection, AdvisorDetails } from "@/components/interface";

const router = useRouter();

export const handleClickOnAdvisor = (id: string) => {
  router.push(`${id}?view=graph`, undefined, {
    shallow: true,
  });
};

export const calculate_influence_factor = (
  advisor: AdvisorDetails,
  degree = 1
) => {
  // TODO, should take the influence of its connected advisors into account, rather than merely count the number of connections
  let influenceFactor = 0;
  for (let i = 0; i < advisor.connections.length; i++) {
    let conn = advisor.connections[i];
    let paper_score = conn.collaborations.length;
    influenceFactor += 1 + paper_score;
  }
  return influenceFactor;
};

export const calculate_relation_factor = (
  advisor1: AdvisorDetails,
  advisor2: AdvisorDetails,
  conn: Connection
) => {
  const tag_weight = 2;
  const relation_weight = 10;
  const paper_weight = 5;

  let tags1 = advisor1.tags;
  let tags2 = advisor2.tags;
  let tag_score = 0;
  tags1.forEach((tag1) => {
    tags2.forEach((tag2) => {
      if (tag1 === tag2) {
        tag_score += 1;
      }
    });
  });
  let paper_score = conn.collaborations.length;
  const relation_type_score_map = {
    PhD: 5,
    Master: 3,
    Undergrad: 1,
    Postdoc: 4,
    Working: 2,
    Collaboration: 1,
  };
  let relations = conn.relations;
  let relation_score = 0;
  for (let i = 0; i < relations.length; i++) {
    let relation = relations[i];

    let type = relation.type;
    // console.log("type", type);
    let start = relation.duration.start;
    let end = relation.duration.end;
    // console.log("start", start);
    // console.log("end", end);
    relation_score +=
      relation_type_score_map[type as keyof typeof relation_type_score_map] *
      (end - start);
  }

  // console.log("tag_score", tag_score);
  // console.log("relation_score", relation_score);
  // console.log("paper_score", paper_score);

  let relationFactor =
    tag_score * tag_weight +
    relation_score * relation_weight +
    paper_score * paper_weight;

  return relationFactor;
};

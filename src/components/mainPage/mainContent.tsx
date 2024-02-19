import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

import advisorsData from "../../data/advisors.json"; // 假设你的数据文件路径

// 使用dynamic导入GraphRender组件，禁用SSR
const GraphRender = dynamic(() => import("./graphRender"), {
  ssr: false, // 确保只在客户端渲染
});

import AdvisorCard from "./advisorCard"; // Ensure AdvisorCard is imported correctly

const advisor = {
  advisor_id: 0,
  name: "John Doe",
  tags: ["Pushing", "Excellent", "Machine Learning"], // tags不能乱取
  avatar: "https://example.com/avatar.jpg",
  github: "https://github.com/johndoe",
  twitter: "https://twitter.com/johndoe",
  email: "john@example.com",
  website: "https://johndoe.com",
  position: "Professor",
  affliation: "LTI, CMU",
  description:
    "John Doe is an experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.",
  connections: [
    {
      advisor_id: 1,
      relation: [
        {
          class: "PhD",
          role: "supervisor",
          duration: {
            start: {
              year: 2018,
              month: 8,
            },
            end: {
              year: 2023,
              month: 12,
            },
          },
        },
        {
          class: "Master",
          role: "supervisor",
          duration: {
            start: {
              year: 2016,
              month: 8,
            },
            end: {
              year: 2018,
              month: 4,
            },
          },
        },
      ],
      collaborations: [
        // rank with year
        {
          papername: "Defining and Extracting Relationships",
          year: 2023,
          url: "https://github.com",
        },
      ],
      latestCollaboration: 2023,
      relationFactor: 45, // MS + 15 | PhD + 25 | PostDoc + 20 | UnderGrad + 10 | 1 Paper + 5, maximum = 100
    },
  ],
};

function MainContent() {
  const router = useRouter();
  // const { advisor_id } = router.query; // default is 0
  const advisor_id = 0;
  const [selectedNode, setSelectedNode] = useState(null); // 用于存储选中的节点信息
  useEffect(() => {
    // 根据advisor_id查找advisor信息
    const advisorInfo = advisorsData.find(
      (advisor) => advisor.advisor_id === advisor_id
    );
    setSelectedNode(advisorInfo || null);
  }, [advisor_id]);
  return (
    <Grid container style={{ height: "calc(100vh - 64px)" }}>
      {" "}
      {/* Adjust height to take the AppBar height into account */}
      <Grid
        item
        xs={9}
        style={{ padding: 0, display: "flex", flexDirection: "column" }}
      >
        {/* Left column for graph display */}
        <Paper
          elevation={3}
          style={{
            flexGrow: 1,
            overflow: "auto",
            borderRadius: 0,
            display: "flex",
          }}
        >
          <GraphRender
            onNodeHover={(node) => {
              if (node) {
                setSelectedNode(node);
              } else {
                // 当没有节点被悬停时，恢复到默认的主节点信息
                const defaultNode = advisorsData.find(
                  (advisor) => advisor.advisor_id === advisor_id
                );
                setSelectedNode(defaultNode);
              }
            }}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={3}
        style={{ padding: 0, display: "flex", flexDirection: "column" }}
      >
        {/* Right column for displaying node information */}
        <Paper
          elevation={3}
          style={{ flexGrow: 1, overflow: "auto", borderRadius: 0 }}
        >
          {selectedNode && <AdvisorCard advisor={selectedNode} />}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MainContent;

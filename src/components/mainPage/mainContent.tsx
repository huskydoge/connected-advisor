import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import advisorsData from "../../data/advisors.json"; // 假设你的数据文件路径
import FilterCard from "./filterCard"; // Ensure FilterCard is imported correctly

// 使用dynamic导入GraphRender组件，禁用SSR
const GraphRender = dynamic(() => import("./dataRender/graphRender"), {
  ssr: false, // 确保只在客户端渲染
});

import AdvisorCard from "./advisorCard"; // Ensure AdvisorCard is imported correctly
import RenderTabs from "./dataRender/renderTabs";
import ListView from "./dataRender/listiew/listView";
import { useRouter } from "next/router";

function MainContent({ id }: { id: number }) {
  const advisor_id = Number(id);
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(null); // 用于存储选中的节点信息
  const [clickedNode, setClickedNode] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTab, setSelectedTab] = useState(""); // 用于存储选中的Tab信息
  const [showGraphOptions, setShowGraphOptions] = useState(false); // 新增状态用于控制显示GraphOptions

  const advisorInfo = advisorsData.find(
    (advisor) => advisor.advisor_id === advisor_id
  );

  const advisor = advisorInfo;

  const handleFilterClick = () => {
    if (showFilter) {
      setShowFilter(false);
      setSelectedTab("");
      return;
    }
    setShowFilter(true); // 显示FilterCard
    setSelectedTab("filter"); // Set filter as selected
  };

  const handleGraphMode = () => {
    setShowGraphOptions(!showGraphOptions);
  };

  const handleListView = () => {
    // 显示ListView
    if (router.query.view === "list") {
      setSelectedTab("");
      router.push(`${advisor?.advisor_id}?view=graph`, undefined, {
        shallow: true,
      });
      return;
    }

    router.push(`${advisor?.advisor_id}?view=list`, undefined, {
      shallow: true,
    });
    setSelectedTab("listview"); // Set listview as selected
  };

  const closeListView = () => {
    setSelectedTab("");
    router.push(`${advisor?.advisor_id}?view=graph`, undefined, {
      shallow: true,
    });
  };

  const closeFilterCard = () => {
    setShowFilter(false); // 关闭FilterCard
    setSelectedTab(""); // Reset selected tab
  };

  useEffect(() => {
    // @ts-ignore

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

        <RenderTabs
          onFilter={handleFilterClick}
          onGraphMode={handleGraphMode}
          onListView={handleListView}
          selected={selectedTab}
        />
        <Paper
          style={{
            flexGrow: 1,
            borderRadius: 0,
            display: "flex",
            maxHeight: "100vh",
          }}
        >
          {router.query.view === "list" ? (
            <ListView onClose={closeListView} mainAdvisor={advisorInfo} />
          ) : (
            <GraphRender
              advisor_id={advisor_id}
              onNodeClick={(node: any) => {
                if (node) {
                  setSelectedNode(node);
                  setClickedNode(node);
                } else {
                  // 当没有节点被悬停时，恢复到默认的主节点信息
                  const defaultNode = advisorsData.find(
                    (advisor) => advisor.advisor_id === advisor_id
                  );
                  // @ts-ignore
                  setSelectedNode(defaultNode);
                  setClickedNode(null);
                }
              }}
              onNodeHover={(node: any) => {
                if (node) {
                  setSelectedNode(node);
                } else {
                  // 当没有节点被悬停时，恢复到默认的主节点信息

                  const defaultNode = advisorsData.find(
                    (advisor) => advisor.advisor_id === advisor_id
                  );
                  if (clickedNode) {
                    setSelectedNode(clickedNode);
                  } else {
                    // @ts-ignore
                    setSelectedNode(defaultNode);
                  }
                }
              }}
            />
          )}
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
          style={{
            flexGrow: 1,
            overflow: "auto",
            borderRadius: 0,
            height: "100vh",
          }}
        >
          {showFilter ? (
            <FilterCard onClose={closeFilterCard} />
          ) : (
            selectedNode && <AdvisorCard advisor={selectedNode} />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MainContent;

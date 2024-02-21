import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import advisorsData from "../../data/advisors.json"; // 假设你的数据文件路径
import FilterCard from "./filterCard"; // Ensure FilterCard is imported correctly
import GraphCard from "./graphCard";

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
  const [showCard, setShowCard] = useState("advisorCard");
  const [selectedTab, setSelectedTab] = useState(""); // 用于存储选中的Tab信息
  const [showGraphOptions, setShowGraphOptions] = useState(false); // 新增状态用于控制显示GraphOptions

  const advisorInfo = advisorsData.find(
    (advisor) => advisor.advisor_id === advisor_id
  );

  const advisor = advisorInfo;

  const handleFilterClick = () => {
    if (showCard === "filterCard") {
      setShowCard("advisorCard");
      setSelectedTab("");
      return;
    }
    setShowCard("filterCard"); // 显示FilterCard
    setSelectedTab("filterCard"); // Set filter as selected
  };

  const handleGraphMode = () => {
    if (showCard === "graphCard") {
      setShowCard("advisorCard");
      setSelectedTab("");
      return;
    }
    setShowCard("graphCard"); // 显示GraphCard
    setSelectedTab("graphCard"); // Set graph as selected
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
    setShowCard("advisorCard"); // 关闭FilterCard
    setSelectedTab(""); // Reset selected tab
  };

  const closeGraphCard = () => {
    setShowCard("advisorCard"); // 关闭GraphCard
    setSelectedTab(""); // Reset selected tab
  };

  const renderCard = () => {
    if (selectedNode === null) {
      return null;
    }
    switch (showCard) {
      case "advisorCard":
        // @ts-ignore
        return <AdvisorCard advisor={selectedNode} />;
      case "graphCard":
        // @ts-ignore
        return <GraphCard onClose={closeFilterCard} />; // 假设GraphCard接受data作为prop
      case "filterCard":
        return <FilterCard onClose={closeFilterCard} />;
      default:
        return null; // 当showCard不匹配任何已知值时不渲染任何东西
    }
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
          {renderCard()};
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MainContent;

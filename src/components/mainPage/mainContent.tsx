import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

// 动态导入组件，实现懒加载
const StatisticsCard = dynamic(() => import("./statisticCard"), {
  ssr: false,
});
const ConfigCard = dynamic(() => import("./configCard"), { ssr: false });
const UploadCard = dynamic(() => import("./uploadCard"), { ssr: false });
const AdvisorCard = dynamic(() => import("./advisorCard"), { ssr: false });
const RenderTabs = dynamic(() => import("./dataRender/renderTabs"), {
  ssr: false,
});
const ListView = dynamic(() => import("./dataRender/listiew/listView"), {
  ssr: false,
});
const GraphRender = dynamic(() => import("./dataRender/graphRender"), {
  ssr: false,
});

import { fetchAdvisorDetails } from "../wrapped_api/fetchAdvisor";

import { useRouter } from "next/router";
import { integer } from "@elastic/elasticsearch/lib/api/types";

function MainContent({ id }: { id: string }) {
  const _id = String(id);
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(null); // 用于存储选中的节点信息
  const [clickedNode, setClickedNode] = useState(null);
  const [showCard, setShowCard] = useState("advisorCard");
  const [selectedTab, setSelectedTab] = useState(""); // 用于存储选中的Tab信息

  const [defaultNode, setDefaultNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [config, setConfig] = useState({
    graphDegree: 1,
    graphType: "undirected",
    pattern_id: 0,
    showAvatars: false,
    layout: "force",
  });
  // 初始左侧面板flex值为3，右侧面板flex值为1，总flex值为4
  const [splitPercentage, setSplitPercentage] = useState(60);

  useEffect(() => {
    const fetchAdvisorInfo = async () => {
      setIsLoading(true);
      const info = await fetchAdvisorDetails(_id);
      setAdvisorInfo(info);
      setSelectedNode(info);
      setDefaultNode(info);
      setIsLoading(false);
    };

    if (
      typeof _id !== "undefined" &&
      (!advisorInfo || (advisorInfo && _id !== advisorInfo["advisor"]))
    ) {
      fetchAdvisorInfo();
    }
  }, [_id]);

  if (isLoading || !advisorInfo) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const handleUploadClick = () => {
    if (showCard === "uploadCard") {
      setShowCard("advisorCard");
      setSelectedTab("");
      return;
    }
    setShowCard("uploadCard"); //
    setSelectedTab("upload"); //
  };

  const handleStatisticClick = () => {
    if (showCard === "statisticsCard") {
      setShowCard("advisorCard");
      setSelectedTab("");
      return;
    }
    setShowCard("statisticsCard"); //
    setSelectedTab("statistic"); // Set statistic as selected
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

  const handleGraphDegreeChange = (degree: number) => {
    setConfig({ ...config, graphDegree: degree });
  };

  const handleGraphTypeChange = (type: string) => {
    setConfig({ ...config, graphType: type });
  };

  const handleGraphAvatarDisplayChange = (show: boolean) => {
    setConfig({ ...config, showAvatars: show });
  };

  const handleGraphPatternChange = (id: integer) => {
    console.log(id);
    setConfig({ ...config, pattern_id: id });
  };

  const handleLayoutChange = (ly: string) => {
    console.log(id);
    setConfig({ ...config, layout: ly });
  };

  const handleListView = () => {
    // 显示ListView

    if (selectedNode) {
      if (router.query.view === "list") {
        setSelectedTab("");
        router.push(`${selectedNode["_id"]}?view=graph`, undefined, {
          shallow: true,
        });
        return;
      }

      router.push(`${selectedNode["_id"]}?view=list`, undefined, {
        shallow: true,
      });
      setSelectedTab("listview"); // Set listview as selected
    }
  };

  const closeListView = () => {
    if (selectedNode) {
      setSelectedTab("");
      router.push(`${selectedNode["_id"]}?view=graph`, undefined, {
        shallow: true,
      });
    }
  };

  const closeCard = () => {
    setShowCard("advisorCard"); // 关闭FilterCard
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
        return (
          <ConfigCard
            onClose={closeCard}
            onGraphAvatarDisplayChange={handleGraphAvatarDisplayChange}
            onGraphDegreeChange={handleGraphDegreeChange}
            onGraphTypeChange={handleGraphTypeChange}
            onGraphPatternChange={handleGraphPatternChange}
            onGraphLayoutChange={handleLayoutChange}
            config={config}
          />
        ); // 假设GraphCard接受data作为prop
      case "statisticsCard":
        return <StatisticsCard onClose={closeCard} split={splitPercentage} />;
      case "uploadCard":
        return <UploadCard onClose={closeCard} />;
      default:
        return null; // 当showCard不匹配任何已知值时不渲染任何东西
    }
  };

  // 鼠标拖动事件处理
  const onMouseDown = (e: any) => {
    // 添加mousemove和mouseup事件监听
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    e.preventDefault(); // 防止默认事件和文本选择
  };

  const onMouseMove = (e) => {
    // 计算新的分割位置百分比
    const newSplitPercentage = (e.clientX / window.innerWidth) * 100;
    // 设置状态以更新UI
    if (newSplitPercentage <= 30 || newSplitPercentage >= 65) {
      e.preventDefault();
    } else {
      setSplitPercentage(newSplitPercentage);
      e.preventDefault();
    }
  };

  const onMouseUp = (e) => {
    // 移除事件监听
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    e.preventDefault();
  };

  // ================================================================================================================================================
  return (
    <Grid
      container
      style={{ height: "calc(100vh - 64px)", width: "100%", display: "flex" }}
    >
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${splitPercentage}%`,
        }}
      >
        <RenderTabs
          onUpload={handleUploadClick}
          onStatistics={handleStatisticClick}
          onGraphMode={handleGraphMode}
          onListView={handleListView}
          selected={selectedTab}
          mainAdvisor={advisorInfo}
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
              advisor={advisorInfo}
              graphDegree={config.graphDegree}
              graphType={config.graphType}
              onNodeHover={(node: any) => {
                if (node) {
                  setSelectedNode(node);
                }
              }}
              split={splitPercentage}
              showAvatar={config.showAvatars}
              pattern_id={config.pattern_id}
              layout={config.layout}
            />
          )}
        </Paper>
      </Grid>

      <div
        onMouseDown={onMouseDown}
        style={{
          width: "5px",
          cursor: "ew-resize",
          background: "darkgray",
          zIndex: 1, // 确保分隔条在顶层
        }}
      >
        {/* 分隔条 */}
      </div>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1, // 使用flex属性而不是百分比宽度
        }}
      >
        <Paper
          elevation={3}
          style={{
            flexGrow: 1,
            overflow: "auto",
            borderRadius: 0,
            height: "100vh",
          }}
        >
          {renderCard()}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MainContent;

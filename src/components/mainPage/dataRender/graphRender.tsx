import React, { useEffect, useRef, useState } from "react";

import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { TitleComponent } from "echarts/components";
import { LegendComponent } from "echarts/components";

import { useRouter } from "next/router";

import { TooltipComponent, VisualMapComponent } from "echarts/components";

import { SVGRenderer } from "echarts/renderers";

import { fetchAdvisorDetails } from "@/components/wrapped_api/fetchAdvisor";
import { integer } from "@elastic/elasticsearch/lib/api/types";
import { Connection, AdvisorDetails } from "@/components/interface";

import CircularProgress from "@mui/material/CircularProgress";

import { scholarImg } from "@/components/const";

// 注册必要的组件
echarts.use([
  TooltipComponent,
  GraphChart,
  SVGRenderer,
  VisualMapComponent,
  TitleComponent,
  LegendComponent,
]);

const get_latest_collaboration = (conn: Connection) => {
  let latestYear = 0;
  conn.collaborations.forEach((collab) => {
    if (collab.year > latestYear) {
      latestYear = collab.year;
    }
  });
  return latestYear;
};

const calculate_influence_factor = (advisor: AdvisorDetails, degree = 1) => {
  // TODO, should take the influence of its connected advisors into account, rather than merely count the number of connections
  let influenceFactor = 0;
  for (let i = 0; i < advisor.connections.length; i++) {
    let conn = advisor.connections[i];
    let paper_score = conn.collaborations.length;
    influenceFactor += 1 + paper_score;
  }
  return influenceFactor;
};

const calculate_relation_factor = (
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

let currentMain = ""; // 记录主要advisor的ID

const fetchAdvisorDetailsBatch = async (connectionIds) => {
  const fetchPromises = connectionIds.map((id) => fetchAdvisorDetails(id));
  return Promise.all(fetchPromises);
};

const advisorsReader = async (
  _id: string,
  graphDegree: number,
  advisor: any
) => {
  let nodes: any[] = [];
  let links: any[] = [];
  let nodeQueue: AdvisorDetails[] = [];
  let nodeQueueBackUp: AdvisorDetails[] = [];
  let nodesSet = new Set<string>();
  let linkSet = new Set<string>(); // 其实是冗余的，暂时先不管
  currentMain = _id; // 更新主要advisor的ID
  let minYear = new Date().getFullYear(); // 初始化为当前年份
  let maxYear = 0;
  if (!graphDegree || graphDegree < 1) {
    graphDegree = 1;
  }
  const currentYear = new Date().getFullYear();

  const maxRelationFactor = 100;

  const minRelationFactor = 0;

  const mainAdvisor = advisor;

  // @ts-ignore
  nodeQueue.push(mainAdvisor);

  const addNode = (
    nodes: any[],
    advisor: AdvisorDetails,
    symbolSize: number,
    latestCollaboration: number,
    influenceFactor: number
  ) => {
    // if exists, return
    if (nodesSet.has(advisor._id)) {
      return nodes;
    }

    if (advisor._id === mainAdvisor?._id) {
      nodes.push({
        id: String(mainAdvisor._id),
        symbolSize: 200, // main节点的大小
        itemStyle: { color: "red" }, // main节点为红色
        latestCollaboration: new Date().getFullYear(), // 假设主节点的最近合作时间为当前年
        influenceFactor: influenceFactor,
        ...mainAdvisor,
        // symbol: "image://" + getImgData(mainAdvisor.picture, mainAdvisor), // Add this line
        draggable: true,
      });
    } else {
      nodes.push({
        id: String(advisor?._id),
        symbolSize: symbolSize,
        latestCollaboration: latestCollaboration,
        symbol: "circle", //`image://${advisor.picture}`, // Add this line
        influenceFactor: influenceFactor,
        ...advisor,
        draggable: true,
      });
    }
    nodesSet.add(advisor._id);
    return nodes;
  };

  function addLink(
    links: any[],
    sourceId: string,
    targetId: string,
    connection: any,
    relationFactor: number
  ) {
    const width =
      1 +
      (4 * (relationFactor - minRelationFactor)) /
        (maxRelationFactor - minRelationFactor);

    const formatter = `Relation factor: ${relationFactor}<br/>${connection.relations
      ?.map(
        (rel: any) =>
          `${rel.role} in ${rel.type}, from ${rel.duration.start} to ${rel.duration.end}`
      )
      .join("; ")}<br/>Collaborations: ${connection.collaborations
      ?.map(
        (collab: any) =>
          `<a href="${collab.url}" target="_blank">${collab.papername} (${collab.year})</a>`
      )
      .join(", ")}`;

    if (linkSet.has([sourceId, targetId].sort().join("-"))) {
      return links;
    }

    links.push({
      source: String(sourceId),
      target: String(targetId),
      value: relationFactor,
      lineStyle: {
        width: width,
        curveness: 0.1,
      },
      tooltip: {
        show: true,
        formatter: formatter,
      },
    });
    // undirected edge, denote it using a set

    const edgeKey = [sourceId, targetId].sort().join("-");
    linkSet.add(edgeKey);

    // console.log(links);
    // console.log(linkSet);

    return links;
  }

  // MAIN LOOP

  while (
    (nodeQueue.length > 0 || nodeQueueBackUp.length > 0) &&
    graphDegree > 0
  ) {
    const currentAdvisor = nodeQueue.shift();

    // get all connected id of currentAdvisor
    if (currentAdvisor) {
      const curr_influence_factor = calculate_influence_factor(currentAdvisor);
      nodes = addNode(
        nodes,
        currentAdvisor,
        200,
        currentAdvisor?.connections?.reduce(
          (max, conn) => Math.max(max, get_latest_collaboration(conn)),
          0
        )
          ? currentAdvisor?.connections.reduce(
              (max, conn) => Math.max(max, get_latest_collaboration(conn)),
              0
            )
          : currentYear,
        curr_influence_factor
      );

      // get all connected advisors using fetchAdvisorDetails into a list

      if (currentAdvisor.connections?.length) {
        const connectionIds = currentAdvisor.connections.map(
          (conn) => conn._id
        );
        const connectedAdvisors = await fetchAdvisorDetailsBatch(connectionIds);

        connectedAdvisors.forEach((connectedAdvisor, index) => {
          if (connectedAdvisor) {
            const connection = currentAdvisor.connections[index];
            const latestYear = connectedAdvisor.connections?.reduce(
              (max, conn) => {
                const year = conn.collaborations.reduce(
                  (maxYear, collab) => Math.max(maxYear, collab.year),
                  0
                );
                return Math.max(max, year);
              },
              0
            );

            const relationFactor = calculate_relation_factor(
              currentAdvisor,
              connectedAdvisor,
              connection
            );
            minYear = Math.min(minYear, latestYear);
            maxYear = Math.max(maxYear, latestYear);

            const influenceFactor =
              calculate_influence_factor(connectedAdvisor);
            const symbolSize = 20 + influenceFactor * 10;
            nodes = addNode(
              nodes,
              connectedAdvisor,
              symbolSize,
              latestYear,
              influenceFactor
            );
            links = addLink(
              links,
              currentAdvisor._id,
              connectedAdvisor._id,
              connection,
              relationFactor
            );
            nodeQueueBackUp.push(connectedAdvisor);
          }
        });
      }

      if (nodeQueue.length === 0) {
        nodeQueue = nodeQueueBackUp;
        nodeQueueBackUp = [];
        graphDegree--;
      }
    }
  }

  return { nodes, links, minYear, maxYear, _id };
};

const getCircularImage = async (imageUrl: string, diameter: number) => {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = diameter;
      canvas.height = diameter;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, diameter, diameter);
        resolve(canvas.toDataURL());
      }
    };
    img.onerror = reject;
    // 更新 imageUrl 为 API 代理的 URL
    // img.src = `/api/image?imageUrl=${imageUrl}`;
    img.src = `/api/image?imageUrl=${encodeURIComponent(imageUrl)}`;
  });
};

const prepareNodes = async (nodesData) => {
  const processedNodes = await Promise.all(
    nodesData.map(async (node) => {
      if (node.picture) {
        const circularImage = await getCircularImage(node.picture, 100); // 假设节点图像直径为100px
        node.symbol = `image://${circularImage}`;
      } else {
        const circularImage = await getCircularImage(scholarImg, 100);
        // node.symbol = "circle";
        node.symbol = `image://${circularImage}`;
      }

      return node;
    })
  );

  return processedNodes;
};

// @ts-ignore
const GraphRender = ({
  onNodeHover,
  advisor,
  graphDegree,
  graphType,
  showAvatar,
  split, // 屏幕占比
}: {
  onNodeHover: Function;
  advisor: Advisor;
  graphDegree: number;
  graphType: string;
  showAvatar: boolean;
  split: integer;
}) => {
  const chartRef = useRef(null);
  const [option, setOption] = useState({}); // 用于存储图表配置
  const [zoomFactor, setZoomFactor] = useState(1); // 存储当前的缩放因子
  const [selectedNode, setSelectedNode] = useState(null); // 新增状态来跟踪选中的节点
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 用于存储选中节点的ID
  const [myChart, setMyChart] = useState(null); // 用于存储 echarts 实例
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nodesWOImg, setNodesWOImg] = useState([]);
  const [nodesWithImg, setNodesWithImg] = useState([]);

  useEffect(() => {
    if (chartRef.current && !myChart) {
      const initializedChart = echarts.init(chartRef.current, null, {
        renderer: "svg",
      });
      // @ts-ignore
      setMyChart(initializedChart); // 保存 echarts 实例
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 开始加载图表时设置 loading 为 true

      // 构造用于缓存的键
      const cacheKey = `graphData-${advisor?._id}-${graphDegree}`;
      // 尝试从 localStorage 获取缓存的图表配置
      // const cachedData = localStorage.getItem(cacheKey);
      const cachedData = null; // 数据可能会更新

      let data;
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        // 如果没有缓存，则从服务器获取数据
        console.log("get data");
        data = await advisorsReader(advisor?._id, graphDegree, advisor);
        // 将获取的数据存储到 localStorage
        // localStorage.setItem(cacheKey, JSON.stringify(data));
      }

      const { nodes, links, minYear, maxYear } = data;

      // 更新节点样式，为选中节点添加边框
      // @ts-ignore
      const updateNodesStyle = (nodes, selectedNodeId) => {
        return nodes.map((node: any) => {
          if (node.id === selectedNodeId) {
            // 如果节点是被选中的节点，修改其样式
            return {
              ...node, // 浅拷贝
              itemStyle: {
                ...node.itemStyle,
                borderColor: "blue",
                borderWidth: 3,
                borderType: "solid",
              },
            };
          } else {
            // 否则，只进行浅拷贝，确保不直接修改原始对象
            return { ...node };
          }
        });
      };

      nodes.forEach((node) => {
        node.label = {
          show: true,
          fontSize: 24 * zoomFactor, // 根据当前缩放因子设置初始字体大小
          offset: [0, 10 + node.symbolSize / 4],
        };
      });

      const updatedNodes = nodes.map((node) => {
        // 主节点保持红色，其他节点颜色由 visualMap 控制
        if (node.id !== currentMain) {
          return {
            ...node,
            value: node.latestCollaboration, // 设置 value 以供 visualMap 使用
          };
        }
        return node;
      });

      let final_nodes = updateNodesStyle(updatedNodes, selectedNodeId);
      let copy_nodes = updateNodesStyle(updatedNodes, selectedNodeId);
      setNodesWOImg(() => final_nodes);
      const nodesWithImages = await prepareNodes(copy_nodes);
      console.log(final_nodes);
      setNodesWithImg(() => nodesWithImages);

      const initialOption = {
        title: {
          text: "科研合作网络图",
          top: "bottom",
          left: "right",
        },
        visualMap: {
          show: true,
          type: "continuous",
          min: 1999,
          max: 2024,
          orient: "horizontal",
          left: "3%",
          bottom: "10%",

          inRange: {
            color: ["#eee", "#abc"], // 从浅灰到深灰的颜色渐变
          },
          textStyle: {
            color: "#333",
          },
          // 显示两端的数值
          text: [maxYear.toString(), minYear.toString()], // visualMap 两端显示的文本，分别对应最大值和最小值
          textGap: 5, // 文本与滑块之间的距离
        },
        tooltip: {
          show: true,
          formatter: (params: any) => {
            if (params.dataType === "edge") {
              return params.data.tooltip;
            }
            return `${params.data.name} <br/> influence factor: ${params.data.influenceFactor}`;
          },
        },
        legend: {
          data: ["Main Node", "Other"],
        },
        focusNodeAdjacency: true, //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
        series: [
          {
            name: "科研合作",
            type: "graph",
            layout: "force",
            layoutAnimation: false,
            data: final_nodes,
            links: links,

            categories: [{ name: "Main Node" }, { name: "Other" }],
            roam: false,
            edgeSymbol: ["none", "none"],
            edgeSymbolSize: [10, 20],
            label: {
              show: true,
              position: "top", // 将标签放置在节点的上方
              formatter: "{b}", // 使用节点的name作为标签文本
            },
            force: {
              repulsion: 1000,
              edgeLength: 500,
            },
            lineStyle: {
              color: "source",
              curveness: 0.3,
            },
            emphasis: {
              focus: "self", // 鼠标悬浮时只强调当前节点
              itemStyle: {
                color: "#darkerColor", // 强调时的颜色，需替换为实际更深的颜色值
                borderColor: "rgba(255, 255, 255, 0.8)", // 强调时的边框颜色，使用半透明的白色
                borderWidth: 3, // 强调时的边框宽度
                borderType: "solid", // 边框类型
                shadowBlur: 10, // 阴影的模糊大小
                shadowColor: "rgba(0, 0, 0, 0.3)", // 阴影颜色
              },
            },
            // 设置选中状态（如果需要）的样式
          },
        ],
      };

      if (graphType === "directed") {
        initialOption.series[0].edgeSymbol = ["none", "arrow"];
      } else if (graphType === "undirected") {
        initialOption.series[0].edgeSymbol = ["none", "none"];
      } else {
        console.error("Invalid graph type.");
      }

      setOption(initialOption); // 设置图表配置

      setLoading(false); // 开始加载图表时设置 loading 为 true
    };

    const showAvatarOnNode = async () => {};

    fetchData();
  }, [selectedNodeId, advisor, graphDegree]);

  useEffect(() => {
    if (myChart) {
      (myChart as any).resize();

      // @ts-ignore
      myChart.setOption(option); // 初始化图表

      // 监听节点的鼠标悬停事件
      // @ts-ignore
      myChart.on("mouseover", "series.graph", function (params) {
        if (params.dataType === "node") {
          // 只有当节点未被选中时，才应用悬浮样式
          // @ts-ignore
          if (!selectedNode || params.data.id !== selectedNode.id) {
            // 应用悬浮样式
            onNodeHover(params.data);
          }
        }
      });

      // 监听鼠标离开图表事件
      // @ts-ignore
      myChart.on("mouseout", "series.graph", function (params) {
        if (params.dataType === "node") {
          // 如果鼠标离开的节点不是被选中的节点，恢复原样式
          // @ts-ignore
          if (!selectedNode || params.data.id !== selectedNode.id) {
            // 恢复节点原样式
            onNodeHover(null); // 鼠标离开时清除选中的节点
          }
        }
      });

      // @ts-ignore
      myChart.on("graphRoam", function (event) {
        if (event.zoom) {
          // @ts-ignore
          const zoomLevel = myChart.getOption().series[0].zoom; // 获取当前的缩放级别
          setZoomFactor(zoomLevel); // 更新缩放因子状态
          // @ts-ignore
          myChart.setOption({
            series: [
              {
                label: {
                  fontSize: 12 * zoomLevel, // 根据缩放级别调整字体大小
                },
              },
            ],
          });
        }
      });

      // 清理工作

      return () => {
        // @ts-ignore
        myChart.off("graphRoam");
        // @ts-ignore
        myChart.off("mouseover");
        // @ts-ignore
        myChart.off("mouseout");
      };
    }
  }, [myChart, zoomFactor, split, onNodeHover, option]);

  useEffect(() => {
    if (myChart) {
      setOption((prevOption) => ({
        ...prevOption,
        series: [
          {
            edgeSymbol:
              graphType === "directed" ? ["none", "arrow"] : ["none", "none"],
          },
        ],
      }));
      myChart.setOption({
        series: [
          {
            edgeSymbol:
              graphType === "directed" ? ["none", "arrow"] : ["none", "none"],
          },
        ],
      });
    }
  }, [graphType]);

  useEffect(() => {
    if (showAvatar) {
      if (nodesWithImg.length !== 0) {
        setOption((prevOption) => ({
          ...prevOption,
          series: [
            {
              edgeSymbol:
                graphType === "directed" ? ["none", "arrow"] : ["none", "none"],
              ...prevOption.series[0],
              data: nodesWithImg,
            },
          ],
        }));
      }
    } else {
      if (nodesWOImg.length !== 0) {
        setOption((prevOption) => ({
          ...prevOption,
          series: [
            {
              edgeSymbol:
                graphType === "directed" ? ["none", "arrow"] : ["none", "none"],
              ...prevOption?.series[0],
              data: nodesWOImg,
            },
          ],
        }));
      }
    }
  }, [showAvatar, nodesWithImg]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default GraphRender;

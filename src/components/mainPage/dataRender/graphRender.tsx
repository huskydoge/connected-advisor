import React, { useEffect, useRef, useState } from "react";

import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { useRouter } from "next/router";

import { TooltipComponent, VisualMapComponent } from "echarts/components";

import { SVGRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([TooltipComponent, GraphChart, SVGRenderer, VisualMapComponent]);
interface Advisor {
  advisor_id: number;
  name: string;
  connections: {
    advisor_id: number;
    relation: Array<{
      class: string;
      role: string;
      duration: {
        start: { year: number; month: number };
        end: { year: number; month: number };
      };
    }>;
    collaborations: Array<{
      papername: string;
      year: number;
      url: string;
    }>;
    latestCollaboration: number;
    relationFactor: number;
  }[];
}

let currentMain = 0; // 记录主要advisor的ID

const advisors: Advisor[] = require("../../../data/advisors.json");

const advisorsReader = (advisor_id: number, graphDegree: number) => {
  let nodes: any[] = [];
  let links: any[] = [];
  let nodeQueue: Advisor[] = [];
  let nodesSet = new Set<number>();
  let linkSet = new Set<string>(); // 其实是冗余的，暂时先不管
  currentMain = advisor_id; // 更新主要advisor的ID
  let minYear = new Date().getFullYear(); // 初始化为当前年份
  let maxYear = 0; // 初始化为0

  if (!graphDegree || graphDegree < 1) {
    graphDegree = 1;
  }
  const currentYear = new Date().getFullYear();
  const minRelationFactor = Math.min(
    ...advisors.flatMap((advisor) =>
      advisor.connections.map((conn) => conn.relationFactor)
    )
  );
  const maxRelationFactor = Math.max(
    ...advisors.flatMap((advisor) =>
      advisor.connections.map((conn) => conn.relationFactor)
    )
  );

  // 找到与currentMain匹配的advisor节点
  const mainAdvisor = advisors.find(
    (advisor) => advisor.advisor_id === currentMain
  );

  // @ts-ignore
  nodeQueue.push(mainAdvisor);

  const addNode = (
    nodes: any[],
    advisor: Advisor,
    symbolSize: number,
    latestCollaboration: number
  ) => {
    if (nodesSet.has(advisor.advisor_id)) {
      return nodes;
    }

    if (advisor.advisor_id === mainAdvisor?.advisor_id) {
      nodes.push({
        id: String(mainAdvisor.advisor_id),
        symbolSize: 200, // main节点的大小
        itemStyle: { color: "red" }, // main节点为红色
        latestCollaboration: new Date().getFullYear(), // 假设主节点的最近合作时间为当前年
        ...mainAdvisor,
      });
    } else {
      nodes.push({
        id: String(advisor?.advisor_id),
        symbolSize: symbolSize,
        latestCollaboration: latestCollaboration,
        ...advisor,
      });
    }
    nodesSet.add(advisor.advisor_id);
    return nodes;
  };

  function addLink(
    links: any[],
    sourceId: number,
    targetId: number,
    connection: any
  ) {
    const width =
      1 +
      (4 * (connection.relationFactor - minRelationFactor)) /
        (maxRelationFactor - minRelationFactor);
    const formatter = `Relation factor: ${
      connection.relationFactor
    }<br/>${connection.relation
      .map(
        (rel: any) =>
          `${rel.role} in ${rel.class}, from ${rel.duration.start.year}-${rel.duration.start.month} to ${rel.duration.end.year}-${rel.duration.end.month}`
      )
      .join("; ")}<br/>Collaborations: ${connection.collaborations
      .map(
        (collab: any) =>
          `<a href="${collab.url}" target="_blank">${collab.papername} (${collab.year})</a>`
      )
      .join(", ")}`;

    if (
      linkSet.has(
        `${Math.min(sourceId, targetId)}-${Math.max(sourceId, targetId)}`
      )
    ) {
      return links;
    }

    links.push({
      source: String(sourceId),
      target: String(targetId),
      value: connection.relationFactor,
      lineStyle: {
        width: width,
        curveness: 0.1,
      },
      tooltip: {
        show: true,
        formatter: formatter,
      },
    });
    // undirected
    linkSet.add(
      `${Math.min(sourceId, targetId)}-${Math.max(sourceId, targetId)}`
    );

    console.log(links);
    console.log(linkSet);

    return links;
  }

  while (nodeQueue.length > 0 && graphDegree > 0) {
    const currentAdvisor = nodeQueue.shift();

    if (currentAdvisor) {
      nodes = addNode(
        nodes,
        currentAdvisor,
        200,
        currentAdvisor?.connections.reduce(
          (max, conn) => Math.max(max, conn.latestCollaboration),
          0
        )
      );
      currentAdvisor.connections.forEach((connection) => {
        const connectedAdvisor = advisors.find(
          (advisor) => advisor.advisor_id === connection.advisor_id
        );
        if (connectedAdvisor) {
          const latestYear = connection.collaborations.reduce(
            (max, collab) => Math.max(max, collab.year),
            0
          );

          minYear = Math.min(minYear, latestYear);
          maxYear = Math.max(maxYear, latestYear);

          const symbolSize = 20 + connection.relationFactor * 0.5;

          // @ts-ignore
          nodes = addNode(nodes, connectedAdvisor, symbolSize, latestYear);
          //@ts-ignore
          links = addLink(
            links,
            currentAdvisor.advisor_id,
            // @ts-ignore
            connectedAdvisor?.advisor_id,
            connection
          );
          nodeQueue.push(connectedAdvisor);
        }
      });
      graphDegree--;
    }
  }

  // if (mainAdvisor) {
  //   nodes.push({
  //     id: String(mainAdvisor.advisor_id),
  //     symbolSize: 200, // main节点的大小
  //     itemStyle: { color: "red" }, // main节点为红色
  //     latestCollaboration: new Date().getFullYear(), // 假设主节点的最近合作时间为当前年
  //     ...mainAdvisor,
  //   });

  //   nodesSet.add(mainAdvisor.advisor_id);

  //   mainAdvisor.connections.forEach((connection) => {
  //     const connectedAdvisor = advisors.find(
  //       (advisor) => advisor.advisor_id === connection.advisor_id
  //     );
  //     if (connectedAdvisor) {
  //       const connectedAdvisor = advisors.find(
  //         (advisor) => advisor.advisor_id === connection.advisor_id
  //       );

  //       const latestYear = connection.collaborations.reduce(
  //         (max, collab) => Math.max(max, collab.year),
  //         0
  //       );

  //       minYear = Math.min(minYear, latestYear);
  //       maxYear = Math.max(maxYear, latestYear);

  //       const symbolSize = 20 + connection.relationFactor * 0.5;

  //       // @ts-ignore
  //       nodes = addNode(nodes, connectedAdvisor, symbolSize, latestYear);
  //       //@ts-ignore
  //       links = addLink(
  //         links,
  //         mainAdvisor.advisor_id,
  //         // @ts-ignore
  //         connectedAdvisor?.advisor_id,
  //         connection
  //       );
  //     }
  //   });

  //   if (graphDegree >= 2) {
  //   }
  // }

  return { nodes, links, minYear, maxYear, advisor_id };
};

// @ts-ignore
const GraphRender = ({
  onNodeHover,
  onNodeClick,
  advisor_id,
  graphDegree,
  graphType,
}: {
  onNodeHover: Function;
  onNodeClick: Function;
  advisor_id: string;
  graphDegree: number;
  graphType: string;
}) => {
  const chartRef = useRef(null);
  const [option, setOption] = useState({}); // 用于存储图表配置
  const [zoomFactor, setZoomFactor] = useState(1); // 存储当前的缩放因子
  const [selectedNode, setSelectedNode] = useState(null); // 新增状态来跟踪选中的节点
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 用于存储选中节点的ID
  const [myChart, setMyChart] = useState(null); // 用于存储 echarts 实例
  const router = useRouter();

  useEffect(() => {
    if (chartRef.current && !myChart) {
      const initializedChart = echarts.init(chartRef.current, null, {
        renderer: "svg",
      });
      // @ts-ignore
      setMyChart(initializedChart); // 保存 echarts 实例
    }

    if (myChart) {
      const { nodes, links, minYear, maxYear } = advisorsReader(
        parseInt(advisor_id),
        graphDegree
      );

      // 更新节点样式，为选中节点添加边框
      // @ts-ignore
      const updateNodesStyle = (nodes, selectedNodeId) => {
        // @ts-ignore
        return nodes.map((node) => {
          if (node.id === selectedNodeId) {
            return {
              ...node,
              itemStyle: {
                ...node.itemStyle,
                borderColor: "blue",
                borderWidth: 3,
                borderType: "solid",
              },
            };
          }
          return {
            ...node,
            itemStyle: {
              ...node.itemStyle,
              borderColor: "none",
              borderWidth: 0,
            },
          };
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

      const initialOption = {
        title: {
          text: "科研合作网络图",
          top: "bottom",
          left: "right",
        },
        visualMap: {
          show: true,
          type: "continuous",
          min: minYear,
          max: maxYear,
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
            return params.data.name;
          },
        },
        legend: {
          data: ["Main Node", "Other"],
        },
        series: [
          {
            name: "科研合作",
            type: "graph",
            layout: "force",
            layoutAnimation: false,
            data: updateNodesStyle(updatedNodes, selectedNodeId),
            links: links,
            categories: [{ name: "Main Node" }, { name: "Other" }],
            roam: true,
            edgeSymbol: ["none", "none"],
            edgeSymbolSize: [10, 20],
            label: {
              show: true,
              position: "top", // 将标签放置在节点的上方
              formatter: "{b}", // 使用节点的name作为标签文本
            },
            force: {
              repulsion: 2000,
              edgeLength: 400,
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
      // @ts-ignore
      myChart.setOption(initialOption); // 初始化图表

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

      // 处理节点点击事件
      // @ts-ignore
      myChart.on("click", function (params: any) {
        if (params.dataType === "node") {
          setSelectedNodeId(params.data.id); // 更新选中节点的ID
          onNodeClick(params.data);
        }
        if (params.dataType === "edge") {
          // 如果是边（edge）的点击事件，不执行任何操作
          console.log("Edge click detected, action will be ignored.");
          setSelectedNodeId(null); // 更新选中节点的ID
          onNodeClick(null);
          return; // 直接返回，不执行后续代码
        }
        // 重新应用图表配置以更新节点样式
        // @ts-ignore
        myChart.setOption({
          series: [
            {
              data: updateNodesStyle(nodes, selectedNodeId),
            },
          ],
        });
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
  }, [zoomFactor, onNodeHover, selectedNodeId, myChart]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default GraphRender;
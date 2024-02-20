/* eslint-disable no-alert */

import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { ECharts, init } from "echarts"; // 假设的导入，根据你的实际使用情况调整
import {
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";

import { SVGRenderer } from "echarts/renderers";

const generateGraphData = (nodesCount: any) => {
  const nodes = [];
  const links = [];

  // 主节点
  nodes.push({
    name: "Main Node",
    category: 0,
    symbolSize: 70,
    itemStyle: { color: "red" },
  });

  // 其他节点
  for (let i = 1; i <= nodesCount; i++) {
    nodes.push({
      name: `Node ${i}`,
      category: 1,
      symbolSize: 20 + Math.random() * 40, // 20 ~ 60 的大小
      itemStyle: { color: "grey" },
    });
    links.push({
      source: "Main Node",
      target: `Node ${i}`,
    });
  }

  return { nodes, links };
};

// 注册必要的组件
echarts.use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  SVGRenderer,
  VisualMapComponent,
]);
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

const currentMain = 0; // 记录主要advisor的ID
const advisors: Advisor[] = require("../../data/advisors.json");
const advisorsReader = () => {
  const nodes: any[] = [];
  const links: any[] = [];
  let minYear = new Date().getFullYear(); // 初始化为当前年份
  let maxYear = 0; // 初始化为0
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
  if (mainAdvisor) {
    nodes.push({
      id: mainAdvisor.advisor_id,
      symbolSize: 200, // main节点的大小
      itemStyle: { color: "red" }, // main节点为红色
      latestCollaboration: new Date().getFullYear(), // 假设主节点的最近合作时间为当前年
      ...mainAdvisor,
    });

    mainAdvisor.connections.forEach((connection) => {
      const connectedAdvisor = advisors.find(
        (advisor) => advisor.advisor_id === connection.advisor_id
      );
      if (connectedAdvisor) {
        const connectedAdvisor = advisors.find(
          (advisor) => advisor.advisor_id === connection.advisor_id
        );

        const latestYear = connection.collaborations.reduce(
          (max, collab) => Math.max(max, collab.year),
          0
        );

        minYear = Math.min(minYear, latestYear);
        maxYear = Math.max(maxYear, latestYear);

        const symbolSize = 20 + connection.relationFactor * 0.5;

        nodes.push({
          id: connectedAdvisor?.advisor_id,
          symbolSize: symbolSize,
          latestCollaboration: latestYear,
          ...(connectedAdvisor || {}),
        });

        links.push({
          source: mainAdvisor.advisor_id,
          target: connectedAdvisor?.advisor_id,
          value: connection.relationFactor,
          lineStyle: {
            width:
              1 +
              (4 * (connection.relationFactor - minRelationFactor)) /
                (maxRelationFactor - minRelationFactor), // 根据relationFactor调整线条粗细
            curveness: 0.1, // 连线的曲度
          },
          tooltip: {
            show: true,
            formatter: () =>
              `Relation factor: ${
                connection.relationFactor
              }<br/>${connection.relation
                .map(
                  (rel) =>
                    `${rel.role} in ${rel.class}, from ${rel.duration.start.year}-${rel.duration.start.month} to ${rel.duration.end.year}-${rel.duration.end.month}`
                )
                .join("; ")}<br/>Collaborations: ${connection.collaborations
                .map(
                  (collab) =>
                    `<a href="${collab.url}" target="_blank">${collab.papername} (${collab.year})</a>`
                )
                .join(", ")}`,
          },
        });
      }
    });
  }

  return { nodes, links, minYear, maxYear };
};

const GraphRender = ({
  onNodeHover,
  onNodeClick,
}: {
  onNodeHover: any;
  onNodeClick: any;
}) => {
  const chartRef = useRef(null);
  const [option, setOption] = useState({}); // 用于存储图表配置
  const [zoomFactor, setZoomFactor] = useState(1); // 存储当前的缩放因子
  const [selectedNode, setSelectedNode] = useState(null); // 新增状态来跟踪选中的节点
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 用于存储选中节点的ID
  const [myChart, setMyChart] = useState<ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current && !myChart) {
      const initializedChart = echarts.init(chartRef.current, null, {
        renderer: "svg",
      });
      // @ts-ignore
      setMyChart(initializedChart); /* eslint-disable no-alert */
    }

    if (myChart) {
      const { nodes, links, minYear, maxYear } = advisorsReader();

      // 更新节点样式，为选中节点添加边框
      const updateNodesStyle = (nodes: any[], selectedNodeId: string) => {
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
          calculable: false,
          orient: "horizontal",
          left: "80%",
          bottom: 20,
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
            data: updateNodesStyle(updatedNodes, selectedNodeId || ""),
            links: links,
            categories: [{ name: "Main Node" }, { name: "Other" }],
            roam: true,
            label: {
              show: true,
              position: "top", // 将标签放置在节点的上方
              formatter: "{b}", // 使用节点的name作为标签文本
            },
            force: {
              repulsion: 500,
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

      setOption(initialOption); // 设置图表配置
      myChart.setOption(initialOption); // 初始化图表

      // 监听节点的鼠标悬停事件
      myChart.on("mouseover", "series.graph", function (params) {
        if (params.dataType === "node") {
          // Only apply hover style when the node is not selected

          if (
            params.data !== null &&
            params.data !== undefined &&
            (!selectedNode ||
              // @ts-ignore
              params.data.id !== selectedNode.id)
          ) {
            // 恢复节点原样式
            onNodeHover(null); // 鼠标离开时清除选中的节点
          }
        }
      });

      // 监听鼠标离开图表事件
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

      myChart.on("click", function (params) {
        if (params.dataType === "node") {
          // @ts-ignore
          setSelectedNodeId(params.data?.id); // 更新选中节点的ID
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
        myChart.setOption({
          series: [
            {
              // @ts-ignore
              data: updateNodesStyle(nodes, selectedNodeId),
            },
          ],
        });
      });

      myChart.on("graphRoam", function (event) {
        // @ts-ignore
        if (event.zoom) {
          // @ts-ignore
          const zoomLevel = myChart.getOption().series[0].zoom; // 获取当前的缩放级别
          setZoomFactor(zoomLevel); // 更新缩放因子状态
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
        myChart.off("graphRoam");
        myChart.off("mouseover");
        myChart.off("mouseout");
      };
    }
  }, [zoomFactor, onNodeHover, selectedNodeId, myChart]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default GraphRender;

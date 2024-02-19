import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";

import { SVGRenderer } from "echarts/renderers";

const generateGraphData = (nodesCount) => {
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
          id: connectedAdvisor.advisor_id,
          symbolSize: symbolSize,
          latestCollaboration: latestYear,
          ...connectedAdvisor,
        });

        links.push({
          source: mainAdvisor.advisor_id,
          target: connectedAdvisor.advisor_id,
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

const GraphRender = ({ onNodeHover }) => {
  const chartRef = useRef(null);
  const [option, setOption] = useState({}); // 用于存储图表配置
  const [zoomFactor, setZoomFactor] = useState(1); // 存储当前的缩放因子

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current, null, { renderer: "svg" });

      const { nodes, links, minYear, maxYear } = advisorsReader();

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
          formatter: (params) => {
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
            data: updatedNodes,
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
              focus: "adjacency",
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      };

      setOption(initialOption); // 设置图表配置
      myChart.setOption(initialOption); // 初始化图表

      // 处理节点点击事件
      myChart.on("click", function (params) {
        if (params.dataType === "node") {
          // 如果点击的是节点，更新选中节点的状态并重新设置图表选项以显示选中效果
          const clickedNodes = updatedNodes.map((node) => {
            if (node.id == params.data.id) {
              console.log(params.data.id);
              return {
                ...node,
                itemStyle: { borderColor: "blue", borderWidth: 30 },
              };
            }
            return node;
          });
          myChart.setOption({
            series: [{ data: clickedNodes }],
          });
          onNodeHover(params.data); // 更新父组件状态，以传递选中的节点数据
        } else {
          // 如果点击的是非节点部分，取消选中状态
          myChart.setOption({
            series: [{ data: updatedNodes }], // 重置节点样式
          });
          onNodeHover(null); // 清除选中的节点数据
        }
      });

      myChart.on("graphRoam", function (event) {
        if (event.zoom) {
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

      // 监听节点的鼠标悬停事件
      myChart.on("mouseover", "series.graph", function (params) {
        if (params.dataType === "node") {
          onNodeHover(params.data); // 调用回调函数，并传递节点数据
        }
      });

      // 监听鼠标离开图表事件
      myChart.on("mouseout", "series.graph", function (params) {
        onNodeHover(null); // 鼠标离开时清除选中的节点
      });

      // 清理工作
      return () => {
        myChart.off("graphRoam");
        myChart.off("mouseover");
        myChart.off("mouseout");
      };
    }
  }, [zoomFactor, onNodeHover]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default GraphRender;

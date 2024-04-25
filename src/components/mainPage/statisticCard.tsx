/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-02-21 15:59:56
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-25 23:08:31
 * @FilePath: /connected-advisor/src/components/mainPage/statisticCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// StatisticCard.jsx
import React, { useEffect, useState, useRef } from "react";
import { Box, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as echarts from "echarts/core";
import CircularProgress from "@mui/material/CircularProgress";

import { GraphChart } from "echarts/charts";
import { TitleComponent } from "echarts/components";
import { LegendComponent } from "echarts/components";

import { useRouter } from "next/router";

import { TooltipComponent, VisualMapComponent } from "echarts/components";

import { SVGRenderer } from "echarts/renderers";
import { fetchStatistics } from "../wrapped_api/fetchStatistics";
import { StatisticsData } from "../interface";

import { PieChart } from "echarts/charts";

echarts.use([
  TooltipComponent,
  GraphChart,
  SVGRenderer,
  VisualMapComponent,
  TitleComponent,
  LegendComponent,
  PieChart,
]);

//@ts-ignore
const StatisticCard = ({ onClose, split }) => {
  const chartRefAff = useRef(null);
  const chartRefTag = useRef(null);
  const chartRefPos = useRef(null);
  const [optionAff, setOptionAff] = useState({}); // 用于存储图表配置
  const [optionTag, setOptionTag] = useState({}); // 用于存储图表配置
  const [optionPos, setOptionPos] = useState({}); // 用于存储图表配置
  const [myChartAff, setMyChartAff] = useState(null); // 用于存储 echarts 实例
  const [myChartTag, setMyChartTag] = useState(null);
  const [myChartPos, setMyChartPos] = useState(null);
  const [loadingAff, setLoadingAff] = useState(true);
  const [loadingTag, setLoadingTag] = useState(true);
  const [loadingPos, setLoadingPos] = useState(true);
  const [statisticData, setStatisticData] = useState<StatisticsData>();
  const [affiliationData, setAffiliationData] = useState(null);
  const [tagData, setTagData] = useState(null);
  const [posData, setPosData] = useState(null);

  const [config, setConfig] = useState({
    aff: "pie",
    pos: "pie",
    tag: "pie",
  });

  const genAffData = (rawData: StatisticsData) => {
    let legendData: string[] = [];
    let seriesData: { name: string; value: number }[] = [];

    // 使用Object.keys和map函数从rawData.affiliationCounts中提取键并生成图表数据
    legendData = Object.keys(rawData.affiliationCounts);
    seriesData = legendData.map((key) => ({
      name: key,
      value: rawData.affiliationCounts[key],
    }));

    // 返回构建的数据，通常用于配置图表
    return { legendData, seriesData };
  };

  const genTagData = (rawData: StatisticsData) => {
    let legendData: string[] = [];
    let seriesData: { name: string; value: number }[] = [];

    // 使用Object.keys和map函数从rawData.affiliationCounts中提取键并生成图表数据
    legendData = Object.keys(rawData.tagCounts);
    seriesData = legendData.map((key) => ({
      name: key,
      value: rawData.tagCounts[key],
    }));

    // 返回构建的数据，通常用于配置图表
    return { legendData, seriesData };
  };

  const genPosData = (rawData: StatisticsData) => {
    let legendData: string[] = [];
    let seriesData: { name: string; value: number }[] = [];

    // 使用Object.keys和map函数从rawData.affiliationCounts中提取键并生成图表数据
    legendData = Object.keys(rawData.positionCounts);
    seriesData = legendData.map((key) => ({
      name: key,
      value: rawData.positionCounts[key],
    }));

    // 返回构建的数据，通常用于配置图表
    return { legendData, seriesData };
  };

  useEffect(() => {
    if (chartRefAff.current && !myChartAff) {
      const initializedChart = echarts.init(chartRefAff.current, null, {
        renderer: "svg",
      });
      // @ts-ignore
      setMyChartAff(initializedChart); // 保存 echarts 实例
    }

    if (chartRefTag.current && !myChartTag) {
      const initializedChart = echarts.init(chartRefTag.current, null, {
        renderer: "svg",
      });
      // @ts-ignore
      setMyChartTag(initializedChart); // 保存 echarts 实例
    }

    if (chartRefPos.current && !myChartPos) {
      const initializedChart = echarts.init(chartRefPos.current, null, {
        renderer: "svg",
      });
      // @ts-ignore
      setMyChartPos(initializedChart); // 保存 echarts 实例
    }
  }, [split]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingAff(true); // 开始加载图表时设置 loadingAff 为 true
      setLoadingTag(true);
      setLoadingPos(true);

      // 构造用于缓存的键
      const cacheKey = `statistics`;
      // 尝试从 localStorage 获取缓存的图表配置
      const cachedData = localStorage.getItem(cacheKey);
      // const cachedData = null; // 由于数据可能会更新，所以暂时不使用缓存

      let data;
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        // 如果没有缓存，则从服务器获取数据
        console.log("get data");
        data = await fetchStatistics();
        // 将获取的数据存储到 localStorage
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }

      console.log(data);
      setStatisticData(() => data);
      setAffiliationData(genAffData(data)); // Update this line
      setLoadingAff(false); // 开始加载图表时设置 loadingAff 为 true
      setTagData(genTagData(data));
      setLoadingTag(false);
      setPosData(genPosData(data));
      setLoadingPos(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const opt = {
      title: {
        text: "Affiliations",
        subtext: "University",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 10,
        top: 20,
        bottom: 20,
        data: affiliationData?.legendData,
      },
      series: [
        {
          name: "Affiliations",
          type: "pie",
          radius: "55%",
          center: ["40%", "50%"],
          data: affiliationData?.seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    setOptionAff(opt);
  }, [affiliationData]);

  useEffect(() => {
    const opt = {
      title: {
        text: "Tags",
        subtext: "fields",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 10,
        top: 20,
        bottom: 20,
        data: tagData?.legendData,
      },
      series: [
        {
          name: "Tags",
          type: "pie",
          radius: "55%",
          center: ["40%", "50%"],
          data: tagData?.seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    setOptionTag(opt);
  }, [tagData]);

  useEffect(() => {
    const opt = {
      title: {
        text: "Positions",
        subtext: "",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 10,
        top: 20,
        bottom: 20,
        data: posData?.legendData,
      },
      series: [
        {
          name: "Positions",
          type: "pie",
          radius: "55%",
          center: ["40%", "50%"],
          data: posData?.seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    setOptionPos(opt);
  }, [posData]);

  useEffect(() => {
    if (myChartAff) {
      (myChartAff as any).resize();
      // @ts-ignore
      myChartAff.setOption(optionAff); // 初始化图表

      return () => {
        // @ts-ignore
        myChartAff.off("graphRoam");
        // @ts-ignore
        myChartAff.off("mouseover");
        // @ts-ignore
        myChartAff.off("mouseout");
      };
    }
  }, [myChartAff, optionAff]);

  useEffect(() => {
    if (myChartTag) {
      (myChartTag as any).resize();
      // @ts-ignore
      myChartTag.setOption(optionTag);
      return () => {
        // @ts-ignore
        myChartTag.off("graphRoam");
        // @ts-ignore
        myChartTag.off("mouseover");
        // @ts-ignore
        myChartTag.off("mouseout");
      };
    }
  }, [myChartTag, optionTag]);

  useEffect(() => {
    if (myChartPos) {
      (myChartPos as any).resize();
      // @ts-ignore
      myChartPos.setOption(optionPos);
      return () => {
        // @ts-ignore
        myChartPos.off("graphRoam");
        // @ts-ignore
        myChartPos.off("mouseover");
        // @ts-ignore
        myChartPos.off("mouseout");
      };
    }
  }, [myChartPos, optionPos]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Typography variant="h6">Statistics</Typography>
      </CardContent>
      <Box sx={{ flex: 1, position: "relative", minHeight: 100 }}>
        <div ref={chartRefAff} style={{ width: "100%", height: "50%" }}>
          {loadingAff && (
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
      </Box>
      <Box sx={{ flex: 1, position: "relative", minHeight: 100 }}>
        <div ref={chartRefTag} style={{ width: "100%", height: "50%" }}>
          {loadingTag && (
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
      </Box>
      <Box sx={{ flex: 1, position: "relative", minHeight: 100 }}>
        <div ref={chartRefPos} style={{ width: "100%", height: "50%" }}>
          {loadingPos && (
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
      </Box>
    </Box>
  );
};

export default StatisticCard;

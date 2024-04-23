import React from "react";
import {
  Link,
  Grid,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { GitHub, Twitter, Email, Language } from "@mui/icons-material";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CardHeader,
  IconButton,
  IconButtonProps,
  Collapse,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AdvisorConnection from "./advisorCardComponents/advisorConnections";
import Tags from "./advisorCardComponents/tags";
import AvatarLoader from "../AvatarLoader";
import { Advisor } from "@/components/interface";

import { scholarImg } from "@/components/const";

// import { Waline } from "./advisorCardComponents/advisorComments";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean; // 明确指出expand属性是一个布尔值
}

const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => (
  <IconButton {...other} />
))(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const AdvisorCard = ({ advisor }: { advisor: Advisor }) => {
  const router = useRouter(); // 使用useRouter钩子
  // 点击事件处理函数
  const handleClick = () => {
    router.push(`/main/${advisor._id}`); // 使用模板字符串插入变量
  };
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      sx={{
        p: 2,
        marginTop: 4,
        marginBottom: 4,
        overflowY: "scroll",
        fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
      }}
      direction="column"
    >
      {/* 将头像放置于顶部 */}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <AvatarLoader
          alt={advisor.name}
          src={advisor.avatar ? advisor.avatar : scholarImg}
          sx={{
            width: { xs: "8rem", sm: "10rem", md: "12rem" },
            height: { xs: "8rem", sm: "10rem", md: "12rem" },
            mb: 2,
          }}
        />
      </Grid>
      {/* 文本内容 */}
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "0.75 rem", sm: "1rem", md: "1.25rem" },
            fontWeight: "bold",
            textAlign: "center", // 使文本在较小屏幕上居中对齐
          }}
        >
          {advisor.name}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            textAlign: "center",
          }}
        >
          {!advisor.department
            ? `${advisor.position} @ ${advisor.affiliation}`
            : `${advisor.position} @ ${advisor.department}, ${advisor.affiliation}`}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center" // 居中对齐图标
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          <IconButton
            component="a"
            target="_blank"
            onClick={handleClick}
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Origin
          </IconButton>

          <Link
            href={advisor.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <GitHub sx={{ mr: 0.5 }} /> GitHub
          </Link>
          <Link
            href={advisor.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Twitter sx={{ mr: 0.5 }} /> Twitter
          </Link>
          <Link
            href={`mailto:${advisor.email}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Email sx={{ mr: 0.5 }} /> Email
          </Link>
          <Link
            href={advisor.homepage}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Language sx={{ mr: 0.5 }} /> Website
          </Link>
        </Stack>
        <Grid item xs={12} sx={{ padding: 5 }}>
          <div className="markdown-preview">
            <ReactMarkdown
              children={advisor.description}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            />
          </div>
        </Grid>
      </Grid>

      {/* Tags */}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex", // 开启Flexbox布局
          justifyContent: "center", // 水平居中
          alignItems: "center", // 垂直居中
          padding: 2, // 保留原有的内边距设置
          width: "100%", // 宽度设置为100%
          marginBottom: 4,
        }}
      >
        <Tags
          tags={advisor.tags ?? []}
          onClickTag={(tag: string) => console.log(tag)}
        />
      </Grid>

      {/* Connections Section */}
      <Grid item xs={12} sx={{ padding: 2, width: "100%" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}
        >
          Connections
        </Typography>
        {advisor.connections?.map((connection) => (
          <AdvisorConnection key={connection._id} connection={connection} />
        ))}
      </Grid>

      {/* Comments Section
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          Comments
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Waline
          serverURL="https://waline-connected-advisor-pud8gagjj-huskydoge.vercel.app"
          path={advisor._id}
        />
      </Grid> */}
    </Grid>
  );
};

export default AdvisorCard;

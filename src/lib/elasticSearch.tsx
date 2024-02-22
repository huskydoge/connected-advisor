// lib/elasticsearch.tsx
import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" }); // 使用你的 Elasticsearch 服务器地址

export default client;

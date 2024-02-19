import Image from "next/image";
import styles from "../styles/page.module.css";
import TopMenu from "@/components/topTab";
import MainContent from "@/components/mainPage/mainContent";

export default function Home() {
  return (
    <div>
      <TopMenu />
      <MainContent />
    </div>
  );
}

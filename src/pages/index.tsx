import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/home.module.css";
import ImageGallery from "@/components/ImageGallery";
import router from "next/router";

export default function Home() {
  const handleEnter = () => {
    router.push("/main/6607bc09eb00fa31e8d30829?graph");
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Our Project!</h1>
        {/* 在这里插入ImageGallery组件 */}
        <div className={styles.galleryWrapper}>
          <ImageGallery />
        </div>
        {/* 添加导航入口 */}
        <div className={styles.enterButton}>
          <button type="button" onClick={handleEnter}>
            Enter Main Page
          </button>
        </div>
      </main>
    </div>
  );
}

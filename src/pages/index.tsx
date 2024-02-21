import React from "react";

import Image from "next/image";
import styles from "../styles/home.module.css";

import ImageGallery from "@/components/ImageGallery";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Our Project!</h1>

        {/* 在这里插入ImageGallery组件 */}
        <div className={styles.galleryWrapper}>
          <ImageGallery />
        </div>

        {/* 其他页面内容 */}
      </main>
    </div>
  );
}

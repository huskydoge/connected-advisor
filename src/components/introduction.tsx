import React from "react";
import Image from "next/image";
import styles from "../styles/introduction.module.css"; // 确保路径正确

const Introduction = () => {
  return (
    <div className={styles.container}>
      <div className={styles.introSection}>
        <h1>Welcome to Our Project</h1>
        <p>
          This is a brief introduction to our project, highlighting its features
          and benefits.
        </p>
      </div>
      <div className={styles.imageGallery}>
        <h2>Image Gallery</h2>
        <div className={styles.galleryGrid}>
          {/* 使用占位符图片作为示例 */}
          <Image
            src="https://via.placeholder.com/500x300"
            alt="Placeholder"
            width={500}
            height={300}
          />
          <Image
            src="https://via.placeholder.com/500x300"
            alt="Placeholder"
            width={500}
            height={300}
          />
          <Image
            src="https://via.placeholder.com/500x300"
            alt="Placeholder"
            width={500}
            height={300}
          />
        </div>
      </div>
      <div className={styles.commentsSection}>
        <h2>User Comments</h2>
        <div className={styles.commentsList}>
          <p>"This project is amazing! Really helped me a lot."</p>
          <p>"Absolutely love the functionality and design."</p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;

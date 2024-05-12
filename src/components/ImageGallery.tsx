import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Masonry from "react-masonry-css";
import styles from "../styles/home.module.css";

// Responsive breakpoints for Masonry layout
const breakpointColumnsObj = {
  default: 5,
  1200: 5,
  1000: 5,
  800: 5,
  600: 5,
  400: 5,
};

export default function ImageGallery() {
  const [items, setItems] = useState([...extendedItemData]);
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const maxScrollHeight =
      scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const interval = setInterval(() => {
      if (scrollRef.current && !isHovering) {
        let newScrollTop = scrollRef.current.scrollTop + 1;
        if (newScrollTop >= maxScrollHeight) {
          setItems((prevItems) => [...prevItems, ...extendedItemData]);
          scrollRef.current.scrollTop = 0;
        } else {
          scrollRef.current.scrollTop = newScrollTop;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <Box
      sx={{
        width: "70%",
        height: "50rem",
        overflow: isHovering ? "auto" : "hidden",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      ref={scrollRef}
      className={styles.scrollBox}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {items.map((item, index) => (
          <div key={index}>
            <img
              className={styles.imageStyle}
              src={`${item.img}`}
              loading="lazy"
            />
          </div>
        ))}
      </Masonry>
    </Box>
  );
}

let itemData = [];

for (let i = 1; i < 39; ++i) {
  itemData.push({ img: `/display/img${i}.png` });
}

const extendedItemData = [...itemData, ...itemData, ...itemData]; // 复制更多数据以实现无限滚动效果

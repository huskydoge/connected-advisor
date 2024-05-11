import { useRouter } from "next/router";

import MainContent from "@/components/mainPage/mainContent";
import TopMenu from "@/components/topMenu";
const Post = () => {
  const router = useRouter();
  const id = 0;

  return (
    <div>
      <TopMenu />
      <MainContent id={String(id)} />
    </div>
  );
};

export default Post;

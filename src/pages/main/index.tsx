import { useRouter } from "next/router";

import MainContent from "@/components/mainPage/mainContent";

const Post = () => {
  const router = useRouter();
  const id = 0;

  return (
    <div>
      <MainContent id={String(id)} />
    </div>
  );
};

export default Post;

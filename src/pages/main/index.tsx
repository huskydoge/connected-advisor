import { useRouter } from "next/router";
import TopMenu from "@/components/topTab";
import MainContent from "@/components/mainPage/mainContent";

const Post = () => {
  const router = useRouter();
  const id = 0;

  return (
    <div>
      <MainContent id={Number(id)} />
    </div>
  );
};

export default Post;

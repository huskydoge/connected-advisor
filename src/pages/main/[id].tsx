import { useRouter } from "next/router";
import TopMenu from "@/components/topMenu";
import MainContent from "@/components/mainPage/mainContent";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <TopMenu />
      <MainContent id={String(id)} />
    </div>
  );
};

export default Post;

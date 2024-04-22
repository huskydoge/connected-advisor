import { useRouter } from "next/router";

const router = useRouter();

export const handleClickOnAdvisor = (id: string) => {
  router.push(`${id}?view=graph`, undefined, {
    shallow: true,
  });
};

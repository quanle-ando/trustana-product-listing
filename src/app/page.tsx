import { use } from "react";
import Main from "./pages/Main/Main";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queries = use(searchParams);

  return <Main queries={queries} />;
}

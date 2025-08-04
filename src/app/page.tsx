import "@ant-design/v5-patch-for-react-19";
import { Skeleton } from "antd";
import { Suspense } from "react";
import ProductTableServer from "./containers/ProductTable/ProductTableServer";
import AttributeColumnServer from "./containers/AttributeColumn/AttributeColumnServer";
import ClientRouter from "./components/ClientRouter/ClientRouter";
import { headers } from "next/headers";
import Main from "./pages/Main/Main";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queries = await searchParams;

  const reqHeaders = await headers();

  return (
    <Main
      clientRouter={<ClientRouter queries={queries} />}
      attributeClient={
        <Suspense fallback={<Skeleton active />}>
          <AttributeColumnServer />
        </Suspense>
      }
      productClient={
        <Suspense fallback={<Skeleton active data-testid="abc" />}>
          <ProductTableServer queries={queries} />
        </Suspense>
      }
    />
  );
}

import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "@components/loading";
import useUser from "@libs/client/useUser";
import WonderingCard from "@components/wondering-card";
import { NaviWithUser } from "pages/navi";
import Header from "@components/header";

interface WonderResponse {
  ok: boolean;
  navis: NaviWithUser[];
}

const Wonders: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<WonderResponse>(
    router.query.id ? `/api/users/${router.query.id}/wonder` : null
  );
  const { user } = useUser();

  return (
    <>
      <Header title="気になる" />
      <Layout canGoBack backURL={`/profile/${user?.id}`} title="気になる">
        {data?.ok ? (
          data.navis?.map((navi) => <WonderingCard navi={navi} key={navi.id} />)
        ) : (
          <Loading />
        )}
      </Layout>
    </>
  );
};

export default Wonders;

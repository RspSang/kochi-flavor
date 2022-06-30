import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
import { Navi, User, Wondering } from "@prisma/client";
import Loading from "@components/loading";
import WonderingCard from "@components/wondering-card";
import Header from "@components/header";

export interface NaviWithUser extends Navi {
  user: User;
  wonderings: Wondering[];
  _count: {
    wonderings: number;
    answers: number;
  };
}

interface NaviResponse {
  ok: boolean;
  navis: NaviWithUser[];
}

const NaviIndex: NextPage = () => {
  const { data } = useSWR<NaviResponse>(`/api/navi`);
  return (
    <>
      <Header title="まちナビ" />
      <Layout hasTabBar>
        <div className="divide-y-[2px] relative">
          {data ? (
            data?.navis?.map((navi) => <WonderingCard navi={navi} />)
          ) : (
            <Loading />
          )}
          <FloatingButton href="/navi/write">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </FloatingButton>
        </div>
      </Layout>
    </>
  );
};

export default NaviIndex;

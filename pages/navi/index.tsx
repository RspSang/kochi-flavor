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
  error?: string;
  navis: NaviWithUser[];
}

const NaviIndex: NextPage = () => {
  const { data } = useSWR<NaviResponse>(`/api/navi`);
  console.log(data);

  return (
    <>
      <Header title="まちナビ" />
      <Layout hasTabBar>
        <div className="divide-y-[2px] relative">
          {data?.ok ? (
            data?.navis?.map((navi) => <WonderingCard navi={navi} />)
          ) : data?.ok === false ? (
            <div className="h-full">
              <div className="flex flex-col justify-center items-center mt-5 space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-14 h-14 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span>まちナビを閲覧するためにはログインが必要です</span>
              </div>
            </div>
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

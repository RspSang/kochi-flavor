import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useCoords from "@libs/client/useCoords";
import useSWR from "swr";
import { Navi, User } from "@prisma/client";

interface NaviWithUser extends Navi {
  user: User;
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
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<NaviResponse>(
    latitude && longitude
      ? `/api/navi?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  return (
    <Layout hasTabBar>
      <div className="space-y-4 divide-y-[2px] relative">
        {data?.navis?.map((navi) => (
          <Link key={navi.id} href={`/navi/${navi.id}`}>
            <a className="flex cursor-pointer flex-col items-start pt-4">
              <span className="ml-4 flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                まち質問
              </span>
              <div className="mt-2 px-4 text-gray-700">
                <span className="font-medium text-orange-500">Q.</span>
                {navi.question}
              </div>
              <div className="mt-5 flex w-full items-center justify-between px-4 text-xs font-medium text-gray-500">
                <span>{navi.user.name}</span>
                <span>{navi.createdAt.slice(0, 10)}</span>
              </div>
              <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5 text-gray-700">
                <span className="flex items-center space-x-2 text-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>気になる {navi._count.wonderings}</span>
                </span>
                <span className="flex items-center space-x-2 text-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>回答 {navi._count.answers}</span>
                </span>
              </div>
            </a>
          </Link>
        ))}
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
  );
};

export default NaviIndex;

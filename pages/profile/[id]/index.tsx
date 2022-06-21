import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { User } from "@prisma/client";
import Loading from "@components/loading";

interface UserWithCounts extends User {
  _count: {
    reviews: number;
    wants: number;
    wents: number;
  };
}

interface ProfileResponse {
  ok: boolean;
  profile: UserWithCounts;
}

const Profile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<ProfileResponse>(
    router.query.id ? `/api/users/${router.query.id}` : null
  );
  const [logout] = useMutation("/api/users/logout");
  const onClick = () => {
    logout({});
    router.push("/auth/signin");
  };
  return (
    <Layout hasTabBar>
      <div className="px-4 max-w-xl">
        {data?.ok ? (
          <>
            <div className="flex items-center mt-2 space-x-3 px-6">
              {data.profile.avatar ? (
                <Image
                  height={72}
                  width={72}
                  src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${data.profile.avatar}/avatar`}
                  className="rounded-full bg-slate-500"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-slate-500" />
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-900">
                  {data.profile.name}
                </span>
                {data.profile.id === user?.id ? (
                  <Link href={`/profile/${user.id}/edit`}>
                    <a className="text-sm text-gray-700">
                      プロフィールを編集する &rarr;
                    </a>
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="mt-4 px-10 border-b-2 pb-4">
              <span>{data.profile.userDescription}</span>
            </div>
            <div className="mt-8 flex justify-around">
              <div className="flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">レビュー</p>
                <p className="text-slate-500 text-lg">
                  {data.profile._count.reviews}
                </p>
              </div>
              <div className="flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">行きたい所</p>
                <p className="text-slate-500 text-lg">
                  {data.profile._count.wants}
                </p>
              </div>
              <div className="flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">行ってきた所</p>
                <p className="text-slate-500 text-lg">
                  {data.profile._count.wents}
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-col px-8 space-y-3">
              <div>
                <span className="text-sm text-gray-500">グルメ</span>
              </div>
              <Link href={`/profile/${data.profile.id}/review`}>
                <a>
                  <div className="bg-orange-100 rounded-xl px-6 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 text-white bg-orange-400 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        レニューを見る
                      </span>
                    </div>
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </Link>
              <Link href={`/profile/${data.profile.id}/want`}>
                <a>
                  <div className="bg-orange-100 rounded-xl px-6 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 text-white bg-orange-400 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        行きたい所
                      </span>
                    </div>
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </Link>
              <Link href={`/profile/${data.profile.id}/went`}>
                <a>
                  <div className="bg-orange-100 rounded-xl px-6 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 text-white bg-orange-400 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        行ってきた所
                      </span>
                    </div>
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </Link>
              <div className="pt-4">
                <span className="text-sm text-gray-500">まちナビ</span>
              </div>
              <Link href={`/profile/${data.profile.id}/wonder`}>
                <a>
                  <div className="bg-amber-100 rounded-xl px-6 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 text-white bg-orange-400 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                            clipRule="evenodd"
                          />
                          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        気になる
                      </span>
                    </div>
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            {data.profile.id === user?.id ? (
              <div className="mt-16 flex">
                <button
                  onClick={onClick}
                  className="bg-red-300 rounded-2xl mx-8 py-3 text-center w-full shadow-md"
                >
                  ログアウト
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </Layout>
  );
};

export default Profile;

import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";

const Profile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [logout] = useMutation("/api/users/logout");
  const onClick = () => {
    logout({});
    router.push("/auth/signin");
  };
  return (
    <Layout hasTabBar>
      <div className="px-4 max-w-xl">
        <div className="flex items-center mt-4 space-x-3 px-6">
          <div className="w-16 h-16 bg-slate-500 rounded-full" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Steve Jebs</span>
            <Link href="/profile/1/edit">
              <a className="text-sm text-gray-700">
                プロフィールを更新する &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div className="mt-4 px-8 border-b-2 pb-4">
          <span>Hi i'm web developer based in Kochi</span>
        </div>
        <div className="mt-8 flex justify-around">
          <div className="flex justify-center flex-col items-center">
            <p className="font-semibold text-lg">レビュー</p>
            <p className="text-slate-500 text-lg">100</p>
          </div>
          <div className="flex justify-center flex-col items-center">
            <p className="font-semibold text-lg">フォロワー</p>
            <p className="text-slate-500 text-lg">100</p>
          </div>
          <div className="flex justify-center flex-col items-center">
            <p className="font-semibold text-lg">フォロー</p>
            <p className="text-slate-500 text-lg">100</p>
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/sold">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">
                レニューを見る
              </span>
            </a>
          </Link>
          <Link href="/profile/bought">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">
                行きたい所
              </span>
            </a>
          </Link>
          <Link href="/profile/loved">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
              <span className="text-sm mt-2 font-medium text-gray-700">
                行ってきた所
              </span>
            </a>
          </Link>
        </div>
        <div className="mt-16 flex">
          <button
            onClick={onClick}
            className="bg-red-300 rounded-2xl mx-2 py-3 text-center w-full "
          >
            ログアウト
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

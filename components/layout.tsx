import React from "react";
import Link from "next/link";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import Search from "./search";
import useSWR from "swr";
import { ProfileResponse } from "@libs/client/useUser";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  searchBar?: boolean;
  hasTabBar?: boolean;
  children?: React.ReactNode;
}

export default function Layout({
  title,
  canGoBack,
  searchBar,
  hasTabBar,
  children,
}: LayoutProps) {
  const router = useRouter();
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");

  const onClick = () => {
    router.back();
  };
  return (
    <div>
      {searchBar ? <Search /> : null}
      {canGoBack ? (
        <div className="fixed top-0 flex h-12 items-center w-full max-w-xl justify-center  border-b bg-white px-10 text-lg  font-medium text-gray-800">
          <button onClick={onClick} className="absolute left-4">
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          {title ? (
            <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
          ) : null}
        </div>
      ) : null}
      <div className={cls("pt-12", hasTabBar ? "pb-24" : "")}>{children}</div>
      {hasTabBar ? (
        <nav className="fixed bottom-0 flex w-full max-w-xl justify-between border-t bg-white px-10 pb-5 pt-3 text-xs text-gray-700">
          <Link href="/">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/"
                  ? "text-orange-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span>グルメ</span>
            </a>
          </Link>
          <Link href="/list">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/list"
                  ? "text-orange-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>リスト</span>
            </a>
          </Link>
          <Link href="/navi">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/navi"
                  ? "text-orange-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
              <span>まちナビ</span>
            </a>
          </Link>
          {data?.ok ? (
            <Link href={`/profile/${data?.profile.id}`}>
              <a
                className={cls(
                  "flex flex-col items-center space-y-2 ",
                  router.pathname === "/profile/[id]"
                    ? "text-orange-500"
                    : "transition-colors hover:text-gray-500"
                )}
              >
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span>プロフィール</span>
              </a>
            </Link>
          ) : (
            <Link href={`/auth/signin`}>
              <a
                className={cls(
                  "flex flex-col items-center space-y-2 ",
                  router.pathname === "/auth/signin"
                    ? "text-orange-500"
                    : "transition-colors hover:text-gray-500"
                )}
              >
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>ログイン</span>
              </a>
            </Link>
          )}
        </nav>
      ) : null}
    </div>
  );
}

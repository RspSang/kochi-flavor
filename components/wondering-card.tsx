import { cls } from "@libs/client/utils";
import Link from "next/link";
import { NaviWithUser } from "pages/navi";
import React from "react";

export interface WonderingCardProps {
  navi: NaviWithUser;
}

export default function WonderingCard({ navi }: WonderingCardProps) {
  return (
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
          <span>{navi.createdAt.toString().slice(0, 10)}</span>
        </div>
        <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5 text-gray-700">
          <div
            className={cls(navi.wonderings.length > 0 ? "text-teal-600" : "")}
          >
            <span className="flex items-center space-x-2 text-sm">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>気になる {navi._count.wonderings}</span>
            </span>
          </div>
          <span className="flex items-center space-x-2 text-sm">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>回答 {navi._count.answers}</span>
          </span>
        </div>
      </a>
    </Link>
  );
}

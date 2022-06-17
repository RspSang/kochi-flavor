import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Answer, Navi, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "@components/input";
import useUser from "@libs/client/useUser";

interface AnswerWithUser extends Answer {
  user: User;
}

interface NaviWithUser extends Navi {
  user: User;
  answers: AnswerWithUser[];
  _count: {
    answers: number;
    wonderings: number;
  };
}

interface NaviDetailResponse {
  ok: boolean;
  navi: NaviWithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  response: Answer;
}

const NaviDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerForm>();
  const { data, mutate } = useSWR<NaviDetailResponse>(
    router.query.id ? `/api/navi/${router.query.id}` : null
  );
  const [deleteNavi, { data: deleteNaviData, loading: deleteNaviLoading }] =
    useMutation(`/api/navi/${router.query.id}/delete`);
  const [wonder, { loading: wonderloading }] = useMutation(
    `/api/navi/${router.query.id}/wonder`
  );
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/navi/${router.query.id}/answers`);
  const onWonderClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        navi: {
          ...data?.navi,
          _count: {
            ...data.navi._count,
            wonderings: data.isWondering
              ? data?.navi._count.wonderings - 1
              : data?.navi._count.wonderings + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    if (!wonderloading) {
      wonder({});
    }
  };
  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);
  const [dropDown, setDropDown] = useState(false);
  const onDeleteClick = () => {
    if (deleteNaviLoading) return;
    deleteNavi({ naviUser: data?.navi.userId });
  };
  useEffect(() => {
    if (deleteNaviData?.ok) {
      if (router.pathname === "/navi/[id]" && mutate) {
        mutate();
        router.push(`/navi/`);
      }
    }
  }, [deleteNaviData]);
  return (
    <Layout canGoBack>
      <div
        onClick={() => {
          if (dropDown) {
            setDropDown((prev) => !prev);
          }
        }}
      >
        <div className="px-4">
          <span className="my-3 pl-2 inline-flex items-center rounded-full bg-gray-100 text-xs font-medium text-gray-800">
            まち質問
          </span>
          <div className="flex items-center justify-between">
            <div className="flex cursor-pointer items-center space-x-3">
              <Link href={`/profile/${data?.navi?.user?.id}`}>
                <a>
                  <div className="h-10 w-10 rounded-full bg-slate-300" />
                </a>
              </Link>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {data?.navi?.user?.name}
                </p>
              </div>
            </div>
            <div>
              {user?.id === data?.navi.userId ? (
                <>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6  hover:cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      onClick={() => setDropDown((prev) => !prev)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                    {dropDown ? (
                      <>
                        <div className="z-10 absolute right-0 w-max bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700">
                          <ul className="py-1 px-2 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                              <div
                                onClick={onDeleteClick}
                                className="px-2 py-2 text-red-500 rounded-lg font-medium hover:bg-red-50 flex items-center space-x-2 hover:cursor-pointer"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                <span>削除</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="text-gray-700 space-x-2 pl-2 my-2">
            <span className="font-medium text-orange-500">Q.</span>
            <span>{data?.navi?.question}</span>
          </div>
        </div>
        <div>
          <div className="mt-3 px-4 flex w-full space-x-5 border-t-2 border-b-[2px] py-2  text-gray-700">
            <button
              onClick={onWonderClick}
              className={cls(
                "flex items-center space-x-2 text-sm",
                data?.isWondering ? "text-teal-600" : ""
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>気になる {data?.navi?._count?.wonderings}</span>
            </button>
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
              <span>回答 {data?.navi?._count?.answers}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4">
          {data?.navi?.answers?.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="block text-xs text-gray-500 ">
                  {answer.createdAt?.toString().slice(0, 7)}
                </span>
                <p className="mt-2 text-gray-700">{answer.answer} </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-2 space-y-1 mb-2">
          <form onSubmit={handleSubmit(onValid)}>
            <Input
              register={register("answer", {
                required: "コメントを入力してください",
              })}
              name={"answer"}
              type={"text"}
              placeholder="レビューにコメントを入力する"
              userAvatar={user?.avatar}
              kind={"comment"}
              required
            />
            {errors ? (
              <span className="block text-sm text-red-500 mb-2">
                {errors?.answer?.message}
              </span>
            ) : null}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NaviDetail;

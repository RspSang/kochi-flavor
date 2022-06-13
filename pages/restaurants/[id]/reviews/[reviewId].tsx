import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ReviewWithUser } from "..";
import { Comment } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import Input from "@components/input";
import { useForm } from "react-hook-form";
import { CommentForm, CommentResponse } from "@components/review-card";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";

interface CommentWithUser extends Comment {
  user: {
    name: string;
    avatar: string;
  };
}

interface ReviewWithComment extends ReviewWithUser {
  comments: CommentWithUser[];
}

interface ReviewDetailResponse {
  ok: boolean;
  review: ReviewWithComment;
}

let comments: Comment[] = [];

const ReviewDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();
  const { data, mutate } = useSWR<ReviewDetailResponse>(
    router.query.id && router.query.reviewId
      ? `/api/restaurant/${router.query.id}/reviews/${router.query.reviewId}`
      : null
  );
  const [isLike, setIsLike] = useState(false);
  const [likeCountState, setLikeCountState] = useState(0);
  const [commentCountState, setCommentCountState] = useState(0);
  const [like, { loading }] = useMutation(
    `/api/restaurant/${router.query.id}/reviews/${router.query.reviewId}/like`
  );
  const onLikeClick = () => {
    setIsLike((prev) => !prev);
    if (isLike) {
      setLikeCountState((prev) => prev - 1);
    } else {
      setLikeCountState((prev) => prev + 1);
    }
    if (!loading) {
      like({});
    }
  };
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(
      `/api/restaurant/${router.query.id}/reviews/${router.query.reviewId}/comment`
    );
  const onValid = (formData: CommentForm) => {
    if (commentLoading) return;
    setCommentCountState((prev) => prev + 1);
    comment(formData);
  };
  useEffect(() => {
    if (data?.review.likes.find((e: any) => e.userId === user?.id))
      setIsLike(true);
  }, [data?.review.likes]);
  useEffect(() => {
    setLikeCountState(data?.review._count.likes!);
  }, [data?.review._count.likes]);
  useEffect(() => {
    setCommentCountState(data?.review._count.comments!);
  }, [data?.review._count.comments]);
  useEffect(() => {
    if (commentData?.ok) {
      reset();
      comments.push(commentData.payload);
    }
  }, [commentData]);
  return (
    <Layout canGoBack>
      <div className="mt-5 space-y-1">
        <div className="py-4">
          <div className="flex items-center space-x-3 ">
            <Link href={`/profile/${data?.review.user.id}`}>
              <a>
                {data?.review.user.avatar ? (
                  <Image
                    height={58}
                    width={58}
                    src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${data?.review.user.avatar}/avatar`}
                    className="rounded-full bg-slate-500"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-slate-500" />
                )}
              </a>
            </Link>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {data?.review.user.name}
              </span>
              <div className="text-slate-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span className="pl-1">{data?.review.user._count.reviews}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 px-3 pb-4">
            <span>{data?.review.review}</span>
          </div>
          <div className="flex overflow-x-scroll relative space-x-2">
            {[1, 2, 3, 4].map(() => (
              <div>
                <div className="h-36 w-36 rounded-2xl bg-slate-500" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5 text-gray-700">
            <span
              onClick={onLikeClick}
              className="flex items-center space-x-2 text-sm group hover:cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cls(
                  "h-6 w-6",
                  isLike
                    ? "fill-red-500 stroke-red-500"
                    : "group-hover:fill-red-500 group-hover:stroke-red-500"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>いいね {likeCountState}</span>
            </span>
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
              <span>コメント {commentCountState}</span>
            </span>
          </div>
          <div className="my-5 space-y-5 px-4">
            {data?.review.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                {comment.user.avatar ? (
                  <Image
                    height={36}
                    width={36}
                    src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${comment.user.avatar}/avatar`}
                    className="rounded-full bg-slate-500"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                )}
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    {comment.user.name}
                  </span>
                  <span className="block text-xs text-gray-500 ">
                    {comment.createdAt.slice(0, 10)}
                  </span>
                  <p className="mt-2 text-gray-700">{comment.comment}</p>
                </div>
              </div>
            ))}
            {commentData?.ok
              ? comments.map((comment) => (
                  <div className="flex items-start space-x-3">
                    <Link href={`/profile/${user?.id}`}>
                      <a>
                        {user?.avatar ? (
                          <Image
                            height={36}
                            width={36}
                            src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${user.avatar}/avatar`}
                            className="rounded-full bg-slate-500"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-200" />
                        )}
                      </a>
                    </Link>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                      <span className="block text-xs text-gray-500 ">
                        {comment.createdAt.slice(0, 10)}
                      </span>
                      <p className="mt-2 text-gray-700">{comment.comment}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>

          <form className="px-4" onSubmit={handleSubmit(onValid)}>
            <Input
              register={register("comment", {
                required: "コメントを入力してください",
              })}
              name={"comment"}
              type={"text"}
              placeholder="レビューにコメントを入力する"
              userAvatar={user?.avatar}
              kind={"comment"}
              required
            />
            {errors ? (
              <span className="block text-sm text-red-500 mb-2">
                {errors?.comment?.message}
              </span>
            ) : null}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewDetail;

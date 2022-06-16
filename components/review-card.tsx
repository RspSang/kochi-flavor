import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReviewResponse, ReviewWithUser } from "pages/restaurants/[id]";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./input";

interface CommentWithUser extends Comment {
  user: User;
}

interface ReviewWithUserWithComments extends ReviewWithUser {
  comments?: CommentWithUser[];
}

interface ReviewCardProps {
  review: ReviewWithUserWithComments;
  type: "simple" | "detail";
  reviewMutate?: Function | null;
}

export interface CommentForm {
  comment: string;
}

export interface CommentResponse {
  ok: boolean;
  payload: Comment;
}

interface DeleteResponse {
  ok: boolean;
}

let comments: Comment[] = [];

export default function ReviewCard({
  review,
  type,
  reviewMutate = null,
}: ReviewCardProps) {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();

  // Like Function
  const [isLike, setIsLike] = useState(false);
  const [likeCountState, setLikeCountState] = useState(review._count.likes);
  const [like, { loading }] = useMutation(
    `/api/restaurant/${router.query.id}/reviews/${review.id}/like`
  );
  const onLikeClick = () => {
    if (!loading) {
      setIsLike((prev) => !prev);
      if (isLike) {
        setLikeCountState((prev) => prev - 1);
      } else {
        setLikeCountState((prev) => prev + 1);
      }
      like({});
    }
  };
  useEffect(() => {
    if (review.likes.find((e: any) => e.userId === user?.id)) setIsLike(true);
  }, [review.likes]);

  // Comment Function
  const [commentCountState, setCommentCountState] = useState(
    review._count.comments
  );
  const [toggleComment, setToggleComment] = useState(false);
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(
      `/api/restaurant/${router.query.id}/reviews/${review.id}/comment`
    );
  const onCommentClick = () => {
    if (type === "simple") {
      setToggleComment((prev) => !prev);
    } else {
      setFocus("comment");
    }
  };
  const onValid = (formData: CommentForm) => {
    if (commentLoading) return;
    setCommentCountState((prev) => prev + 1);
    comment(formData);
  };
  useEffect(() => {
    if (commentData?.ok) {
      comments.push(commentData.payload);
      if (type === "simple") {
        setToggleComment((prev) => !prev);
      }
      reset();
    }
  }, [commentData]);
  useEffect(() => {
    if (toggleComment) {
      setFocus("comment");
    }
  }, [toggleComment]);
  useEffect(() => {
    comments = [];
  }, [router]);

  // Dropdown Function
  const [dropDown, setDropDown] = useState(false);
  const [
    deleteReview,
    { data: deleteReviewData, loading: deleteReviewLoading },
  ] = useMutation<DeleteResponse>(
    `/api/restaurant/${router.query.id}/reviews/${review.id}/delete`
  );
  const onDeleteClick = () => {
    if (deleteReviewLoading) return;
    deleteReview({ reviewUser: review.userId });
  };
  useEffect(() => {
    if (deleteReviewData?.ok) {
      if (router.pathname === "/restaurants/[id]" && reviewMutate) {
        reviewMutate();
      } else {
        router.push(`/restaurants/${router.query.id}`);
      }
    }
  }, [deleteReviewData]);
  return (
    <div
      className="border-b-2"
      onClick={() => {
        if (dropDown) {
          setDropDown((prev) => !prev);
        }
      }}
    >
      <div className="flex mt-4 justify-between">
        <div className="flex items-center space-x-3 ">
          <Link href={`/profile/${review.userId}`}>
            <a>
              {review.user.avatar ? (
                <Image
                  height={58}
                  width={58}
                  src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${review.user.avatar}/avatar`}
                  className="rounded-full bg-slate-500"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-500" />
              )}
            </a>
          </Link>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {review.user.name}
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
              <span className="pl-1">{review.user._count.reviews}</span>
            </div>
          </div>
        </div>
        {user?.id === review.userId ? (
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
                        <div className="px-2 py-2 rounded-lg font-medium hover:bg-slate-100 flex items-center space-x-2">
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>編集</span>
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={onDeleteClick}
                          className="px-2 py-2 text-red-500 rounded-lg font-medium hover:bg-red-50 flex items-center space-x-2"
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
      <Link href={`/restaurants/${router.query.id}/reviews/${review.id}`}>
        <a>
          <div className="mt-2 px-3 pb-4">
            <span>{review.review}</span>
          </div>
        </a>
      </Link>
      {review.photo ? (
        <div className="flex relative space-x-2">
          <Image
            height={160}
            width={160}
            src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${review.photo}/avatar`}
            className="rounded-lg bg-slate-500"
          />
        </div>
      ) : null}
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
        <span
          onClick={onCommentClick}
          className="flex items-center space-x-2 text-sm group"
        >
          <svg
            className={cls(
              "h-6 w-6",
              toggleComment ? "text-orange-500" : "group-hover:text-orange-500"
            )}
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
      {type === "detail"
        ? review.comments?.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-3 px-2 mb-2"
            >
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
                  {comment.createdAt.toString().slice(0, 10)}
                </span>
                <p className="mt-2 text-gray-700">{comment.comment}</p>
              </div>
            </div>
          ))
        : null}
      {commentData?.ok
        ? comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-3 p-2 mb-2"
            >
              <Link href={`/profile/${user?.id}`}>
                <a>
                  {user?.avatar ? (
                    <Image
                      height={40}
                      width={40}
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
                  {comment.createdAt.toString().slice(0, 10)}
                </span>
                <p className="mt-2 text-gray-700">{comment.comment}</p>
              </div>
            </div>
          ))
        : null}
      {type === "detail" ? (
        <form className="px-2" onSubmit={handleSubmit(onValid)}>
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
      ) : toggleComment ? (
        <div className="px-2 space-y-1 mb-2">
          <form onSubmit={handleSubmit(onValid)}>
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
      ) : null}
    </div>
  );
}

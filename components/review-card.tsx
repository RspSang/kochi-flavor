import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReviewWithUser } from "pages/restaurants/[id]";
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
}

export interface CommentForm {
  comment: string;
}

export interface CommentResponse {
  ok: boolean;
  payload: Comment;
}

let comments: Comment[] = [];

export default function ReviewCard({ review, type }: ReviewCardProps) {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();
  const [isLike, setIsLike] = useState(false);
  const [likeCountState, setLikeCountState] = useState(review._count.likes);
  const [commentCountState, setCommentCountState] = useState(
    review._count.comments
  );
  const [toggleComment, setToggleComment] = useState(false);
  const [like, { loading }] = useMutation(
    `/api/restaurant/${router.query.id}/reviews/${review.id}/like`
  );
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(
      `/api/restaurant/${router.query.id}/reviews/${review.id}/comment`
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
    if (toggleComment) {
      setFocus("comment");
    }
  }, [toggleComment]);
  useEffect(() => {
    if (review.likes.find((e: any) => e.userId === user?.id)) setIsLike(true);
  }, [review.likes]);
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
    comments = [];
  }, [router]);
  return (
    <div className="border-b-2">
      <div className="flex items-center mt-4 space-x-3 ">
        <Link href={`/profile/${review.user.id}`}>
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
          <span className="font-medium text-gray-900">{review.user.name}</span>
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

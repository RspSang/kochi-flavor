import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { Comment } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./input";

interface ReviewCardProps {
  userName?: string;
  userAvatar?: string | null;
  reviewCount?: number;
  review?: string;
  reviewId?: number;
  likeCount?: number;
  commentCount?: number;
  userLike?: any;
  sessionUserId?: number;
}

interface CommentForm {
  comment: string;
}

interface CommentResponse {
  ok: boolean;
  payload: Comment;
}

export default function ReviewCard({
  userName,
  userAvatar,
  reviewCount,
  review,
  reviewId,
  likeCount = 0,
  commentCount = 0,
  userLike,
  sessionUserId,
}: ReviewCardProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();
  const [isLike, setIsLike] = useState(false);
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const [toggleComment, setToggleComment] = useState(false);
  const [like, { loading }] = useMutation(`/api/reviews/${reviewId}/like`);
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(`/api/reviews/${reviewId}/comment`);
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
    setToggleComment((prev) => !prev);
  };
  const onValid = (formData: CommentForm) => {
    if (commentLoading) return;
    comment(formData);
  };
  useEffect(() => {
    if (toggleComment) {
      setFocus("comment");
    }
  }, [toggleComment]);
  useEffect(() => {
    if (userLike?.find((e: any) => e.userId === sessionUserId)) setIsLike(true);
  }, [userLike]);
  useEffect(() => {
    if (commentData?.ok) {
      setToggleComment((prev) => !prev);
      reset();
    }
  }, [commentData]);
  return (
    <div className="border-b-2">
      <div className="flex items-center mt-4 space-x-3 ">
        {userAvatar ? (
          <Image
            height={58}
            width={58}
            src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${userAvatar}/avatar`}
            className="rounded-full bg-slate-500"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-slate-500" />
        )}
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{userName}</span>
          <div className="text-slate-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="pl-1">{reviewCount}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 px-3 pb-4">
        <span>{review}</span>
      </div>
      <div className="flex overflow-x-scroll relative space-x-2">
        {[1, 2, 3, 4].map((i, _) => (
          <div key={i}>
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
          <span>コメント {commentCount}</span>
        </span>
      </div>
      {commentData?.ok ? (
        <div className="flex items-start space-x-3 bg-slate-50 rounded-lg p-2 mb-2">
          {userAvatar ? (
            <Image
              height={40}
              width={40}
              src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${userAvatar}/avatar`}
              className="rounded-full bg-slate-500"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          )}
          <div>
            <span className="block text-sm font-medium text-gray-700">
              {userName}
            </span>
            <span className="block text-xs text-gray-500 ">
              {commentData.payload.createdAt.slice(0, 10)}
            </span>
            <p className="mt-2 text-gray-700">{commentData.payload.comment}</p>
          </div>
        </div>
      ) : null}
      {toggleComment ? (
        <div className="px-2 space-y-1 mb-2">
          <form onSubmit={handleSubmit(onValid)}>
            <Input
              register={register("comment", {
                required: "コメントを入力してください",
              })}
              name={"comment"}
              type={"text"}
              placeholder="レビューにコメントを入力する"
              userAvatar={userAvatar}
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

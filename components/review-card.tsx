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
import Rating from "react-rating";
import Input from "./input";
import ReviewComment from "./review-comment";

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
  mutate?: Function | null;
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

export default function ReviewCard({
  review,
  type,
  reviewMutate = null,
  mutate = null,
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
  const [likeCountState, setLikeCountState] = useState(0);
  const [like, { data: likeData, loading: likeLoading }] = useMutation(
    `/api/restaurant/${router.query.id}/reviews/${review.id}/like`
  );
  const onLikeClick = () => {
    if (!likeLoading) {
      like({});
    }
  };
  useEffect(() => {
    if (review.likes.find((e: any) => e.userId === user?.id)) setIsLike(true);
  }, [review.likes]);
  useEffect(() => {
    if (likeData?.ok && reviewMutate) {
      setIsLike((prev) => !prev);
      if (isLike) {
        setLikeCountState((prev) => prev - 1);
      } else {
        setLikeCountState((prev) => prev + 1);
      }
    }
  }, [likeData]);

  // Comment Function
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCountState, setCommentCountState] = useState(0);
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
    comment(formData);
  };
  useEffect(() => {
    if (commentData?.ok) {
      setCommentCountState((prev) => prev + 1);
      setComments((prev) => [...prev, commentData.payload]);
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

  // Comment Delete Function
  const [
    deleteComment,
    { data: deleteCommentData, loading: deleteCommentLoading },
  ] = useMutation<CommentResponse>(
    `/api/restaurant/${router.query.id}/reviews/${review.id}/comment/delete`
  );
  const onCommentDeleteClick = (commentId: number, commentUserId: number) => {
    if (deleteCommentLoading) return;
    deleteComment({ id: commentId, userId: commentUserId });
    if (comments.length > 0) {
      const deletedIndex = comments.findIndex(
        (comment) => comment.id === commentId
      );
      setComments((prev) => [
        ...prev.slice(0, deletedIndex),
        ...prev.slice(deletedIndex + 1, prev.length),
      ]);
    }
  };
  useEffect(() => {
    if (deleteCommentData?.ok && reviewMutate) {
      setCommentCountState((prev) => prev - 1);
    }
  }, [deleteCommentData]);

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
      if (router.pathname === "/restaurants/[id]" && reviewMutate && mutate) {
        reviewMutate();
        mutate();
      } else {
        router.push(`/restaurants/${router.query.id}`);
      }
    }
  }, [deleteReviewData]);

  useEffect(() => {
    if (review._count.likes) setLikeCountState(review._count.likes);
    if (review._count.comments) setCommentCountState(review._count.comments);
  }, [review._count]);
  useEffect(() => {
    if (review.comments) setComments([...review.comments]);
  }, [review.comments]);

  return (
    <div
      className="border-b-2 mx-3"
      onClick={() => {
        if (dropDown) {
          setDropDown((prev) => !prev);
        }
      }}
    >
      <div className="flex mt-4 justify-between items-center">
        <div className="flex items-center space-x-3">
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
                <div className="h-12 w-12 rounded-full bg-slate-500" />
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
        <div className="flex flex-col items-end space-y-1">
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
          <div className="">
            <Rating
              initialRating={review.rate}
              readonly={true}
              emptySymbol={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgb(249 115 22)"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
              fullSymbol={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="rgb(249 115 22)"
                  viewBox="0 0 24 24"
                  stroke="rgb(249 115 22)"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>
      <Link href={`/restaurants/${review.restaurantId}`}>
        <a>
          <span className="text-orange-400 text-sm">
            @{review.restaurant.name}
          </span>
        </a>
      </Link>
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
      {comments.map((comment) => (
        <div key={comment.id} className="mb-2">
          <ReviewComment
            comment={comment}
            user={user}
            onCommentDeleteClick={onCommentDeleteClick}
          />
        </div>
      ))}
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

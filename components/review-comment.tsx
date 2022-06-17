import Image from "next/image";
import Link from "next/link";
import { Comment, User } from "@prisma/client";
import { useEffect, useState } from "react";

interface ReviewCommentProps {
  comment: Comment;
  user?: User;
  onCommentDeleteClick: (commentId: number, commentUserId: number) => void;
}

export default function ReviewComment({
  comment,
  user,
  onCommentDeleteClick,
}: ReviewCommentProps) {
  const [isMine, setIsMine] = useState(false);
  const onClickeHandler = () => {
    onCommentDeleteClick(comment.id, comment.userId);
  };
  useEffect(() => {
    if (comment.userId === user?.id) {
      setIsMine(true);
    }
  }, []);
  return (
    <>
      <div className="flex justify-between">
        <div className="flex space-x-3">
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
          <div className="flex flex-col bg-slate-200 rounded-lg px-3 py-1">
            <span className="text-sm font-medium text-gray-900">
              {user?.name}
            </span>
            <span className="text-gray-700 text-sm">{comment.comment}</span>
          </div>
          {isMine ? (
            <div
              onClick={onClickeHandler}
              className="flex items-center text-gray-500 hover:cursor-pointer"
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
            </div>
          ) : null}
        </div>
      </div>
      <div className="px-3"></div>
    </>
  );
}

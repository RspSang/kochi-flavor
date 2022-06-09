import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import ReviewCard from "@components/review-card";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ReviewWithUser } from "..";

interface ReviewDetailResponse {
  ok: boolean;
  review: ReviewWithUser;
}

const ReviewDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<ReviewDetailResponse>(
    router.query.id
      ? `/api/restaurant/${router.query.id}/reviews/${router.query.reviewId}`
      : null
  );
  return (
    <Layout canGoBack>
      <div className="px-4 max-w-xl mt-10 space-y-1">
        <div className="border-2 px-3 rounded-lg py-4">
          <ReviewCard
            userName={data?.review.user.name}
            userAvatar={data?.review.user.avatar}
            reviewCount={data?.review.user._count.reviews}
            review={data?.review.review}
          />
          <div className="my-5 space-y-5 px-4">
            {[1, 2, 3, 4, 5].map((i, _) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-200" />
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    username
                  </span>
                  <span className="block text-xs text-gray-500 ">
                    createdAt
                  </span>
                  <p className="mt-2 text-gray-700">answer</p>
                </div>
              </div>
            ))}
          </div>
          <form className="px-4">
            <TextArea
              name="description"
              placeholder="コメントを入力する"
              required
            />
            <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
              送信
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewDetail;

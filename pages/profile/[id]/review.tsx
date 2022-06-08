import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import { Review, User } from "@prisma/client";
import ReviewCard from "@components/review-card";

interface UserWithCounter extends User {
  _count: { reviews: number };
}

interface ReviewsWithUser extends Review {
  user: UserWithCounter;
}

interface WentResponse {
  ok: boolean;
  reviews: ReviewsWithUser[];
}

const Reviews: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<WentResponse>(
    router.query.id ? `/api/users/${router.query.id}/review` : null
  );
  return (
    <Layout canGoBack title="書いたレビュー">
      {data?.reviews
        ? data.reviews.map((review) => (
            <ReviewCard
              userName={review.user.name}
              reviewCount={review.user._count.reviews}
              review={review.review}
            />
          ))
        : null}
    </Layout>
  );
};

export default Reviews;

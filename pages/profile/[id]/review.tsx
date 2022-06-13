import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import { Restaurant, Review, User } from "@prisma/client";
import ReviewCard from "@components/review-card";
import Loading from "@components/loading";

interface UserWithCounter extends User {
  _count: { reviews: number };
}

interface ReviewsWithUser extends Review {
  user: UserWithCounter;
  restaurant: Restaurant;
  _count: {
    likes: number;
    comments: number;
  };
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
      {data ? (
        data?.reviews?.map((review) => (
          <Link
            href={`/restaurants/${review.restaurantId}/reviews/${review.id}`}
          >
            <a>
              <ReviewCard
                userName={review.user.name}
                userId={review.user.id}
                userAvatar={review.user.avatar}
                reviewCount={review.user._count.reviews}
                likeCount={review._count.likes}
                commentCount={review._count.comments}
                review={review.review}
                reviewId={review.id}
                restaurandId={review.restaurant.id}
              />
            </a>
          </Link>
        ))
      ) : (
        <Loading />
      )}
    </Layout>
  );
};

export default Reviews;

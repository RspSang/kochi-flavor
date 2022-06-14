import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import ReviewCard from "@components/review-card";
import Loading from "@components/loading";
import useUser from "@libs/client/useUser";
import { ReviewResponse } from "pages/restaurants/[id]";

const Reviews: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<ReviewResponse>(
    router.query.id ? `/api/users/${router.query.id}/review` : null
  );
  const { user } = useUser();
  return (
    <Layout canGoBack title="書いたレビュー">
      {data ? (
        data?.reviews?.map((review) => (
          <Link
            key={review.id}
            href={`/restaurants/${review.restaurantId}/reviews/${review.id}`}
          >
            <a className="relative">
              <div className="absolute top-0 w-full h-full z-20" />
              <ReviewCard
                userName={review.user.name}
                userId={review.user.id}
                userAvatar={review.user.avatar}
                reviewCount={review.user._count.reviews}
                likeCount={review._count.likes}
                commentCount={review._count.comments}
                review={review.review}
                reviewId={review.id}
                restaurandId={review.restaurantId}
                userLike={review.likes}
                sessionUserId={user?.id}
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

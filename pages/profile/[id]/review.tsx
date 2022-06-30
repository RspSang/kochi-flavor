import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import ReviewCard from "@components/review-card";
import Loading from "@components/loading";
import { ReviewResponse } from "pages/restaurants/[id]";
import Header from "@components/header";

const Reviews: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<ReviewResponse>(
    router.query.id ? `/api/users/${router.query.id}/review` : null
  );
  return (
    <>
    <Header title="書いたレビュー"/>
      <Layout
        canGoBack
        backURL={`/profile/${router.query.id}`}
        title="書いたレビュー"
      >
        {data ? (
          data?.reviews?.map((review) => (
            <Link
              key={review.id}
              href={`/restaurants/${review.restaurantId}/reviews/${review.id}`}
            >
              <a className="relative">
                <div className="absolute top-0 w-full h-full z-20" />
                <ReviewCard review={review} type={"simple"} />
              </a>
            </Link>
          ))
        ) : (
          <Loading />
        )}
      </Layout>
    </>
  );
};

export default Reviews;

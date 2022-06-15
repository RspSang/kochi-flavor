import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import ReviewCard from "@components/review-card";

const ReviewDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR(
    router.query.id && router.query.reviewId
      ? `/api/restaurant/${router.query.id}/reviews/${router.query.reviewId}`
      : null
  );

  return (
    <Layout canGoBack>
      <div className="mt-5 space-y-1">
        {data?.ok ? <ReviewCard review={data.review} type={"detail"} /> : null}
      </div>
    </Layout>
  );
};

export default ReviewDetail;

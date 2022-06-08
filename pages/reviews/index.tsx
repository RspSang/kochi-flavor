import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import ReviewCard from "@components/review-card";

const Reviews: NextPage = () => {
  return (
    <Layout hasTabBar searchBar>
      <div className="px-4 max-w-xl mt-10 space-y-1">
        <Link href={"/reviews/1"}>
          <a>
            {[1, 2, 3, 4, 5].map(() => (
              <ReviewCard userName="test" reviewCount={1} review="test" />
            ))}
          </a>
        </Link>
      </div>
    </Layout>
  );
};

export default Reviews;

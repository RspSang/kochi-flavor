import Article from "@components/article";
import Layout from "@components/layout";

export default function Articles() {
  return (
    <>
      <Layout searchBar hasTabBar>
        {[1, 2, 3, 4].map((i, _) => (
          <Article title={"title"} description={"desc"} key={i} />
        ))}
      </Layout>
    </>
  );
}

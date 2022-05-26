import Search from "@components/search";
import type { NextPage } from "next";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <>
      <Search />
      <Layout hasTabBar />
    </>
  );
};

export default Home;

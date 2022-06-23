import Map from "@components/map";
import type { NextPage } from "next";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout hasTabBar>
        <Map />
      </Layout>
    </>
  );
};

export default Home;

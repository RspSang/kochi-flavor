import Map from "@components/map";
import useUser from "@libs/client/useUser";
import type { NextPage } from "next";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout searchBar hasTabBar></Layout>
      <Map />
    </>
  );
};

export default Home;

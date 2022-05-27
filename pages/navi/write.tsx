import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";

const Write: NextPage = () => {
  return (
    <Layout canGoBack title="質問する">
      <form className="space-y-4 p-4">
        <TextArea required placeholder="周りの人に質問しよう!" />
        <Button text={"送信"} />
      </form>
    </Layout>
  );
};

export default Write;

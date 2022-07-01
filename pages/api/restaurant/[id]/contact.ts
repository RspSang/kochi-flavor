import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import mail from "@sendgrid/mail";
import { withApiSession } from "@libs/server/withSession";

mail.setApiKey(process.env.SENDGRID_KEY!);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { name, address, openTime, closeTime, closed, parking, cuisine, ect },
    session: { user },
  } = req;
  const sendEmail = await mail.send({
    from: "akwek33@naver.com",
    to: "akwek33@naver.com",
    subject: `Kochi Flavor レストラン情報[${name}]`,
    html: `<h1>お店:${name}</h1><h1>住所:${address}</h1><h1>開店時間:${openTime}</h1><h1>閉店時間:${closeTime}</h1><h1>定休日:${closed}</h1><h1>駐車場:${parking}</h1><h1>種類:${cuisine}</h1><h1>その他:${ect}</h1><h1>UserId:${user?.id}</h1>`,
  });
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

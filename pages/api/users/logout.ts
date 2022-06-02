import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.json({ ok: true });
}

export default withApiSession(handler);

import { NextApiHandler } from "next";
import { getRobotsTxt } from "../../lib/services/kontent-service";

const handler: NextApiHandler = async (req, res) => {
    const robots = await getRobotsTxt(false);
    let robotsTxt = "User-agent: */r Disallow: /"
    if (robots) {
        robotsTxt = robots?.elements.content.value as string
    }
    
  res.send(robotsTxt);
}

export default handler;
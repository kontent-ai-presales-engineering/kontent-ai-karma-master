import { NextApiHandler } from "next";
import axios from "axios";

const getForms = async (accessToken:any) => {
  const { data } = await axios.get(
    `https://api.hubapi.com/forms/v2/forms`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return data;
};

const handler: NextApiHandler = async (req, res) => {
  const { accessToken } = req.query
  const data = await getForms(accessToken);

  res.status(200).json(data);
}

export default handler;
import fetch from 'node-fetch';
import axios from "axios";

export default class VercelService {
  public readonly defaultLanguageId = '00000000-0000-0000-0000-000000000000'
  constructor() {
  }

  public async addDomain(vercelProjectId: string, domainUrl: string) {
    const token = process.env.VERCEL_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID
    const result = await axios.post(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/domains?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          name: domainUrl
        }
      }
    );      
    console.log(result)
    const data = await result.data
    console.log(data)
    return data.res.status(200).json(data);
  }
}     
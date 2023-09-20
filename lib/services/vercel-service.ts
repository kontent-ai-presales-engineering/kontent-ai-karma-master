import fetch from 'node-fetch';
import axios from "axios";

export default class VercelService {
  public readonly defaultLanguageId = '00000000-0000-0000-0000-000000000000'
  constructor() {
  }

  public async checkDomainExists(vercelProjectId: string, domainUrl: string) {
    const token = process.env.VERCEL_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID
    const result = await axios.get(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/domains?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );      
    console.log(domainUrl)
    console.log(result.data?.domains?.lenght > 0)
    console.log(result.data.domains.some(domain => domain.name === domainUrl))
    if (result.data?.domains?.lenght > 0)
    {
      return await result.data.domains?.some(domain => domain.name === domainUrl)
    }
    return false
  }

  public async addDomain(vercelProjectId: string, domainUrl: string) {
    console.log("Add domain in Vercel")
    const token = process.env.VERCEL_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID
    const result = await axios.post(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/domains?teamId=${teamId}`,
      {
        name: domainUrl
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );      
    return await result.data
  }
}     
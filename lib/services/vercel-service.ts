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
    return result.data.domains?.filter(domain => domain.name === domainUrl).length > 0
  }

  public async addDomain(vercelProjectId: string, domainUrl: string) {
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

  public async removeDomain(vercelProjectId: string, domainUrl: string) {
    const token = process.env.VERCEL_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID
    const result = await axios.delete(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/domains/${domainUrl}?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );      
    return await result.data
  }
}     
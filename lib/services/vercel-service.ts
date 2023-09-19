import fetch from 'node-fetch';

export default class VercelService {
  public readonly defaultLanguageId = '00000000-0000-0000-0000-000000000000'
  constructor() {
  }

  public async addDomain(vercelProjectId: string, domainUrl: string) {
    const token = process.env.VERCEL_TOKEN
    const result = (await fetch(`https://api.vercel.com/v10/projects/${vercelProjectId}/domains`, {
        "body": {
          "name": domainUrl
        },
        "headers": {
          "Authorization": `Bearer ${token}`
        },
        "method": "post"
      }));
    const data = await result.json();
    return data.res.status(200).json(data);
  }
}
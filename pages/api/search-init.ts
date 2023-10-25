import { NextApiRequest, NextApiResponse } from "next"
import AlgoliaService from "../../lib/services/algolia-service"
import SearchService from "../../lib/services/search-service"
import { SearchProjectConfiguration } from "../../lib/services/search-model"
import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies"

const slugCodename = "url"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).end()
        return
    }

    if (!req.body) {
        res.status(200).json([])
        return
    }

    const config = getConfiguration(req.body);

    const currentEnvId = req.cookies[envIdCookieName];
    const currentPreviewApiKey = req.cookies[previewApiKeyCookieName];

    const searchService = new SearchService()
    const allContent = await searchService.getAllContentFromProject({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, config.kontent.language)
    const indexableContent = searchService.getAllIndexableContentFromProject(allContent)
    const searchableStructure = searchService.createSearchableStructure(indexableContent, allContent)

    const algoliaService = new AlgoliaService(config.algolia)
    await algoliaService.setupIndex()

    const indexedItems = await algoliaService.indexSearchableStructure(searchableStructure)

    res.status(200).json(indexedItems)
}

export interface ISearchInitBody {
    projectId: string,
    language: string
}

function getConfiguration(body: ISearchInitBody): SearchProjectConfiguration {
    const config: SearchProjectConfiguration = {
        kontent: {
            projectId: body.projectId,
            language: body.language
        },
        algolia: {
            appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
            apiKey: process.env.ALGOLIA_ADMIN_KEY as string,
            index: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX as string
        }
    };

    return config;
}
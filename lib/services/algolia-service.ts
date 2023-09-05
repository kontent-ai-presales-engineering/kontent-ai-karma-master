import AlgoliaSearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { AlgoliaConfiguration, SearchableItem } from './search-model';

class AlgoliaService {
    config: AlgoliaConfiguration;
    index: SearchIndex;
    client: SearchClient;

    constructor(config: AlgoliaConfiguration|any = null) {
        this.config = config ?? {
            apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
            appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
            index: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX,
        };

        // init the algolia client & index
        const baseClient = AlgoliaSearch(this.config.appId, this.config.apiKey)
        this.client = {
            ...baseClient,
            search(requests) {
                if (requests.every(({ params }) => !params?.query)) {                    
                    return Promise.resolve({
                        results: requests.map(() => ({
                            hits: [],
                            nbHits: 0,
                            nbPages: 0,
                            page: 0,
                            processingTimeMS: 0,
                            hitsPerPage: 0,
                            exhaustiveNbHits: false,
                            query: '',
                            params: '',
                        })),
                    });
                }

                return baseClient.search(requests);
            }
        };
        this.index = this.client.initIndex(this.config.index);
        // set search settings to only include processed content fields
    }

    // setup index
    async setupIndex() {
        let result = await this.index.setSettings({
            searchableAttributes: ["content.contents", "content.name", "name"],
            attributesForFaceting: ["content.codename", "language","content.type","productcolors","productsize","productmaterial"],
            attributesToSnippet: ['content.contents'],
            hitsPerPage: 5
        }).wait();
    }

    // indexes searchable structure of content into algolia
    async indexSearchableStructure(structure: SearchableItem[] | any): Promise<string[]> {
        // push searchable objects into algolia
        const indexed = await (this.index.saveObjects(structure).wait());
        return indexed.objectIDs;
    }

    // returns the indexed content item(s) that include searched content item
    async searchIndex(searchedCodename: string, language: string, productcolors: string, productsize: string, productmaterial: string): Promise<SearchableItem[]> {
        try {
            const response = await this.index.search<SearchableItem>("", {
                facetFilters: [`content.codename: ${searchedCodename}`, `content.language: ${language}`, `productcolors: ${productcolors}`, `productsize: ${productsize}`, `productmaterial: ${productmaterial}`]
            });
            return response.hits;
        }
        catch (error) {
            return [];
        }
    }

    // removes items from the index
    async removeFromIndex(codenames: string[]): Promise<string[]> {
        try {
            const response = await this.index.deleteObjects(codenames).wait();
            return response.objectIDs;
        }
        catch (error) {
            return [];
        }
    }

}

export default AlgoliaService;
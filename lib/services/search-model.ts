type KontentConfiguration = {
    projectId: string,
    language?: string
}

type AlgoliaConfiguration = {
    appId: string,
    apiKey: string,
    index: string
}

type SearchProjectConfiguration = {
    kontent: KontentConfiguration,
    algolia: AlgoliaConfiguration
}

type SearchableItem = {
    id: string,
    objectID: string,
    codename: string,
    componentname: string,
    image: string,
    name: string,
    language: string,
    type: string,
    productcolors: string,
    productsize: string,
    productmaterial: string,
    summary: string,
    slug: string,
    collection: string,
    content: ContentBlock[]
}

type ContentBlock = {
    id: string,
    codename: string,
    name: string,
    type: string,
    language: string,
    collection: string,
    parents: string[],
    contents: string
}

export type { SearchProjectConfiguration, SearchableItem, ContentBlock, AlgoliaConfiguration, KontentConfiguration }
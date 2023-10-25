
import { Elements, IContentItem, camelCasePropertyNameResolver, createDeliveryClient } from "@kontent-ai/delivery-sdk"
import { ContentBlock, SearchableItem } from "./search-model"
import { deliveryApiDomain, deliveryPreviewApiDomain, defaultEnvId, defaultPreviewKey } from "../utils/env";
const sourceTrackingHeaderName = 'X-KC-SOURCE';

const getDeliveryClient = ({ envId, previewApiKey }: ClientConfig) => createDeliveryClient({
    environmentId: envId,
    globalHeaders: () => [
      {
        header: sourceTrackingHeaderName,
        value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
      }
    ],
    propertyNameResolver: camelCasePropertyNameResolver,
    proxy: {
      baseUrl: deliveryApiDomain,
      basePreviewUrl: deliveryPreviewApiDomain,
    },
    previewApiKey: defaultEnvId === envId ? defaultPreviewKey : previewApiKey
  });
  
  type ClientConfig = {
    envId: string,
    previewApiKey?: string
  }

export default class SearchService {
    public slugCodename = "url"    

    public async getAllContentFromProject(config: ClientConfig, languageCodename: string = "default") {
        const feed = await getDeliveryClient(config)
            .itemsFeed()
            .queryConfig({ waitForLoadingNewContent: true })
            .languageParameter(languageCodename)
            .equalsFilter("system.language", languageCodename)
            .toPromise()
        return [...feed.data.items, ...Object.keys(feed.data.linkedItems).map(key => feed.data.linkedItems[key])]
    }

    public async getAllContentByTypeFromProject(config: ClientConfig, languageCodename: string = "default", typeName: string) {
        const feed = await getDeliveryClient(config)
            .itemsFeed()
            .type(typeName)
            .queryConfig({ waitForLoadingNewContent: true })
            .languageParameter(languageCodename)
            .equalsFilter("system.language", languageCodename)
            .toPromise()
        return [...feed.data.items, ...Object.keys(feed.data.linkedItems).map(key => feed.data.linkedItems[key])]
    }

    public getAllIndexableContentFromProject(allContent: Array<IContentItem>) {
        return allContent.filter(item => item.elements[this.slugCodename])
    }

    public createSearchableStructure(indexableContent: IContentItem[]|any[], allContent: IContentItem[]): SearchableItem[] {
        const searchableStructure: SearchableItem[] = [];

        // process all items with slug into searchable items
        for (const item of indexableContent) {
            const url = item.elements[this.slugCodename] as Elements.UrlSlugElement
            // searchable item structure
            let searchableItem: SearchableItem = {
                objectID: `${item.system.codename}_${item.system.language}`,
                id: item.system.id,
                codename: item.system.codename,                
                componentname: item.system.name,
                image: item["productDetailsPrimaryThumbnail"]?.value,
                name: item["title"]?.value
                    ?? item["product_details__name"]?.value
                    ?? item.system.name,
                productcolors: item["colors"]?.value,
                productsize: item["sizes"]?.value,
                productmaterial: item["bikeFrameMaterials"]?.value,
                summary: item["productDetailsSummary"]?.value,
                language: item.system.language,
                type: item.system.type,
                collection: item.system.collection,
                slug: url.value,
                content: []
            };

            searchableItem.content = this.getContentFromItem(item, [], [], allContent,);
            searchableStructure.push(searchableItem);
        }

        return searchableStructure;
    }

    private getContentFromItem(item: IContentItem, parents: string[], children: string[], allContent: IContentItem[]): ContentBlock[] {
        if (!item) return [];

        // array of linked content for this item
        let linkedContent: ContentBlock[] = [];
        const contents: string[] = [];

        // content of the currently processed item
        let itemsContent: ContentBlock = {
            id: item.system.id,
            codename: item.system.codename,
            language: item.system.language,
            collection: item.system.collection,
            type: item.system.type,
            name: item.system.name,
            parents: parents,
            contents: ""
        };

        // go over each element and extract it's contents
        // ONLY FOR TEXT/RICH-TEXT + LINKED ITEMS (modular content)
        for (const propName in item.elements) {
            const camelCasePropName = getCamelCaseName(propName)
            const property: any = item.elements[camelCasePropName];
            const type: string = property?.type;
            let stringValue: string = "";

            if (type) {
                switch (type) {
                    case "text": // for text property -> copy the value
                        stringValue = property.value;
                        if (stringValue)
                            contents.push(stringValue);
                        break;
                    case "rich_text": // for rich text -> strip HTML and copy the value
                        stringValue = property.value.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/\n/g, ' ');
                        if (stringValue)
                            contents.push(stringValue)
                        // for rich text -> process linked content + components
                        if (property.linkedItemCodenames && property.linkedItemCodenames.length > 0)
                            linkedContent = [...linkedContent, ...this.getLinkedContent(property.linkedItemCodenames, [item.system.codename, ...parents], children, allContent)];
                        break;
                    case "modular_content": // for modular content -> process modular content
                        if (property.itemCodenames && property.itemCodenames.length > 0)
                            linkedContent = [...linkedContent, ...this.getLinkedContent(property.itemCodenames, [item.system.codename, ...parents], children, allContent)];
                        break;
                    //@TODO: case "custom_element": ... (searchable value)
                }
            }
        }

        itemsContent.contents = contents.join(" ").replace('"', ''); // create one long string from contents
        return [itemsContent, ...linkedContent];
    }

    private getLinkedContent(codenames: string[], parents: string[], children: string[], allContent: IContentItem[]) {
        const linkedContent: ContentBlock[] = [];

        for (const linkedCodename of codenames) {
            const foundLinkedItem: IContentItem | any = allContent.find(i => i.system.codename == linkedCodename);
            // IF THE LINKED ITEM CONTAINS SLUG, IT'S NOT BEING INCLUDED IN THE PARENT'S CONTENT

            if (foundLinkedItem) {
                children.push(foundLinkedItem.system.codename);
                if (!foundLinkedItem[this.slugCodename]) {// if the item doesn't have a slug -> include
                    linkedContent.push(...this.getContentFromItem(foundLinkedItem, parents, children, allContent));
                }
            }
        }

        return linkedContent;
    }
}

function getCamelCaseName(propName: string) {

    const adjusted = propName
        .toLowerCase()
        .replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase())
        .replace(/_/g, '');

    return adjusted.charAt(0).toLowerCase() + adjusted.slice(1)

}

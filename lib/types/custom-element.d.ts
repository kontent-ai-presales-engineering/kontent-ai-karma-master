declare namespace CustomElement {
    /**
     * Use the `init` method to initialize your custom element.
     * 
     * The `init` method expects a callback function which takes `element` and `context` as parameters. This callback function is called once your custom element is registered within Kentico Kontent.
     * @param callback - A callback function that receives the `Element` and `Context` objects which provide information from Kentico Kontent about the custom element and about where it is displayed in the UI.
     */
    function init(callback: (element: CustomElement.Element, context: Context) => void): void
    function setValue(value: string | null | object | ValueObject): void
    function onDisabledChanged(callback: (disabled: boolean) => void): void
    function setHeight(height: number): void
    function getElementValue(elementCodename: string, callback: (value: any) => void): void
    function observeElementChanges(elementCodenames: Array<string>, callback: (changedElementCodenames: Array<string>) => void): void
    function observeItemChanges(callback: (newItemDetails: ItemChangedDetails) => void): void
    function selectAssets(config: SelectAssetConfig): Promise<Array<AssetReference>> | null
    function getAssetDetails(assetIds: Array<string>): Promise<Array<Asset>> | null
    function selectItems(config: SelectItemsConfig): Promise<Array<ContentItemReference>> | null
    function getItemDetails(itemIds: Array<string>): Promise<Array<ContentItem>> | null

    interface ContentItem {
        id: string
        codename: string
        name: string
        collection: reference
        type: reference
    }

    interface Asset {
        id: string
        descriptions: Array<AssetDescription>
        fileName: string
        imageHeight: number
        imageWidth: number
        name: string
        size: number
        thumbnailUrl: string
        title: string
        type: string
        url: string
    }

    interface AssetDescriptionLanguage {
        id: string
        codename: string
    }

    interface AssetDescription {
        description: string
        language: AssetDescriptionLanguage
    }

    interface SelectAssetConfig {
        allowMultiple: boolean
        fileType: "all" | "images"
    }

    interface ItemChangedDetails {
        codename: string
        collection: Reference
        name: string
    }

    interface ValueObject {
        value: string | null,
        searchableValue: string | null
    }

    interface Element {
        value: string | null
        disabled: boolean
        config: object | null
    }

    interface AssetReference extends Reference { }

    interface ContentItemReference extends Reference { }

    interface Reference {
        id: string
    }

    interface Item {
        id: string
        codename: string
        collection: Reference
        name: string
    }

    interface Variant {
        id: string
        codename: string
    }

    interface Context {
        projectId: string
        item: Item
        variant: Variant
    }
}


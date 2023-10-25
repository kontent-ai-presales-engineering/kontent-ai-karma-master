export const createItemSmartLink = (itemId: string | undefined, itemIdName: string | undefined, disableHighlight = false) => (itemId && itemIdName && itemId.replaceAll("-", "_") !== itemIdName.replaceAll("-", "_")) ? withDisable(disableHighlight, {
  "data-kontent-item-id": itemId,
}) : withDisable(disableHighlight, {
  "data-kontent-component-id": itemId,
});

export const createElementSmartLink = (elementCodename: string, disableHighlight = false) => withDisable(disableHighlight, {
  "data-kontent-element-codename": elementCodename
});

export const createFixedAddSmartLink = (position: "start" | "end", renderPosition?: RenderPosition) => ({
  "data-kontent-add-button": true,
  "data-kontent-add-button-insert-position": position,
  "data-kontent-add-button-render-position": renderPosition,
});

export const createRelativeAddSmartLink = (position: "before" | "after", renderPosition?: RenderPosition) => ({
  "data-kontent-add-button": true,
  "data-kontent-add-button-insert-position": position,
  "data-kontent-add-button-render-position": renderPosition,
});

export const createRelativeAddSmartLinkWithComponentId= (id: string, position: "before" | "after", renderPosition?: RenderPosition) => ({
  "data-kontent-add-button": true,
  "data-kontent-add-button-insert-position": position,
  "data-kontent-add-button-render-position": renderPosition,
  "data-kontent-component-id": id
});

type RenderPosition = "bottom-start" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end" | "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end";

const withDisable = (disable: boolean, attrs: Readonly<Record<string, string | undefined>>) => disable
  ? { ...attrs, ...disableAttribute }
  : attrs;

const disableAttribute = {
  "data-kontent-disable-features": "highlight",
}

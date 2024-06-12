import {
  ContentItemElementsIndexer,
  Elements,
  IContentItem,
  IContentItemElements,
  IContentItemSystemAttributes,
  camelCasePropertyNameResolver,
} from '@kontent-ai/delivery-sdk';
import KontentSmartLink, { KontentSmartLinkEvent, applyUpdateOnItem } from '@kontent-ai/smart-link';
import {
  IUpdateMessageData,
  IUpdateMessageElement,
} from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isString, notNull } from '../../../lib/utils/typeguards';

type DataMaps<TKey extends string, TValue> = {
  readonly byId: ReadonlyMap<TKey, TValue>;
  readonly byCodename: ReadonlyMap<TKey, TValue>;
}

type ElementData = Omit<IUpdateMessageElement, 'element'>

type Element = string;
type ElementDataMaps = DataMaps<Element, ElementData>;

type Variant = string;
type VariantDataMaps = DataMaps<Variant, ElementDataMaps>;

type Item = string;
type ItemDataMaps = DataMaps<Item, VariantDataMaps>;

type LivePreviewContextValue = {
  readonly trackedItems: ReadonlyMap<string, IContentItem>;
  readonly trackItem: (item: IContentItem) => void;
};

const defaultContext: LivePreviewContextValue = {
  trackedItems: new Map(),
  trackItem: () => { },
};

export const LivePreviewContext = React.createContext<LivePreviewContextValue>(defaultContext);

interface LivePreviewContextProps {
  readonly children: React.ReactNode;
  readonly smartLink: KontentSmartLink | null;
}

export const LivePreviewProvider: React.FC<LivePreviewContextProps> = ({
  children,
  smartLink,
}) => {
  const [trackedItems, setTrackedItems] = useState<ReadonlyMap<string, IContentItem>>(new Map());

  const handleUpdate = useCallback((data: IUpdateMessageData) => {
    return setTrackedItems(items => new Map(Array.from(items.entries()).map(([codename, item]) => [codename, applyUpdateOnItem(item, data)])));
  }, []);

  useEffect(() => {
    smartLink?.on(KontentSmartLinkEvent.Update, handleUpdate);

    return () => smartLink?.off(KontentSmartLinkEvent.Update, handleUpdate);
  }, [smartLink, handleUpdate]);

  const trackItem = useCallback((item: IContentItem) => setTrackedItems(prev => {
    return new Map([...Array.from(prev.entries()), [item.system.codename, item]]);
  }), []);

  const contextState = useMemo<LivePreviewContextValue>(
    () => ({ trackedItems, trackItem }),
    [trackedItems, trackItem]);

  return (
    <LivePreviewContext.Provider value={contextState}>
      {children}
    </LivePreviewContext.Provider>
  );
};

LivePreviewProvider.displayName = 'LivePreviewProvider';

type ItemData = {
  readonly system: Pick<IContentItemSystemAttributes, 'id' | 'language' | 'codename'>;
  readonly elements: IContentItemElements;
};

const isContentItemMinimum = (item: any): item is ItemData =>
  item.system?.id && item.system?.language;

const updateObject = <TObject extends Readonly<Record<string, unknown>>>(
  original: TObject,
  propUpdater: <TName extends string>(name: TName, current: TObject[TName]) => TObject[TName],
): TObject => {
  const updated = { ...original };
  let changed = false;
  for (const propertyName in original) {
    if (Object.hasOwn(original, propertyName)) {
      const value = original[propertyName];
      const newValue = propUpdater(propertyName, value);
      if (newValue !== value) {
        updated[propertyName] = newValue;
        changed = true;
      }
    }
  }
  return changed ? updated : original;
};

const hasLinkedItems = (
  element: ContentItemElementsIndexer & { readonly linkedItems?: unknown },
): element is ContentItemElementsIndexer & { readonly linkedItems: ItemData[] } =>
  isArrayOf(element.linkedItems, isContentItemMinimum);

const updateLinkedItems = (elements: IContentItemElements, updatedItems: ItemDataMaps): IContentItemElements =>
  updateObject(elements, (_, current) => {
    if (!hasLinkedItems(current)) {
      return current;
    }

    const newLinkedItems = updateItemArray(current.linkedItems, updatedItems);
    return (newLinkedItems !== current.linkedItems)
      ? {
        ...current,
        linkedItems: newLinkedItems,
      }
      : current;
  });

const apply = <T, Res>(fnc: (value: T) => Res, value: T | null | undefined): Res | null | undefined =>
  value === null ? null : value === undefined ? undefined : fnc(value);

const indexElementsWithCamelCaseCodename = <Item extends Readonly<{ elements: IContentItemElements }>>(item: Item): Item => ({
  ...item,
  elements: Object.fromEntries(
    Object.entries(item.elements)
      .map(([elCodename, el]) => {
        const updatedEl = hasLinkedItems(el) ? { ...el, linkedItems: el.linkedItems.map(indexElementsWithCamelCaseCodename) } : el;

        return [camelCasePropertyNameResolver("", elCodename), updatedEl];
      })
  )
});

const updateElementData = (elements: IContentItemElements, updatedElements: ElementDataMaps | undefined): IContentItemElements =>
  updatedElements
    ? updateObject(
      elements,
      (name, current) => {
        const updated = updatedElements.byCodename.get(name);
        const updatedLinkedItems = updated && "linkedItemCodenames" in updated.data && isArrayOf(updated.data.linkedItemCodenames, isString) && "linkedItems" in updated.data && isArrayOf(updated.data.linkedItems, isContentItemMinimum)
          ? updated.data
          : { linkedItems: [], linkedItemCodenames: [] } as Pick<Elements.RichTextElement, "linkedItems" | "linkedItemCodenames">;
        return updated
          ? {
            ...current,
            ...updated.data,
            ...hasLinkedItems(current)
              ? {
                linkedItems: updatedLinkedItems.linkedItemCodenames
                  .map((codename: string) =>
                    updatedLinkedItems.linkedItems.find(i => i.system.codename === codename) ??
                    apply(indexElementsWithCamelCaseCodename, current.linkedItems.find(i => i.system.codename === codename)) ??
                    null
                  )
                  .filter(notNull)
              }
              : {}
          }
          : current;
      },
    )
    : elements;

const updateItem = <TItem extends ItemData>(item: TItem, updatedItems: ItemDataMaps): TItem => {
  const updatedVariants = updatedItems.byId.get(item.system.id);
  const updatedElements = updatedVariants?.byCodename.get(item.system.language);

  const newElements = updateLinkedItems(updateElementData(item.elements, updatedElements), updatedItems);

  return (newElements !== item.elements)
    ? {
      ...item,
      elements: indexElementsWithCamelCaseCodename({ elements: newElements }).elements,
    }
    : item;
};

export const isArray = <TValue extends unknown>(arg: unknown): arg is ReadonlyArray<TValue> =>
  arg instanceof Array;

export const isArrayOf = <TItem extends unknown>(arg: unknown, itemTypeGuard: (item: unknown) => item is TItem): arg is ReadonlyArray<TItem> => {
  return isArray(arg) && arg.every(itemTypeGuard);
};

const updateArray = <T extends unknown>(items: ReadonlyArray<T>, updater: (item: T) => T): ReadonlyArray<T> => {
  let changed = false;
  const newItems = items.map(item => {
    const newItem = updater(item);
    if (newItem !== item) {
      changed = true;
      return newItem;
    }
    return item;
  });
  return changed ? newItems : items;
};

const updateItemArray = <TItem extends ItemData>(items: ReadonlyArray<TItem>, updatedItems: ItemDataMaps): ReadonlyArray<TItem> =>
  updateArray(items, item => updateItem(item, updatedItems));

type OptionalItemData = null | undefined | ItemData;
type ArrayWithItemData = ReadonlyArray<ItemData>;
type ObjectWithItemData = Readonly<Record<string, OptionalItemData | ArrayWithItemData>>;

function useLive<TData extends ReadonlyArray<ItemData>>(data: TData, isPreview?: boolean): TData;
function useLive<TData extends OptionalItemData>(data: TData, isPreview?: boolean): TData;
function useLive<TData extends ObjectWithItemData>(data: TData, isPreview?: boolean): TData;
function useLive<TData extends OptionalItemData | ArrayWithItemData | ObjectWithItemData>(
  data: TData,
  isPreview: boolean = true,
): TData {
  const { trackedItems, trackItem } = useContext(LivePreviewContext);
  const [trackedOriginalItems, setTrackedOriginalItems] = useState<ReadonlyMap<string, IContentItem>>(new Map());

  const addOriginalTrackedItem = useCallback((item: IContentItem) => {
    setTrackedOriginalItems(prev => new Map([...Array.from(prev), [item.system.codename, item]]));
  }, []);

  useEffect(
    () => {
      if (!data || !isPreview) {
        return;
      }

      if (isContentItemMinimum(data)) {
        if (trackedOriginalItems.get(data.system.codename) !== data as IContentItem) {
          trackItem(data as IContentItem);
          addOriginalTrackedItem(data as IContentItem);
        }
        return;
      }

      if (isArrayOf(data, isContentItemMinimum)) {
        data.forEach(i => {
          if (trackedOriginalItems.get(i.system.codename) !== i as IContentItem) {
            trackItem(i as IContentItem)
            addOriginalTrackedItem(i as IContentItem);
          };
        });
        return;
      }

      if (typeof data === 'object') {
        Object.values(data).forEach(v => {
          if (isContentItemMinimum(v)) {
            if (trackedOriginalItems.get(v.system.codename) !== v as IContentItem) {
              trackItem(v as IContentItem);
              addOriginalTrackedItem(v as IContentItem);
            }
            return;
          }

          if (isArrayOf(v, isContentItemMinimum)) {
            v.forEach(i => {
              if (trackedOriginalItems.get(i.system.codename) !== i as IContentItem) {
                trackItem(i as IContentItem)
                addOriginalTrackedItem(i as IContentItem);
              };
            });
            return;
          }
        });
        return;
      }

      throw new Error('Unsupported type of data to update with live preview');
    },
    [data, isPreview, trackItem, trackedOriginalItems, addOriginalTrackedItem],
  );

  return useMemo((): TData => {
    if (!data) {
      return data;
    }

    if (isContentItemMinimum(data)) {
      return trackedItems.get(data.system.codename) as unknown as TData ?? data;
    }
    if (isArrayOf(data, isContentItemMinimum)) {
      return data.map(i => trackedItems.get(i.system.codename) ?? i) as unknown as TData;
    }
    if (typeof data === "object") {
      return Object.fromEntries(Object.entries(data).map(([key, value]) => {
        if (!value) {
          return [key, value] as const;
        }
        if (isContentItemMinimum(value)) {
          return [key, trackedItems.get(value.system.codename) ?? value];
        }
        if (isArrayOf(value, isContentItemMinimum)) {
          return [key, value.map(i => trackedItems.get(i.system.codename) ?? i)];
        }
        return [key, value];
      })) as unknown as TData;
    }
    return data;
  }, [trackedItems, data]);
}

export const useLivePreview = useLive;

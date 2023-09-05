import { ElementModels } from "@kontent-ai/delivery-sdk";

export function isMultipleChoiceOptionPresent(elementValue: ElementModels.MultipleChoiceOption[], codename: string): boolean {
  return elementValue != null && elementValue.length > 0 ? elementValue.some(o => o.codename === codename) : false
}

export function getFirstMultipleChoiceOptionCodename(elementValue: ElementModels.MultipleChoiceOption[], defaultValue: string = ''): string {
  return elementValue != null && elementValue.length > 0 ? elementValue[0].codename : defaultValue
}
import axios from "axios";
import { valueTranslationMap } from "./translation-service";

export default class AzureTranslationService {
  private readonly key: string
  private readonly endpoint: string
  private readonly region: string

  constructor() {
    this.key = process.env.AZURE_TRANSLATOR_KEY as string
    this.endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT as string
    this.region = process.env.AZURE_TRANSLATOR_REGION as string
  }

  public async translate(values: Array<valueTranslationMap>, sourceLanguageCodename: string, targetLanguageCodename: string) {

    const sLang = AzureTranslationService.getSupportedLanguageCode(sourceLanguageCodename)
    const tLang = AzureTranslationService.getSupportedLanguageCode(targetLanguageCodename)

    const newValues = [...values].filter(v => {
      if (typeof v.value === "string") {
        return v.value != null && v.value !== ""
      } else {
        return false
      }
    })
    const translatorData = newValues.map(v => {
      const text = (v.value as string).length < 10000 ? v.value : "<p>🚫🔀🗨</p>"
      return { text }
  })

    const translatorUrl = `${this.endpoint}translate?api-version=3.0&textType=html&from=${sLang}&to=${tLang}`

    if (translatorData.length > 0) {
      const response = await axios.post(translatorUrl, translatorData, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.key,
          'Ocp-Apim-Subscription-Region': this.region

        },
      })

      newValues.forEach((map, index) => {
        map.value = response.data[index].translations[0].text.replace(/<br>/g, '<br/>').replace(/\\\\"/g, '\\"')
      })
    }

    return newValues
  }

  public static getSupportedLanguageCode(codename: string) {
    const supportedLanguages = ["af", "sq", "am", "ar", "hy", "as", "az", "bn", "bs", "bg", "yue", "ca", "lzh", "zh-hans", "zh-hant", "hr", "cs", "da", "prs", "nl", "en", "et", "fj", "fil", "fi", "fr", "fr-ca", "de", "el", "gu", "ht", "he", "hi", "mww", "hu", "is", "id", "iu", "ga", "it", "ja", "kn", "kk", "km", "tlh-Latn", "tlh-piqd", "ko", "ku", "kmr", "lo", "lv", "lt", "mg", "ms", "ml", "mt", "mi", "mr", "my", "ne", "nb", "or", "ps", "fa", "pl", "pt", "pt-pt", "pa", "otq", "ro", "ru", "sm", "sr-cyrl", "sr-latn", "sk", "sl", "es", "sw", "sv", "ty", "ta", "te", "th", "ti", "to", "tr", "uk", "ur", "vi", "cy", "yua"]
    const parts = codename.split('-')
    if (supportedLanguages.includes(codename.toLowerCase())) {
      return codename.toLowerCase()
    } else if (parts.length > 0 && supportedLanguages.includes(parts[0].toLowerCase())) {
      return parts[0].toLowerCase()
    }
    return null
  }
}
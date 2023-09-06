import { ArticleCategory } from "../../models";

export type ArticleListingUrlQuery = Readonly<{
    page: string,
    category: string
  }>;
  
  export type ArticleTypeWithAll = ArticleCategory | "all";
  export const categoryFilterSource =
    Object.keys({
      "all": null,
      "product_spotlights": null,
      "industry_trends_and_insights": null,
      "sustainability_and_green_manufacturing": null,
      "company_news_and_updates": null,
      "other": null,
    } as const satisfies Record<ArticleTypeWithAll, null>) as ArticleTypeWithAll[];
  
  
  export const isArticleType = (input: string | undefined): input is ArticleTypeWithAll => (categoryFilterSource as string[]).includes(input || "");
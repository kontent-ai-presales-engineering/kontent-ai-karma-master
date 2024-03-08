import { FC, useEffect, useState } from 'react';
import { Article, ArticleListing } from '../../models';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { useSiteCodename } from './siteCodenameContext';
import { useRouter } from 'next/router';
import { ArticleItem } from '../listingPage/ArticleItem';
import { resolveUrlPath } from '../../lib/routing';

type Props = Readonly<{
  item: ArticleListing;
}>;

export const ArticleListingComponent: FC<Props> = (props) => {
  const isPreview = useRouter().isPreview;
  const router = useRouter();
  const siteCodename = useSiteCodename();
  const [totalCount, setTotalCount] = useState();
  const [articles, setArticles] = useState<
    ReadonlyArray<Article> | undefined
  >();
  const categories = props.item.elements.articleType?.value
    .map((term) => term.codename)
    .join(', ');

  useEffect(() => {
    const getArticles = async () => {
      const response = await fetch(
        `/api/articles?preview=${isPreview}&category=${categories}&language=${router.locale}&page=1&pageSize=3`
      );
      const newData = await response.json();
      setArticles(newData.articles);
      setTotalCount(newData.totalCount);
    };
    getArticles();
  }, [isPreview, router.locale, categories]);

  return (
    <>
      <h2 className='m-0 mt-16'>{props.item.elements.title?.value}</h2>
      <ul
        className='flex lg:flex-row flex-col gap-6 p-0'
        {...createItemSmartLink(
          props.item.system.id,
          props.item.system.name,
          true
        )}
      >
        {articles?.map((a) => (
          <ArticleItem
            key={a.system.id}
            title={a.elements.title?.value}
            itemId={a.system.id}
            itemName={a.system.name}
            description={a.elements.abstract?.value}
            imageUrl={a.elements.heroImage.value[0]?.url}
            publishingDate={a.elements.publishingDate?.value}
            detailUrl={resolveUrlPath({
              type: 'article',
              slug: a.elements.url?.value,
            })}
            locale={a.system.language}
          />
        ))}
      </ul>
    </>
  );
};

ArticleListingComponent.displayName = 'ArticleListingComponent';

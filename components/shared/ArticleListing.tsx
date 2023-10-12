import { FC, useEffect, useState } from 'react';
import { Article, Block_ArticleListing } from '../../models';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { useSiteCodename } from './siteCodenameContext';
import { useRouter } from 'next/router';
import { ArticleItem } from '../listingPage/ArticleItem';

type Props = Readonly<{
  item: Block_ArticleListing;
}>;

export const ArticleListingComponent: FC<Props> = (props) => {
  const isPreview = useRouter().isPreview;
  const router = useRouter();
  const siteCodename = useSiteCodename();
  const [totalCount, setTotalCount] = useState();
  const [articles, setArticles] = useState<
    ReadonlyArray<Article> | undefined
  >();
  const categories = props.item.elements.articleType.value
    .map((term) => term.codename)
    .join(', ');

  useEffect(() => {
    const getArticles = async () => {
      const response = await fetch(
        `/api/articles?preview=${isPreview}&category=${categories}&language=${router.locale}`
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
        className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 list-none gap-5 pt-4 pl-0'
        {...createItemSmartLink(
          props.item.system.id,
          props.item.system.name,
          true
        )}
      >
        {articles?.map((a) => (
          <ArticleItem
            key={a.system.id}
            title={a.elements.title.value}
            itemId={a.system.id}
            itemName={a.system.name}
            description={a.elements.abstract.value}
            imageUrl={a.elements.heroImage.value[0]?.url}
            publisingDate={a.elements.publishingDate.value}
            detailUrl={`/articles/${a.elements.url.value}`}
            locale={a.system.language}
          />
        ))}
      </ul>
    </>
  );
};

ArticleListingComponent.displayName = 'ArticleListingComponent';

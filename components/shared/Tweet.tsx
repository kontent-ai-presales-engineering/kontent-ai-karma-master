import { FC } from "react";

import { createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_TweetEmbed } from "../../models";
import { Tweet } from "react-twitter-widgets";

type Props = Readonly<{
  item: Block_TweetEmbed;
}>;

export const TweetComponent: FC<Props> = props => {
  return (    
      <section className="bg-white dark:bg-gray-900"
        {...createItemSmartLink(props.item.system.id, props.item.system.name)}>
        <Tweet 
        tweetId={`${props.item.elements.tweetId.value}`}
        renderError={_err => <span>Could not load tweet</span>}
    />
      </section>
  );
};

import { FC, useEffect } from 'react';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { FormGatedContentIntegration, contentTypes } from '../../models';

type Props = Readonly<{
  item: FormGatedContentIntegration;
}>;

export const GatedContentComponent: FC<Props> = (props) => {
  useEffect(() => {
      const gcdc: any = (window as any).gcdc;
      if (gcdc) {
        gcdc('loadGates');
      }
  });

  return (
      <div
        className={`vis-container mx-auto w-full max-w-screen-xl p-4`}
        {...createItemSmartLink(
          props.item.system.id,
          props.item.system.name
        )}
        {...createElementSmartLink(
          contentTypes.form_gatedcontent.elements.forms.codename
        )}
        {...createFixedAddSmartLink('end')}
        dangerouslySetInnerHTML={{ __html: props.item.elements.forms.value }}
      >
      </div>
  );
};

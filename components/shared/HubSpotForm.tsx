import { FC } from 'react';
import { FormHubspotIntegration, contentTypes } from '../../models';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import HubspotForm from 'react-hubspot-form';

type Props = Readonly<{
  item: FormHubspotIntegration;
}>;

export const HubSpotFormComponent: FC<Props> = (props) => {
  return (
    <div
      {...createItemSmartLink(props.item.system.id, props.item.system.name)}
      {...createElementSmartLink(contentTypes.form.elements.form.codename)}
      className={`bg-white shadow-md rounded px-8 pt-6 pb-8 my-16`}
        >
      {props.item.elements.form.value && (
        <HubspotForm
          portalId={process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID}
          formId={(() => {
            try {
              return JSON.parse(props.item.elements.form.value).formId;
            } catch (e) {
              console.error('Invalid JSON in form value:', e);
              return '';
            }
          })()}
          onSubmit={() => console.log('Submit!')}
          onReady={() => console.log('Form ready!')}
          loading={<div>Loading...</div>}
        />
      )}
    </div>
  );
};
HubSpotFormComponent.displayName = 'HubSpotFormComponent';

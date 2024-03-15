import React, { useEffect, useState } from 'react';
import { ContentTypeModels } from '@kontent-ai/management-sdk';
import Image from 'next/image';
import { defaultPreviewKey } from '../../lib/utils/env';
import { getItemByCodename } from '../../lib/services/kontentClient';
import { Head } from 'next/document';

interface IProps {
  element: CustomElement.Element;
  context: CustomElement.Context;
  handleSave: (value: string) => void;
  value: string | any;
}

export const FocalPointCustomElement: React.FC<IProps> = ({
  element,
  value,
  context,
  handleSave,
}) => {

  const [image, setImage] = useState("");

  useEffect(() => {
    const envId = context.projectId;
    const previewApiKey = "ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogImVkNDFmNDA5NmU0YTRmZTJiMzc0ZjQwNGQ2YjZkNDEyIiwNCiAgImlhdCI6ICIxNjk0MTU4MDUwIiwNCiAgImV4cCI6ICIxNzI1NzgwNDIwIiwNCiAgInZlciI6ICIyLjAuMCIsDQogICJzY29wZV9pZCI6ICIwYmQ5ZDQ2NDliYjI0MzNhOWNiMmFjYTk2MzRjMWM3NSIsDQogICJwcm9qZWN0X2NvbnRhaW5lcl9pZCI6ICIwMDU4NWYzN2E3MDMwMTAzOGFmZjNjOWU3OWU0ZGNjYSIsDQogICJhdWQiOiAiZGVsaXZlci5rb250ZW50LmFpIg0KfQ.eqk-IeZy0jgFS8-KFven5GU0NTroTzNV6DR09NAI-3U";
    const imageField = element.config['imageElement'];

    const getImage = async () => {
      const item = await getItemByCodename(
        { envId, previewApiKey },
        context.item.codename,
        true,
        context.variant.codename as string
      );
      setImage(item.elements[imageField].value[0].url);
    };

    getImage();
  }, [context.projectId, context.item.codename, context.variant.codename, element.config]);


  return (
    <>
      <Head>
        <script src="/scripts/focal-point.js"></script>
      </Head>
      <div className="container mx-auto">
        <div className="grid grid-cols-1">
          <div className="col-span-1">
            <div className="hidden md:block">
              <div
                id="background-container"
                className="bg-no-repeat bg-transparent"
                style={{
                  backgroundImage: `url(${image}?h=800&q=80)`,
                  backgroundPosition: '0% 0%',
                }}
              ></div>
            </div>
            <div id="positioner-container">
              <p className="picker-title">Choose your focal point:</p>
              <div id="picker" className="relative">
                <Image
                  id="focal-img"
                  src={`${image}?auto=format&fit=crop&h=800&q=80`}
                  alt="Background"
                  layout="fill"
                  objectFit="cover"
                />
                <div id="point" className="absolute"></div>
              </div>
              <div className="controls flex">
                <span className="results mr-2">Position: 0% 0%</span>
                <span id="desktop" className="control mr-2 cursor-pointer">
                  <i className="fas fa-desktop"></i>
                </span>
                <span id="tablet" className="control mr-2 cursor-pointer">
                  <i className="fas fa-tablet-alt"></i>
                </span>
                <span id="mobile" className="control cursor-pointer">
                  <i className="fas fa-mobile-alt"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

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
  const [imageUrl, setImageUrl] = useState("");  
  const [focalPoint, setFocalPoint] = useState({ x: '0%', y: '0%' });
  const [pointOffset, setPointOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState('desktop');

  useEffect(() => {
    try {
      const obj = JSON.parse(value);
      setFocalPoint({
        x: `${obj.fpX * 100}%`,
        y: `${obj.fpY * 100}%`
      });
      setPointOffset({
        x: obj.pointXOffset,
        y: obj.pointYOffset
      });
      // Set custom focal point if needed
    } catch (error) {
      console.error(error);
    }
  }, [value]);

  const handlePickerClick = (e) => {
    const picker = e.currentTarget;
    const pointYOffset = e.nativeEvent.offsetY - 10; // Assuming point height is 20
    const pointXOffset = e.nativeEvent.offsetX - 10; // Assuming point width is 20
    const fpX = Math.round((e.nativeEvent.offsetY / picker.offsetHeight) * 100);
    const fpY = Math.round((e.nativeEvent.offsetX / picker.offsetWidth) * 100);

    setFocalPoint({ x: `${fpX}%`, y: `${fpY}%` });
    setPointOffset({ x: pointXOffset, y: pointYOffset });
    // Update results and set value for custom element
  };

  const handleViewportChange = (type) => {
    setViewportSize(type);
  };

  useEffect(() => {
    const getImageUrl = async () => {
      {
        /* @ts-ignore:next-line */
      }
      const response = await axios.get(
        `/api/image?language=${context.variant.codename as string}&codename=${context.item.codename}`
      );
      setImageUrl(response.data.imageUrl);
    };
    getImageUrl();
  }, [context.projectId, context.item.codename, context.variant.codename, element.config]);

  // CustomElement.observeItemChanges([element.config["elementToWatch"]], () => {
  //   CustomElement.getElementValue(element.config["elementToWatch"], (elementValue) => {
  //     fetchData(elementValue);
  //   });
  // });

  CustomElement.init


  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-1">
          <div className="col-span-1">
            <div className="hidden md:block">
              <div
                id="background-container"
                className="bg-no-repeat bg-transparent"
                style={{
                  backgroundImage: `url(${imageUrl}?h=800&q=80)`,
                  backgroundPosition: `${focalPoint.x} ${focalPoint.y}`,
                }}
              ></div>
            </div>
            <div id="positioner-container">
              <p className="picker-title">Choose your focal point:</p>
              <div id="picker" className="relative">
                <Image
                  id="focal-img"
                  src={`${imageUrl}?auto=format&fit=crop&h=800&q=80`}
                  alt="Background"
                  layout="fill"
                  objectFit="cover"
                  onClick={handlePickerClick}
                />
                <div id="point" style={{ top: pointOffset.y, left: pointOffset.x }} className="absolute"></div>
              </div>
              <div className="controls flex">
                <span className="results mr-2">Position: {focalPoint.x} {focalPoint.y}</span>
                <span id="desktop" className="control mr-2 cursor-pointer" onClick={() => handleViewportChange('desktop')}>
                  <i className="fas fa-desktop"></i>
                </span>
                <span id="tablet" className="control mr-2 cursor-pointer" onClick={() => handleViewportChange('tablet')}>
                  <i className="fas fa-tablet-alt"></i>
                </span>
                <span id="mobile" className="control cursor-pointer" onClick={() => handleViewportChange('mobile')}>
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
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Draggable from 'react-draggable';
import { ComputerDesktopIcon, DevicePhoneMobileIcon, DeviceTabletIcon } from '@heroicons/react/24/solid';

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
      CustomElement.setHeight(500)
      const obj = JSON.parse(value ? value : "{\"fpX\":0,\"fpY\":0}");
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
      const response = await axios.get(
        `/api/image?language=${context.variant.codename as string}&codename=${context.item.codename}`
      );
      setImageUrl(response.data.imageUrl);
    };
    getImageUrl();
  }, [context.projectId, context.item.codename, context.variant.codename, element.config]);

  const handleDrag = (e, data) => {
    const fpY = Math.round((data.y / data.node.parentElement.offsetHeight) * 100);
    const fpX = Math.round((data.x / data.node.parentElement.offsetWidth) * 100);

    setFocalPoint({ x: `${fpX}%`, y: `${fpY}%` });
    setPointOffset({ x: data.x, y: data.y });
    CustomElement.setValue(JSON.stringify({ fpX: fpX / 100, fpY: fpY / 100, pointYOffset: data.y, pointXOffset: data.x }));
    // Update results and set value for custom element
  };

  const handleClear = () => {
    // Clear the value in the custom element
    CustomElement.setValue("");
  };

  return (
    <div className="container mx-auto" id="focal-picker">
      <div className="grid grid-cols-1">
        <div className="col-span-1">
          <div className={`viewport ${viewportSize}`}>
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
              <Draggable
                bounds="parent"
                onDrag={handleDrag}
                position={{ x: pointOffset.x, y: pointOffset.y }}
              >
                <div id="point" className="absolute"></div>
              </Draggable>
            </div>
            <div className="controls flex">
              <span className="results mr-2">Position: {focalPoint.x} {focalPoint.y}</span>
              <span id="desktop" className="control mr-2 cursor-pointer" onClick={() => handleViewportChange('desktop')}>
                <ComputerDesktopIcon className="h-6 w-6 inline-block mr-2" />
              </span>
              <span id="tablet" className="control mr-2 cursor-pointer" onClick={() => handleViewportChange('tablet')}>
                <DeviceTabletIcon className="h-6 w-6 inline-block mr-2" />
              </span>
              <span id="mobile" className="control cursor-pointer" onClick={() => handleViewportChange('mobile')}>
                <DevicePhoneMobileIcon className="h-6 w-6 inline-block mr-2" />
              </span>
            </div>
            <button className="bg-sky-800 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-full mt-2" onClick={handleClear}>
              Reset focal point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import Image from 'next/image';

interface IProps {
  value: string | any;
}

export const PimberlyCustomElement: React.FC<IProps> = ({
  value
}) => {
  return (
    <div className='custom-element'>
      <div className='mb-3 d-flex justify-content-center'>
        {value?.split(',').map((imageUrl, i) => (
          <Image key={i} alt={value} height={300} src={imageUrl} />
        ))}
      </div>
    </div>
  );
};
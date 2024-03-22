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
      <div className='mb-3'>
        {value?.map((imageUrl, i) => (
          <Image key={i} alt={imageUrl} height={300} src={imageUrl} />
        ))}
      </div>
    </div>
  );
};

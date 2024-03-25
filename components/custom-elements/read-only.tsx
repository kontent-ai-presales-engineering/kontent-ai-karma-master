import React from 'react';

interface IProps {
  value: string | any;
}

export const ReadOnlyCustomElement: React.FC<IProps> = ({
  value
}) => {
  return (
    <div className='custom-element'>
        {value}
    </div>
  );
};
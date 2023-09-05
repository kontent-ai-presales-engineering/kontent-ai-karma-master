
import React from 'react';

interface IProps {
  readonly isPreview: boolean;
}

export const PreviewContext = React.createContext<IProps>({
  isPreview: false
});
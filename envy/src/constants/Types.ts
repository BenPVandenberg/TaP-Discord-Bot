import { IconType } from 'react-icons';
import { To } from 'react-router-dom';

export type TStyledProps = {
  className?: string;
};

export type TPath = {
  to: To;
  element: React.ReactNode | null;
  navEntry: {
    label: string;
    icon: IconType;
  } | null;
  subPaths: TPath[] | null;
};

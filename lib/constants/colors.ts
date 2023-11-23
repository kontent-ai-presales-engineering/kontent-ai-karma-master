import { PerCollection } from '../types/perCollection';

export const mainColorHoverClass: PerCollection<string> = {
  sandbox: 'hover:bg-manufacturing-dark',
  elitebuild: 'hover:bg-green-100',
  support: 'hover:bg-red-100',
  pdf: 'hover:bg-blue-100',
  default: 'hover:bg-blue-100',
};

export const mainColorHoverBorder: PerCollection<string> = {
  sandbox: 'hover:border-manufacturing',
  elitebuild: 'hover:border-green-100',
  support: 'hover:border-red-100',
  pdf: 'hover:border-blue-100',
  default: 'hover:border-blue-100',
};

export const mainColorBgClass: PerCollection<string> = {
  sandbox: 'bg-manufacturing',
  elitebuild: 'bg-elitebuild',
  support: 'bg-gray-300',
  pdf: 'bg-blue-300',
  default: 'bg-blue-300',
};

export const mainColorBorderClass: PerCollection<string> = {
  sandbox: 'border-manufacturing',
  elitebuild: 'border-sky-950',
  support: 'border-red-300',
  pdf: 'border-blue-300',
  default: 'border-blue-300',
};

export const mainColorTextClass: PerCollection<string> = {
  sandbox: 'text-white',
  elitebuild: 'text-white',
  support: 'text-red-600',
  pdf: 'text-blue-600',
  default: 'text-blue-600',
};

export const mainColorHighlightClass: PerCollection<string> = {
  sandbox: 'text-sky-950',
  elitebuild: 'text-sky-950',
  support: 'text-red-800',
  pdf: 'text-blue-800',
  default: 'text-blue-800',
};

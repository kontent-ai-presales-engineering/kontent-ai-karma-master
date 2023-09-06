import { PerCollection } from "../types/perCollection";

export const mainColorHoverClass: PerCollection<string> = {
  corporate_site: "hover:bg-green-100",
  elitebuild: "hover:bg-green-100",
  support: "hover:bg-red-100",
  elysium: "hover:bg-blue-100",
  default: "hover:bg-blue-100",
}

export const mainColorBgClass: PerCollection<string> = {
  corporate_site: "bg-sandbox",
  elitebuild: "bg-green-500",
  support: "bg-gray-300",
  elysium: "bg-elysium",
  default: "bg-blue-300",
};

export const mainColorBorderClass: PerCollection<string> = {
  corporate_site: "border-sky-950",
  elitebuild: "border-green-300",
  support: "border-red-300",
  elysium: "border-blue-300",
  default: "border-blue-300",
};

export const mainColorTextClass: PerCollection<string> = {
  corporate_site: "text-white",
  elitebuild: "text-black-600",
  support: "text-red-600",
  elysium: "text-black-600",
  default: "text-blue-600",
}

export const mainColorHighlightClass: PerCollection<string> = {
  corporate_site: "text-sky-950",
  elitebuild: "text-green-800",
  support: "text-red-800",
  elysium: "text-blue-800",
  default: "text-blue-800",
}

import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image"
import { NextRouter, useRouter } from "next/router";
import { FC, useState } from "react";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, WSL_Page, WSL_WebSpotlightRoot } from "../../../models";
import { useSiteCodename } from "../siteCodenameContext";
import { resolveLink } from "../../../lib/utils/link-utils";
import { IContentItem } from "@kontent-ai/delivery-sdk";

type Link = Readonly<WSL_Page>;

type Props = Readonly<{
  item: IContentItem
  homeContentItem?: WSL_WebSpotlightRoot;
}>

type MenuListProps = Readonly<{
  items: WSL_Page[];
  activeMenu: string | number;
  smallMenuActive: boolean
  handleClick: (menuId: string | number) => void;
}>

type DropdownMenuProps = Readonly<{
  links: ReadonlyArray<Link>;
}>;

const isPage = (item: WSL_Page | WSL_WebSpotlightRoot): item is WSL_Page =>
  item.system.type === contentTypes.page.codename;

const isCurrentNavigationItemActive = (pageLink: WSL_Page, router: NextRouter) => {
  const pathWithoutQuerystring = router.asPath.replace(/\?.*/, '');
  const pathSegments = pathWithoutQuerystring.split("/");
  const topLevelSegment = pathSegments[1];
  return pageLink && isPage(pageLink) && pageLink.elements.url.value === topLevelSegment;
};

const MenuList: FC<MenuListProps> = props => {
  const router = useRouter();
  const siteCodename = useSiteCodename();

  return (
    <ul className={`${props.smallMenuActive ? "flex" : "hidden"} flex-col md:flex md:gap-4 font-medium md:flex-row h-full`}>
      {props.items.map((link, i) => (        
        link.elements.seoMetadataShowInNavigation.value[0]?.codename != "no" && 
        <li
          key={i}
          className={`${isCurrentNavigationItemActive(link, router) ? "" : "border-l-transparent border-t-transparent"}
        border-gray-500 border-l-8 border-t-0 md:border-t-8 md:border-l-0 h-full ${mainColorBgClass[siteCodename]} group grow`}
          onClick={() => props.handleClick(i)}
        >
          {link.elements.subpages.value.length > 0 ? (
            <div className={`${i === props.activeMenu ? "bg-white text-black" : ""} md:hover:bg-white md:hover:text-black h-full`}>
              <DropdownButton item={link} />
              <div
                className={`${i === props.activeMenu ? "block" : "hidden"} md:group-hover:block absolute z-50 left-0 shadow-sm bg-white text-black border-gray-200 w-full `}
              >
                <DropdownMenuItems links={link.elements.subpages.linkedItems} />
              </div>
            </div>
          ) : (
            <Link
              rel="noopener noreferrer"
              className="h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-white border-b border-gray-100 md:w-auto md:bg-transparent md:border-0 md:hover:bg-white hover:text-gray-900"
              href={resolveLink({ type: link.system.type, urlSlug: link.elements.url.value }, link.system.language)}
            >
              {link.elements.title.value}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

const DropdownButton: FC<Props> = props => {
  return (
    <button
      className="h-full flex items-center justify-between w-full p-4 py-2 font-medium border-b border-gray-100 md:w-auto md:bg-transparent md:border-0"
    >
      <Link
        rel="noopener noreferrer"
        className="h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-white border-b border-gray-100 md:w-auto md:bg-transparent md:border-0 md:hover:bg-white hover:text-gray-900"
        href={resolveLink({ type: props.item.system.type, urlSlug: props.item.elements.url.value }, props.item.system.language)}
      >
        {props.item.elements.title.value}
        <ChevronDownIcon className="w-4 h-4 ml-1 mt-1" />
      </Link>
    </button>
  )
}

const DropdownMenuItems: FC<DropdownMenuProps> = props => {
  const router = useRouter();

  return (
    <ul className="grid gap-2 max-w-screen-xl px-4 py-5 mx-auto text-black sm:grid-cols-2 md:grid-cols-3 md:px-6">
      {props.links.map(link => (
        link.elements.seoMetadataShowInNavigation.value[0]?.codename != "no" && 
        <li key={link.system.codename}>
          <Link
            rel="noopener noreferrer"
            href={resolveLink({ type: link.system.type, urlSlug: link.elements.url?.value }, link.system.language)}
            className={`${isCurrentNavigationItemActive(link, router) ? "border-l-gray-500 cursor-default " : "border-l-transparent hover:border-l-gray-500"}
          block p-3 bg-gray-200 border-l-8 h-full`}
          >
            <div className="font-semibold">{link.elements.title?.value}</div>
            <span className="text-sm text-gray-500">{link.elements.title?.value}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const Menu: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive, setSmallMenuActive] = useState(false);
  const size = siteCodename == "elysium" ? "220" : "60"
  const handleMenuClick = (menuId: string | number): void => (
    setActiveMenu(menuId === activeMenu ? -1 : menuId)
  )

  return (
    <div
      className={`w-full ${mainColorBgClass[siteCodename]} fixed z-40`}
      {...createItemSmartLink(props.item.system.id, props.item.system.name)}
    >
      <div className="flex justify-between items-center mx-auto max-w-screen-xl md:h-16 pr-4">
        <div className="w-screen h-full md:flex justify-between z-50 md:pr-24 xl:pr-12 2xl:pr-0">
          <div className="flex h-full justify-between items-center ">
            <Link href="/" className="flex items-center max-h-full">
              {props.homeContentItem?.elements.logo.value[0] &&
                <Image
                  className="h-auto"
                  width={size}
                  height={size}
                  src={props.homeContentItem.elements.logo.value[0].url}
                  alt={props.homeContentItem.elements.logo.value[0].description} />
              }
              {props.homeContentItem?.elements.name.value &&
                <div className="ml-1 text-white">
                  <div>{props.homeContentItem.elements.name.value}</div>
                  <div>{props.homeContentItem.elements.tagline.value}</div>
                </div>
              }
            </Link>
            <button
              type="button"
              className="md:hidden flex justify-center items-center"
              onClick={() => setSmallMenuActive(!smallMenuActive)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          <div>
            <MenuList
              smallMenuActive={smallMenuActive}
              items={props.homeContentItem.elements.subpages.linkedItems}
              handleClick={handleMenuClick}
              activeMenu={activeMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Menu.displayName = "Menu";


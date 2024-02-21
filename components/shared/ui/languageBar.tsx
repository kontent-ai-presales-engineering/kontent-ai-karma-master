import { FC, useEffect, useState } from "react";
import { ILanguage } from "@kontent-ai/delivery-sdk";
import styles from "./LanguageSelector.module.scss";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { getLanguages } from "../../../lib/services/kontentClient";
import { getEnvIdFromCookie } from "../../../lib/utils/pageUtils";
import { defaultEnvId } from "../../../lib/utils/env";
import "/node_modules/flag-icons/css/flag-icons.min.css";


interface FlagIconProps {
    countryCode: string;
}

function FlagIcon({ countryCode = "gb" }: FlagIconProps) {
    return (
        <span
            className={`fi fis ${styles.fiCircle} inline-block mr-2 fi-${countryCode.slice(-2).toLowerCase()}`}
        />
    );
}

type Props = Readonly<{
    display: string;
}>;

export const LanguageBar: FC<Props> = props => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const envId = getEnvIdFromCookie() ?? defaultEnvId;

    const [languages, setLanguages] = useState<ILanguage[]>([]);
    useEffect(() => {
        const setupLanguages = async () => {
            const appLanguages = getLanguages({ envId });
            setLanguages((await appLanguages).data.items);
        };
        setupLanguages();
    }, [envId]);
    const selectedLanguage = languages.find(language => language.system.codename === router.locale);

    const LANGUAGE_SELECTOR_ID = `language-selector-${props.display}`;
    useEffect(() => {
        const handleWindowClick = (event: any) => {
            const target = event.target.closest('button');
            if (target && target.id === LANGUAGE_SELECTOR_ID) {
                return;
            }
            setIsOpen(false);
        }
        window.addEventListener('click', handleWindowClick)
        return () => {
            window.removeEventListener('click', handleWindowClick);
        }
    }, [LANGUAGE_SELECTOR_ID]);
    return (
        <div className="relative inline-block text-left m-3 z-50">
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="inline-flex items-end justify-end w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id={LANGUAGE_SELECTOR_ID}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-label="Language switch"
                >
                    <FlagIcon countryCode={selectedLanguage?.system.codename as string} />
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            {isOpen && <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="language-selector"
            >
                <div className="py-1 grid grid-cols-1 gap-1" role="none">
                    {languages.map((language, index) => {
                        return (
                            <Link href={router.asPath} locale={language.system.codename}
                                key={language.system.codename}>
                                <button
                                    className={`${selectedLanguage?.system.codename === language.system.codename
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700"
                                        } block px-4 py-1 text-sm text-left items-center inline-flex hover:bg-gray-100 ${index % 2 === 0 ? 'rounded-r' : 'rounded-l'}`}
                                    role="menuitem"
                                >
                                    <FlagIcon countryCode={language.system.codename} />
                                    <span className="truncate">{language.system.name}</span>
                                </button>
                            </Link>
                        );
                    })}
                </div>
            </div>}
        </div>
    );
};
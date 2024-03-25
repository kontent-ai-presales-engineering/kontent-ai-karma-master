import { FC, useEffect, useState } from "react";
import { ITaxonomyTerms } from "@kontent-ai/delivery-sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import { getPersonas } from "../../../lib/services/kontentClient";
import { getEnvIdFromCookie, getPersonaFromCookie } from "../../../lib/utils/pageUtils";
import { defaultEnvId } from "../../../lib/utils/env";
import { personaCookieName } from "../../../lib/constants/cookies";

type Props = Readonly<{
    display: string;
}>;

export const PersonasBar: FC<Props> = props => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const envId = getEnvIdFromCookie() ?? defaultEnvId;
    const personaId = getPersonaFromCookie();
    const [selectedPersona, setSelectedPersona] = useState<ITaxonomyTerms>();

    const [personas, setPersonas] = useState<ITaxonomyTerms[]>([]);
    useEffect(() => {
        const setupPersonas = async () => {
            const personas = getPersonas({ envId });
            setPersonas((await personas));
            setSelectedPersona((await personas).find(persona => persona.codename === personaId))
        };
        setupPersonas();
    }, [envId, personaId]);

    const PERSONA_SELECTOR_ID = `persona-selector-${props.display}`;
    useEffect(() => {
        const handleWindowClick = (event: any) => {
            const target = event.target.closest('button');
            if (target && target.id === PERSONA_SELECTOR_ID) {
                return;
            }
            setIsOpen(false);
        }
        window.addEventListener('click', handleWindowClick)
        return () => {
            window.removeEventListener('click', handleWindowClick);
        }
    }, [PERSONA_SELECTOR_ID]);

    const handleSelectPersona = (persona) => {
        if (persona) {
            const personaTerm = personas.find(p => p.codename === personaId);
            setSelectedPersona(personaTerm);
            setIsOpen(false);
            document.cookie = `${personaCookieName}=${persona.codename}; path=/;`;
        } else {
            // Set the cookie to expire in the past, effectively clearing it            
            setSelectedPersona(null);
            document.cookie = `${personaCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
    };

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="inline-flex items-end justify-end w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id={PERSONA_SELECTOR_ID}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-label="Persona switch"
                >
                    {selectedPersona ? selectedPersona?.name : "Choose an persona"}
                </button>
            </div>
            {isOpen && (
                <div
                    className="origin-bottom-right absolute left-40 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={PERSONA_SELECTOR_ID}
                    style={{ transform: 'translateY(-100%)' }} // This line is added to lift the menu up by its own height
                >
                    <div className="py-1 grid grid-cols-1 gap-1" role="none">
                        {personas.map((persona) => (
                            <button
                                key={persona.codename}
                                className={`${selectedPersona?.codename === persona.codename
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700'
                                    } block px-4 py-1 text-sm text-left items-center inline-flex hover:bg-gray-100`}
                                role="menuitem"
                                onClick={() => handleSelectPersona(persona)}
                            >
                                <span className="truncate">{persona.name}</span>
                            </button>
                        ))}
                        <button
                            className={`${!selectedPersona
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700'
                                } block px-4 py-1 text-sm text-left items-center inline-flex hover:bg-gray-100`}
                            role="menuitem"
                            onClick={() => handleSelectPersona(null)}
                        >
                            <span className="truncate">Not personalized</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
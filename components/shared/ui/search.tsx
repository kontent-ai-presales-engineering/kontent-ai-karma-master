import React, { useState } from "react"
import { InstantSearch, SearchBox, connectStateResults, Hits, Highlight, Snippet } from "react-instantsearch-dom"
import Link from "next/link"
import AlgoliaService from "../../../lib/services/algolia-service"

interface Props {
    hoverResults?: boolean
}

const Search: React.FC<Props> = ({ hoverResults = true }) => {
    const algoliaService = new AlgoliaService()

    const [showResults, setShowResults] = useState(false)

    const Hit = ({ hit }: any) => {
        return <div>
            <Link href={`${hit.slug}`} passHref={true}>
                <Highlight attribute="name" hit={hit} />
            </Link>
            <br />
            {hit._snippetResult.content.map((contents: any, i: number) => {
                if (contents.contents.matchLevel !== "none")
                    return <Snippet key={i} attribute={`content[${i}].contents`} hit={hit} />
                else
                    return null
            })}

        </div >
    }

    const Results = connectStateResults(({ searchState }) => {
        return searchState && searchState.query ? (
            <div className={`position-relative ${!showResults ? "d-none" : ""}`} style={{ zIndex: 1000 }}>
                <div className={hoverResults ? "position-absolute top-0 end-0" : ""} style={{ width: "300px" }}>
                    <Hits hitComponent={Hit} />
                </div>
            </div>
        ) : null
    });

    return <div className="relative inline-block text-left m-3">
        <InstantSearch
            searchClient={algoliaService.client}
            indexName={algoliaService.config.index}
        >
            {/* @ts-ignore:next-line */}
            <SearchBox onFocus={() => setShowResults(true)} onBlur={() => setTimeout(() => setShowResults(false), 200)} 
            classNames={{
                root: 'relative mb-4 flex w-full flex-wrap items-stretch',
                button: 'relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg',
                form: 'relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary',
              }}/>
            <Results />
        </InstantSearch>
    </div>
}

export default Search
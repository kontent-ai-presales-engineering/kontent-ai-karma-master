
import React, { useState } from "react"
import { InstantSearch, SearchBox, connectStateResults, Hits, Highlight, Snippet } from "react-instantsearch-dom"
import Link from "next/link"
import AlgoliaService from "../../lib/services/algolia-service"

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
            {hit._snippetResult.content.map((contents: { contents: { matchLevel: string } }, i: React.Key | null | undefined) => {
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


    return <div>
        <InstantSearch
            searchClient={algoliaService.client}
            indexName={algoliaService.config.index}
        >
            {/* @ts-ignore:next-line */}
            <SearchBox onFocus={() => setShowResults(true)} onBlur={() => setTimeout(() => setShowResults(false), 200)} />
            <Results />
        </InstantSearch>
    </div>
}

export default Search
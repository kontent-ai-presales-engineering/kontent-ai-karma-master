import axios from 'axios';
import React, { useState } from "react";
import Search from '../search/search';

interface IProps {
    element: CustomElement.Element,
    context: CustomElement.Context,
    handleSave: (value: string | null | object | CustomElement.ValueObject| any) => void
    value: string | null | object | CustomElement.ValueObject | any
}

export const AlgoliaCustomElement: React.FC<IProps> = ({ element, context, value, handleSave }) => {

    const [status, setStatus] = useState("")

    const reindex = () => {
        setStatus("indexing...")
        axios.post("/api/search-init", {
            projectId: context.projectId,
            language: context.variant.codename
        }).then(r => {
            setStatus(r.data.length + " items indexed.")
        })
    }
    
    return <>
        <div className="custom-element">
            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-xs btn-secondary" onClick={() => reindex()}>Re-index</button>
            </div>
            <div className="d-flex justify-content-center mb-3">{status}</div>
            <div className="p-1">
                <Search hoverResults={false} />
            </div>
        </div>
    </>
}
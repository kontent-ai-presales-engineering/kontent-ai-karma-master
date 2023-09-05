import React, { useEffect, useState } from "react"

interface IProps {
    element: CustomElement.Element
    handleSave: (value: string|any) => void
    value: string|any
}

function stripTrailingSlash(str:any) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

export const InstagramCustomElement: React.FC<IProps> =
    ({ element, value, handleSave }) => {

        const instagramUrl = value ? stripTrailingSlash(value.toString()) : ""
        const [userInput, setUserInput] = useState(instagramUrl)

        useEffect(() => {
            if (instagramUrl) {
                setUserInput(instagramUrl)
            }
        }, [value, instagramUrl])

        const handleChange = (value: string) => {
            const instagramUrl = value ? stripTrailingSlash(value.toString()) : ""
            setUserInput(instagramUrl)
            handleSave(instagramUrl)
        }

        return <div className="custom-element">
            <form>
                <fieldset disabled={element.disabled}>
                    <div className="mb-3">
                        <label htmlFor="instagramUrl" className="form-label">Instagram URL</label>
                        <input id="instagramUrl" className="form-control" type="text" value={userInput} onChange={e => handleChange(e.target.value)} autoComplete="off" />
                    </div>
                </fieldset>
            </form>
            <div className="d-flex justify-content-center">
                {instagramUrl ? <iframe
                    className="instagram"
                    src={instagramUrl + "/embed"}
                    height="500px"></iframe> : null}
            </div>
        </div>
    }
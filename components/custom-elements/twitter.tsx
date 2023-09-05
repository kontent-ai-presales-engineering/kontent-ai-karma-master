import React, { useEffect, useState } from "react"
import { Tweet } from "react-twitter-widgets"

interface IProps {
    element: CustomElement.Element
    handleSave: (value: string|any) => void
    value: string|any
}

export const TwitterCustomElement: React.FC<IProps> =
    ({ element, value, handleSave }) => {

        const tweetId = value ? value.toString() : ""
        const [userInput, setUserInput] = useState(tweetId)

        useEffect(() => {
            if (value) {
                setUserInput(value.toString())
            }
        }, [value])

        const handleChange = (value: string) => {
            setUserInput(value)

            const idRegex = /[0-9]{5,}/
            const id = value.match(idRegex)
            if (id) {
                handleSave(id[0])
            } else {
                handleSave("")
            }
        }

        return <div className="custom-element">
            <form>
                <fieldset disabled={element.disabled}>
                    <div className="mb-5">
                        <label htmlFor="tweet" className="form-label">Tweet ID (or URL)</label>
                        <input id="tweet" className="form-control" type="text" value={userInput} onChange={e => handleChange(e.target.value)} autoComplete="off" />
                    </div>
                </fieldset>
            </form>
            <div className="d-flex justify-content-center">
                {tweetId ? <Tweet
                    tweetId={tweetId}
                    renderError={_err => <strong>Could not load tweet: {tweetId}</strong>}
                /> : null}
            </div>
        </div>
    }
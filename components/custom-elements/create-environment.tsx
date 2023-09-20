import axios from 'axios';
import React, { useState } from "react";

interface IProps {
    element: CustomElement.Element,
    context: CustomElement.Context,
    handleSave: (value: string | null | object | CustomElement.ValueObject | any) => void
    value: string | null | object | CustomElement.ValueObject | any
}

export const CreateEnvironmentCustomElement: React.FC<IProps> = ({ element, context, value, handleSave }) => {

    const [status, setStatus] = useState("")
    const [valueName, setValueName] = useState('');
    const [valueEmail, setValueEmail] = useState('');
    const [active, setActive] = useState(true)

    const createEnvironment = () => {
        if (valueEmail && valueName) {
            setActive(!active)
            setStatus("Creating environment...This process may take a few minutes to complete.")
            axios.post("/api/create-environment", {
                environment_name: valueName,
                user_email: valueEmail
            }).then(r => {
                setStatus("Environment created")
                setActive(active)
            })
        }
    }

    return <>
        <div className="custom-element">
            <div className="p-1">
                Company name: <input id="companyName" onChange={e => { setValueName(e.currentTarget.value); }} className="form-control" type="text" autoComplete="off" />
            </div>
            <div className="p-1">
                Email adress: <input id="email" onChange={e => { setValueEmail(e.currentTarget.value); }} className="form-control" type="text" autoComplete="off" />
            </div>
            <div className="d-flex justify-content-center mb-3 p-1 py-5">
                <button disabled={!active} className="btn btn-xs btn-secondary" onClick={() => createEnvironment()}>Create environment</button>
            </div>
            <div className="d-flex justify-content-center mb-3">{status}</div>
        </div>
    </>
}
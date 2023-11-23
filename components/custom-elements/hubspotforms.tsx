import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface IProps {
  element: CustomElement.Element;
  context: CustomElement.Context;
  handleSave: (value: string) => void;
  value: string | any;
}

export const HubspotFormsCustomElement: React.FC<IProps> = ({
  element,
  value,
  context,
  handleSave,
}) => {
  const formId = value ? value.toString() : '';
  const [userInput, setUserInput] = useState(formId);
  const [forms, setForms] = useState(new Array());

  useEffect(() => {
    if (value) {
      setUserInput(value.toString());
    }

    const getForms = async () => {
      {
        /* @ts-ignore:next-line */
      }
      const formsResponse = await axios.get(
        '/api/hubspot-getforms?accessToken=' + element.config['apiKey']
      );
      setForms(formsResponse.data);
    };

    getForms();
  }, [value, element.config]);

  const handleChange = (value: string) => {
    {
      /* @ts-ignore:next-line */
    }
    value = value + '|' + element.config['portalId'];
    if (value) {
      handleSave(value);
      setUserInput(value);
    } else {
      handleSave('');
    }
  };

  return (
    <div className='custom-element'>
      <form>
        <div className='mb-3'>
          <select
            id='forms'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
            value={userInput.slice(0, userInput.lastIndexOf('|')) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            autoComplete='off'
          >
            <option value='' selected disabled>
              Select a form
            </option>
            {forms.map((form) => (
              <option key={form.guid} value={form.guid}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

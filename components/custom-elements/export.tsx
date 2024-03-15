// components/HubspotFormsCustomElement.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { ContentTypeModels } from '@kontent-ai/management-sdk';

interface IProps {
  element: CustomElement.Element;
  context: CustomElement.Context;
  handleSave: (value: string) => void;
  value: string | any;
}

export const ExportCustomElement: React.FC<IProps> = ({
  element,
  value,
  context,
  handleSave,
}) => {

  const [contenttypes, setContenttypes] = useState(
    new Array<ContentTypeModels.ContentType>()
  );

  const [selectedContentType, setSelectedContentType] = useState('');

  const handleContentTypeChange = (event) => {
    setSelectedContentType(event.target.value);
  };


  const handleExportClick = async () => {
    if (!selectedContentType) {
      alert('Please select a content type to export.');
      return;
    }

    const res = await fetch(`/api/export-to-csv?contenttype=${selectedContentType}&language=${context.variant.codename}&preview=true`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedContentType}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };


  useEffect(() => {
    const getContentypes = async () => {
      const contenttypesResponse = await axios.get<
        Array<ContentTypeModels.ContentType>
      >('/api/get-contenttypes/');
      setContenttypes(contenttypesResponse.data);
    };

    getContentypes();
  });

  return (
    <div className="flex flex-col">
      <select
        id="contenttype"
        value={selectedContentType}
        onChange={handleContentTypeChange}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
      >
        <option value=''>Select a content type</option>
        {contenttypes.map((c) => {
          return (
            <option key={c.id} value={c.codename}>
            {c.name}
          </option>
          );
        })}
      </select>

      <button className="bg-sky-800 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-full mt-2"
        onClick={handleExportClick}>
        <ArrowDownTrayIcon className="h-6 w-6 inline-block mr-2" />
        Export all data
      </button>
    </div>
  );
};
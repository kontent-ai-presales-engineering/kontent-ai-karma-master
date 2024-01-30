import {
  IContentItem,
  ILanguage,
  camelCasePropertyNameResolver,
  createDeliveryClient,
} from '@kontent-ai/delivery-sdk';
import { WorkflowModels } from '@kontent-ai/management-sdk';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AzureTranslationService from '../../lib/services/azure-translation-service';
import {
  defaultEnvId,
  defaultPreviewKey,
  deliveryApiDomain,
  deliveryPreviewApiDomain,
} from '../../lib/utils/env';
const sourceTrackingHeaderName = 'X-KC-SOURCE';

interface Props {
  element: CustomElement.Element;
  context: CustomElement.Context;
  handleSave: (value: string | any) => void;
  value: string | any;
}

const getDeliveryClient = ({ envId, previewApiKey }: ClientConfig) =>
  createDeliveryClient({
    environmentId: envId,
    globalHeaders: () => [
      {
        header: sourceTrackingHeaderName,
        value: `${process.env.APP_NAME || 'n/a'};${
          process.env.APP_VERSION || 'n/a'
        }`,
      },
    ],
    propertyNameResolver: camelCasePropertyNameResolver,
    proxy: {
      baseUrl: deliveryApiDomain,
      basePreviewUrl: deliveryPreviewApiDomain,
    },
    previewApiKey: defaultEnvId === envId ? defaultPreviewKey : previewApiKey,
  });

type ClientConfig = {
  envId: string;
  previewApiKey?: string;
};

export interface SavedValue {
  sourceLanguageId?: string;
  targetLanguageIds?: Array<string>;
  triggerWorkflowStep?: string;
  reviewWorkflowStep?: string;
}

export const TranslationCustomElement: React.FC<Props> = ({
  element,
  context,
  value,
  handleSave,
}) => {
  const envId = context.projectId;
  const previewApiKey = defaultEnvId === envId ? defaultPreviewKey : '';
  const config = useMemo(() => {
    return { envId, previewApiKey };
  }, [envId, previewApiKey]);
  const defaultLanguageId = '00000000-0000-0000-0000-000000000000';

  const [savedValue, setSavedValues] = useState<SavedValue>();

  const [languages, setLanguages] = useState(new Array<ILanguage>());
  const [workflows, setWorkflows] = useState(
    new Array<WorkflowModels.WorkflowStep>()
  );
  const [selectedItems, setSelectedItems] = useState(new Array<string>());

  const [stuckItems, setStuckItems] = useState(new Array<IContentItem>());
  const [stuckProcessing, setStuckProcessing] = useState('initial');

  const loadStuckItems = async () => {
    setStuckProcessing('loading');
    const triggerWorkflow = workflows.find(
      (wf) => wf.codename === savedValue?.triggerWorkflowStep
    );

    if (triggerWorkflow) {
      setSelectedItems([]);
      const sourceLanguages = languages.filter(
        (l) => savedValue?.sourceLanguageId === l.system.id
      );
      const getStuckSources = sourceLanguages.map((sl) =>
        getDeliveryClient(config)
          .items()
          .elementsParameter(['none'])
          .queryConfig({
            usePreviewMode: true,
          })
          .equalsFilter('system.workflow_step', triggerWorkflow.codename)
          .equalsFilter('system.language', sl.system.codename)
          .languageParameter(sl.system.codename)
          .toPromise()
      );

      const targetLanguages = languages.filter((l) =>
        savedValue?.targetLanguageIds?.includes(l.system.id)
      );
      const getStuckTargets = targetLanguages.map((tl) =>
        getDeliveryClient(config)
          .items()
          .elementsParameter(['none'])
          .queryConfig({
            usePreviewMode: true,
          })
          .equalsFilter('system.workflow_step', triggerWorkflow.codename)
          .equalsFilter('system.language', tl.system.codename)
          .languageParameter(tl.system.codename)
          .toPromise()
      );

      const stuckItems = await Promise.all([
        ...getStuckSources,
        ...getStuckTargets,
      ]);
      setStuckItems(stuckItems.flatMap((si) => si.data.items));
      setStuckProcessing('loaded');
    } else {
      setStuckProcessing('error');
    }
  };

  const triggerSave = useCallback(
    (savedValue: SavedValue) => {
      setSavedValues(savedValue);
      handleSave(JSON.stringify(savedValue));
    },
    [handleSave]
  );

  useEffect(() => {
    const parsedSavedValue = JSON.parse(value) as SavedValue;

    setSavedValues({
      sourceLanguageId: parsedSavedValue?.sourceLanguageId ?? '',
      targetLanguageIds: parsedSavedValue?.targetLanguageIds ?? [],
      triggerWorkflowStep: parsedSavedValue?.triggerWorkflowStep ?? '',
      reviewWorkflowStep: parsedSavedValue?.reviewWorkflowStep ?? '',
    });
  }, [triggerSave, value]);

  const handleLanguageSelectionChange = (value: string) => {
    const newSelection = [...(savedValue?.targetLanguageIds as string[])];
    const index = newSelection?.indexOf(value);
    if (index >= 0) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(value);
    }

    triggerSave({
      ...savedValue,
      targetLanguageIds: newSelection,
    });
  };

  const handleItemSelectionChange = (value: string) => {
    const newSelection = [...selectedItems];
    const index = newSelection.indexOf(value);
    if (index >= 0) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(value);
    }

    setSelectedItems(newSelection);
  };

  const handleSourceLanguageChange = (value: string) => {
    const newSelection = [...(savedValue?.targetLanguageIds as string[])];
    const index = newSelection?.indexOf(value);
    if (index >= 0) {
      newSelection.splice(index, 1);
    }

    triggerSave({
      ...savedValue,
      targetLanguageIds: newSelection,
      sourceLanguageId: value,
    });
  };

  const handleTriggerWorkflowSelectionChange = (newTriggerStep: string) => {
    let newReviewStep =
      newTriggerStep !== savedValue?.reviewWorkflowStep
        ? savedValue?.reviewWorkflowStep
        : '';

    triggerSave({
      ...savedValue,
      reviewWorkflowStep: newReviewStep,
      triggerWorkflowStep: newTriggerStep,
    });
  };

  const handleReviewWorkflowSelectionChange = (newReviewStep: string) => {
    let newTriggerStep =
      newReviewStep !== savedValue?.reviewWorkflowStep
        ? savedValue?.triggerWorkflowStep
        : '';

    triggerSave({
      ...savedValue,
      reviewWorkflowStep: newReviewStep,
      triggerWorkflowStep: newTriggerStep,
    });
  };

  useEffect(() => {
    const getLanguages = async () => {
      const languagesResponse = await getDeliveryClient(config)
        .languages()
        .toPromise();
      setLanguages(languagesResponse.data.items);
    };

    const getWorkflows = async () => {
      const workflowsResponse = await axios.get<
        Array<WorkflowModels.WorkflowStep>
      >('/api/get-workflows/');
      setWorkflows(workflowsResponse.data);
    };

    getLanguages();
    getWorkflows();
  }, [config]);

  const resubmitItems = async (selectedOnly: boolean) => {
    setStuckProcessing('resubmitting');
    const items = stuckItems.filter(
      (si) =>
        !selectedOnly ||
        selectedItems.includes(si.system.codename + si.system.language)
    );
    const resubmits = items.map((i) => {
      const languageId = languages.find(
        (l) => l.system.codename === i.system.language
      )?.system.id;
      return axios.post('/api/translate-manual/', {
        itemId: i.system.id,
        languageId,
      });
    });

    await Promise.all(resubmits);
    setTimeout(() => loadStuckItems(), 5000);
  };

  if (savedValue === null) {
    return <>Loading...</>;
  }

  return (
    <div className='custom-element p-1'>
      <div className='container mx-auto'>
        {context.variant?.id !== defaultLanguageId ? (
          <>Only configurable via default language</>
        ) : (
          <>
            {/* <pre>{JSON.stringify(savedValue, null, 2)}</pre> */}
            <h4 className='mb-2 mt-0 text-2xl font-medium leading-tight text-primary'>
              Auto-translation Settings
            </h4>
            <div className='flex flex-wrap  my-3'>
              <div className='relative flex-grow max-w-full flex-1 px-4'>
                <label className='block mb-2 text-sm font-medium text-gray-900 text-white'>
                  Source Language
                </label>
                <select
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                  value={savedValue?.sourceLanguageId ?? ''}
                  onChange={(e) => handleSourceLanguageChange(e.target.value)}
                >
                  <option value=''>Select a language</option>
                  {languages.map((l) => {
                    const supportedLanguage =
                      AzureTranslationService.getSupportedLanguageCode(
                        l.system.codename
                      );
                    return (
                      <option
                        key={l.system.id}
                        value={l.system.id}
                        disabled={supportedLanguage === null}
                      >
                        {l.system.name} (
                        {supportedLanguage === null
                          ? `language not supported`
                          : `translated as ${supportedLanguage}`}
                        )
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className='flex flex-wrap  my-3'>
              <div className='relative flex-grow max-w-full flex-1 px-4'>
                <label className='block mb-2 text-sm font-medium text-gray-900 text-white'>
                  Trigger Workflow
                </label>
                <select
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                  value={savedValue?.triggerWorkflowStep ?? ''}
                  onChange={(e) =>
                    handleTriggerWorkflowSelectionChange(e.target.value)
                  }
                >
                  <option value=''>Select a workflow step</option>
                  {workflows.map((wf) => (
                    <option key={wf.id} value={wf.codename}>
                      {wf.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='relative flex-grow max-w-full flex-1 px-4'>
                <label className='block mb-2 text-sm font-medium text-gray-900 text-white'>
                  Review Workflow
                </label>
                <select
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                  value={savedValue?.reviewWorkflowStep ?? ''}
                  onChange={(e) =>
                    handleReviewWorkflowSelectionChange(e.target.value)
                  }
                >
                  <option value=''>Select a workflow step</option>
                  {workflows.map((wf) => (
                    <option key={wf.id} value={wf.codename}>
                      {wf.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className='mb-2 mt-0 text-2xl font-medium leading-tight text-primary'>
              Languages to automatically translate
            </h4>
            <ul className='flex flex-col pl-0 mb-0 border rounded border-gray-300  my-3'>
              {languages.map((language) => {
                const supportedLanguage =
                  AzureTranslationService.getSupportedLanguageCode(
                    language.system.codename
                  );

                if (language.system.id === savedValue?.sourceLanguageId)
                  return null;
                return (
                  <li
                    key={language.system.id}
                    className='relative block py-3 px-6 -mb-px border border-r-0 border-l-0 border-gray-300 no-underline'
                  >
                    <div className='mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]'>
                      <input
                        className='absolute mt-1 -ml-6'
                        type='checkbox'
                        id={language.system.id}
                        disabled={supportedLanguage === null}
                        defaultChecked={savedValue?.targetLanguageIds?.includes(
                          language.system.id
                        )}
                        onChange={() =>
                          handleLanguageSelectionChange(language.system.id)
                        }
                      />
                      <label
                        className='text-gray-700 pl-6 mb-0'
                        htmlFor={language.system.id}
                      >
                        {language.system.name} (
                        {supportedLanguage === null
                          ? `language not supported`
                          : `translated as ${supportedLanguage}`}
                        )
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>

            <h4 className='mb-2 mt-0 text-2xl font-medium leading-tight text-primary'>
              Stuck Items
            </h4>
            {stuckProcessing === 'initial'
              ? 'Click the load/refresh button to see any stuck items'
              : null}
            {stuckProcessing === 'loading' ? 'Loading stuck items' : null}
            {stuckProcessing === 'resubmitting'
              ? 'Resubmitting stuck items'
              : null}
            {stuckProcessing === 'loaded' && stuckItems.length === 0
              ? 'Nothing is stuck.'
              : null}

            {stuckItems &&
            stuckProcessing !== 'loading' &&
            stuckProcessing !== 'resubmitting' ? (
              <ul className='flex flex-col pl-0 mb-0 border rounded border-gray-300  my-3'>
                {stuckItems.map((item) => {
                  return (
                    <li
                      key={item.system.id + item.system.language}
                      className='relative block py-3 px-6 -mb-px border border-r-0 border-l-0 border-gray-300 no-underline'
                    >
                      <div className='relative block mb-2'>
                        <input
                          className='absolute mt-1 -ml-6'
                          type='checkbox'
                          id={item.system.id + item.system.language}
                          checked={selectedItems.includes(
                            item.system.codename + item.system.language
                          )}
                          onChange={(e) =>
                            handleItemSelectionChange(
                              item.system.codename + item.system.language
                            )
                          }
                        />
                        <label
                          className='text-gray-700 pl-6 mb-0 w-full'
                          htmlFor={item.system.id + item.system.language}
                        >
                          {item.system.name} ({item.system.language})
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className='flex flex-wrap  my-3'>
              <div className='relative flex-grow max-w-full flex-1 px-4 flex'>
                <button
                  className='inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-600 me-auto'
                  onClick={() => loadStuckItems()}
                >
                  Load/Refresh Items
                </button>
                <button
                  className='inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700'
                  onClick={() => resubmitItems(true)}
                >
                  Re-Submit {selectedItems.length} selected items
                </button>
                <button
                  className='inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700 ms-1'
                  onClick={() => resubmitItems(false)}
                >
                  Re-Submit all items
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

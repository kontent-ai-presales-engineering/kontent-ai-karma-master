import path from 'path';
import { writeJson } from './fileSystem';

interface ISavedApiKeys {
  [projectId: string]: string;
}

const jsonDirectory = path.join(process.cwd(), 'json');
const FileName = 'json/apiKeys.json';

export const getApiKey = (projectId: string): Promise<string | undefined> => {
  const isDefaultProject = process.env.DEFAULT_PROJECT_ID === projectId;
  const defaultApiKey = process.env.DEFAULT_API_KEY;

  return isDefaultProject && defaultApiKey
    ? Promise.resolve(defaultApiKey)
    : getApiKeyFromFile(projectId);
};

export const getApiKeyFromFile = async (projectId: string): Promise<string | undefined> => {
  const {
    loadJson,
  } = await import('./fileSystem');
  const apiKeys = loadJson<ISavedApiKeys>(FileName);  
  return apiKeys[projectId];
};

export const saveApiKeyToFile = async (projectId: string): Promise<void> => {
  const {
    loadJson,
    writeJson,
  } = await import('./fileSystem');
  const apiKeys = loadJson<ISavedApiKeys>(FileName);
  const newApiKeys = {
    ...apiKeys,
    [projectId]: apiKey,
  };
  writeJson(FileName, newApiKeys);
};

export const removeApiKeyFromFile = async (projectId: string): Promise<void> => {
  const {
    loadJson,
  } = await import('./fileSystem');
  const apiKeys = loadJson<ISavedApiKeys>(FileName);
  const { [projectId]: forget1, ...newApiKeys } = apiKeys;
  writeJson(FileName, newApiKeys);
};

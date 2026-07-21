import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL || ""}/api/v1/gpus`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Helper for caching inside sessionStorage
const requestWithCache = async (url, params = {}) => {
  const cacheKey = `gpu_cache_${url}_${JSON.stringify(params)}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }

  const { data } = await api.get(url, { params });
  
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
  } catch (err) {
    // If storage is full, clear and attempt to write once
    sessionStorage.clear();
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
    } catch {}
  }

  return data.data;
};

export const searchGpus = async (query) => {
  return requestWithCache("/search", { q: query });
};

export const getLocalGpus = async (params = {}) => {
  return requestWithCache("/local", params);
};

export const getCloudProviders = async (params = {}) => {
  return requestWithCache("/cloud", params);
};

export const getSystems = async (params = {}) => {
  return requestWithCache("/systems", params);
};

export const getTcoData = async (hours = 8) => {
  return requestWithCache("/tco", { hours });
};

export const getBandwidthData = async () => {
  return requestWithCache("/bandwidth");
};

export const getExternalSpecs = async (name) => {
  return requestWithCache("/external-specs", { name });
};

export const sendChatMessage = async (messages, token) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await axios.post(`${backendUrl}/api/v1/chat`, { messages }, { headers });
  return data.data;
};


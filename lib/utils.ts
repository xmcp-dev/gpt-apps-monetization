import { getBaseUrl } from "./base-url";

export const getAppsSdkCompatibleHtml = async (path: string) => {
  const baseUrl = getBaseUrl();
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

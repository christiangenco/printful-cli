import { getConfig } from "./config.js";

const BASE_URL = "https://api.printful.com";

export async function printfulFetch(
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  const { token, storeId } = getConfig();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  if (storeId) {
    headers["X-PF-Store-Id"] = storeId;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    const msg =
      (json as { error?: { message?: string } }).error?.message ||
      (json as { result?: string }).result ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}

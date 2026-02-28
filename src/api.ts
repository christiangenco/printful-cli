import { getConfig } from "./config.js";

const BASE_URL = "https://api.printful.com";

export async function printfulFetch(
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  const { token } = getConfig();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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

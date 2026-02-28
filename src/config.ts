import "dotenv/config";

export function getConfig() {
  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token) {
    throw new Error("Missing PRINTFUL_API_TOKEN in environment. See .env.example");
  }
  const storeId = process.env.PRINTFUL_STORE_ID || undefined;
  return { token, storeId };
}

export interface ShippingAddress {
  name: string;
  address1: string;
  city: string;
  state_code: string;
  zip: string;
  country_code: string;
}

export function getShippingAddress(): ShippingAddress {
  const required = [
    "PRINTFUL_SHIP_NAME",
    "PRINTFUL_SHIP_ADDRESS1",
    "PRINTFUL_SHIP_CITY",
    "PRINTFUL_SHIP_STATE",
    "PRINTFUL_SHIP_ZIP",
    "PRINTFUL_SHIP_COUNTRY",
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing ${key} in environment. See .env.example`);
    }
  }

  return {
    name: process.env.PRINTFUL_SHIP_NAME!,
    address1: process.env.PRINTFUL_SHIP_ADDRESS1!,
    city: process.env.PRINTFUL_SHIP_CITY!,
    state_code: process.env.PRINTFUL_SHIP_STATE!,
    zip: process.env.PRINTFUL_SHIP_ZIP!,
    country_code: process.env.PRINTFUL_SHIP_COUNTRY!,
  };
}

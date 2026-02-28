import { Command } from "commander";
import { printfulFetch } from "../api.js";
import { getShippingAddress } from "../config.js";
import { ok, fail } from "../output.js";
import { uploadFile } from "./files.js";

interface OrderItem {
  id: number;
  variant_id: number;
  quantity: number;
  name: string;
  price: string;
  retail_price: string | null;
}

interface OrderResult {
  id: number;
  external_id: string | null;
  status: string;
  shipping: string;
  shipping_service_name: string;
  created: number;
  updated: number;
  items: OrderItem[];
  costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    digitization: string;
    additional_fee: string;
    fulfillment_fee: string;
    retail_delivery_fee: string;
    tax: string;
    vat: string;
    total: string;
  };
  retail_costs: {
    currency: string;
    subtotal: string | null;
    discount: string | null;
    shipping: string | null;
    tax: string | null;
    vat: string | null;
    total: string | null;
  };
}

export const orderCommand = new Command("order")
  .description("Place an order (shows estimate unless --confirm is passed)")
  .requiredOption("--variant <id>", "Catalog variant ID")
  .requiredOption("--file <path>", "Path to design file (PNG, JPG, SVG)")
  .option("--quantity <n>", "Quantity", "1")
  .option("--confirm", "Actually place the order (without this, shows estimate only)")
  .action(
    async (opts: {
      variant: string;
      file: string;
      quantity: string;
      confirm?: boolean;
    }) => {
      try {
        const variantId = parseInt(opts.variant, 10);
        if (isNaN(variantId)) {
          fail("Invalid variant ID");
        }

        const quantity = parseInt(opts.quantity, 10);
        if (isNaN(quantity) || quantity < 1) {
          fail("Quantity must be a positive integer");
        }

        const address = getShippingAddress();

        // Upload design file
        const file = await uploadFile(opts.file);

        const body = {
          recipient: address,
          items: [
            {
              variant_id: variantId,
              quantity,
              files: [{ type: "default", url: file.url }],
            },
          ],
        };

        if (!opts.confirm) {
          // Estimate only
          const res = (await printfulFetch(
            "POST",
            "/orders/estimate",
            body
          )) as { code: number; result: OrderResult };

          const costs = res.result.costs;
          ok({
            mode: "estimate",
            costs: {
              currency: costs.currency,
              subtotal: costs.subtotal,
              shipping: costs.shipping,
              tax: costs.tax,
              total: costs.total,
            },
            file: {
              id: file.id,
              url: file.url,
              preview_url: file.preview_url,
            },
            variant_id: variantId,
            quantity,
            message: "Add --confirm to place this order",
          });
        } else {
          // Place real order
          const res = (await printfulFetch("POST", "/orders", body)) as {
            code: number;
            result: OrderResult;
          };

          const order = res.result;
          ok({
            mode: "confirmed",
            order_id: order.id,
            status: order.status,
            items: order.items.map((i) => ({
              id: i.id,
              variant_id: i.variant_id,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            costs: {
              currency: order.costs.currency,
              subtotal: order.costs.subtotal,
              shipping: order.costs.shipping,
              tax: order.costs.tax,
              total: order.costs.total,
            },
            shipping_service: order.shipping_service_name,
            created: order.created,
          });
        }
      } catch (e: unknown) {
        fail((e as Error).message);
      }
    }
  );

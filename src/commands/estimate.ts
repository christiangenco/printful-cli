import { Command } from "commander";
import { printfulFetch } from "../api.js";
import { getShippingAddress } from "../config.js";
import { ok, fail } from "../output.js";
import { uploadFile } from "./files.js";

interface OrderEstimateResult {
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

export const estimateCommand = new Command("estimate")
  .description("Get price + shipping estimate for an order")
  .requiredOption("--variant <id>", "Catalog variant ID")
  .requiredOption("--file <path>", "Path to design file (PNG, JPG, SVG)")
  .option("--quantity <n>", "Quantity", "1")
  .action(
    async (opts: { variant: string; file: string; quantity: string }) => {
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

        const res = (await printfulFetch(
          "POST",
          "/orders/estimate",
          body
        )) as { code: number; result: OrderEstimateResult };

        const costs = res.result.costs;
        ok({
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
        });
      } catch (e: unknown) {
        fail((e as Error).message);
      }
    }
  );

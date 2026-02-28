import { Command } from "commander";
import { printfulFetch } from "../api.js";
import { ok, fail } from "../output.js";

interface CatalogProduct {
  id: number;
  name: string;
  type: string;
  brand: string | null;
  model: string;
  variant_count: number;
  is_discontinued: boolean;
  sizes: string[];
  colors: { name: string; value: string }[];
}

interface CatalogVariant {
  id: number;
  catalog_product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
}

interface VariantPrice {
  id: number;
  techniques: { technique_key: string; technique_display_name: string; price: string; discounted_price: string }[];
}

interface PagingInfo {
  total: number;
  limit: number;
  offset: number;
}

export const catalogCommand = new Command("catalog")
  .description("Browse the Printful product catalog");

catalogCommand
  .command("search <query>")
  .description("Search catalog products")
  .option("--limit <n>", "Max results", "20")
  .action(async (query: string, opts: { limit: string }) => {
    try {
      const limit = parseInt(opts.limit, 10);
      const params = new URLSearchParams({ search: query, limit: String(limit) });
      const res = (await printfulFetch("GET", `/v2/catalog-products?${params}`, undefined, { skipStoreId: true })) as {
        data: CatalogProduct[];
        paging: PagingInfo;
      };

      const products = res.data.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        brand: p.brand,
        model: p.model,
        variant_count: p.variant_count,
        colors_count: p.colors.length,
        sizes_count: p.sizes.length,
        is_discontinued: p.is_discontinued,
      }));

      ok({ products, total: res.paging.total });
    } catch (e: unknown) {
      fail((e as Error).message);
    }
  });

catalogCommand
  .command("variants <product_id>")
  .description("List variants for a catalog product")
  .option("--color <color>", "Filter by color (case-insensitive substring)")
  .option("--size <size>", "Filter by size (case-insensitive substring)")
  .action(async (productId: string, opts: { color?: string; size?: string }) => {
    try {
      // Fetch all variants (paginated)
      let allVariants: CatalogVariant[] = [];
      let offset = 0;
      const pageSize = 100;

      while (true) {
        const params = new URLSearchParams({ limit: String(pageSize), offset: String(offset) });
        const res = (await printfulFetch(
          "GET",
          `/v2/catalog-products/${productId}/catalog-variants?${params}`,
          undefined,
          { skipStoreId: true }
        )) as { data: CatalogVariant[]; paging: PagingInfo };

        allVariants = allVariants.concat(res.data);
        if (allVariants.length >= res.paging.total || res.data.length < pageSize) break;
        offset += pageSize;
      }

      // Apply filters
      let filtered = allVariants;
      if (opts.color) {
        const colorFilter = opts.color.toLowerCase();
        filtered = filtered.filter((v) => v.color.toLowerCase().includes(colorFilter));
      }
      if (opts.size) {
        const sizeFilter = opts.size.toLowerCase();
        filtered = filtered.filter((v) => v.size.toLowerCase().includes(sizeFilter));
      }

      // Fetch prices (paginated)
      const priceMap = new Map<number, string>();
      let priceOffset = 0;
      const pricePageSize = 100;

      while (true) {
        const priceParams = new URLSearchParams({ limit: String(pricePageSize), offset: String(priceOffset) });
        const pricesRes = (await printfulFetch(
          "GET",
          `/v2/catalog-products/${productId}/prices?${priceParams}`,
          undefined,
          { skipStoreId: true }
        )) as { data: { currency: string; variants: VariantPrice[] }; paging: PagingInfo };

        for (const vp of pricesRes.data.variants) {
          const dtg = vp.techniques.find((t) => t.technique_key === "dtg");
          const tech = dtg || vp.techniques[0];
          if (tech) priceMap.set(vp.id, tech.discounted_price || tech.price);
        }

        if (priceOffset + pricesRes.data.variants.length >= pricesRes.paging.total || pricesRes.data.variants.length < pricePageSize) break;
        priceOffset += pricePageSize;
      }

      const variants = filtered.map((v) => ({
        id: v.id,
        name: v.name,
        color: v.color,
        color_code: v.color_code,
        size: v.size,
        price: priceMap.get(v.id) || null,
      }));

      ok({ variants, total: allVariants.length, filtered: variants.length });
    } catch (e: unknown) {
      fail((e as Error).message);
    }
  });

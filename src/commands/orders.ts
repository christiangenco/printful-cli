import { Command } from "commander";
import { printfulFetch } from "../api.js";
import { ok, fail } from "../output.js";

interface OrderSummary {
  id: number;
  external_id: string | null;
  status: string;
  created: number;
  updated: number;
  costs: {
    currency: string;
    total: string;
  };
}

interface OrderDetail {
  id: number;
  external_id: string | null;
  status: string;
  shipping: string;
  shipping_service_name: string;
  created: number;
  updated: number;
  items: {
    id: number;
    variant_id: number;
    quantity: number;
    name: string;
    price: string;
  }[];
  costs: {
    currency: string;
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
  };
  shipments: {
    id: number;
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    ship_date: string;
    shipped_at: number;
    reshipment: boolean;
    items: { item_id: number; quantity: number }[];
  }[];
}

export const ordersCommand = new Command("orders")
  .description("List orders or check order status");

ordersCommand
  .command("list")
  .description("List recent orders")
  .option("--limit <n>", "Max results", "20")
  .option("--status <status>", "Filter by status (draft, pending, failed, canceled, inprocess, onhold, partial, fulfilled)")
  .action(async (opts: { limit: string; status?: string }) => {
    try {
      const params = new URLSearchParams({ limit: opts.limit });
      if (opts.status) params.set("status", opts.status);

      const res = (await printfulFetch("GET", `/orders?${params}`)) as {
        code: number;
        result: OrderSummary[];
        paging: { total: number };
      };

      const orders = res.result.map((o) => ({
        id: o.id,
        status: o.status,
        total: o.costs.total,
        currency: o.costs.currency,
        created: new Date(o.created * 1000).toISOString(),
      }));

      ok({ orders, total: res.paging.total });
    } catch (e: unknown) {
      fail((e as Error).message);
    }
  });

ordersCommand
  .command("status <order_id>")
  .description("Get detailed order status")
  .action(async (orderId: string) => {
    try {
      const res = (await printfulFetch("GET", `/orders/${orderId}`)) as {
        code: number;
        result: OrderDetail;
      };

      const o = res.result;
      ok({
        id: o.id,
        status: o.status,
        shipping_service: o.shipping_service_name,
        items: o.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        costs: o.costs,
        shipments: o.shipments.map((s) => ({
          carrier: s.carrier,
          tracking_number: s.tracking_number,
          tracking_url: s.tracking_url,
          ship_date: s.ship_date,
        })),
        created: new Date(o.created * 1000).toISOString(),
        updated: new Date(o.updated * 1000).toISOString(),
      });
    } catch (e: unknown) {
      fail((e as Error).message);
    }
  });

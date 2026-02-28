import { Command } from "commander";
import { catalogCommand } from "./commands/catalog.js";
import { estimateCommand } from "./commands/estimate.js";
import { orderCommand } from "./commands/order.js";
import { ordersCommand } from "./commands/orders.js";

const program = new Command();

program
  .name("printful-cli")
  .description("Order custom print-on-demand products via Printful API")
  .version("0.1.0");

program.addCommand(catalogCommand);
program.addCommand(estimateCommand);
program.addCommand(orderCommand);
program.addCommand(ordersCommand);

program.parse();

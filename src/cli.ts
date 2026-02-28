import { Command } from "commander";
import { catalogCommand } from "./commands/catalog.js";

const program = new Command();

program
  .name("printful-cli")
  .description("Order custom print-on-demand products via Printful API")
  .version("0.1.0");

program.addCommand(catalogCommand);

program.parse();

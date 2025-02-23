import Command from ".";
import Config from "../Config";
import { scanDirectory } from "../Utils/scannerUtils";
import Logger from "../Logger";
import { basename } from "discord.js";

const args = process.argv.slice(2);

export default class CommandScanner {
  config: Config;
  commands: Command[] = [];
  logger = new Logger("CommandScanner");

  constructor(config: Config) {
    this.config = config;
  }

  importCommands(extensionFilters = ["js", "ts"]) {
    const files = scanDirectory(this.config.settings.commandPath, {
      ignoreFilters: this.config.settings.ignoredCommandDirs,
      extensionFilters
    });
    this.commands = files
      .map((file) => {
        try {
          const command = new (require(file).default)() as Command;
          if (!command.id) return;
          command.path = file;
          return command;
        } catch (error) {
          this.logger.error(
            `Error loading ${basename(file)}`.red,
            args.includes("--errdetails")
              ? error
              : "--errdetails to get detailed error".gray
          );
          this.logger.info("Skipping...".magenta);
        }
      })
      .filter((v) => v) as Command[];
    return this.commands;
  }
}

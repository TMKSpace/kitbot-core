import fs from "fs";
import path from "path";
import { normalizeFilepath } from "./reusedUtils";

export default class CoreConfig<ConfigType = any> {
  moduleName: string;
  configFolder: string;
  private initialData: ConfigType;
  private configData: ConfigType;

  constructor(moduleName: string, initialData: ConfigType) {
    this.moduleName = moduleName;
    this.configFolder = normalizeFilepath(moduleName);
    this.initialData = initialData;
    this.configData = initialData;

    this.readConfig() ?? this.writeConfig(initialData);
  }

  get config() {
    return this.configData;
  }

  readConfig(): ConfigType | undefined {
    const cfg = path.join(this.getCfgDir(), "index.json");
    try {
      this.configData = JSON.parse(fs.readFileSync(cfg, { encoding: "utf-8" }));
      return this.configData;
    } catch {
      return;
    }
  }

  writeConfig(data: ConfigType): ConfigType {
    const dir = this.getCfgDir();
    const cfg = path.join(dir, "index.json");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(cfg, JSON.stringify(data));
    this.configData = this.initialData;
    return data;
  }

  deleteConfig() {
    const cfg = this.getCfgDir();
    if (!fs.existsSync(cfg)) return false;
    fs.rmSync(cfg, { force: true });
    return true;
  }

  private getCfgDir = () =>
    path.join(process.cwd(), "configs/core", this.configFolder);
}

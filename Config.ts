export default class Config {
  bot = {
    token: "PlaceYourTokenHere",
    prefix: "'",
    devGuildId: "",
    ownerId: ["YourUserId"],
    intents: [3276799]
  };
  settings = {
    autoDeploy: true,
    commandPath: "commands",
    ignoredCommandDirs: [".lib", ".i", "libs"]
  };
}

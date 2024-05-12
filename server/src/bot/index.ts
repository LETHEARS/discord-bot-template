import { Client, GatewayIntentBits } from "discord.js";
import * as config from "../../config.json";

const client = new Client({ intents: Object.values(GatewayIntentBits) as [] });

client.login(config.bot.token);

if (client.isReady()) {
    console.log("bot başladı");
}

export default client;
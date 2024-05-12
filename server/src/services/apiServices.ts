import axios from "axios";

import * as config from "../../config.json";

const getUserInfo = async (token: string) => {
    return await axios("https://discord.com/api/users/@me", {
        headers: { authorization: token },
    });
};

const getAccessToken = async (code: string) => {
    return await axios({
        method: "post",
        url: "https://discord.com/api/oauth2/token",
        data: {
            client_id: config.bot.clientId,
            client_secret: config.bot.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: config.bot.redirectUri,
            code,
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

const getUserGuilds = async (token: string) => {
    return await axios("https://discord.com/api/users/@me/guilds", {
        headers: { authorization: token },
    });
};

const getBotGuilds = async () => {
    return axios("https://discord.com/api/users/@me/guilds", {
        headers: { authorization: `Bot ${config.bot.token}` },
    });
};

export { getUserGuilds, getAccessToken, getUserInfo, getBotGuilds };

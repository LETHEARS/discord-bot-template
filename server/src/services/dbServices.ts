import { Client } from "discord.js";

import guilds from "../database/models/guilds";

const checkGuild = async (guild_id: string) => {
    const guild = await guilds.findOne({ guild_id });

    if (!guild) return null;

    return guild;
};

const createGuild = (guild_id: string) => {
    return guilds.create({ guild_id });
};

const changeState = async (guild_id: string, value: any, bool: any, client: Client) => {
    return await guilds.findOneAndUpdate({ guild_id }, { $set: { [value]: bool } }, { new: true });
};

const updateStates = (guild_id: string, params: any) => {
    const type = params.type;
    delete params.type;
    const editedObj = Object.entries(params).map(([key, value]) => ({ [`${type}.${key}`]: value }));
    const obj = {};
    editedObj.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        obj[key] = value;
    });
    return guilds.findOneAndUpdate({ guild_id }, { $set: obj }, { new: true }).catch(console.log);
};

export {
    checkGuild,
    createGuild,
    changeState,
    updateStates,
};
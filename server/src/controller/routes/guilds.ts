import { getUserGuilds, getBotGuilds } from "../../services/apiServices";
import { checkGuild, createGuild } from "../../services/dbServices";

import type { Client } from "discord.js";
import type { Response, Request } from "express";

const ADMIN_PERMISSION_NUMBER = 2147483647;

interface UserGuild {
    id: string;
    name: string;
    icon: string;
    permissions: number;
    owner: boolean;
}

interface BotGuild {
    id: string;
    name: string;
    icon: string;
}

const responseWithError = (
    res: Response,
    statusCode: number,
    message: string
) => {
    res.status(statusCode).json({ success: false, message });
};

const guilds_get =
    ({ client }: { client: Client }) =>
        async (req: Request, res: Response) => {
            try {
                const authorizationHeader = req.headers.authorization;

                if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
                    return responseWithError(res, 506, "Authorization header is not valid");
                }

                const accessToken = authorizationHeader.split("Bearer ")[1];

                if (!accessToken) {
                    return responseWithError(res, 506, "Access token is not found");
                }

                const response = await getUserGuilds(`Bearer ${accessToken}`).catch(
                    (e) => e
                );

                if (!response?.status)
                    return res
                        .status(response.response?.status ?? 500)
                        .json({ success: false, ...response.response.data });

                const userAdminGuilds = response.data
                    .filter(
                        (userGuild: UserGuild) =>
                            userGuild.permissions == ADMIN_PERMISSION_NUMBER
                    )
                    .map((userGuild: UserGuild) => ({
                        id: userGuild.id,
                        name: userGuild.name,
                        icon: userGuild.icon,
                        owner: userGuild.owner,
                    }));

                const botGuildResponse = await getBotGuilds();

                const botGuilds = botGuildResponse.data.map((botGuild: BotGuild) => ({
                    id: botGuild.id,
                    name: botGuild.name,
                    icon: botGuild.icon,
                }));

                const added = userAdminGuilds.filter((guild: UserGuild) => {
                    return botGuilds.some((botGuild: BotGuild) => guild.id == botGuild.id);
                });

                const notAdded = userAdminGuilds.filter((guild: UserGuild) => {
                    return !added.some((botGuild: BotGuild) => guild.id == botGuild.id);
                });

                if (!added.length)
                    return res.status(200).send({ success: true, added, notAdded });

                for (const index in added) {
                    const userGuild = added[index];

                    const guild = (await checkGuild(userGuild.id))?.toObject({
                        virtuals: true,
                    });

                    const currGuild = await client.guilds.fetch(userGuild.id);

                    userGuild.roles = currGuild.roles.cache
                        .filter((role) => role.name != "@everyone" && !role.managed)
                        ?.map((role) => ({
                            id: role.id,
                            name: role.name,
                            position: role.rawPosition,
                        }));

                    userGuild.botRolePosition = currGuild.roles.cache.find(
                        (role: { tags: any; managed: any }) =>
                            role.managed && role.tags.botId == client.user?.id
                    )?.rawPosition;

                    userGuild.channels = currGuild.channels.cache?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        type: channel.type,
                    }));

                    userGuild.members = currGuild.members.cache.map((member) => ({
                        id: member.id,
                        name: member.user.globalName,
                        avatar: member.user.displayAvatarURL(),
                    }));

                    userGuild.stats = {
                        memberCount: currGuild.memberCount,
                        roleCount: currGuild.roles.cache.size,
                        channelCount: currGuild.channels.cache.size,
                    };

                    if (!guild) {
                        const currentGuild = await createGuild(userGuild.id);
                        userGuild.states = currentGuild;
                    } else {
                        userGuild.states = guild;
                    }
                }

                res.status(response.status).json({ success: true, added, notAdded });
            } catch { }
        };

export { guilds_get };

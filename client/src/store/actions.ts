import { getReq, postReq } from "../utils/axiosReqs";

type UserData = {
    access_token?: string;
};

const ActionTypes = {
    SAVE_GUILD_STATE: "SAVE_GUILD_STATE",
};

export default {
    async initUser() {
        const userData: UserData = JSON.parse(
            localStorage.getItem("user_data") ?? "{}"
        );

        if (!userData.access_token) {
            return;
        }

        (this as any).isLoading = true;

        const getUser = async () => {
            return await getReq("/user");
        };

        try {
            const response = await this.makeRequest(getUser);
            if (response.data.success) {
                (this as any)._isLogin = true;
                (this as any).getters._getUser = response.data;
            }
        } finally {
        }
    },

    async initGuild() {
        const userData: UserData = JSON.parse(
            localStorage.getItem("user_data") ?? "{}"
        );

        if (!userData.access_token) {
            return false;
        }

        const getGuilds = async () => {
            return await getReq("/guilds");
        };

        const response = await this.makeRequest(getGuilds);
        if (response.data.success) {
            (this as any).getters._getGuilds = response.data;
        }

        return response;
    },

    async dispatch(
        actionType: keyof typeof ActionTypes,
        { guild_id, data }: { guild_id?: string; data: object }
    ) {
        switch (actionType) {
            case ActionTypes.SAVE_GUILD_STATE:
                return await postReq(`/guilds/${guild_id}`, data);
            default:
                throw new Error(`Unknown action type: ${actionType as string}`);
        }
    },

    async makeRequest(this: any, requestFunc: () => Promise<any>) {
        try {
            const response = await requestFunc();
            return response;
        } catch (err: any) {
            await this.handleRateLimit(err, () => this.makeRequest(requestFunc));
            if (err?.response?.status === 401) {
                this.handleUnauthorized();
            }
            throw err;
        }
    },

    handleRateLimit(err: any, retryCallback: () => Promise<any>) {
        if (err?.response?.data?.message === "You are being rate limited.") {
            const retryAfter = err.response.data.retry_after || 1;
            setTimeout(retryCallback, retryAfter * 1300);
        }
    },

    handleUnauthorized() {
        if (!window.location.pathname.includes("/logout"))
            location.href = "/logout";
    },
};

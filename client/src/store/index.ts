import actions from "./actions";
import { defineStore } from "pinia";

interface Guild {
    id: string,
    icon: string,
    name: string,
    owner: string
}

export interface Store {
    _isLogin: boolean;
    _isLoading: boolean;
    _isProgress: number;
    getters: {
        _getUser: any;
        _getGuilds: { added: [Guild] | null; notAdded: [Guild] | null };
    };
}

export default defineStore("store", {
    state: (): Store => ({
        _isLogin: false,
        _isProgress: 0,
        _isLoading: true,
        getters: {
            _getUser: null,
            _getGuilds: { added: null, notAdded: null },
        },
    }),

    getters: {},
    actions,
});

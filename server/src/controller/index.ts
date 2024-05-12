import { type Router } from "express";

import client from "../bot";

import { state_get, state_post } from "./routes/states";
import { guilds_get } from "./routes/guilds";
import { callback_get, userInfo_get } from "./routes/user";

export default (router: Router) => {
    router.get("/user", userInfo_get);
    router.get("/callback", callback_get);

    router.get("/guilds", guilds_get({ client }));

    router.post("/guilds/:id", state_post({ client }));
    router.get("/guilds/:id/state", state_get({ client }));

    router.get("*", (req, res) =>
        res.status(404).json({ success: false, message: "API endpoint not found" })
    );
};

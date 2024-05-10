import { Client } from "discord.js";
import { Response, Request } from "express";
import { updateStates, changeState } from "../../services/dbServices";

const STATES = [""];

interface StateGetRequest extends Request {
    query: {
        state: string;
        value: string;
    };
    params: {
        id: string;
    };
}

interface StatePostRequest extends Request {
    params: {
        id: string;
    };
    body: {
        type: string;
        [key: string]: any;
    };
}

const state_get =
    ({ client }: { client: Client }) =>
        async (req: StateGetRequest, res: Response) => {
            const { state, value } = req.query;
            const { id } = req.params;

            if (!id || !state || !value) {
                return res.status(400).json({
                    success: false,
                    message: "Required parameters or query missing",
                });
            }

            if (!STATES.includes(state)) {
                return res.status(400).json({ success: false, message: "Invalid state" });
            }

            if (!["true", "false"].includes(value)) {
                return res.status(400).json({ success: false, message: "Invalid value" });
            }

            try {
                const updatedState = await changeState(
                    id,
                    state,
                    value === "true",
                    client
                );

                if (updatedState) {
                    return res.status(200).json({ success: true, updatedState });
                } else {
                    return res
                        .status(400)
                        .json({ success: false, message: "Invalid Guild Id" });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Error changing state",
                    error: error.toString(),
                });
            }
        };

const state_post =
    ({ client }: { client: Client }) =>
        async (req: StatePostRequest, res: Response) => {
            const { id } = req.params;
            const { type, ...rest } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Guild ID is required",
                });
            }

            try {
                await updateStates(id, req.body);
                return res.status(200).json({ success: true });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Error updating states",
                    error: error.toString(),
                });
            }
        };

export { state_get, state_post };

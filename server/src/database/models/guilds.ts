import { Schema, model } from "mongoose";

interface GuildsTypes {
    guild_id: string;
    essantials: {
        welcome: {
            isActive: boolean;
            channel_id: string;
        };
    };
}

const guildsSchema = new Schema<GuildsTypes>({
    guild_id: { type: String, default: null, required: true },
    essantials: {
        type: {
            welcome: {
                type: {
                    isActive: { type: Boolean, default: false, required: true },
                    channel_id: { type: String, default: "select", required: true },
                },
                default: {},
                required: true,
            },
        },
        default: {},
        required: true,
    },
});

export { GuildsTypes };
export default model("Guilds", guildsSchema);

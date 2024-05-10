import { Schema, model } from "mongoose";

interface UserAuthTypes {
    email: string;
    user_id: string;
    access_token: string;
    refresh_token: string;
}

const userAuthSchema = new Schema<UserAuthTypes>({
    email: String,
    access_token: String,
    refresh_token: String,
    user_id: String,
});

export { UserAuthTypes };
export default model("UserAuth", userAuthSchema);

import UserAuth from "../../database/models/userAuth";
import { getAccessToken, getUserInfo } from "../../services/apiServices";
import type { Response, Request } from "express";

interface QueryParams {
    code?: string;
}

interface UserInfo {
    id: string;
    email: string;
}

const responseWithError = (
    res: Response,
    statusCode: number,
    message: string
) => {
    res.status(statusCode).json({ success: false, message });
};

const callback_get = async (req: Request, res: Response) => {
    const { code } = req.query as QueryParams;

    if (!code) {
        return responseWithError(res, 506, "Code is not found");
    }

    const accessTokenResponse = await getAccessToken(code).catch((err) => {
        console.error("Error getting access token:", err);
        return null;
    });

    if (!accessTokenResponse || !accessTokenResponse.data?.access_token) {
        return responseWithError(res, 500, "Internal server error");
    }

    const accessToken = accessTokenResponse.data.access_token;
    const refreshToken = accessTokenResponse.data.refresh_token;

    const userInfoResponse = await getUserInfo(`Bearer ${accessToken}`).catch(
        (err) => {
            console.error("Error getting user info:", err);
            return null;
        }
    );

    if (!userInfoResponse || !userInfoResponse.status) {
        return responseWithError(res, 500, "Unauthorized");
    }

    const userInfo = userInfoResponse.data as UserInfo;

    await UserAuth.updateOne(
        { user_id: userInfo.id },
        {
            $set: {
                access_token: accessToken,
                refresh_token: refreshToken,
                email: userInfo.email,
            },
        },
        { upsert: true }
    ).catch((err) => {
        console.error("Error updating UserAuth:", err);
    });

    res
        .status(200)
        .json({ success: true, access_token: accessToken, ...userInfo });
};

const userInfo_get = async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return responseWithError(res, 506, "Authorization header is not valid");
    }

    const accessToken = authorizationHeader.split("Bearer ")[1];

    if (!accessToken) {
        return responseWithError(res, 506, "Access token is not found");
    }

    const userInfoResponse = await getUserInfo(`Bearer ${accessToken}`).catch(
        (err) => {
            console.error("Error getting user info:", err);
            return null;
        }
    );

    if (!userInfoResponse || !userInfoResponse.status) {
        return responseWithError(res, 500, "Unauthorized");
    }

    const userInfo = userInfoResponse.data as UserInfo;

    res.status(200).json({ success: true, ...userInfo });
};

export { callback_get, userInfo_get };

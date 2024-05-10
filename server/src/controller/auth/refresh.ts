import jwt from "jsonwebtoken";

/**
 * Secret key used for generating refresh tokens.
 */
const secretKey = "refresh_token_secret";

function generateRefreshToken(user: object) {
    const refreshToken = jwt.sign(user, secretKey);

    return refreshToken;
}

function verifyRefreshToken(token: string) {
    try {
        const decoded = jwt.verify(token, secretKey);

        return decoded;
    } catch (error) {
        return false;
    }
}

// Export the generateRefreshToken function
export { generateRefreshToken, verifyRefreshToken };

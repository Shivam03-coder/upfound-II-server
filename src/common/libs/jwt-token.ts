import { Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { envs } from "../configs/envs.config";
import { SessionUser } from "../types/global.types";
import { db } from "@src/core/database";
import { AuthError } from "../utils/error.utils";
import { getCookieOptions } from "../utils/cookie.util";

class TokenService {
  private static accessSecret = envs.ACCESS_TOKEN_SECRET || "access-secret-key";
  private static refreshSecret =
    envs.REFRESH_TOKEN_SECRET || "refresh-secret-key";

  public static generateTokens(payload: SessionUser) {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async decodeToken(res: Response, refreshToken: string) {
    const decoded = jwt.verify(refreshToken, this.refreshSecret) as {
      id: string;
      role: string;
    };

    if (!decoded || !decoded.id || !decoded.role) {
      throw new JsonWebTokenError(
        "Invalid token payload. Please log in again."
      );
    }
    const isUser = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!isUser) {
      throw new AuthError(
        "User not found. The token might be invalid or expired."
      );
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      this.accessSecret,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("accessToken", newAccessToken, getCookieOptions(1));
  }
}

export default TokenService;

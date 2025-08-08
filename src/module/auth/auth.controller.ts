import { Request, Response } from "express";
import AuthServices from "./auth.service";
import { UserAuthData } from "./auth.dto.types";
import { ApiResponse, AsyncHandler } from "@src/common/utils/api.utils";
import { db } from "@src/core/database";
import TokenService from "@src/common/libs/jwt-token";
import { getCookieOptions } from "@src/common/utils/cookie.util";
import { AuthError } from "@src/common/utils/error.utils";

export class AuthController {
  public static oAuthLoginHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { role, token } = req.body as UserAuthData;

      if (!token) throw new AuthError("ID token is missing.");

      const { email, name, picture } = await AuthServices.firebaseAuthLogin(
        token
      );

      const isUserExist = await db.user.findUnique({ where: { email } });

      if (isUserExist) {
        throw new AuthError("User already exists");
      }

      const dbUser = await db.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            role,
          },
        });

        if (role === "JOBSEEKER") {
          await tx.jobSeeker.create({
            data: {
              userId: newUser.id,
              name,
              profilePicture: picture,
            },
          });
        }
        return newUser;
      });

      const { accessToken, refreshToken } = TokenService.generateTokens({
        id: dbUser.id,
        role: dbUser.role!,
      });

      res.cookie("accessToken", accessToken, getCookieOptions(1));
      res.cookie("refreshToken", refreshToken, getCookieOptions(7));

      res.status(200).json(
        new ApiResponse("User created successfully", {
          id: dbUser.id,
          role: dbUser.role,
        })
      );
    }
  );

  public static refreshTokenHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AuthError("Refresh token is missing. Please log in again.");
      }

      await TokenService.decodeToken(res, refreshToken);

      res
        .status(200)
        .json(new ApiResponse("Access token refreshed successfully"));
    }
  );

  public static userInfoHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user;
      if (!user) {
        throw new AuthError("Unauthorized access. User info not found.");
      }

      // Fetch complete user info based on role
      let userInfo;
      if (user.role === "JOBSEEKER") {
        userInfo = await db.jobSeeker.findUnique({
          where: { userId: user.id },
          select: {
            name: true,
            profilePicture: true,
          },
        });
      }

      res.status(200).json(
        new ApiResponse("User information fetched successfully", {
          id: user.id,
          role: user.role,
          ...userInfo,
        })
      );
    }
  );

  public static signOutHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json(new ApiResponse("Sign out successful"));
    }
  );

  public static getTestTokens = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, name, status } = req.body;

      const user = await db.user.create({
        data: {
          email,
          role: "JOBSEEKER",
        },
      });

      const { accessToken, refreshToken } = TokenService.generateTokens({
        id: user.id,
        role: user.role!,
      });

      res.cookie("accessToken", accessToken, getCookieOptions(1));
      res.cookie("refreshToken", refreshToken, getCookieOptions(7));

      res.status(200).json(
        new ApiResponse("Test tokens generated successfully", {
          accessToken,
          refreshToken,
          userId: user.id,
        })
      );
    }
  );
}

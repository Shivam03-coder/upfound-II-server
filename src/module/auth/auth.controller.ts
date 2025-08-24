import { Request, Response } from "express";
import AuthServices from "./auth.service";
import { UserAuthData } from "./auth.dto.";
import { ApiResponse, AsyncHandler } from "@src/common/utils/api.utils";
import { db } from "@src/core/database";
import TokenService from "@src/common/libs/jwt-token";
import { getCookieOptions } from "@src/common/utils/cookie.util";
import { AuthError, ValidationError } from "@src/common/utils/error.utils";

export class AuthController {
  public static oAuthLoginHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { role, token } = req.body as UserAuthData;
      if (!token) throw new AuthError("ID token is missing.");

      const { email, name, picture } = await AuthServices.firebaseAuthLogin(
        token
      );

      const existingUser = await db.profile.findUnique({ where: { email } });
      let createdUser;

      if (!existingUser) {
        createdUser = await db.user.create({
          data: {
            role,
            profile: {
              create: {
                email,
                name,
                profilePicture: picture,
              },
            },
            authProvider: "GOOGLE",
          },
        });
      }

      if (!createdUser) {
        throw new ValidationError("User account creation failed");
      }

      const { accessToken, refreshToken } = TokenService.generateTokens({
        id: createdUser.id,
        role: createdUser.role!,
      });

      res.cookie("accessToken", accessToken, getCookieOptions(1));
      res.cookie("refreshToken", refreshToken, getCookieOptions(7));
      res.status(200).json(
        new ApiResponse("User logged in successfully", {
          accessToken,
          role: createdUser.role,
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

      res.status(200).json(
        new ApiResponse("User information fetched successfully", {
          id: user.id,
          role: user.role,
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

      const userProfile = await db.profile.findUnique({
        where: { email },
        select: {
          user: {
            select: {
              role: true,
              id: true,
            },
          },
        },
      });

      if (!userProfile) {
        await db.user.create({
          data: {
            role: "JOBSEEKER",
            profile: {
              create: {
                name,
                email,
              },
            },
            jobSeekerProfile: {
              create: {
                status: status,
              },
            },
          },
        });
      }

      const { accessToken, refreshToken } = TokenService.generateTokens({
        id: userProfile?.user.id!,
        role: userProfile?.user.role!,
      });

      res.cookie("accessToken", accessToken, getCookieOptions(1));
      res.cookie("refreshToken", refreshToken, getCookieOptions(7));

      res.status(200).json(
        new ApiResponse("Test tokens generated successfully", {
          accessToken,
          refreshToken,
          userId: userProfile?.user.id,
        })
      );
    }
  );
}

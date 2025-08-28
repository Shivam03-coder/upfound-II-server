import { Request, Response } from "express";
import AuthServices from "./auth.service";
import { UserAuthData } from "./auth.dto.";
import { ApiResponse, AsyncHandler } from "@src/common/utils/api.utils";
import { db } from "@src/core/database";
import TokenService from "@src/common/libs/jwt-token";
import { getCookieOptions } from "@src/common/utils/cookie.util";
import {
  AuthError,
  DatabaseError,
  ValidationError,
} from "@src/common/utils/error.utils";

export class AuthController {
  public static oAuthLoginHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { role, token } = req.body as UserAuthData;
      if (!token) throw new AuthError("ID token is missing");
      if (!role) throw new ValidationError("User role is required");

      let email: string, name: string, picture: string;
      try {
        ({ email, name, picture } = await AuthServices.firebaseAuthLogin(
          token
        ));
      } catch (err) {
        throw new AuthError("Invalid or expired Google token", err);
      }

      const existingUser = await db.profile.findUnique({
        where: { email },
        include: { user: true },
      });

      let createdUser;

      if (!existingUser) {
        try {
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
            select: {
              id: true,
              role: true,
              profile: {
                select: {
                  name: true,
                  email: true,
                  profilePicture: true,
                },
              },
            },
          });
        } catch (err) {
          throw new DatabaseError("User account creation failed", err);
        }
      } else {
        createdUser = {
          id: existingUser.user.id,
          role: existingUser.user.role,
          profile: {
            name: existingUser.name,
            email: existingUser.email,
            profilePicture: existingUser.profilePicture,
          },
        };
      }

      if (!createdUser) {
        throw new DatabaseError("Something went wrong while creating user");
      }

      const { accessToken, refreshToken } = TokenService.generateTokens({
        id: createdUser.id,
        role: createdUser.role!,
      });

      const syncUser = {
        userId: createdUser.id,
        name: createdUser.profile?.name,
        email: createdUser.profile?.email,
        avatar: createdUser.profile?.profilePicture,
        isVerified: true,
      };

      res.cookie("accessToken", accessToken, getCookieOptions(1));
      res.cookie("refreshToken", refreshToken, getCookieOptions(7));

      res.status(200).json(
        new ApiResponse("User logged in successfully", {
          accessToken,
          role: createdUser.role,
          syncUser,
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

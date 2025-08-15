import { UserRole } from "@prisma/client";

export interface IoauthData {
  email: string;
  name: string;
  picture: string;
}

export interface UserAuthData {
  token: string;
  role: UserRole;
}

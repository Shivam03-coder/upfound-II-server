import {
  $Enums,
  MaterialType,
  ProductCategory,
  SockSize,
  UserRole,
} from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: SessionUser;
    }
  }
}

export interface SessionUser {
  id: string;
  role: UserRole;
}

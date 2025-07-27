type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge: number;
  domain: string;
};

const DEFAULT_COOKIE_DAYS = 7;

export function getCookieOptions(days?: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: (days ?? DEFAULT_COOKIE_DAYS) * 24 * 60 * 60 * 1000,
    domain: "localhost",
  };
}

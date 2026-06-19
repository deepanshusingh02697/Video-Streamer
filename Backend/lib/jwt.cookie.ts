import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_SECRET) {
  throw new Error("Secret key not provided for generating access token ");
}

export const signAccessToken = (userId: number, email: string): string => {
  return jwt.sign({ userId, email }, ACCESS_SECRET, { expiresIn: "24h" });
};
export const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
export const setTokens = (res: any, userId: number, email: string) => {
  const accessToken = signAccessToken(userId, email);

  res.cookie("accessToken", accessToken, accessCookieOptions);
};
export const verifyaccessToken = (
  token: string,
): { userId: number; email: string } => {
  return jwt.verify(token, ACCESS_SECRET) as { userId: number; email: string };
};

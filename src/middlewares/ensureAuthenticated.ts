import { Unauthorized } from "@utils/errors";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    throw new Unauthorized();
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(
      token,
      "2d1c939c5caf4d9b315f896c31683d38"
    ) as IPayload;

    request.user_id = sub;

    return next();
  } catch (err) {
    throw new Unauthorized();
  }
}

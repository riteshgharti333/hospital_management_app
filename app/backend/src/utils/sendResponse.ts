import { Response } from "express";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

export const sendResponse = <T>(
  res: Response,
  { success, message, data, statusCode }: IApiResponse<T>
) => {
  res.status(statusCode).json({ success, message, data });
};

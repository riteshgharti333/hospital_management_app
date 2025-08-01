import { Response } from "express";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
  pagination?: {
    nextCursor?: string;
    limit?: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  { success, message, data, statusCode, pagination }: IApiResponse<T>
) => {
  const responseBody: Record<string, any> = {
    success,
    message,
    data,
  };

  if (pagination) {
    responseBody.pagination = pagination;
  }

  res.status(statusCode).json(responseBody);
};

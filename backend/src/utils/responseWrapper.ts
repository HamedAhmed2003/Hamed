import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, data: any, message: string = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
};

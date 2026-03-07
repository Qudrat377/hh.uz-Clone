import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      message =
        typeof res === "string"
          ? res
          : Array.isArray((res as any).message)
            ? (res as any).message.join(", ")
            : (res as any).message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }
}


// import { Catch, ArgumentsHost, HttpException, ExceptionFilter} from "@nestjs/common"
// import {Response} from "express"

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {

//     catch(exception: any, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();
//         const status = exception instanceof HttpException ? exception.getStatus() : 500;
//         const message = exception.message || "Internal server error";

//         response.status(status).json({
//             statusCode: status,
//             message: message || "Internal server error",
//             error: exception.name || "UnknownError",
//             stack: exception.stack || "UnknowError",
//             timeStamp: new Date().toISOString(),
//         });
//     }
// }
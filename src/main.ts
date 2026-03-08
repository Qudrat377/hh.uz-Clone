import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import { HttpExceptionFilter } from "./common/filter/all-exception.filter";
import { ValidationPipe } from "@nestjs/common";
// import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"; //logger
import { LoggerService } from "./module/logger/logger.service"; //logger

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    const PORT = process.env.PORT || 3000;

    // swagger
    const config = new DocumentBuilder()
      .setTitle("HH.uz")
      .setDescription("HH.uz documentation")
      .setVersion("1.0.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          name: "JWT",
          bearerFormat: "JWT",
          description: "JWT token from bearer",
          in: "header",
        },
        "JWT-auth",
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    app.use("/uploads", express.static("uploads"));

    // NestJS ichki loggerini Winston bilan almashtiramiz //logger
    // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); //logger
    // Biz yaratgan LoggerService-ni asosiy logger sifatida o'rnatamiz

    // const customLogger = app.get(LoggerService);
    // app.useLogger(customLogger);

    await app.listen(PORT, () => {
      console.log("Server is running at:", PORT);
      console.log(`Documentation link: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    return error.message;
  }
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestQueryParser } from '@nestjsx/crud-request';
import { Request } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use((req: Request, res, next) => {
  //   const qp =  RequestQueryParser.create();
  //   const qs = req.query //req.url.split('?')[1];
  //   console.log(qs);
  
  //   console.log(qp.parseQuery(qs).getParsed())
  //   next();
  // });
  app.enableCors();
  await app.listen(3000);
}

bootstrap();

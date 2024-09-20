import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  
  const port = process.env.PORT || 8082;
  app.use(cors());
  await app.listen(port, () => console.log(`Server running on port ${port}`));  
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); 
  module.exports = app; 
  const port = process.env.PORT || 8082;
  app.enableCors();
  await app.listen(port, () => console.log(`Server running on port ${port}`));  
}

bootstrap();

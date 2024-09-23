import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure } from '@codegenie/serverless-express';

//thank you so much to https://medium.com/@shoaibahmd/build-and-deploy-a-serverless-nestjs-nodejs-application-with-serverless-framework-95741ced3e70
// for providing a tutoral

let server: Handler

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.init();

    const expressHandler = app.getHttpAdapter().getInstance()

    return configure({app: expressHandler})
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
}
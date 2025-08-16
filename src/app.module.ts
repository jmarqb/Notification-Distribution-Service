import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TraceModule } from './trace/trace.module';
import { envs } from './config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: envs.mongo_cnn,
      }),
    }),
    AuthModule,
    CommonModule,
    TraceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

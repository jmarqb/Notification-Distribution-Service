import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TraceService } from './trace.service';
import { Trace, TraceSchema } from './entities/trace.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Trace.name,
        schema: TraceSchema,
      },
    ]),
  ],
  providers: [TraceService],
})
export class TraceModule {}

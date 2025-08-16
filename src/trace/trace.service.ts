import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trace } from './entities/trace.entity';
import { Model } from 'mongoose';
import { CreateTraceDto } from './dto/create-trace.dto';

@Injectable()
export class TraceService {
  private readonly logger = new Logger(TraceService.name);

  constructor(
    @InjectModel(Trace.name)
    private readonly traceModel: Model<Trace>,
  ) {}

  async create(createTraceDto: CreateTraceDto) {
    try {
      return await this.traceModel.create(createTraceDto);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

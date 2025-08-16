import { Test, TestingModule } from '@nestjs/testing';
import { TraceService } from './trace.service';
import { Model } from 'mongoose';
import { Trace } from './entities/trace.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTraceDto } from './dto/create-trace.dto';

describe('TraceService', () => {
  let traceService: TraceService;
  let traceModel: Model<Trace>;

  const mockTraceModel = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Trace.name),
          useValue: mockTraceModel,
        },
        TraceService,
      ],
    }).compile();

    traceService = module.get<TraceService>(TraceService);
    traceModel = module.get<Model<Trace>>(getModelToken('Trace'));
  });

  it('should be defined', () => {
    expect(traceService).toBeDefined();
  });

  it('should be create and return a trace', async () => {
    const dto: CreateTraceDto = {
      _id: 'c589e948-fb91-475c-9043-1b4c05bec680',
      notification: 'c589e948-fb91-475c-9043-1b4c05bec681',
      info: 'Notification processed successfully',
    };

    const traceCreated: Trace = {
      _id: dto._id,
      notification: dto.notification,
      info: dto.info,
    };

    jest.spyOn(traceModel, 'create').mockResolvedValue(traceCreated as any);

    const result = await traceService.create(dto);
    expect(traceModel.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(traceCreated);
  });

  it('should log an error if create fails', async () => {
    const error = new Error('DB error');

    jest.spyOn(traceModel, 'create').mockRejectedValue(error);
    const loggerSpy = jest.spyOn<any, any>(traceService['logger'], 'error');

    await traceService.create({} as any);

    expect(loggerSpy).toHaveBeenCalledWith(error);
  });
});

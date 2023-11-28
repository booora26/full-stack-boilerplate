import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ShiftMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('shift middleware res', res.body);
    req.body.slotDurationInHours = req.body.slotDuration / 60;
    console.log('shift middleware req', req.body);

    next();
  }
}

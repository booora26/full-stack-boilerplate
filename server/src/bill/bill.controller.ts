import { Body, Controller, Post } from '@nestjs/common';
import { BillService } from './bill.service';
import { PaymentSlip } from './payment-slip.interface';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async fillForm(@Body() paymentSlip: PaymentSlip) {
    console.log('controller', paymentSlip);
    return await this.billService.fillForm(paymentSlip);
  }
}

import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { BillService } from './bill.service';
import { PaymentSlip } from './payment-slip.interface';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @Header('x-summary', 'Fill payment slip and generate pdf')
  async fillForm(@Body() paymentSlip: PaymentSlip) {
    console.log('controller', paymentSlip);
    return await this.billService.fillForm(paymentSlip);
  }

  @Get()
  async findAll() {
    return await this.billService.findAll();
  }
}

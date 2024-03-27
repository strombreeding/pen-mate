import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getPayRecord() {}

  @Post()
  async postPayRecord(@Body() body: { data: ItemProps; at: string }) {
    const reuslt = await this.paymentService.createPayment(body.data, body.at);
    return reuslt;
  }
}
type ItemProps = {
  price: number;
  _id: string;
  cnt: number;
};

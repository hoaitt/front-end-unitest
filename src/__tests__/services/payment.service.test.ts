import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PaymentService } from '@/services/payment.service';
import { Order } from '@/models/order.model';
import { PaymentMethod } from '@/models/payment.model';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('.buildPaymentMethod', () => {
    it('should return available payment methods based on total price', () => {
      expect(paymentService.buildPaymentMethod(100000)).toEqual(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY, PaymentMethod.AUPAY].join(',')
      );
      expect(paymentService.buildPaymentMethod(200000)).toEqual(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY, PaymentMethod.AUPAY].join(',')
      );
      expect(paymentService.buildPaymentMethod(300000)).toEqual(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY, PaymentMethod.AUPAY].join(',')
      );
      expect(paymentService.buildPaymentMethod(400000)).toEqual(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY].join(',')
      );
      expect(paymentService.buildPaymentMethod(500000)).toEqual(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY].join(',')
      );
    });
  });

  describe('.payViaLink', () => {
    it('should open a new window with the payment link', () => {
      const order: Order = {
        id: 'orderId',
        totalPrice: 100,
        items: [{ id: 'id', productId: 'productId', price: 50, quantity: 2 }],
        couponId: 'valid',
        paymentMethod: PaymentMethod.CREDIT,
      };
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      paymentService.payViaLink(order);

      expect(openSpy).toHaveBeenCalledWith(
        `https://payment.example.com/pay?orderId=${order.id}`,
        '_blank'
      );
    });
  });
});

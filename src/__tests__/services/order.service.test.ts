import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrderService } from '@/services/order.service';
import { PaymentService } from '@/services/payment.service';
import { Order } from '@/models/order.model';

// Mock
describe('OrderService', () => {
  describe('.getCouponById', () => {
    let orderService: OrderService;

    beforeEach(() => {
      orderService = new OrderService({} as PaymentService);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should return coupon data', async () => {
      const couponId = 'valid';
      const couponData = { id: couponId, discount: 10 };
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(couponData),
      });

      const result = await orderService.getCouponById(couponId);
      expect(result).toEqual(couponData);
    });

    it('should throw an error if coupon is invalid', async () => {
      const couponId = 'invalid';
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(null),
      });

      await expect(orderService.getCouponById(couponId)).rejects.toThrow(
        'Invalid coupon'
      );
    });
  });

  describe('.createOrder', () => {
    let orderService: OrderService;

    beforeEach(() => {
      orderService = new OrderService({} as PaymentService);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should create an order and return the created order', async () => {
      const orderPayload = { items: [], couponId: 'valid' };
      const createdOrder = { id: 'mocked_order_id', ...orderPayload };
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(createdOrder),
      });

      const result = await orderService.createOrder(orderPayload);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('.process', () => {
    let orderService: OrderService;
    let paymentServiceMock: PaymentService;

    const orderEmpty = {
      items: [],
    };

    const orderInvalid = {
      items: [
        { id: 'id', productId: 'productId', price: -1, quantity: 1 },
        { id: 'id', productId: 'productId', price: 1, quantity: -1 },
      ],
    };

    const orderPriceTotalInvalid = {
      items: [
        { id: 'id', productId: 'productId', price: 0, quantity: 1 },
        { id: 'id', productId: 'productId', price: 1, quantity: 0 },
      ],
    };
    const orderCouponInvalid = {
      items: [{ id: 'id', productId: 'productId', price: 50, quantity: 2 }],
      couponId: 'invalid',
    };
    const orderCouponValid = {
      items: [{ id: 'id', productId: 'productId', price: 50, quantity: 2 }],
      couponId: 'valid',
    };

    beforeEach(() => {
      paymentServiceMock = {
        buildPaymentMethod: vi.fn().mockReturnValue('mocked_payment_method'),
        payViaLink: vi.fn(),
      } as unknown as PaymentService;
      orderService = new OrderService(paymentServiceMock);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should throw an error if order items are empty', async () => {
      await expect(orderService.process(orderEmpty)).rejects.toThrow(
        'Order items are required'
      );
    });

    it('should throw an error if order items are invalid', async () => {
      await expect(orderService.process(orderInvalid)).rejects.toThrow(
        'Order items are invalid'
      );
    });

    it('should throw an error if total price is less than or equal to 0', async () => {
      await expect(
        orderService.process(orderPriceTotalInvalid)
      ).rejects.toThrow('Order items are invalid');
    });

    it('should throw an error if coupon is invalid', async () => {
      vi.spyOn(orderService, 'getCouponById').mockResolvedValue(null);
      await expect(orderService.process(orderCouponInvalid)).rejects.toThrow(
        'Invalid coupon'
      );
    });

    it('should apply coupon discount correctly', async () => {
      vi.spyOn(orderService, 'getCouponById').mockResolvedValue({
        discount: 10,
      });
      vi.spyOn(orderService, 'createOrder').mockImplementation(
        async (orderPayload: Partial<Order>) => {
          return {
            ...orderPayload,
            id: 'mocked_order_id',
            createdAt: new Date(),
          };
        }
      );
      const result = await orderService.process(orderCouponValid);
      expect(result.totalPrice).toBe(90);
    });

    it('should not allow total price to be less than 0 after applying coupon', async () => {
      vi.spyOn(orderService, 'getCouponById').mockResolvedValue({
        discount: 110,
      });
      vi.spyOn(orderService, 'createOrder').mockImplementation(
        async (orderPayload: Partial<Order>) => {
          return {
            ...orderPayload,
            id: 'mocked_order_id',
            createdAt: new Date(),
          };
        }
      );

      const result = await orderService.process(orderCouponValid);
      expect(result.totalPrice).toBe(0);
    });
  });
});

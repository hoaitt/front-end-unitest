# Test Cases Checklist

## PaymentService Tests
- **buildPaymentMethod**
  - Verify available payment methods based on total price.
- **payViaLink**
  - Ensure a new window opens with the correct payment link.

## OrderService Tests
- **getCouponById**
  - Validate coupon retrieval for valid and invalid coupon IDs.
- **createOrder**
  - Verify order creation and returned data.
- **process**
  - Handle empty order items.
  - Handle invalid order items.
  - Handle total price less than or equal to 0.
  - Validate coupon application (valid and invalid).
  - Ensure total price does not go below 0 after applying a coupon.

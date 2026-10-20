import { Order } from "../../domain/entities/Order.js";
import { OrderDetail } from "../../domain/entities/OrderDetail.js";

export class CreateOrder {
  constructor({
    orderRepository,
    customerClient,
    productClient,
    discountPolicy
  }) {
    this.orderRepository = orderRepository;
    this.customerClient = customerClient;
    this.productClient = productClient;
    this.discountPolicy = discountPolicy;
  }

  async execute({ uid, items }) {
    if (!Number.isInteger(uid) || uid <= 0) {
      throw new Error("Invalid customer id");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    for (const item of items) {
      if (
        !Number.isInteger(item.pid) ||
        item.pid <= 0 ||
        !Number.isInteger(item.qty) ||
        item.qty <= 0
      ) {
        throw new Error("Invalid order item");
      }
    }

    const uniquePids = new Set(
      items.map((item) => item.pid)
    );

    if (uniquePids.size !== items.length) {
      throw new Error("Duplicate product in order");
    }

    let customer;

    try {
      customer =
        await this.customerClient.getCustomer(uid);
    } catch (error) {
      if (error.code === 5) {
        throw new Error("Customer not found");
      }

      throw error;
    }

    const resolvedItems = [];

    for (const item of items) {
      let product;

      try {
        product =
          await this.productClient.getProduct(
            item.pid
          );
      } catch (error) {
        if (error.code === 5) {
          throw new Error(
            `Product ${item.pid} not found`
          );
        }

        throw error;
      }

      resolvedItems.push({
        pid: product.pid,
        qty: item.qty,
        unitPrice: product.price
      });
    }

    const subtotal = resolvedItems.reduce(
      (total, item) =>
        total + item.unitPrice * item.qty,
      0
    );

    const discount =
      await this.discountPolicy.calculate({
        score: customer.score,
        subtotal
      });

    const reservedItems = [];

    try {
      for (const item of resolvedItems) {
        try {
          await this.productClient.decreaseStock(
            item.pid,
            item.qty
          );

          reservedItems.push({
            pid: item.pid,
            qty: item.qty
          });
        } catch (error) {
          if (error.code === 9) {
            throw new Error(
              `Insufficient stock for product ${item.pid}`
            );
          }

          if (error.code === 5) {
            throw new Error(
              `Product ${item.pid} not found`
            );
          }

          throw error;
        }
      }

      const order = new Order({
        uid,
        discount,
        details: resolvedItems.map(
          (item) =>
            new OrderDetail({
              pid: item.pid,
              qty: item.qty,
              unitPrice: item.unitPrice
            })
        )
      });

      const createdOrder =
        await this.orderRepository.createWithOutbox(
          order
        );

      return {
        ...createdOrder,
        subtotal,
        customer: {
          uid: customer.uid,
          fullname: customer.fullname,
          score: customer.score
        }
      };
    } catch (error) {
      const compensationErrors = [];

      for (
        let i = reservedItems.length - 1;
        i >= 0;
        i--
      ) {
        const item = reservedItems[i];

        try {
          await this.productClient.restoreStock(
            item.pid,
            item.qty
          );
        } catch (compensationError) {
          compensationErrors.push(
            compensationError
          );
        }
      }

      if (compensationErrors.length > 0) {
        const compensationFailure =
          new Error(
            "Order creation failed and stock compensation failed"
          );

        compensationFailure.cause = error;
        compensationFailure.compensationErrors =
          compensationErrors;

        throw compensationFailure;
      }

      throw error;
    }
  }
}
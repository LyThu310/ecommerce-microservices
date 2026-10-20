import { CreateOrder } from "../../application/use-cases/CreateOrder.js";
import { PrismaOrderRepository } from "../../infrastructure/repositories/PrismaOrderRepository.js";

import * as customerClient
  from "../../infrastructure/grpc/customer.client.js";

import * as productClient
  from "../../infrastructure/grpc/product.client.js";

import { ScoreDiscountPolicy } from "../../infrastructure/policies/ScoreDiscountPolicy.js";

import {
  createOrderSchema,
  orderIdSchema
} from "../validators/order.validator.js";

const orderRepository =
  new PrismaOrderRepository();

const discountPolicy =
  new ScoreDiscountPolicy();

const createOrder =
  new CreateOrder({
    orderRepository,
    customerClient,
    productClient,
    discountPolicy
  });

export async function createOrderHandler(
  req,
  res,
  next
) {
  try {
    const parsed =
      createOrderSchema.safeParse(
        req.body
      );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten()
      });
    }

    const result =
      await createOrder.execute(
        parsed.data
      );

    return res.status(201).json({
      message: "Create order successfully",
      data: result
    });
  } catch (error) {
    if (
      error.message ===
      "Customer not found"
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    if (
      error.message.startsWith("Product ") &&
      error.message.endsWith(" not found")
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    if (
      error.message.startsWith(
        "Insufficient stock"
      )
    ) {
      return res.status(409).json({
        message: error.message
      });
    }

    return next(error);
  }
}

export async function getOrderByIdHandler(
  req,
  res,
  next
) {
  try {
    const parsed =
      orderIdSchema.safeParse(
        req.params.oid
      );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    const order =
      await orderRepository.findById(
        parsed.data
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const actorUid =
      Number(req.get("x-user-id"));

    const actorRole =
      req.get("x-user-role");

    if (
      actorRole !== "ADMIN" &&
      order.uid !== actorUid
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return res.status(200).json({
      message: "Get order successfully",
      data: order
    });
  } catch (error) {
    return next(error);
  }
}
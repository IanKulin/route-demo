import express from "express";
import {
  dbOrdersGet,
  dbOrdersGetById,
  dbOrdersDelete,
  dbCustomersGetById,
} from "../db.js";

const router = express.Router();

// GET /orders
router.get("/", (req, res) => {
  const orders = dbOrdersGet();
  res.render("orders", { orders });
});

// GET /orders/:id
router.get("/:id", (req, res) => {
  const order = dbOrdersGetById(req.params.id);
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }
  const customer = dbCustomersGetById(order.customerId);
  if (!customer) {
    res.status(404).send("Customer not found");
    return;
  }
  res.render("order", { order, customer });
});

// GET /orders/:id/delete
router.get("/:id/delete", (req, res) => {
  dbOrdersDelete(req.params.id);
  res.redirect("/orders");
});

export default router;

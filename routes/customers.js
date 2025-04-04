import express from "express";
import {
  dbCustomersGet,
  dbCustomersGetById,
  dbCustomersDelete,
  dbOrdersGetByCustomerId,
} from "../db.js";

const router = express.Router();

// GET /customers
router.get("/", (req, res) => {
  const customers = dbCustomersGet();
  res.render("customers", { customers });
});

// GET /customers/:id
router.get("/:id", (req, res) => {
  const customer = dbCustomersGetById(req.params.id);
  const orders = dbOrdersGetByCustomerId(req.params.id);
  res.render("customer", { customer, orders });
});

// GET /customers/:id/delete
router.get("/:id/delete", (req, res) => {
  dbCustomersDelete(req.params.id);
  res.redirect("/customers");
});

export default router;

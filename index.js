import express from "express";
import {
  dbCustomersGet,
  dbCustomersGetById,
  dbCustomersDelete,
  dbOrdersGet,
  dbOrdersGetById,
  dbOrdersGetByCustomerId,
  dbOrdersDelete,
} from "./db.js";

const app = express();
app.set("view engine", "ejs");
const port = 3002;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/customers");
});

app.get("/customers", (req, res) => {
  const customers = dbCustomersGet();
  res.render("customers", { customers });
});

app.get("/customers/:id", (req, res) => {
  const customer = dbCustomersGetById(req.params.id);
  const orders = dbOrdersGetByCustomerId(req.params.id);
  res.render("customer", { customer, orders });
});

app.get("/customers/:id/delete", (req, res) => {
  dbCustomersDelete(req.params.id);
  res.redirect("/customers");
});

app.get("/orders", (req, res) => {
  const orders = dbOrdersGet();
  res.render("orders", { orders });
});

app.get("/orders/:id", (req, res) => {
  const order = dbOrdersGetById(req.params.id);
  const customer = dbCustomersGetById(order.customerId);
  res.render("order", { order, customer });
});

app.get("/orders/:id/delete", (req, res) => {
  dbOrdersDelete(req.params.id);
  res.redirect("/orders");
});

app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});

import express from "express";
import customersRouter from "./routes/customers.js";
import ordersRouter from "./routes/orders.js";

const app = express();
app.set("view engine", "ejs");
const port = 3002;

app.use(express.urlencoded({ extended: true }));

// routers
app.use("/customers", customersRouter);
app.use("/orders", ordersRouter);

// root route redirect to customers
app.get("/", (req, res) => {
  res.redirect("/customers");
});

app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});

import { describe, it } from "node:test";
import assert from "node:assert";
import {
  dbCustomersGet,
  dbCustomersGetById,
  dbCustomersAdd,
  dbCustomersUpdate,
  dbCustomersDelete,
  dbOrdersGet,
  dbOrdersGetById,
  dbOrdersGetByCustomerId,
  dbOrdersAdd,
  dbOrdersUpdate,
  dbOrdersDelete,
} from "../db.js";

// Future footgun - we're not resetting state between tests

describe("Customer Database Functions", () => {
  it("dbCustomersGet returns a copy of all customers", () => {
    const customers = dbCustomersGet();
    assert.strictEqual(Array.isArray(customers), true);
    assert.strictEqual(customers.length, 20);

    // Verify it's a copy by modifying the returned array
    const originalLength = customers.length;
    customers.push({ id: "999", name: "Test User", address: "Test Address" });
    const newCustomers = dbCustomersGet();
    assert.strictEqual(newCustomers.length, originalLength);
  });

  it("dbCustomersGetById returns the correct customer", () => {
    const customer = dbCustomersGetById("3");
    assert.strictEqual(customer.id, "3");
    assert.strictEqual(customer.name, "Charlie Brown");
    assert.strictEqual(customer.address, "789 Pine St, Capital City");
  });

  it("dbCustomersGetById returns null for non-existent customer", () => {
    const customer = dbCustomersGetById("999");
    assert.strictEqual(customer, null);
  });

  it("dbCustomersAdd adds a new customer with auto-incremented ID", () => {
    const originalCustomers = dbCustomersGet();
    const originalLength = originalCustomers.length;

    const newCustomer = {
      name: "Test Customer",
      address: "Test Address",
    };

    const addedCustomer = dbCustomersAdd(newCustomer);
    assert.strictEqual(typeof addedCustomer.id, "string");
    assert.strictEqual(addedCustomer.name, "Test Customer");

    const updatedCustomers = dbCustomersGet();
    assert.strictEqual(updatedCustomers.length, originalLength + 1);

    // Verify the ID is auto-incremented
    const maxId = originalCustomers.reduce(
      (max, c) => Math.max(max, parseInt(c.id, 10)),
      0
    );
    assert.strictEqual(addedCustomer.id, String(maxId + 1));
  });

  it("dbCustomersUpdate updates an existing customer", () => {
    const customerId = "4";
    const updatedData = {
      name: "Updated Name",
      address: "Updated Address",
    };

    const updatedCustomer = dbCustomersUpdate(customerId, updatedData);
    assert.strictEqual(updatedCustomer.id, customerId);
    assert.strictEqual(updatedCustomer.name, "Updated Name");
    assert.strictEqual(updatedCustomer.address, "Updated Address");

    // Verify the customer was actually updated in the database
    const retrievedCustomer = dbCustomersGetById(customerId);
    assert.strictEqual(retrievedCustomer.name, "Updated Name");
  });

  it("dbCustomersUpdate returns null for non-existent customer", () => {
    const result = dbCustomersUpdate("999", { name: "Test" });
    assert.strictEqual(result, null);
  });

  it("dbCustomersDelete removes a customer and their orders", () => {
    // First, add a customer and some orders for them
    const customer = dbCustomersAdd({
      name: "Delete Test",
      address: "Delete Address",
    });
    const order1 = dbOrdersAdd({
      customerId: customer.id,
      date: "2025-04-01",
      value: 100,
    });
    const order2 = dbOrdersAdd({
      customerId: customer.id,
      date: "2025-04-02",
      value: 200,
    });

    // Verify orders exist
    const customerOrders = dbOrdersGetByCustomerId(customer.id);
    assert.strictEqual(customerOrders.length, 2);

    // Delete the customer
    const originalCustomersLength = dbCustomersGet().length;
    const originalOrdersLength = dbOrdersGet().length;

    const deletedCustomer = dbCustomersDelete(customer.id);
    assert.strictEqual(deletedCustomer.id, customer.id);

    // Verify customer was deleted
    assert.strictEqual(dbCustomersGet().length, originalCustomersLength - 1);
    assert.strictEqual(dbCustomersGetById(customer.id), null);

    // Verify associated orders were deleted
    assert.strictEqual(dbOrdersGet().length, originalOrdersLength - 2);
    assert.strictEqual(dbOrdersGetByCustomerId(customer.id).length, 0);
  });

  it("dbCustomersDelete returns null for non-existent customer", () => {
    const result = dbCustomersDelete("999");
    assert.strictEqual(result, null);
  });
});

describe("Order Database Functions", () => {
  it("dbOrdersGet returns a copy of all orders", () => {
    const orders = dbOrdersGet();
    assert.strictEqual(Array.isArray(orders), true);

    // Verify it's a copy by modifying the returned array
    const originalLength = orders.length;
    orders.push({ id: "999", customerId: "1", date: "2025-04-01", value: 100 });
    const newOrders = dbOrdersGet();
    assert.strictEqual(newOrders.length, originalLength);
  });

  it("dbOrdersGetById returns the correct order", () => {
    const order = dbOrdersGetById("1");
    assert.strictEqual(order.id, "1");
    assert.strictEqual(order.customerId, "3");
    assert.strictEqual(order.date, "2025-03-01");
    assert.strictEqual(order.value, 100);
  });

  it("dbOrdersGetById returns null for non-existent order", () => {
    const order = dbOrdersGetById("999");
    assert.strictEqual(order, null);
  });

  it("dbOrdersGetByCustomerId returns all orders for a customer", () => {
    // Add a customer and multiple orders
    const customer = dbCustomersAdd({
      name: "Order Test",
      address: "Order Address",
    });
    dbOrdersAdd({ customerId: customer.id, date: "2025-04-01", value: 100 });
    dbOrdersAdd({ customerId: customer.id, date: "2025-04-02", value: 200 });
    dbOrdersAdd({ customerId: customer.id, date: "2025-04-03", value: 300 });

    const customerOrders = dbOrdersGetByCustomerId(customer.id);
    assert.strictEqual(customerOrders.length, 3);

    // Verify they're copies by modifying one
    customerOrders[0].value = 999;
    const newOrders = dbOrdersGetByCustomerId(customer.id);
    assert.notStrictEqual(newOrders[0].value, 999);
  });

  it("dbOrdersAdd adds a new order with auto-incremented ID", () => {
    const originalOrders = dbOrdersGet();
    const originalLength = originalOrders.length;

    const newOrder = {
      customerId: "1",
      date: "2025-04-01",
      value: 150,
    };

    const addedOrder = dbOrdersAdd(newOrder);
    assert.strictEqual(typeof addedOrder.id, "string");
    assert.strictEqual(addedOrder.customerId, "1");
    assert.strictEqual(addedOrder.value, 150);

    const updatedOrders = dbOrdersGet();
    assert.strictEqual(updatedOrders.length, originalLength + 1);

    // Verify the ID is auto-incremented
    const maxId = originalOrders.reduce(
      (max, o) => Math.max(max, parseInt(o.id, 10)),
      0
    );
    assert.strictEqual(addedOrder.id, String(maxId + 1));
  });

  it("dbOrdersUpdate updates an existing order", () => {
    const orderId = "2";
    const updatedData = {
      date: "2025-04-15",
      value: 500,
    };

    const updatedOrder = dbOrdersUpdate(orderId, updatedData);
    assert.strictEqual(updatedOrder.id, orderId);
    assert.strictEqual(updatedOrder.date, "2025-04-15");
    assert.strictEqual(updatedOrder.value, 500);

    // Verify the order was actually updated in the database
    const retrievedOrder = dbOrdersGetById(orderId);
    assert.strictEqual(retrievedOrder.date, "2025-04-15");
    assert.strictEqual(retrievedOrder.value, 500);
  });

  it("dbOrdersUpdate returns null for non-existent order", () => {
    const result = dbOrdersUpdate("999", { value: 999 });
    assert.strictEqual(result, null);
  });

  it("dbOrdersDelete removes an order", () => {
    // First, add an order
    const order = dbOrdersAdd({
      customerId: "1",
      date: "2025-04-01",
      value: 100,
    });

    // Delete the order
    const originalOrdersLength = dbOrdersGet().length;

    const deletedOrder = dbOrdersDelete(order.id);
    assert.strictEqual(deletedOrder.id, order.id);

    // Verify order was deleted
    assert.strictEqual(dbOrdersGet().length, originalOrdersLength - 1);
    assert.strictEqual(dbOrdersGetById(order.id), null);
  });

  it("dbOrdersDelete returns null for non-existent order", () => {
    const result = dbOrdersDelete("999");
    assert.strictEqual(result, null);
  });
});

const customers = [
  { id: "1", name: "Alice Johnson", address: "123 Main St, Springfield" },
  { id: "2", name: "Bob Smith", address: "456 Oak St, Shelbyville" },
  { id: "3", name: "Charlie Brown", address: "789 Pine St, Capital City" },
  { id: "4", name: "Diana Prince", address: "101 Maple St, Gotham" },
  { id: "5", name: "Ethan Hunt", address: "202 Elm St, Metropolis" },
  { id: "6", name: "Fiona Glenanne", address: "303 Birch St, Star City" },
  { id: "7", name: "George Costanza", address: "404 Cedar St, Quahog" },
  { id: "8", name: "Hannah Abbott", address: "505 Spruce St, Smallville" },
  { id: "9", name: "Isaac Newton", address: "606 Redwood St, Hill Valley" },
  { id: "10", name: "Julia Roberts", address: "707 Sequoia St, Twin Peaks" },
  { id: "11", name: "Kevin Malone", address: "808 Fir St, Pawnee" },
  { id: "12", name: "Laura Palmer", address: "909 Palm St, Sunnydale" },
  { id: "13", name: "Michael Scott", address: "1001 Aspen St, Scranton" },
  { id: "14", name: "Nancy Drew", address: "1102 Chestnut St, Riverdale" },
  { id: "15", name: "Oscar Wilde", address: "1203 Willow St, Arkham" },
  { id: "16", name: "Pam Beesly", address: "1304 Alder St, Hawkins" },
  { id: "17", name: "Quincy Adams", address: "1405 Poplar St, Westview" },
  { id: "18", name: "Rachel Green", address: "1506 Sycamore St, Greendale" },
  { id: "19", name: "Steve Rogers", address: "1607 Magnolia St, Wakanda" },
  { id: "20", name: "Tony Stark", address: "1708 Bonsai St, Atlantis" },
];

const orders = [
  { id: "1", customerId: "3", date: "2025-03-01", value: 100 },
  { id: "2", customerId: "7", date: "2025-03-02", value: 250 },
  { id: "3", customerId: "1", date: "2025-03-03", value: 75 },
  { id: "4", customerId: "10", date: "2025-03-04", value: 300 },
  { id: "5", customerId: "15", date: "2025-03-05", value: 50 },
  { id: "6", customerId: "6", date: "2025-03-06", value: 120 },
  { id: "7", customerId: "12", date: "2025-03-07", value: 90 },
  { id: "8", customerId: "4", date: "2025-03-08", value: 200 },
  { id: "9", customerId: "18", date: "2025-03-09", value: 180 },
  { id: "10", customerId: "9", date: "2025-03-10", value: 250 },
  { id: "11", customerId: "2", date: "2025-03-11", value: 130 },
  { id: "12", customerId: "14", date: "2025-03-12", value: 60 },
  { id: "13", customerId: "5", date: "2025-03-13", value: 110 },
  { id: "14", customerId: "8", date: "2025-03-14", value: 175 },
  { id: "15", customerId: "11", date: "2025-03-15", value: 200 },
  { id: "16", customerId: "13", date: "2025-03-16", value: 225 },
  { id: "17", customerId: "16", date: "2025-03-17", value: 95 },
  { id: "18", customerId: "19", date: "2025-03-18", value: 160 },
  { id: "19", customerId: "17", date: "2025-03-19", value: 140 },
  { id: "20", customerId: "20", date: "2025-03-20", value: 310 },
];

export function dbCustomersGet() {
  return [...customers]; // Return a copy to avoid external mutations
}

export function dbCustomersGetById(id) {
  return customers.find((c) => c.id === id);
}

export function dbCustomersAdd(customer) {
  customers.push(customer);
}

export function dbCustomersUpdate(id, updatedData) {
  const customer = dbCustomersGetById(id);
  if (customer) {
    Object.assign(customer, updatedData);
  } else {
    console.error(`Customer with id ${id} not found.`);
  }
}

export function dbCustomersDelete(id) {
  const index = customers.findIndex((c) => c.id === id);
  if (index !== -1) {
    customers.splice(index, 1);
    // clean up any orders for this customer
    dbOrdersGetByCustomerId(id).forEach((o) => dbOrdersDelete(o.id));
  } else {
    console.error(`Customer with id ${id} not found.`);
  }
}

export function dbOrdersGet() {
  return [...orders];
}

export function dbOrdersGetById(id) {
  return orders.find((o) => o.id === id);
}

export function dbOrdersGetByCustomerId(customerId) {
  return orders.filter((o) => o.customerId === customerId);
}

export function dbOrdersAdd(order) {
  orders.push(order);
}

export function dbOrdersUpdate(id, updatedData) {
  const order = dbOrdersGetById(id);
  if (order) {
    Object.assign(order, updatedData);
  } else {
    console.error(`Order with id ${id} not found.`);
  }
}

export function dbOrdersDelete(id) {
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    orders.splice(index, 1);
  } else {
    console.error(`Order with id ${id} not found.`);
  }
}

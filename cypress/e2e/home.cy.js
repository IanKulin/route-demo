describe("route-demo Tests", () => {
  // test for customers list page
  describe("Customers Page", () => {
    it("should have the home page redirect to customers page", () => {
      cy.visit("http://localhost:3002");
      cy.url().should("include", "/customers");
      cy.get("h1").contains("Customers");
    });

    it("should display a list of customers", () => {
      cy.visit("http://localhost:3002/customers");
      cy.get("li").should("have.length.at.least", 5);
      cy.get("li").eq(0).contains("Alice");
    });

    it("should have working links to customer details", () => {
      cy.visit("http://localhost:3002/customers");
      // click the first customer (Alice)
      cy.get("a").contains("Alice Johnson").click();
      cy.url().should("include", "/customers/");
      cy.get("h2").contains("Alice Johnson");
    });
  });

  // test for orders list page
  describe("Orders Page", () => {
    it("should display the orders page", () => {
      cy.visit("http://localhost:3002/orders");
      cy.get("h1").contains("Orders");
    });

    it("should display a list of orders", () => {
      cy.visit("http://localhost:3002/orders");
      cy.get("li").should("have.length.at.least", 5);
    });

    it("should have working links to order details", () => {
      cy.visit("http://localhost:3002/orders");
      // click the first order
      cy.get("li a").first().click();
      cy.url().should("include", "/orders/");
      cy.get("h1").contains("Order");
    });
  });

  // test for customer detail page
  describe("Customer Detail Page", () => {
    it("should display customer information correctly", () => {
      cy.visit("http://localhost:3002/customers/1");
      cy.get("h2").contains("Alice Johnson");
      cy.get("p").contains("Springfield");
    });

    it("should list orders for the customer", () => {
      cy.visit("http://localhost:3002/customers/1");
      cy.get("h3").contains("Orders");
      cy.get("ul li").should("exist");
    });

    it("should have working links to order details from customer detail", () => {
      cy.visit("http://localhost:3002/customers/1");
      cy.get("ul li a").first().click();
      cy.url().should("include", "/orders/");
      cy.get("h1").contains("Order");
    });

    it("should delete a customer when delete link is clicked", () => {
      // first check the customer exists
      cy.visit("http://localhost:3002/customers");
      cy.get("a").contains("Hannah Abbott").should("exist");

      // visit the customer page and delete
      cy.visit("http://localhost:3002/customers/8");
      cy.get("a").contains("Delete customer").click();

      // verify the customer is deleted
      cy.url().should("include", "/customers");
      cy.get("a").contains("Hannah Abbott").should("not.exist");
    });
  });

  // test for order detail page
  describe("Order Detail Page", () => {
    it("should display order information correctly", () => {
      cy.visit("http://localhost:3002/orders/3");
      cy.get("h2").contains("3");
      cy.get("p").contains("Date: 2025-03-03");
      cy.get("p").contains("Value: 75");
    });

    it("should link back to the customer from the order", () => {
      cy.visit("http://localhost:3002/orders/3");
      cy.get("p a").contains("Alice Johnson").click();
      cy.url().should("include", "/customers/");
      cy.get("h2").contains("Alice Johnson");
    });

    it("should delete an order when delete link is clicked", () => {
      // first check the order exists
      cy.visit("http://localhost:3002/orders");
      cy.get("a").contains("5 - 2025-03-05 - $50").should("exist");

      // visit the order page and delete
      cy.visit("http://localhost:3002/orders/5");
      cy.get("a").contains("Delete order").click();

      // verify the order is deleted
      cy.url().should("include", "/orders");
      cy.get("a").contains("5 - 2025-03-05 - $50").should("not.exist");
    });
  });

  describe("Cascading Deletions", () => {
    it("should delete all associated orders when a customer is deleted", () => {
      // first make a note of an order for a specific customer
      cy.visit("http://localhost:3002/customers/4");
      cy.get("h2").contains("Diana Prince");

      // note an order ID that belongs to this customer
      cy.get("ul li a")
        .first()
        .invoke("text")
        .then((orderText) => {
          // extract the full order text to use for matching later
          const orderTextFull = orderText.trim();
          // extract just the order ID number
          const orderId = orderText.split(" ")[0].trim();

          // delete the customer
          cy.get("a").contains("Delete customer").click();

          // verify customer is deleted
          cy.url().should("include", "/customers");
          cy.get("a").contains("Diana Prince").should("not.exist");

          // check that the order is also deleted - use the full text for precise matching
          cy.visit("http://localhost:3002/orders");
          // make sure we're matching the exact order (not just a substring)
          cy.get(`a[href="/orders/${orderId}"]`).should("not.exist");
        });
    });
  });

  // additional edge case tests
  describe("Edge Cases", () => {
    it("should handle non-existent customer IDs with a 404 response", () => {
      // visit a non-existent customer page
      cy.request({
        url: "http://localhost:3002/customers/999",
        failOnStatusCode: false,
      }).then((response) => {
        // verify status code is 404
        expect(response.status).to.eq(404);
        // verify error message
        expect(response.body).to.include("Customer not found");
      });
    });

    it("should handle non-existent order IDs with a 404 response", () => {
      // visit a non-existent order page
      cy.request({
        url: "http://localhost:3002/orders/999",
        failOnStatusCode: false,
      }).then((response) => {
        // verify status code is 404
        expect(response.status).to.eq(404);
        // verify error message
        expect(response.body).to.include("Order not found");
      });
    });
  });

  // navigation tests
  describe("Navigation", () => {
    it("should be able to navigate from customers to orders and back", () => {
      // starting from customers
      cy.visit("http://localhost:3002/customers");

      // go to a customer detail
      cy.get("a").contains("Bob Smith").click();

      // go to one of their orders
      cy.get("ul li a").first().click();
      cy.url().should("include", "/orders/");

      // go back to all orders
      cy.visit("http://localhost:3002/orders");
      cy.get("h1").contains("Orders");

      // go to a specific order
      cy.get("a").contains("10 - ").click();

      // go to the customer from the order
      cy.get("p a").click();
      cy.url().should("include", "/customers/");
    });
  });
});

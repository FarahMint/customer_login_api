const errors = require("restify-errors");
const Customer = require("../models/Customer");

const rjwt = require("restify-jwt-community");
const config = require("../config");

//   create route
module.exports = server => {
  //  Fetch all customer GET
  //  http://localhost:3000/customers
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      // whenever done with route need to call next() @ the end  with restify
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  //  Fetch one customer GET
  //  http://localhost:3000/customers/5c460b1caa3e8345f45b96a8 - per ex
  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      // single customer
      res.send(customer);
      // whenever done with route need to call next() @ the end  with restify
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  // want to protectthis route go after end ppoit before CB

  //  Add customer POST
  //localhost:3000/customers
  server.post(
    "/customers",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // server.post("/customers", async (req, res, next) => {
      //  check if json
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { name, email, balance } = req.body;
      //  create new customer
      const customer = new Customer({
        name,
        email,
        balance
      });

      try {
        // save in DB
        const newCustomer = await customer.save();
        res.send(201);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  //  Update customer  PUT
  // http://localhost:3000/customers/5c460b1caa3e8345f45b96a8 -> per ex
  server.put(
    "/customers/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // server.put("/customers/:id", async (req, res, next) => {
      //  check if json
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        // save in DB
        // use model directly (Customer)
        const customer = await Customer.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  //  delete customer  DELETE - del
  //localhost:3000/customers
  server.del(
    "/customers/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // server.del("/customers/:id", async (req, res, next) => {
      try {
        // save in DB
        // use model directly (Customer)
        const customer = await Customer.findOneAndDelete(
          { _id: req.params.id },
          req.body
        );
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );
};

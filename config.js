module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || "hhtp://localhost:3000",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb://admin:admin123@ds163164.mlab.com:63164/restify_api",
  JWT_SECRET: process.env.JWT_SECRET || "secret"
};

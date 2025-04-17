// middleware/auth.js
const { expressjwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Replace with your actual Auth0 domain and API identifier
const authConfig = {
  domain: "dev-qqnq4k85lt7yr0r0.us.auth0.com",
  audience: "https://nav.airow.io/api",
};

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
  requestProperty: "auth"
});

module.exports = checkJwt;

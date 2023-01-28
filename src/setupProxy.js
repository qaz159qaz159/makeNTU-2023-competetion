const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://${process.env.REACT_APP_API_HOST}:7780`,
      changeOrigin: true,
    })
  );
};

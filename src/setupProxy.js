const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy('/customer', {
          target: 'http://localhost:8080/',
          changeOrigin: true
        })
    );    
};
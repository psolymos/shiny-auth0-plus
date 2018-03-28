var express = require('express');
var passport = require('passport');
var httpProxy = require('http-proxy');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
var router = express.Router();

var proxy = httpProxy.createProxyServer({
  target: {
      host: process.env.SHINY_HOST,
      port: process.env.SHINY_ADMIN_PORT
    }
});

proxy.on('error', function(e) {
  console.log('Error connecting to shiny server admin');
  console.log(e);
});

var setIfExists = function(proxyReq, header, value){
  if(value){
    proxyReq.setHeader(header, value);
  }
}

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  setIfExists(proxyReq, 'x-auth0-user-id', req.user._json.sub);
  setIfExists(proxyReq, 'x-auth0-groups', req.user._json.groups);
});

/* Proxy all requests */
router.all(/.*/, ensureLoggedIn, function(req, res, next) {
  proxy.web(req, res, target: {host: process.env.SHINY_HOST,port: process.env.SHINY_ADMIN_PORT},
  function(e) {
    console.log('Error connecting to shiny server');
    console.log(e);
  });
});

module.exports = router;
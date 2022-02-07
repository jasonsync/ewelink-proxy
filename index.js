/**
 * - sync-access-ewelink-control/index.js
 * - Author: Jason Banfield
 * - Description: This module is a node.js web service which acts as a proxy to
 *    control ewelink devices via LAN mode or the eWeLink cloud server.
 *
 * - Breakdown:
 *    - Accepts an application/json HTTP request
 *
 *
 *
 *
 *
 *    - Does some auth (must be localhost making the request)
 *    - uses parameters from request's json body to make relevant
 *      request to eWeLink devices / eWeLink server
 *    - sends relevant response back to requester.
 */

const http = require("http");
const ewelink = require('ewelink-api-fixed');

/* Default config */
const config = {
  "host": 'localhost',
  "port": 9000,
  "ewelink": {
    "username": null,
    "password": null,
    "region": "eu"
  }
};

// override default config with any set arguments
argsToConfig();

/* HTTP request listener */
const server = http.createServer(async (req, res) => {

  console.log("##### Client Request: " + req.method + " " + req.url);
  //only this server (localhost) may only make requests
  if (req.headers.host == config.host + ":" + config.port) {

    //only valid resources allowed
    if (req.url === "/" && req.method === "POST") {

      //set the response
      res.writeHead(200, {
        "Content-Type": "application/json"
      });

      // console.log('\x1b[34m%s\x1b[0m',"headers:");
      // console.log('\x1b[34m%s\x1b[0m',req.headers);



      // request parameters to config...
      let reqJSON = {};
      let json = await getJSONBodyAsync(req);
      console.log('\x1b[35m%s\x1b[0m', json);
      res.write(JSON.stringify(json));
      res.end();
      // end test
      return;

      doEwelinkRequest("devicealias", "toggle", "on")
        .then((ret) => {
          console.log(ret);
          res.write(JSON.stringify(ret));
          res.end();
        })
        .catch((error) => {
          console.error(error);
          res.write(error);
          res.end();
        });
    }
    // If invalid resource
    else {
      res.writeHead(404, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        message: "404 - Requested resource not found"
      }));
    }

  }
  // If invalid auth
  else {
    res.writeHead(401, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
      message: "401 - Unauthorized. Only localhost can make requests."
    }));
  }
});
server.listen(config.port, config.host, () => {
  console.log('\x1b[33m%s\x1b[0m', `Server is running on http://${config.host}:${config.port}`);
});



/* eWeLink Section */
const doEwelinkRequest = async function(options = {
  "device_sync_alias": null,
  "device_id": null,
  "action": null
}) {
  // auth
  const connection = new ewelink({
    email: config.ewelink.username,
    password: config.ewelink.password,
    region: config.ewelink.region
  });
  // alias to device_id mapping:
  // TODO: lookup in MariaDB
  let requestDatetime = Date.now();
  let duration = null;
  let returnvalue = null;

  switch (options.action) {
    case "toggle":
    default:

      console.log("==> Calling: toggleDevice('" + options.device_id + "'); " + new Date(requestDatetime));


      await connection.toggleDevice(options.device_id)
        .then(async ret => {
          duration = Date.now() - requestDatetime;
          console.log('\x1b[33m%s\x1b[0m', text + ' - Toggle');
          console.log("Response time: " + duration + "ms");
          console.log(ret);
          if (!ret.error) {
            // Confirm the state
            const status = await connection.getDevicePowerState(options.device_id);
            duration = Date.now() - requestDatetime;
            console.log('\x1b[33m%s\x1b[0m', text + " - Current Status");
            console.log("Response time: " + duration + "ms");
            console.log(status);
            console.log("----------------------------------------------");
            console.log();
          }
        });



      break;
  }
  console.log("<== Response from eWeLink Server: (Duration = " + duration / 1000 + "s)");

  return returnvalue;
};

function argsToConfig() {
  const args = process.argv.slice(2);
  for (var i = 0; i < args.length; i++) {
    if (args[i].indexOf('port=') > -1) {
      config.port = args[i].substring(args[i].indexOf('port=') + 'port='.length);
    }
  }
};

async function getJSONBodyAsync(req) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  console.log('here');
  return JSON.parse(data);
}

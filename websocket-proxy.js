const http = require("http");
const ewelink = require('ewelink-api-fixed');

// instantiate class
const connection = new ewelink({
  email: 'apps@syncofthings.co.za',
  password: 'Gitmo1234#2021',
  region: 'eu',
});

var socket; //define outside of async function to allow access as required
async function ws() {
  // login into eWeLink
  await connection.getCredentials();

  // call openWebSocket method with a callback as argument
  socket = await connection.openWebSocket(async data => {
    // data is the message from eWeLink
    if (data == "pong") { //can just ignore of for debug print date & time to console
      date = new Date();
      console.log('\x1b[31m%s\x1b[0m',"keepalive received at:", date.toUTCString());
    } else { //process event...
      console.log('\x1b[33m%s\x1b[0m',"openWebSocket data::", JSON.stringify(data, null, 4)); //if(DEBUG) when coded !
    }
  });

  process.on("SIGINT", () => {
    console.log(" - Caught SIGINT. Exiting in 3 seconds.");
    console.log("Closing WebSocket...");
    var cls = socket.close();
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  });

}

ws();

# ewelink-proxy
HTTP API proxy & websocket proxy for ewelink

The point of this proxy, is to bypass typical limitations found in the ewelink app and web dashboard. 

Projects can use this module in order to create custom dashboards, apps, or whatever.

### HTTP API Proxy:
ewelink credentials get passed along with a request to the this API (nodejs), which will connect to ewelink and execute the relevant api call, and return the response to the original callee. 

### Websocket Proxy:
ewelink credentials get passed to this proxy (nodejs) which in turn establishes a websocket connection to the ewelink server's websocket. 
Any incoming messages from ewelink's websocket are relayed back to the user of this proxy.

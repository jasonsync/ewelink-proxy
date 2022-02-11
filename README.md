# ewelink-proxy
HTTP API proxy & websocket proxy for ewelink

The point of this proxy, is to bypass typical limitations found in the ewelink app and web dashboard, such as only 1 concurrent users logging in with the same account.

Projects can use this module in order to create custom dashboards, apps, or whatever.

### HTTP API Proxy:
When you have one or many users wanting to send requests to one or many ewelink accounts, this proxy will 

1. User sends request to this proxy (e.g. toggle bedroom light)
2. Proxy does necessary user authentication with your own custom database (does this user have permission to toggle the bedroom light?)
3. Proxy gets the relevant ewelink credentials from the database for this device.
4. Proxy connects to the ewelink API with the credentials and makes the request (e.g. toggle bedroom light)
5. Proxy relays response messages back to client. (json object with status)


### Websocket Proxy:
When you have multiple users wanting to listen to the same ewelink device's messages, e.g. a Sonoff P1 63A breaker, which gives periodic updates based on state change

1. User establishes websocket to this proxy
2. Proxy does necessary user authentication with your own custom database (does this user have permission to view the smart breaker?)
3. Proxy gets the relevant ewelink credentials from the database for this device. 
4. Proxy establishes a websocket of it's own with the ewelink server.
5. Proxy relays incoming messages back to the client. (json object with status change)

'use strict';

const WebSocketImpl = globalThis.WebSocket || global.WebSocket;

module.exports = WebSocketImpl;
module.exports.WebSocket = WebSocketImpl;
module.exports.default = WebSocketImpl;

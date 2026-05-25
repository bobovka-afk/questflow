"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const node_crypto_1 = require("node:crypto");
const REQUEST_ID_HEADER = 'x-request-id';
function requestIdMiddleware(req, res, next) {
    const incomingRequestId = req.headers[REQUEST_ID_HEADER];
    const requestId = Array.isArray(incomingRequestId)
        ? incomingRequestId[0]
        : incomingRequestId ?? (0, node_crypto_1.randomUUID)();
    req.id = requestId;
    req.headers[REQUEST_ID_HEADER] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
}
//# sourceMappingURL=request-id.middleware.js.map
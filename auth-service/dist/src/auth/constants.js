"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const crypto_1 = require("crypto");
exports.jwtConstants = {
    secret: process.env.JWT_SECRET || (0, crypto_1.randomBytes)(32).toString('hex'),
    expiresIn: '30m', // Short-lived JWTs for better security
    refreshSecret: process.env.JWT_REFRESH_SECRET || (0, crypto_1.randomBytes)(32).toString('hex'),
    refreshExpiresIn: '7d', // Refresh tokens last for 7 days
};

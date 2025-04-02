"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let ThrottlerMiddleware = class ThrottlerMiddleware {
    constructor() {
        this.requestsMap = new Map();
    }
    use(req, res, next) {
        const userIP = req.ip || ''; // If IP is not found, use an empty string.
        const currentTime = Date.now();
        const timeWindow = 60000;
        const maxRequests = 5;
        const userRequests = this.requestsMap.get(userIP) || [];
        const validRequests = userRequests.filter((timestamp) => currentTime - timestamp <= timeWindow);
        if (validRequests.length >= maxRequests) {
            res.status(429).send('Too many requests, please try again later.');
            return; // Exit out early to prevent further processing.
        }
        validRequests.push(currentTime);
        this.requestsMap.set(userIP, validRequests);
        next();
    }
};
exports.ThrottlerMiddleware = ThrottlerMiddleware;
exports.ThrottlerMiddleware = ThrottlerMiddleware = __decorate([
    (0, common_1.Injectable)()
], ThrottlerMiddleware);

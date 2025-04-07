import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ThrottlerMiddleware implements NestMiddleware {
    private requestsMap: Map<string, number[]> = new Map();

    use(req: Request, res: Response, next: NextFunction) {

        const userIP = req.ip || ''; // If IP is not found, use an empty string.
        const currentTime = Date.now();
        const timeWindow = 60000; 
        const maxRequests = 5;
        const userRequests = this.requestsMap.get(userIP) || [];

        const validRequests = userRequests.filter(
            (timestamp) => currentTime - timestamp <= timeWindow,
        );

        if (validRequests.length >= maxRequests) {
            res.status(429).send('Too many requests, please try again later.');
            return; // Exit out early to prevent further processing.
        }
        validRequests.push(currentTime);
        this.requestsMap.set(userIP, validRequests);
        next();
    }
}

import { Router } from 'express';

export const routerGame = Router();

/**
 * Standard route
 */
routerGame.get('/', (req, res) => {
    res.send("Test");
});
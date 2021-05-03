import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { Game } from '../entity/Game';

export const routerGame = Router();
const gameCtrl = new GameController();

/**
 * Saving a game
 */
routerGame.post('/', async (req, res) => {
    const data = req.body;
    const game = new Game(data.word);
    const savedGame = await gameCtrl.save(game);
    res.json(savedGame);
});

routerGame.get('/', async (req, res) => {
    res.json(await gameCtrl.getAll());
});

routerGame.get('/:gameId', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    res.json(await gameCtrl.getGame(gameId));
});

routerGame.post('/:gameId', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const { letter } = req.body;
    res.json(await gameCtrl.hitLetter(gameId, letter));
});
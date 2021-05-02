import "reflect-metadata";
import { createConnection } from "typeorm";
import { Game } from "./entity/Game";

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const game = new Game();
    game.word = "Timber";
    game.remainingTime = 3600;
    game.date = new Date();
    game.finished = false;
    game.wrongLetters = [];
    game.hitLetters = [];
    game.errors = 0;
    await connection.manager.save(game);
    console.log("Saved a new game with id: " + game.id);

    console.log("Loading games from the database...");
    const games = await connection.manager.find(Game);
    console.log("Loaded games: ", games);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));

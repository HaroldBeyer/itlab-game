import { app } from './app';

const PORT = 3000;

const server = app.listen(PORT, () => console.log(`App listening at port ${PORT}`));

/**
 * As soon as the process ends, so does our app
 */
process.on("SIGINT", () => {
    server.close();
    console.log(`The app has been closed`);
});

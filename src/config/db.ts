import { createConnection } from 'typeorm';

export const connectServerWithDB = async () => {
    const connection = await createConnection();
    console.log(`Connected with DB ${connection.options.database}`);

    process.on("SIGINT", () => {
        connection.close().then(() => {
            console.log(`Connection with DB has been closed`);
        }).catch((err) => {
            console.log(`Error while trying to close connection: ${err}`);
        });
    });
};
import { Client } from "pg";

const database = new Client({
    database: "movies_sprint2",
    password:"1234",
    user:"naks",
    host: "localhost",
    port:5432
})

const startDatabase = async () => {
    await database.connect()
    console.log("database connected")
}


export {database, startDatabase}
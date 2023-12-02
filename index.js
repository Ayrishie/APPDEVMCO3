import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import * as url from "url";
import routes from "./routes/routes.js";

const app = express();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
      extended: true,
  })
);
app.use(express.static(__dirname + "/public"));
app.use(session({
    "secret": "secret",
    "resave": false,
    "saveUninitialized": false,
    store: MongoStore.create({mongoUrl: process.env.MONGODB_URI})
}));
app.use(routes);
app.engine("hbs", engine({extname: "hbs"}));
app.set("view engine", "hbs");
app.set("views", "./views");

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log("Server listening on port " + port);

    const connect = async () => {
        try{
            await mongoose.connect(process.env.MONGODB_URI, {dbName: process.env.DB_NAME});
        } catch(err){
            console.log(err);
        }
    }

    connect().then(() => {
        console.log("Connected to database");
    });
});
/*
  - Required For Absolute Imports
  - Add any folder to paths
  - why to use # only before name, 
    - to  avoid conflict between node-modules and local folders
*/
require("./abs");

const routes = require("#routes");
const utils = require("#utils");
const express = require("express");
const http = require("http");
const cors = require("cors");
//HTTP/TCP Connection
const app = express();
const port = process.env.PORT_NODE || 3306;
const httpServer = http.createServer(app);

//Basic Initialization
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});
app.use(
    cors({
        origin: (o, c) => {
            c(null, true);
        },
    })
);
app.use(express.json());

//Routes
routes(app);

//Starting Connection
httpServer.listen(port, () => {    
    utils.printGreetings(port);
});
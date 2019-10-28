"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const child_process_1 = require("child_process");
const appPort = process.env.APP_SERVER_PORT || 8010;
const redirectPort = process.env.REDIRECT_SERVER_PORT || 8090;
function initAppServer() {
    const server = express();
    const indexFilePath = path.resolve(__dirname, "..", "public", "app", "index.html");
    const childFilePath = path.resolve(__dirname, "..", "public", "app", "child.html");
    const callbackFilePath = path.resolve(__dirname, "..", "public", "app", "callback.html");
    server.get("/", (_, res) => res.sendFile(indexFilePath));
    server.get("/child", (_, res) => res.sendFile(childFilePath));
    server.post("/redirect", (_, res) => res.redirect(`http://localhost:${redirectPort}`));
    server.get("/callback", (_, res) => res.sendFile(callbackFilePath));
    server.listen(appPort);
}
function initRedirectServer() {
    const server = express();
    server.use(cors());
    const indexFilePath = path.resolve(__dirname, "..", "public", "redirect", "index.html");
    server.get("/", (_, res) => res.sendFile(indexFilePath));
    server.post("/redirect", (_, res) => res.redirect(`http://localhost:${appPort}/callback`));
    server.listen(redirectPort);
}
function executeOpenfin() {
    const appJsonPath = path.resolve(__dirname, "..", "app.json");
    child_process_1.exec(`openfin -l -c ${appJsonPath}`);
}
if (require.main === module) {
    initAppServer();
    initRedirectServer();
    executeOpenfin();
}

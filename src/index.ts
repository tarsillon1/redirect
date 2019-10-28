import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { exec } from "child_process";

const appPort = process.env.APP_SERVER_PORT || 8010;
const redirectPort = process.env.REDIRECT_SERVER_PORT || 8090;

function initAppServer() {
  const server = express();

  const indexFilePath: string = path.resolve(
    __dirname,
    "..",
    "public",
    "app",
    "index.html"
  );
  const childFilePath: string = path.resolve(
    __dirname,
    "..",
    "public",
    "app",
    "child.html"
  );
  const callbackFilePath: string = path.resolve(
    __dirname,
    "..",
    "public",
    "app",
    "callback.html"
  );

  server.get("/", (_, res) => res.sendFile(indexFilePath));
  server.get("/child", (_, res) => res.sendFile(childFilePath));
  server.post("/redirect", (_, res) =>
    res.redirect(`http://localhost:${redirectPort}`)
  );
  server.get("/callback", (_, res) => res.sendFile(callbackFilePath));

  server.listen(appPort);
}

function initRedirectServer() {
  const server = express();
  server.use(cors());

  const indexFilePath: string = path.resolve(
    __dirname,
    "..",
    "public",
    "redirect",
    "index.html"
  );
  server.get("/", (_, res) => res.sendFile(indexFilePath));
  server.post("/redirect", (_, res) =>
    res.redirect(`http://localhost:${appPort}/callback`)
  );

  server.listen(redirectPort);
}

function executeOpenfin() {
  const appJsonPath: string = path.resolve(__dirname, "..", "app.json");
  exec(`openfin -l -c ${appJsonPath}`);
}

if (require.main === module) {
  initAppServer();
  initRedirectServer();
  executeOpenfin();
}

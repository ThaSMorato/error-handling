import { createServer } from "http";
import { BusinessError } from "./errors/businessError.js";
import { statusCodes } from "./util/httpStatusCodes.js";

function validateHero(hero) {
  //simulando um outro error, por exemplo de bando de dados

  if (Reflect.has(hero, "connectionError")) {
    throw new Error("Error connecting to DB");
  }

  if (hero.age < 20) {
    throw new BusinessError("Age must be higher than 20");
  }

  if (hero.name?.length < 4) {
    throw new BusinessError("Name must be at least 4 characters");
  }
}

async function handler(req, res) {
  for await (const data of req) {
    try {
      const hero = JSON.parse(data);
      validateHero(hero);
      console.log({ hero });
      res.writeHead(statusCodes.OK);
    } catch (error) {
      if (error instanceof BusinessError) {
        res.writeHead(statusCodes.BAD_REQUEST);
        res.write(error.message);
        continue;
      }
      res.writeHead(statusCodes.INTERNAL_SERVER_ERROR);
    } finally {
      res.end();
    }
  }
}

createServer(handler).listen(3000, () => console.log("Running at 3000"));

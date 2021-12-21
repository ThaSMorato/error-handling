import { createServer } from "http";
import { HeroEntity } from "./util/heroEntity.js";
import { statusCodes } from "./util/httpStatusCodes.js";

async function handler(req, res) {
  for await (const data of req) {
    try {
      const parsedData = JSON.parse(data);

      if (Reflect.has(parsedData, "connectionError")) {
        throw new Error("Error connecting to DB");
      }

      const hero = new HeroEntity(parsedData);

      if (!hero.isValid()) {
        res.writeHead(statusCodes.BAD_REQUEST);
        res.write(hero.notifications.join("\n"));
        continue;
      }

      //cadastra no banco de dados...
      console.log({ hero });

      res.writeHead(statusCodes.OK);
    } catch (error) {
      res.writeHead(statusCodes.INTERNAL_SERVER_ERROR);
    } finally {
      res.end();
    }
  }
}

createServer(handler).listen(3000, () => console.log("Running at 3000"));

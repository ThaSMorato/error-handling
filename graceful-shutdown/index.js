import { MongoClient } from "mongodb";
import { createServer } from "http";
import { promisify } from "util";

async function dbConnect() {
  const client = new MongoClient("mongodb://thalesmorato:pass123@localhost:27017");
  await client.connect();
  console.log("Mongodb is connected");
  const db = client.db("comics");
  return {
    collections: { heroes: db.collection("heroes") },
    client,
  };
}

const { client, collections } = await dbConnect();

async function handler(req, res) {
  for await (const data of req) {
    try {
      const hero = JSON.parse(data);
      await collections.heroes.insertOne({
        ...hero,
        updatedAt: new Date().toISOString(),
      });
      res.writeHead(201);

      const heroes = await collections.heroes.find().toArray();

      res.write(JSON.stringify(heroes));
    } catch (error) {
      console.log(error);
      res.writeHead(500);
      res.write(JSON.stringify({ message: "Internal server error" }));
    } finally {
      res.end();
    }
  }
}

const server = createServer(handler).listen(3000, () =>
  console.log("running at 3000 and process", process.pid)
);

const onStop = async (e) => {
  console.info(`\n${e} signal received!`);

  console.log("Closing http server");
  await promisify(server.close.bind(server))();
  console.log("Http server has closed!");

  console.log("Mongo closing...");
  //close(true) forca o encerramento
  await client.close();
  console.log("Mongo connection has been closed");

  //0 tudo certo / 1 erro
  process.exit(0);
};

//SIGINT - ctrl c
//SIGTERM - KILL

["SIGTERM", "SIGINT"].forEach((event) => process.on(event, onStop));

import Http from "http";

let count = 1;
async function handler(req, res) {
  count++;
  try {
    if (count % 2 === 0) {
      await Promise.reject("error dentro do try");
    }

    for await (const data of req) {
      try {
        if (count % 2 !== 0) {
          await Promise.reject("error dentro do for");
        }
      } catch (error) {
        console.log("request error", error);
        res.writeHead(500);
        res.write(JSON.stringify({ message: "request error" }));
      } finally {
        res.end();
      }
    }
  } catch (error) {
    console.log("server error", error);
    res.writeHead(500);
    res.write(JSON.stringify({ message: "server error" }));
    res.end();
  }
}

Http.createServer(handler).listen(3000, () => console.log("running at 3000"));

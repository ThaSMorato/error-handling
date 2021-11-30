import timers from "timers/promises";

const timeoutAsync = timers.setTimeout;

// const results = [1, 2].map(async (item) => {
//   console.log("starting process");
//   await timeoutAsync(100);
//   console.log(item);
//   console.log(await Promise.resolve("timout order"));
//   await timeoutAsync(100);
//   console.log("debug");
//   return item * 2;
// });

// console.log("results", await Promise.all(results));

setTimeout(async () => {
  console.log("starting process");
  await timeoutAsync(100);
  console.log("debug");
  console.log(await Promise.resolve("timout order"));
  await timeoutAsync(100);
  console.log("debug");
  await Promise.reject("error timeout");
}, 1000);

const throwError = (msg) => {
  throw new Error(msg);
};

try {
  console.log("starting process");
  throwError("error no try");
} catch (error) {
  console.log("error pego no catch", error.message);
} finally {
  console.log("finally");
}

process.on("unhandledRejection", (e) => {
  console.log("unhandledRejection", e.message || e);
});

process.on("uncaughtException", (e) => {
  console.log("uncaughtException", e.message || e);
  // process.exit(1);
});

Promise.reject("promise rejected");

// se o promise.reject estiver em outro contexto ele cai no unhandledRejection
setTimeout(async () => {
  await Promise.reject("promise rejected on set time out");
});

setTimeout(() => {
  throwError("error fora do catch dentro do timeout");
});

throwError("error fora do catch");

//mas se ele estiver no global ele cai no uncaughtException
// await Promise.reject("promise rejected on await");

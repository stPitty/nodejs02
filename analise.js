const fs = require("fs");

async function readFile(filePath) {
  try {
    let data = await fs.promises.readFile(filePath, "utf-8");
    let outData = [];
    data = data.split("\n");
    data.splice(-1);
    data.forEach((element) => {
      outData.push(JSON.parse(element));
    });
    return outData;
  } catch (err) {
    console.error(err);
  }
}

async function gameAnalise(filePath) {
  const games = await readFile(filePath);
  const result = {
    wins: Number(),
    loses: Number(),
  };
  for (let game of games) {
    if (game.result === "win") result.wins += 1;
    else result.loses += 1;
  }
  result.winsPerCent = Math.floor((result.wins / games.length) * 100);
  result.losesPerCent = Math.floor((result.loses / games.length) * 100);
  console.log(`
  Общее количество партий: ${games.length}
  Побед: ${result.wins}, ${result.winsPerCent}%
  Поражений: ${result.loses}, ${result.losesPerCent}%
  `);
}

(async () => {
  await gameAnalise(process.argv[2]);
})();

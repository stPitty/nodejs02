const fs = require("fs");
const readline = require("readline");
const path = require("path");

const getRandomInt = () => Math.floor(Math.random() * 2 + 1);

async function createMyFile(filePath, data) {
  await fs.promises.writeFile(filePath, data + "\n", { flag: "a+" });
}

async function writeFile(filePath, data) {
  data = JSON.stringify(data);
  try {
    await createMyFile(filePath, data);
  } catch (e) {
    if (e.code === "ENOENT") {
      const myPath = path.dirname(filePath).split("/");
      let counter = String();
      for (let element of myPath) {
        try {
          counter += element + "/";
          await fs.promises.mkdir(counter);
        } catch (e) {
          if (!e.code === "EEXIST") console.error(e);
        }
      }
      await createMyFile(filePath, data);
    } else console.error(e);
  }
}

async function game(filePath) {
  console.log("Добро пожаловать в игру! Введите число 1 или 2!");

  const input = readline.createInterface(process.stdin, process.stdout);

  let myRandom = getRandomInt();

  async function inputListener(data) {
    if (!["1", "2"].includes(data)) {
      return console.log("Введите число 1 или 2");
    }
    if (myRandom === Number(data)) {
      console.log("Угадал");
      myRandom = getRandomInt();
      await writeFile(filePath, { result: "win" });
    } else {
      console.log("Не угадал");
      myRandom = getRandomInt();
      await writeFile(filePath, { result: "lose" });
    }
  }

  input.on("error", (err) => console.error(err));
  input.on("line", inputListener);
}

(async () => {
  await game(process.argv[2]);
})();

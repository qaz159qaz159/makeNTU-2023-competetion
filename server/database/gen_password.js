const fs = require("fs");
const fcsv = require("fast-csv");
const { compare } = require("bcrypt");

const csvInput = "./private-data/teams.csv";
const jsonOutput = "./private-data/teams.json";
const csvOutput = "./private-data/teams_password.csv";

const jsonData = [];
const csvData = [["id", "grade", "name", "password"]];

function genPassword(length = 10) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

fcsv
  .parseFile(csvInput, { headers: true, encoding: "utf8" })
  .on("err", (err) => console.log(err))
  .on("data", (row) => {
    const newpassword = genPassword();
    jsonData.push({
      teamID: row.id,
      password: newpassword,
    });
    csvData.push([row.id, row.grade, row.name, newpassword]);
  })
  .on("end", () => {
    fs.writeFileSync(jsonOutput, JSON.stringify(jsonData, null, 2));
    console.log("Done writing .json!");
    /*
    fcsv
      .writeToPath(csvOutput, csvData, { headers: true, rowDelimiter: "\r\n" })
      .on("error", (err) => console.log(err))
      .on("finish", () => console.log("Done writing .csv!")); */
  });

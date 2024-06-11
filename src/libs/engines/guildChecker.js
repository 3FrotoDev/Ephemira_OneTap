const fs = require("fs");
const PATH_GUILDS = "./src/db/guilds.json";

function rJson() {
  const str = fs.readFileSync(PATH_GUILDS, "utf8");
  return JSON.parse(str);
}
function wJson(data) {
  fs.writeFileSync(PATH_GUILDS, JSON.stringify(data));
}

function addGuild(guildId) {
  const db = rJson();
  if (!db[guildId]) {
    db[guildId] = { whitelist: true, type: "free" };
    wJson(db);
  }
}

function setState(guildId, state) {
  const db = rJson();
  if (db[guildId]) {
    db[guildId]["whitelist"] = state;
    wJson(db);
  }
  else{
    addGuild(guildId);
  }
}
//check if the guild is in the whitelist
function getState(guildId) {
  const db = rJson();
  return db[guildId] ? db[guildId]["whitelist"] : undefined;
}
/////////////////////[ End State ]/////////////////////

function getType(guildId) {
  const db = rJson();
  return db[guildId] ? db[guildId]["type"] : undefined;
}

function setType(guildId, type) {
  const db = rJson();
  if (db[guildId]) {
    db[guildId]["type"] = type;
    wJson(db);
  }
}
//////////////[ End subscription Type ]//////////////

module.exports = {
  getState,
  addGuild,
  setState,
  setType,
  getType,
};

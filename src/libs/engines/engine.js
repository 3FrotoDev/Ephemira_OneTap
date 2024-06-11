const fs = require("fs");
const path = require("path");
const PATH_DB = path.join(__dirname,"../../db");
const APP_SETUP = "setup.json";
const APP_ROOMS = "rooms.json";
const APP_USERS = "users.json";
//make the

function getDefaultSetup(guildId) {
  const default_setup = {
    bl: guildId,
    wl: guildId,
    ban: guildId,
    ghost: guildId,
    reset: guildId,
    sounds: guildId,
    mute: guildId,
};

  return default_setup;
}

//engine to setup the premium role

function setPremiumRole(guildId, command, role) {
  const db = rJson(guildId, APP_SETUP);
  if (db["premiumCommands"]) {
    db["premiumCommands"][command] = role;
  } else {
    db["premiumCommands"] = getDefaultSetup(guildId);
  }
  wJson(guildId, APP_SETUP, db);
}

function getPremiumRole(guildId, command) {
  let role = guildId;
  if (command) {
    const db = rJson(guildId, APP_SETUP);
    if (db["premiumCommands"]) {
      role = db["premiumCommands"][command];
    }
  }
  return role;
}

function rJson(guildId, app) {
  const DB = `${PATH_DB}/${guildId}`;
  let str = undefined;
  if (fs.existsSync(DB)) {
    str = JSON.parse(fs.readFileSync(`${PATH_DB}/${guildId}/${app}`, "utf8"));
  }
  return str;
}
function wJson(guildId, app, data) {
  const DB = `${PATH_DB}/${guildId}`;
  if (!fs.existsSync(DB)) {
    fs.mkdirSync(DB);
    fs.writeFileSync(`${PATH_DB}/${guildId}/${app}`, JSON.stringify(data));
  } else {
    fs.writeFileSync(`${PATH_DB}/${guildId}/${app}`, JSON.stringify(data));
  }
}

function generateOneTapDb(guildId) {
  const DB = `${PATH_DB}/${guildId}`;
  if (!fs.existsSync(DB)) {
    wJson(guildId, APP_ROOMS, {});
    wJson(guildId, APP_SETUP, {
      voiceId: null,
      parentId: null,
      premiumCommands: getDefaultSetup(guildId),
      fixedRooms: [],
      rooms: [],
      roomOwnerRole: null,
      ejectedRoom: null,
    });
    wJson(guildId, APP_USERS, {});
  }
}

function removeOneTapDb(guildId) {
  const DB = `${PATH_DB}/${guildId}`;
  if (fs.existsSync(DB)
  ) {
    fs.rmSync(DB,{ recursive: true });
    console.log(`${DB} is deleted!`);
  }
}

//setup one tap data
function setupOneTap(
  guildId,
  voiceId,
  parentId,
  fixedRooms,
  roomOwnerRole,
  ejectedRoom
) {
  const db = rJson(guildId, APP_SETUP);
  db["voiceId"] = voiceId;
  db["parentId"] = parentId;
  db["roomOwnerRole"] = roomOwnerRole;
  db["ejectedRoom"] = ejectedRoom;
  wJson(guildId, APP_SETUP, db);
  addFixedRooms(guildId, fixedRooms);
}
//get one tap data
function addFixedRooms(guildId, fixedRooms) {
  const db = rJson(guildId, APP_SETUP);
  for (let i = 0; i < fixedRooms.length; i++) {
    if (!db["fixedRooms"].includes(fixedRooms[i])) {
      db["fixedRooms"].push(fixedRooms[i]);
    }
  }
  wJson(guildId, APP_SETUP, db);
}
function removeFixedRoom(guildId, voiceId) {
  const db = rJson(guildId, APP_SETUP);
  for (let i = 0; i < db["fixedRooms"].length; i++) {
    if (db["fixedRooms"][i] == voiceId) {
      db["fixedRooms"].splice(i, 1);
      break;
    }
  }
  wJson(guildId, APP_SETUP, db);
}
//////////////[ room maker ]//////////////
function setupRooms(guildId, voiceId, parentId, fixedRooms, name, limit) {
  const db = rJson(guildId, APP_SETUP);
  addFixedRooms(guildId, fixedRooms);
  const choices = {
    solo: 1,
    duo: 2,
    trio: 3,
    squad: 4,
    unlimited: 0,
  };
  const names = {
    solo: "🔒",
    duo: "🤝",
    trio: "🌳",
    squad: "☕",
    unlimited: "🐣",
  };
  const { isHere, index } = checkIfRoomHere(guildId, voiceId);
  if (!isHere) {
    db["rooms"].push({
      voiceId,
      parentId,
      name: name ? name : names[limit],
      limit: choices[limit],
    });
    wJson(guildId, APP_SETUP, db);
  } else {
    db["rooms"][index] = {
      voiceId,
      parentId,
      name: name ? name : names[limit],
      limit: choices[limit],
    };
    wJson(guildId, APP_SETUP, db);
  }
}

function checkIfRoomHere(guildId, voiceId) {
  const db = rJson(guildId, APP_SETUP);
  let index = null;
  let isHere = false;
  for (let i = 0; i < db["rooms"].length; i++) {
    if (db["rooms"][i]["voiceId"] == voiceId) {
      isHere = true;
      index = i;
      break;
    }
  }
  return { isHere, index };
}

function isParentHasOneTap(guildId, parentId) {
  const db = rJson(guildId, APP_SETUP);
  let has = false;
  if (db["parentId"] == parentId) {
    has = true;
  }
  return has;
}

function isParentHasMaker(guildId, parentId) {
  const db = rJson(guildId, APP_SETUP);
  let has = false;
  for (let i = 0; i < db["rooms"].length; i++) {
    if (db["rooms"][i]["parentId"] == parentId) {
      has = true;
      break;
    }
  }
  return has;
}

function cleanChannelFromData(guildId, voiceId) {
  const db = rJson(guildId, APP_SETUP);
  if (db["voiceId"] == voiceId) {
    db["voiceId"] = "";
    db["parentId"] = "";
  }
  const { index, isHere } = checkIfRoomHere(guildId, voiceId);
  if (isHere) {
    db["rooms"].splice(index, 1);
  }
  wJson(guildId, APP_SETUP, db);
  removeFixedRoom(guildId, voiceId);
}

function getMaker(guildId, voiceId) {
  const db = rJson(guildId, APP_SETUP);
  let maker = null;
  for (let i = 0; i < db["rooms"].length; i++) {
    if (db["rooms"][i]["voiceId"] == voiceId) {
      maker = db["rooms"][i];
      break;
    }
  }
  return maker;
}
function countRoomsOfMaker(guildId) {
  const db = rJson(guildId, APP_SETUP);
  return db["rooms"].length;
}

//get setup data
function getSetup(guildId) {
  const db = rJson(guildId, APP_SETUP);
  return db;
}
/////////////[ Room Engine ]//////
function createRoom(guildId, roomId, ownerId, parentId) {
  const db = rJson(guildId, APP_ROOMS);
  if (!db[roomId]) {
    db[roomId] = { ownerId, parentId, managers: [] };
    wJson(guildId, APP_ROOMS, db);
  }
}
function deleteRoom(guildId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  if (db[roomId]) {
    delete db[roomId];
    wJson(guildId, APP_ROOMS, db);
  }
}
//{"ownerId":"","parentId":"","managers":[]}
function getOwnerByRoomId(guildId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let ownerId = null;
  if (db[roomId]) {
    ownerId = db[roomId]["ownerId"];
  }
  return ownerId;
}

function setOwnerByRoomId(guildId, ownerId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let done = false;
  if (db[roomId]) {
    db[roomId]["ownerId"] = ownerId;
    done = true;
    wJson(guildId, APP_ROOMS, db);
  }
  return done;
}

function cleanRoomFromOwner(guildId, userId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let done = false;
  if (db[roomId]) {
    if (db[roomId]["ownerId"] == userId) {
      db[roomId]["ownerId"] = null;
      done = true;
      wJson(guildId, APP_ROOMS, db);
    }
  }
  return done;
}

function returnRoomToOwner(guildId, userId, roomId) {
  if (getUserValueById(guildId, userId, "roomId") == roomId) {
    if (!getOwnerByRoomId(guildId, roomId)) {
      setOwnerByRoomId(guildId, userId, roomId);
    }
  }
}

function addManager(guildId, userId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let done = false;
  if (db[roomId]) {
    if (!db[roomId]["managers"].includes(userId)) {
      db[roomId]["managers"].push(userId);
      done = true;
      wJson(guildId, APP_ROOMS, db);
    }
  }
  return done;
}
function removeManager(guildId, userId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let done = false;
  if (db[roomId]) {
    if (db[roomId]["managers"].includes(userId)) {
      db[roomId]["managers"].splice(db[roomId]["managers"].indexOf(userId), 1);
      done = true;
      wJson(guildId, APP_ROOMS, db);
    }
  }
  return done;
}

function resetManagerList(guildId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let done = false;
  if (db[roomId]) {
    done = true;
    db[roomId]["managers"] = [];
    wJson(guildId, APP_ROOMS, db);
  }
  return done;
}

function getManagersList(guildId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let list = [];
  if (db[roomId]) {
    list = db[roomId]["managers"];
  }
  return list;
}

function isManagerOfRoom(guildId, userId, roomId) {
  const db = rJson(guildId, APP_ROOMS);
  let yup = false;
  if (userId) {
    if (db[roomId]) {
      yup = db[roomId]["managers"].includes(userId);
    }
  }
  return yup;
}

function resetManagersOfRoom(guildId, roomId) {
  let done = false;
  if (roomId) {
    const db = rJson(guildId, APP_ROOMS);
    if (db[roomId]) {
      db[roomId]["managers"] = [];
      wJson(guildId, APP_ROOMS, db);
      done = true;
    }
  }
  return done;
}









///////////////  [ End Room Engine ]////////////////////
///////////////////////// [ User Engine ] //////////////
function createUserById(guildId, userId) {
  const db = rJson(guildId, APP_USERS);
  let done = false;
  if (!db[userId]) {
    done = true;
    db[userId] = {
      name: null,
      blackList: [],
      whiteList: [],
      banList: [],
      roomId: null,
    };
    wJson(guildId, APP_USERS, db);
  }
  return done;
}
function getUserValueById(guildId, userId, key) {
  const db = rJson(guildId, APP_USERS);
  let value = null;
  if (db[userId]) {
    value = db[userId][key];
  }
  return value;
}
function setUserValueById(guildId, userId, key, value) {
  const db = rJson(guildId, APP_USERS);
  if (db[userId]) {
    db[userId][key] = value;
    wJson(guildId, APP_USERS, db);
  } else {
    db[userId] = {
      name: null,
      blackList: [],
      whiteList: [],
      banList: [],
      roomId: null,
    };
    db[userId][key] = value;
    wJson(guildId, APP_USERS, db);
  }
}

function whoIsOwnerOfThisRoom(guildId, roomId) {
  const db = rJson(guildId, APP_USERS);
  let ownerId = null;
  for (const key in db) {
    if (db[key]["roomId"] == roomId) {
      ownerId = key;
      break;
    }
  }
  return ownerId;
}

////// [ BLACK & WHITE & BAN LIST FUNCTIONS ADD | REMOVE] ///////////////////

function bwbList(guildId, memberId, userId, op, action) {
  const db = rJson(guildId, APP_USERS);
  let done = false;
  if (action) {
    if (db[memberId]) {
      if (!db[memberId][op].includes(userId)) {
        db[memberId][op].push(userId);
        wJson(guildId, APP_USERS, db);
        done = true;
      }
    }
  } else {
    if (db[memberId]) {
      if (db[memberId][op].includes(userId)) {
        db[memberId][op].splice(db[memberId][op].indexOf(userId), 1);
        wJson(guildId, APP_USERS, db);
        done = true;
      }
    }
  }
  return done;
}

function getBwbList(guildId, memberId, op) {
  const db = rJson(guildId, APP_USERS);
  let list = [];
  if (db[memberId]) {
    if (op == "blackList") {
      //show black list
      list = db[memberId][op];
    } else if (op == "whiteList") {
      //show white list
      list = db[memberId][op];
    } else if (op == "banList") {
      //sdd to ban list
      list = db[memberId][op];
    }
  }
  return list;
}

function transferUserFromList(guildId, memberId, someId, op) {
  const db = rJson(guildId, APP_USERS);
  let done = null;
  if (db[memberId]) {
    
    if (!db[memberId][op].includes(someId)) {
      // Define the lists to check
      const lists = ["blackList", "whiteList", "banList"];
      for (const list of lists) {
        // Check if someId is in the current list
        if (db[memberId][list].includes(someId)) {
          // If it is, remove it from the current list and add it to the op list
          bwbList(guildId, memberId, someId, list, false);
          bwbList(guildId, memberId, someId, op, true); //true action

          done = true;
          break;
        }
      }
    } else {
      done = false;
    }
  }
  return done;
}

function countBwbList(guildId, memberId, op) {
  const db = rJson(guildId, APP_USERS);
  let count = 0;
  if (db[memberId]) {
    count = db[memberId][op].length;
  }
  return count;
}

function resetBwbList(guildId, memberId) {
  const db = rJson(guildId, APP_USERS);
  if (db[memberId]) {
    const lists = ["blackList", "whiteList", "banList"];
    for (const list of lists) {
      db[memberId][list] = [];
    }
    wJson(guildId, APP_USERS, db);
  }
}

///////////////////// [ End User Engine ] //////////////////////////
module.exports = {
  generateOneTapDb,
  removeOneTapDb,
  setupOneTap,
  createRoom,
  deleteRoom,
  getSetup,
  setupRooms,
  getMaker,
  isParentHasOneTap,
  isParentHasMaker,
  cleanChannelFromData,
  setPremiumRole,
  getPremiumRole,
  getOwnerByRoomId,
  setOwnerByRoomId,
  cleanRoomFromOwner,
  getUserValueById,
  createUserById,
  setUserValueById,
  whoIsOwnerOfThisRoom,
  returnRoomToOwner,
  bwbList,
  getBwbList,
  countBwbList,
  countRoomsOfMaker,
  addManager,
  removeManager,
  isManagerOfRoom,
  getManagersList,
  resetManagersOfRoom,
  transferUserFromList,
  resetBwbList,
  resetManagerList,
};

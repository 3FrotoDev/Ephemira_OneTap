const tools = require("../tools.js");
const embeds = require("../../embeds/index.js");
const prefix = require("../../embeds/prefix.js");
const {
  isManagerOfRoom,
  getOwnerByRoomId,
  countBwbList,
  getBwbList,
  getPremiumRole,
  getSetup,
} = require("../engines/engine.js");
const { getType } = require("./guildChecker.js");


class ConditionsToExcute {
  constructor(reply, someId, client) {
    const { guild, member } = reply;
    this.guild = guild;
    this.member = member;
    this.someId = someId;
    this.listType = null;
    this.commandName = null;
    this.client = client;
    this.interaction = reply;

    this.inZone = true;
    this.noOwner = true;
    this.ownerOrManager = true;
    this.notYourself = true;
    this.notOnManagers = true;
    this.invalid = true;
    this.premium = true;
    this.categoryRoles = true;
  }
  async execute(callback, type = null) {
    const { op, some } = await tools.checkIfRoleOrUser(this.guild, this.someId);
    this.someId = some?.id;
    const checkRoleCategory = () => {
      if (this.someId) {
        const category = this.member.voice.channel.parent;
        const perms = category.permissionOverwrites.cache;
        return perms.some((perm) => perm.id == this.someId && perm.type == 0);
      }return false;};

    const checkRoleorUserLimit = async () => {
      const target = this.someId;
      const listName = this.listType;
      if (listName && target) {
        const { isWhat } = await tools.checkIfRoleOrUser(this.guild, target);
        if (isWhat === "role") {
          const roles = getBwbList(this.guild.id, this.member.id, listName).map(
            async (uid) => {
              const { isWhat, some } = await tools.checkIfRoleOrUser(
                this.guild,
                uid
              );
              if (isWhat == "role") {
                return some.id;
              }
            }
          );
          if (roles.length < this.client.system[getType(this.guild.id)].roles) {
            return true;
          } else {
            return false;
          }
        } else if (isWhat === "user") {
          const count = countBwbList(this.guild.id, this.member.id, listName);
          if (count < this.client.system[getType(this.guild.id)].users) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    };
    if (getSetup(this.guild.id)["voiceId"] == null) {
      if (type == "message") {
        return await prefix.isNotSetupedYet(this.interaction);
      } else {
        return await embeds.room.isNotSetupedYet(this.interaction, true);
      }
    } else if (
      !tools.checkMemberInZone(this.guild.id, this.member) &&
      this.inZone
    ) {
      //you must be in voice zone
      if (type == "message") {
        return await prefix.notInZone(
          this.interaction,
          getSetup(this.guild.id)["voiceId"]
        );
      } else {
        // prefix;
        return await embeds.room.notInZone(
          this.interaction,
          getSetup(this.guild.id)["voiceId"],
          false
        );
      }
    } else if (
      getOwnerByRoomId(this.guild.id, this.member.voice.channel.id) == null &&
      this.noOwner
    ) {
      //room has no owner
      if (type == "message") {
        return await prefix.roomHasNoOwner(this.interaction);
      } else {
        return await embeds.room.roomHasNoOwner(this.interaction, true);
      }
    } else if (
      !(
        getOwnerByRoomId(this.guild.id, this.member.voice.channel.id) ==
          this.member.id ||
        isManagerOfRoom(
          this.guild.id,
          this.member.id,
          this.member.voice.channel.id
        )
      ) &&
      this.ownerOrManager
    ) {
      // he is not owner or manager.
      if (type == "message") {
        return await prefix.notTheRoomOwner(this.interaction, this.member);
      } else {
        return await embeds.room.notTheRoomOwner(this.interaction, true, this.member);
      }
    } else if (this.someId == this.member.id && this.notYourself) {
      //not yourself
      if (type == "message") {
        return await prefix.notYourself(this.interaction);
      } else {
        return await embeds.room.notYourself(this.interaction, true);
      }
    } else if (
      !this.member.roles.cache.has(
        getPremiumRole(this.guild.id, this.commandName)
      ) &&
      this.premium
    ) {
      //
      if (type == "message") {
        return await prefix.onlyPremium(this.interaction);
      } else {
        return await embeds.room.onlyPremium(this.interaction, true);
      }
    } else if (
      getOwnerByRoomId(this.guild.id, this.member.voice.channel.id) !=
        this.member.id &&
      (isManagerOfRoom(
        this.guild.id,
        this.someId,
        this.member.voice.channel.id
      ) ||
        getOwnerByRoomId(this.guild.id, this.member.voice.channel.id) ==
          this.someId) &&
      this.notOnManagers
    ) {
      //commands don't work on managers or owner
      if (type == "message") {
        return await prefix.notOnOwnerOrManager(this.interaction);
      } else {
        return await embeds.room.notOnOwnerOrManager(this.interaction, true);
      }
    } else if (!this.someId && this.invalid) {
      // invalid Id
      if (type == "message") {
        return await prefix.undefinedID(this.interaction);
      } else {
        return await embeds.room.undefinedID(this.interaction, true);
      }
      // manager has no permission to abuse on managers or owner
    } else if (checkRoleorUserLimit() && this.limit) {
      //check limits
      if (type == "message") {
        return await prefix.limit(this.interaction);
      } else {
        return await embeds.room.limit(this.interaction, true);
      }
    } else if (checkRoleCategory() && this.categoryRoles) {
      //stop permitting or rejecting category roles
      if (type == "message") {
        return await prefix.notOncategoryRoles(this.interaction, op);
      } else {
        return await embeds.room.notOncategoryRoles(
          this.interaction,
          op,
          false
        );
      }
    }
    await callback();
  }
}
//
module.exports = {
  ConditionsToExcute,
};


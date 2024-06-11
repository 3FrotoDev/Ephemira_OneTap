const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    
    async execute(client) {
        client.user.setActivity({
            type: ActivityType.Custom,
            name: 'customstatus',
            state: '.v help | @Ephemira ✨'
        })
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};
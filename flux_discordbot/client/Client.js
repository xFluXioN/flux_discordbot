const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
    constructor(config) {
        super({
            disabledEvents: ['TYPING_START'],
        });

        this.commands = new Collection();

        this.queue = new Map();

        this.config = config;
    }
};
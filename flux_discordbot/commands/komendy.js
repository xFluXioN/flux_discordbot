const fs = require('fs');

module.exports = {
    name: 'komendy',
    description: 'Lista wszystkich dostępnych komend',
    execute(message) {
        let str = '**KOMENDY DOSTĘPNE NA DISCORDZIE XXX**\n';
        const commandFiles = fs
            .readdirSync('./commands')
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            str += "```Nazwa: !" + command.name + "\nOpis: " + command.description + "```";
        }

        message.author.send(str);
    },
};
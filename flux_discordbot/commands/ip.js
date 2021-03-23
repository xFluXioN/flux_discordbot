const fs = require('fs');

module.exports = {
    name: 'ip',
    description: 'Wyświetl IP serwera',
    execute(message) {
		message.reply("aby połączyć się z serwerem wpisz: connect xxx");
    }
};
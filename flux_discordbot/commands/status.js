const fs = require('fs');

module.exports = {
    name: 'status',
    description: 'Wyświetl status serwera',
    execute(message) {
		message.reply("<#11111111111>"); // <- tutaj ID kanału dajemy po # (to jest kanał głosowy który musimy zrobić pod bota)
    }
};
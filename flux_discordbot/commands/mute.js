const fs = require('fs');
const role = 'xxx'; //ID roli "muted"
const channel = 'xxx'; //ID kanału na którym wpisujemy komendę do mute'a
const needRole = 'xxx'; //ID roli potrzebnej do nadania rangi (admin)

module.exports = {
    name: 'mute',
    description: 'Dodaj rangę "Muted" dla danego użytkownika (tylko dla administracji)',
    execute(message) {
		let channelid = message.channel.id;
		let author = message.author;
		if (channelid === channel) {
			if (message.member.roles.cache.some(role => role.id === needRole)){
				let ping = message.content.substring(6);
				let user = message.mentions.members.first();
				message.delete();
				if (user.roles.cache.some(r => r.id === role)) {
					message.reply("Usunięto rolę MUTE gracza " + ping);
					user.roles.remove(role);
				} else {
					message.reply("Dodano rolę MUTE dla gracza " + ping);
					user.roles.add(role);
				}
			} else {
				message.delete();
				author.send("Nie masz odpowiedniej rangi do użycia tej komendy");
			}
		} else {
			message.delete();
			author.send("Na tym kanale nie możesz użyć komendy !mute!");
		}
    },
};
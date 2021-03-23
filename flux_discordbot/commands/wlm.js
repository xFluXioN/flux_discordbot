const fs = require('fs');
const role = 'xxx'; //ID roli obywatel
const channel = 'xxx'; //ID kanału dla WL checkerów do dodawania nowych WL na DC
const oldRole = 'xxx'; //ID rangi tymczasowej oznaczającej brak WL
const needRole = 'xxx'; //Ranga potrzebna do użycia komendy

module.exports = {
    name: 'wlm',
    description: 'Dodaj rangę "Obywatel" dla danego użytkownika (tylko dla administracji)',
    execute(message) {
		let channelid = message.channel.id;
		let author = message.author;
		if (channelid === channel) {
			if (message.member.roles.cache.some(role => role.id === needRole)){
				let ping = message.content.substring(5);
				let user = message.mentions.members.first();
				message.delete();
				if (user.roles.cache.some(r => r.id === role)) {
					message.reply("Usunięto rolę OBYWATEL gracza " + ping);
					user.roles.add(oldRole);
					user.roles.remove(role);
				} else {
					message.reply("Dodano rolę OBYWATEL dla gracza " + ping);
					user.roles.add(role);
					user.roles.remove(oldRole);
				}
			} else {
				message.delete();
				author.send("Nie masz odpowiedniej rangi do użycia tej komendy");
			}
		} else {
			message.delete();
			author.send("Na tym kanale nie możesz użyć komendy /wlm!");
		}
    },
};
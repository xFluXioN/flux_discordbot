const fs = require('fs');
const tempModule = require('../index.js');

const filterName = m => m.content != null; //Filtr do imienia i nazwiska
const filterMessage = m => m.content != null; //Filtr do wiadomości
const filterConfirm = m => (m.content).toLowerCase() === "tak"; //Filtr do potwierdzania
const channelid = 'xxx'; //ID kanału tweeter na DC

const loginEmbed = {
	color: 0x0099ff,
	title: 'LOGOWANIE...',
	author: {
		name: "Tweeter Los Santos",
		icon_url: 'https://i.imgur.com/aJZ7Qac.gif',
	},
	description: 'Pamiętaj, aby zachować zasady IC oraz kulturę osobistą podczas wstawiania postów na #「🌐」twitter',
};

const nameEmbed = {
	color: 0x0099ff,
	title: 'Wpisz imię i nazwisko',
	description: 'Dla przykładu: John Kovalsky (Posty bez imienia i nazwiska będą kasowane)',
	footer: {
		text: "Masz 30 sekund na wpisanie danych"
	}
};

const messageEmbed = {
	color: 0x0099ff,
	title: 'Wpisz wiadomość',
	description: 'Miejsce do zwykłych rozmów pomiędzy obywatelami oraz obywatelkami',
	footer: {
		text: "Masz 3 minuty na napisanie swojego Tweeta"
	}
};

const confirmEmbed = {
	color: 0x0099ff,
	title: 'Czy na pewno chcesz wrzucić post?',
	description: 'Wpisz "tak", bądź odczekaj 15 sekund jeżeli nie',
	footer: {
		text: "Masz 15 sekund na zatwierdzenie postu"
	}
}

const successEmbed = {
	color: 0x0099ff,
	title: 'Twój post został wrzucony!',
	description: 'Sprawdź kanał #「🌐」twitter',
}

const errorEmbed = {
	color: 0x0099ff,
	title: 'Czas minął'
}


module.exports = {
    name: 'tweet',
    description: 'Dodaj post na tweetera -> Forma IC!',
    execute(message) {
		let twtName = "";
		let twtMessage = "";
		let author = message.author;
		console.log(author);
		if (message.channel.type == 'dm') {
			message.channel.send({embed:loginEmbed}).then((msg) => {
				let botmsg = msg;
				setTimeout(function(){
					botmsg.edit({embed:nameEmbed}).then(() => {
						message.channel.awaitMessages(filterName, {max: 1, time: 30000, errors: ['time'] })
						.then(collected => {
							twtName = collected.first().content;
							message.channel.send({embed:messageEmbed}).then(() => {
								message.channel.awaitMessages(filterMessage, {max: 1, time: 180000, errors: ['time'] })
								.then(collected => {
									twtMessage = collected.first().content;
									let doneEmbed = {
										color: 0x0099ff,
										description: twtMessage,
										author: {
											name: twtName,
											icon_url: 'https://i.imgur.com/kCtSayy.png',
										},
										timestamp: new Date(),
										footer: {
											text: "By " + message.author.tag,
										}
									};
									message.channel.send({embed:doneEmbed});
									message.channel.send({embed:confirmEmbed}).then(() => {
										message.channel.awaitMessages(filterConfirm, {max: 1, time: 15000, errors: ['time'] })
										.then(collected => {
											tempModule.sendToChannel(channelid, {embed:doneEmbed});
											message.channel.send({embed:successEmbed});
										})
										.catch(collected => {
											message.channel.send({embed:errorEmbed});
										});
									});
								})
								.catch(collected => {
									message.channel.send({embed:errorEmbed});
								});
							});
						})
						.catch(collected => {
							message.channel.send({embed:errorEmbed});
						});
					});
				}, 3000);
			});
		} else {
			message.delete();
			author.send("Komendy !tweet używaj tylko na DM bota!");
		}
    },
};
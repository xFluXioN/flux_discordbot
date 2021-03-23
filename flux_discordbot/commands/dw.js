const fs = require('fs');
const tempModule = require('../index.js');

const filterName = m => m.content != null; //Filtr do nickname
const filterMessage = m => m.content != null; //Filtr do wiadomości
const filterConfirm = m => (m.content).toLowerCase() === "tak"; //Filtr - potwierdzenie
const channelid = 'xxx'; //ID kanału DW na DC

const loginEmbed = {
	color: 0x990000,
	title: 'LOGOWANIE...',
	author: {
		name: "Dark Web Los Santos",
		icon_url: 'https://i.imgur.com/aJZ7Qac.gif',
	},
	description: 'Pamiętaj, aby zachować zasady IC podczas wstawiania postów na #「🌐」darkweb',
};

const nameEmbed = {
	color: 0x990000,
	title: 'Wpisz swoją anonimową nazwę',
	description: 'Dla przykładu: AnalDevastator69',
	footer: {
		text: "Masz 30 sekund na wpisanie nazwy"
	}
};

const messageEmbed = {
	color: 0x990000,
	title: 'Wpisz wiadomość',
	description: 'Miejsce dla czarnego rynku, handlu bronią, narkotykami itp.',
	footer: {
		text: "Masz 3 minuty na napisanie swojego Dark Weba"
	}
};

const confirmEmbed = {
	color: 0x990000,
	title: 'Czy na pewno chcesz wrzucić post?',
	description: 'Wpisz "tak", bądź odczekaj 15 sekund jeżeli nie',
	footer: {
		text: "Masz 15 sekund na zatwierdzenie postu"
	}
}

const successEmbed = {
	color: 0x990000,
	title: 'Twój post został wrzucony!',
	description: 'Sprawdź kanał #darkweb',
}

const errorEmbed = {
	color: 0x990000,
	title: 'Czas minął'
}


module.exports = {
    name: 'dw',
    description: 'Dodaj post na Dark Web -> Forma IC!',
    execute(message) {
		let dwName = "";
		let dwMessage = "";
		if (message.channel.type == 'dm') {
			message.channel.send({embed:loginEmbed}).then((msg) => {
				let botmsg = msg;
				setTimeout(function(){
					botmsg.edit({embed:nameEmbed}).then(() => {
						message.channel.awaitMessages(filterName, {max: 1, time: 30000, errors: ['time'] })
						.then(collected => {
							dwName = collected.first().content;
							message.channel.send({embed:messageEmbed}).then(() => {
								message.channel.awaitMessages(filterMessage, {max: 1, time: 180000, errors: ['time'] })
								.then(collected => {
									dwMessage = "||" + collected.first().content + "||";
									let doneEmbed = {
										color: 0x990000,
										description: dwMessage,
										author: {
											name: dwName,
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
			author.send("Komendy !dw używaj tylko na DM bota!");
		}
    },
};
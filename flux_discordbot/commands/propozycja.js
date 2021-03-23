const fs = require('fs');
const tempModule = require('../index.js');

const filterCategory = m => m.content.length > 3; //Filtr do kategorii minimum 4 znaki
const filterDesc = m => m.content.length > 50; //Filtr do opisu minimum 51 znaków
const filterConfirm = m => (m.content).toLowerCase() === "tak";
const channelid = 'xxx'; //ID kanału propozycje na DC

const categoryEmbed = {
	color: 0xff8000,
	title: 'Czego dotyczy propozycja?',
	description: 'Zanim przejdziesz do następnych kroków upewnij się, że propozycja jeszcze nie istnieje!',
	footer: {
		text: "Masz 1 minutę na wpisanie danych"
	}
};

const descEmbed = {
	color: 0xff8000,
	title: 'Opisz dokładnie propozycję',
	description: 'Jeżeli posiadasz zdjęcia wyślij je jako zwykły link. Opis musi zawierać minimum 50 znaków.',
	footer: {
		text: "Masz 5 minut na opisanie propozycji"
	}
};

const confirmEmbed = {
	color: 0xff8000,
	title: 'Czy na pewno chcesz dodać tę propozycję?',
	description: 'Wpisz "tak", bądź odczekaj 15 sekund jeżeli nie',
	footer: {
		text: "Masz 15 sekund na zatwierdzenie propozycji"
	}
}

const successEmbed = {
	color: 0xff8000,
	title: 'Twoja propozycja została dodana!',
	description: 'Sprawdź kanał #「⭐」propozycje',
}

const errorEmbed = {
	color: 0xff8000,
	title: 'Czas minął'
}


module.exports = {
    name: 'propozycja',
    description: 'Masz propozycję? Użyj tej komendy w PW u bota!',
    execute(message) {
		let category = "";
		let desc = "";
		if (message.channel.type == 'dm') {
			message.channel.send({embed:categoryEmbed}).then(() => {
				message.channel.awaitMessages(filterCategory, {max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					category = collected.first().content;
					message.channel.send({embed:descEmbed}).then(() => {
						message.channel.awaitMessages(filterDesc, {max: 1, time: 300000, errors: ['time'] })
						.then(collected => {
							desc = collected.first().content;
							let doneEmbed = {
								color: 0xff8000,
								description: desc,
								title: category,
								author: {
									name: message.author.tag,
									icon_url: 'https://i.imgur.com/kCtSayy.png',
								},
								timestamp: new Date(),
							};
							message.channel.send({embed:doneEmbed});
							message.channel.send({embed:confirmEmbed}).then(() => {
								message.channel.awaitMessages(filterConfirm, {max: 1, time: 15000, errors: ['time'] })
								.then(collected => {
									tempModule.sendToChannelAddReactions(channelid, {embed:doneEmbed});
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
		} else {
			message.delete();
			author.send("Komendy !propozycja używaj tylko na DM bota!");
		}
    },
};
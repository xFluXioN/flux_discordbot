const fs = require('fs');
const tempModule = require('../index.js');

const filterName = m => m.content != null; //Jakieś filtry od zdjęć i tagów
const filterPhoto = m => m.attachments.size > 0;
const filterTags = m => m.content != null;
const filterConfirm = m => (m.content).toLowerCase() === "tak";
const channelid = 'xxx'; //ID kanału instagram na DC

const loginEmbed = {
	color: 0x9455f9,
	title: 'LOGOWANIE...',
	author: {
		name: "Instagram Los Santos",
		icon_url: 'https://i.imgur.com/aJZ7Qac.gif',
	},
	description: 'Pamiętaj, aby zachować zasady IC oraz kulturę osobistą podczas wstawiania zdjęć na #「🌐」instagram',
};

const nameEmbed = {
	color: 0x9455f9,
	title: 'Wpisz nazwę użytkownika lub imię i nazwisko',
	description: 'Dla przykładu: John Kovalsky',
	footer: {
		text: "Masz 30 sekund na wpisanie nazwy"
	}
};

const photoEmbed = {
	color: 0x9455f9,
	title: 'Wstaw zdjęcie oraz opis',
	description: 'Dla przykładu: Wyjazd z rodziną do Paleto',
	footer: {
		text: "Masz 1 minutę na wrzucenie zdjęcia i dodanie opisu"
	}
};

const tagsEmbed = {
	color: 0x9455f9,
	title: 'Dodaj tagi',
	description: 'Dla przykładu: #Rodzinnie #Trip',
	footer: {
		text: "Masz 30 sekund na dodanie tagów"
	}
};

const confirmEmbed = {
	color: 0x9455f9,
	title: 'Czy na pewno chcesz wrzucić zdjęcie?',
	description: 'Wpisz "tak", bądź odczekaj 15 sekund jeżeli nie',
	footer: {
		text: "Masz 15 sekund na zatwierdzenie postu"
	}
}

const successEmbed = {
	color: 0x9455f9,
	title: 'Twoje zdjęcie zostało wrzucone!',
	description: 'Sprawdź kanał #「🌐」instagram ',
}

const errorEmbed = {
	color: 0x9455f9,
	title: 'Czas minął'
}


module.exports = {
    name: 'ig',
    description: 'Dodaj post na instagram -> Forma IC!',
    execute(message) {
		let author = message.author;
		let instName = "";
		let instPhoto = "";
		let instDesc = "";
		let instTags = "";
		if (message.channel.type == 'dm') {
			message.channel.send({embed:loginEmbed}).then((msg) => {
				let botmsg = msg;
				setTimeout(function(){
					botmsg.edit({embed:nameEmbed}).then(() => {
						message.channel.awaitMessages(filterName, {max: 1, time: 30000, errors: ['time'] })
						.then(collected => {
							instName = collected.first().content;
							message.channel.send({embed:photoEmbed}).then(() => {
								message.channel.awaitMessages(filterPhoto, {max: 1, time: 60000, errors: ['time'] })
								.then(collected => {
									let Photo = (collected.first().attachments).array();
									instPhoto = Photo[0].url;
									instDesc = collected.first().content;									
									message.channel.send({embed:tagsEmbed}).then(() => {
										message.channel.awaitMessages(filterTags, {max: 1, time: 30000, errors: ['time'] })
										.then(collected => {
											instTags = collected.first().content;
											let doneEmbed = {
												color: 0x9455f9,
												description: instDesc,
												author: {
													name: instName,
													icon_url: 'https://i.imgur.com/kCtSayy.png',
												},
												image: {
													url: instPhoto,
												},
												timestamp: new Date(),
												footer: {
													text: "By " + message.author.tag + " • Tagi: " + instTags
												},
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
						})
						.catch(collected => {
							message.channel.send({embed:errorEmbed});
						});
					});
				}, 3000);
			});
		} else {
			message.delete();
			author.send("Komendy !ig używaj tylko na DM bota!");
		}
    },
};
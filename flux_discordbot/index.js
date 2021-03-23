const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const fetch = require('node-fetch');
const { prefix, token } = require('./config.json');

let memberChannel;
let onlineChannel;
let serverChannel;
const memberChannelID = 'xxx'; //ID Kanał głosowy do zliczania wszystkich członków
const onlineChannelID = 'xxx'; //ID Kanał głosowy do zliczania osób online
const serverChannelID = 'xxx'; //ID Kanał głosowy do zliczania osób online na serwerze fivem
const serverID = 'xxx'; //ID serwera discord
const newUserChannelID = 'xxx'; //ID Kanał gdy ktoś dołączy na DC
const newUserRoleID = 'xxx'; //ID rangi bez WL (nadaje w momencie dołączenia do serwera DC)

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
	client.user.setActivity('Wpisz !komendy, aby uzyskać listę dostępnych komend...', { type: 'WATCHING'});
	console.log("------------------------------------------------------");
	console.log(`${client.user.username} został włączony prawidłowo!!!`);
	console.log("------------------------------------------------------");
	client.channels.fetch(memberChannelID).then(chan => {
		memberChannel = chan;
	});
	client.channels.fetch(onlineChannelID).then(chan2 => {
		onlineChannel = chan2;
	});
	client.channels.fetch(serverChannelID).then(chan3 => {
		serverChannel = chan3;
	});
	client.setInterval(server, 300000);
	client.setInterval(update, 600000);
});

client.on('reconnecting', () => {
    console.log('Reconnecting!');
});

client.on('disconnect', () => {
    console.log('Disconnect!');
	client.user.setStatus("offline");
});

function server() {
	fetch("http://xx.xx.xxx.xxx:xxx/info.json", { method: "Get" }).then(res => res.json()).then((infojson) => {
		fetch("http://xx.xx.xxx.xxx:xxx/players.json", { method: "Get" }).then(res2 => res2.json()).then((playersjson) => {
			infojson = JSON.stringify(infojson);
			infojson = JSON.parse(infojson);
			playersjson = JSON.stringify(playersjson);
			playersjson = JSON.parse(playersjson);
			var playerMax = parseInt(infojson.vars.sv_maxClients);
			var playerCount = playersjson.length;
			var queueCount = parseInt(infojson.vars.Kolejka); //Żeby poprawnie zczytywać ilość osób w kolejce musicie odpowiednio połączyć to ze swoim skryptem który za to odpowiada -> Pomoże funkcja SetConvar("Kolejka", tostring(Ilość_osób_w_kolejce)) zamknięta w wątku po ServerSide
			
			if (queueCount > 0) {
				serverChannel.setName("「" + playerCount + "/" + playerMax + "+" + queueCount + "」 FIVEM");
			} else {
				serverChannel.setName("「" + playerCount + "/" + playerMax + "」 FIVEM");
			}
		}). catch((err) => {
			serverChannel.setName("「OFFLINE」 FIVEM");
		});
	}). catch((err) => {
		serverChannel.setName("「OFFLINE」 FIVEM");
	});
}

function update() {
	const guild = client.guilds.cache.get(serverID);
	var memberCount = guild.memberCount;
	var activeCount = guild.members.cache.filter(m => m.presence.status != 'offline').size;
	memberChannel.setName("「" + memberCount + "」 Osób");
	onlineChannel.setName("「" + activeCount + "」 Online");
}

client.on('guildMemberAdd', member => {
	const guild = client.guilds.cache.get(serverID);
	var memberCount = guild.memberCount;
	let user = member.user;
	let avatarURL = user.avatarURL();
	if (avatarURL === null){
		avatarURL = "https://cdn.discordapp.com/embed/avatars/0.png";
	}
    member.guild.channels.cache.get(newUserChannelID).send({embed: {
		color: 0x0099ff,
		author: {
			name: user.username + "#" + user.discriminator,
			icon_url: 'https://i.imgur.com/kCtSayy.png',
		},
		description: "Witamy na serwerze XXX. Jesteś naszym **" + memberCount + "** użytkownikiem. Cieszymy się, że z nami jesteś! Aby uzyskać WL na serwerze przeczytaj regulamin oraz zgłoś się na kanał xxx",
		thumbnail: {
			url: avatarURL,
		},
		timestamp: new Date(),
		footer: {
			text: "DC Bot By FluX",
		}
	}});
	member.roles.add(newUserRoleID);
});

client.on('message', async (message) => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
	let author = message.author;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    try {
        if (commandName == 'ban' || commandName == 'userinfo') {
            command.execute(message, client);
        } else {
            command.execute(message);
        }
    } catch (error) {
        author.send("`Komenda " + commandName + " nie istnieje!`\nWpisz !komendy, aby sprawdzić listę dostępnych komend");
    }
});

exports.sendToChannel = function(channel, message){
	client.channels.cache.get(channel).send(message);
}

exports.sendToChannelAddReactions = function(channel, message){
	client.channels.cache.get(channel).send(message).then((msg) => {
		msg.react("👍")
        msg.react("👎")
	});
}

client.login(token);
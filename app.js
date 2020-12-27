var { Client } = require("discord.js");
var query = require("source-server-query");
var fs = require("fs");

var client = new Client();
var servers = null;
var updateMsg = null;

client.on("ready", () => {
	servers = JSON.parse(fs.readFileSync(`${__dirname}/servers.json`, "utf8"));
	console.log(`------------------------------------\nLogged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers, serving ${client.users.cache.size} users.\n------------------------------------`);
	client.user.setActivity(client.users.cache.size+" brugere", { type: "WATCHING" });
	updateServers(updateMsg, "792608728503418880"); // Erstat "792608728503418880" med eget Kanal ID.
	client.setInterval(() => updateServers(updateMsg, "792608728503418880"), 60000); // Erstat "792608728503418880" med eget Kanal ID.
});

[ "guildCreate", "guildDelete", "guildMemberAdd", "guildMemberRemove" ].map(e => client.on(e, () => client.user.setActivity(client.users.cache.size+" brugere", { type: "WATCHING" })));

async function updateServers(message = updateMsg, channel = "792608728503418880") { // message er updateMsg variable ved default, og channel er min egen test kanal ved default.
	servers = JSON.parse(fs.readFileSync(`${__dirname}/servers.json`, "utf8"));
	var embed = {
		embed: {
			title: "Server List",
			color: 0xD8182B,
			description: "Her kan du se listen af vores servere, deres status, og hvor mange spillere er på.",
			thumbnail: {
				url: "https://i.imgur.com/PquMB6Z.png"
			},
			fields: [],
			timestamp: new Date()
		}
	};
	if(message === null) {
		for (var i = 0; i < servers.length; i++) {
			var server = servers[i];
			var info = await query.info(server.ip, server.port);
			if(info instanceof Error) {
				embed.embed.fields.push({ name: server.name, value: `🔴 | ${server.name} - 0/0 | IP: ${server.ip}:${server.port}` });
			} else {
				embed.embed.fields.push({ name: server.name, value: `🟢 | ${server.name} - ${info.playersnum}/${info.maxplayers} | IP: ${server.ip}:${server.port}` });
			}
		}
		var messages = await client.channels.cache.get(channel).messages.fetch();
		messages.first() == null ? client.channels.cache.get(channel).send(embed).then(msg => {
			updateMsg = msg;
		}) : messages.first().edit(embed).then(msg => {
			updateMsg = msg;
		});
	} else {
		for (var i = 0; i < servers.length; i++) {
			var server = servers[i];
			var info = await query.info(server.ip, server.port);
			if(info instanceof Error) {
				embed.embed.fields.push({ name: server.name, value: `🔴 | ${server.name} - 0/0 | IP: ${server.ip}:${server.port}` });
			} else {
				embed.embed.fields.push({ name: server.name, value: `🟢 | ${server.name} - ${info.playersnum}/${info.maxplayers} | IP: ${server.ip}:${server.port}` });
			}
		}
		updateMsg.edit(embed).then(msg => {
			updateMsg = msg;
		});
	}
};

client.login("blafguijer8hj"); // Eget token

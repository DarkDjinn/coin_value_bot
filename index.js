const TelegramBot = require('node-telegram-bot-api');
const { token } = require('./config');
const openDb = require('./db');
const getCoinValue = require('./utils/getCoinValue');
const { start, help, symbols, notify, remove } = require('./routes');
const bot = new TelegramBot(token, { polling: true });

(async () => {
	const db = await openDb();
	const userChats = await db.all('select * from user');
	if (userChats.length) {
		for (let userChat of userChats) {
			const existingNotifications = await db.all(
				`select * from user_symbols where user_id = ${userChat.id}`
			);
			if (existingNotifications.length) {
				for (let { symbol_id, operator, value } of existingNotifications) {
					const symbol = await db.get(`select * from symbols where id = ${symbol_id}`);
					getCoinValue(bot, userChat.id, symbol, operator, value, userChat.chat_id);
				}
			}
		}
	}
})();

start(bot);

help(bot);

symbols(bot);

notify(bot);

remove(bot);

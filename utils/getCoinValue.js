const ccxt = require('ccxt');
const openDb = require('../db');

module.exports = async (bot, userId, dbSymbol, operator, value, chatId) => {
	let exchange = new ccxt['binance']({ enableRateLimit: true });
	let work = true;
	const db = await openDb();
	while (work) {
		try {
			const ticker = await exchange.fetchTicker(dbSymbol.symbol);

			if (operator === '>') {
				if (ticker['bid'] >= value) {
					work = false;
					bot.sendMessage(
						chatId,
						`Attention!\n${dbSymbol.symbol} is now higher than ${value}.\nCurrent value is ${ticker['bid']}.\nPlease set another notification or use /help for options.`
					);
					await db.exec(
						`delete from user_symbols where user_id = ${userId} and symbol_id = ${dbSymbol.id} and operator = '${operator}' and value = ${value}`
					);
				}
			} else {
				if (ticker['bid'] <= value) {
					work = false;
					bot.sendMessage(
						chatId,
						`Attention!\n${dbSymbol.symbol} is now lower than ${value}.\nCurrent value is ${ticker['bid']}.\nPlease set another notification or use /help for options.`
					);
					await db.exec(
						`delete from user_symbols where user_id = ${userId} and symbol_id = ${dbSymbol.id} and operator = '${operator}' and value = ${value}`
					);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
};

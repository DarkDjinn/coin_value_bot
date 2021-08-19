const ccxt = require('ccxt');
const openDb = require('../../db');
const getCoinValue = require('../../utils/getCoinValue');

module.exports = bot => {
	bot.onText(/\/notify (\w+\/\w+)(?:\s)?(.{1})?(?:\s)?(.+)?/, async (msg, match) => {
		let exchange = new ccxt['binance']({ enableRateLimit: true });

		const chatId = msg.chat.id;
		const symbol = match[1];
		const operator = match[2];
		const value = match[3];

		try {
			const ticker = await exchange.fetchTicker(symbol);

			if (symbol && !operator && !value) {
				return bot.sendMessage(chatId, `Current ${symbol} value is ${ticker['bid']}`);
			}

			if (operator !== '>' && operator !== '<')
				return bot.sendMessage("Invalid operator chosen!\n Operators are: '<' or '>'");

			const db = await openDb();

			let dbSymbol = await db.get('select * from symbols where symbol = ?', symbol);
			if (!dbSymbol)
				return bot.sendMessage(
					chatId,
					`Incorrect symbol.\nType \'Symbols\' to get a list of symbols`
				);

			const user = await db.get('select id from user where chat_id = ?', chatId);

			const alreadyChosen = await db.get(
				'select * from user_symbols where user_id = ? and symbol_id = ? and operator = ? and value = ?',
				[user.id, dbSymbol.id, operator, value]
			);

			if (dbSymbol && !alreadyChosen) {
				await db.exec(
					`insert into user_symbols (user_id, symbol_id, operator, value) values (${user.id}, ${dbSymbol.id}, '${operator}', ${value})`
				);
				bot.sendMessage(
					chatId,
					`Symbol ${symbol} chosen succesfully.\n` +
						`Current ${symbol} value is ${ticker['bid']}.\n` +
						`You will be notified when ${symbol} is at the value of ${operator} ${value}`
				);
				getCoinValue(bot, user.id, dbSymbol, operator, value, chatId);
			} else if (dbSymbol && alreadyChosen) {
				return bot.sendMessage(
					chatId,
					`Requested notification of ${symbol} ${operator} ${value} was already chosen and you will be notified about it.`
				);
			}
		} catch (err) {
			console.log(err);
		}
	});
};

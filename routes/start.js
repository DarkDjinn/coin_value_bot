const openDb = require('../db');

module.exports = bot => {
	bot.onText(/\/start/, async msg => {
		const chatId = msg.chat.id;
		const helpMsg =
			'Welcome, here are your options:\n' +
			'Type /help at any time for this message.\n' +
			'1. Type /symbols to get a list of currently supported symbols.\n' +
			'2. Type /notify {symbol} to get current value of the symbol.\n' +
			'3. Type /notify {symbol} {operator} {value} to select a symbol and a value to be notified about.\n' +
			"Operators are: '>' or '<'\n" +
			'4. Type /remove to get a list of currently selected symbols.\n' +
			'5. Type /remove {id} to remove the symbol from the selected list.';

		try {
			const db = await openDb();
			await db.exec(`insert into user (chat_id) values (${chatId})`);
		} catch (err) {
			console.log(err);
		}

		const opts = {
			reply_markup: {
				resize_keyboard: true,
				keyboard: [
					['/notify BTC/USDT', '/notify ETH/USDT', '/notify DOGE/USDT'],
					['/symbols', '/remove', '/help'],
				],
			},
		};

		bot.sendMessage(chatId, helpMsg, opts);
	});
};

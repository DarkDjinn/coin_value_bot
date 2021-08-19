const openDb = require('../../db');

module.exports = bot => {
	bot.onText(/\/remove(?:\s?)(\d+)?/, async (msg, match) => {
		const chatId = msg.chat.id;
		const userSymbolId = match[1];

		try {
			const db = await openDb();
			const user = await db.get('select * from user where chat_id = ?', [chatId]);
			const userSymbols = await db.all(
				'select us.id, us.symbol_id, us.operator, us.value, s.symbol from user_symbols us join symbols s on us.symbol_id = s.id where user_id = ?',
				user.id
			);
			const selectedSymbol = userSymbols.find(sym => sym.symbol_id === parseInt(userSymbolId));
			if (!userSymbols.length) {
				return bot.sendMessage(chatId, 'You dont have any symbols selected.');
			}

			if (!userSymbolId) {
				bot.sendMessage(
					chatId,
					'Please select the id you want to remove:\n' +
						userSymbols.map(sym => `${sym.symbol_id}. ${sym.symbol}`).join('\n') +
						'\n' +
						'Usage: /remove {id}'
				);
			} else if (selectedSymbol) {
				await db.exec(`delete from user_symbols where id = ${selectedSymbol.id}`);
				bot.sendMessage(
					chatId,
					`Notification about ${selectedSymbol.symbol} ${selectedSymbol.operator} ${selectedSymbol.value} removed successfully.`
				);
			} else {
				bot.sendMessage(chatId, 'Wrong symbol id selected.');
			}
		} catch (err) {
			console.log(err);
		}
	});
};

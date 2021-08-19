const openDb = require('../../db');
const chunkify = require('../../utils/chunkify');

module.exports = bot => {
	bot.onText(/\/symbols/, async (msg, match) => {
		const chatId = msg.chat.id;

		try {
			const db = await openDb();
			const res = await db.all('select * from symbols');

			const messages = chunkify(res, 4, true);

			for (let message of messages) {
				bot.sendMessage(chatId, message.map(row => row.symbol).join('\n'));
			}
		} catch (err) {
			console.log(err);
		}
	});
};

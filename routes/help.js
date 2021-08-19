module.exports = bot => {
	bot.onText(/\/help/, msg => {
		const chatId = msg.chat.id;
		const helpMsg =
			'Welcome, here are your options:\n' +
			'1. Type /symbols to get a list of currently supported symbols.\n' +
			'2. Type /notify {symbol} to get current value of the symbol.\n' +
			'3. Type /notify {symbol} {operator} {value} to select a symbol and a value to be notified about.\n' +
			"Operators are: '>' or '<'\n" +
			'4. Type /remove to get a list of currently selected symbols.\n' +
			'5. Type /remove {id} to remove the symbol from the selected list.';
		bot.sendMessage(chatId, helpMsg);
	});
};

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = async () => {
	return open({
		filename: 'db.sqlite',
		driver: sqlite3.Database,
	});
};

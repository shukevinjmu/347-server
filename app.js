const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

function rowToObject(row) {
	return {
		user: row.user,
		reddit1: row.reddit1,
		reddit2: row.reddit2,
		reddit3: row.reddit3,
	}
}

app.get('/user/:username', (request, response) => {
	const query = 'SELECT user, reddit1, reddit2, reddit3 FROM db WHERE user = ?';
	const params = [request.params.username];
	connection.query(query, params, (error, rows) => {
		response.send({
			ok: true,
			db: rows.map(rowToObject),
		});
	});
});

app.post('/new', (request, response) => {
	const query = 'INSERT INTO db(user, reddit1, reddit2, reddit3) VALUES (?, ?, ?, ?)';
	const params = [request.body.user, request.body.reddit1, request.body.reddit2, request.body.reddit3];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
			id: result.insertId,
		});
	});
});

app.patch('/update/:username', (request, response) => {
	const query = 'UPDATE db SET reddit1 = ?, reddit2 = ?, reddit3 = ? WHERE user = ?';
	const params = [request.body.reddit1, request.body.reddit2, request.body.reddit3, request.params.username];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
		});
	});
});

const port = 3445;
app.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});

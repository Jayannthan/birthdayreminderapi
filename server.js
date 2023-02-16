const express = require('express');
const cors = require('cors');
const knex = require('knex');
const app = express();

app.use(cors())
app.use(express.json());

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
		// port: 5432,
		// user: 'postgres',
		// password: 'ptjn',
		// database: 'BDayApp'
	}
});

db.select('*').from('people').then(data => {
	console.log(data);
}).catch((err) => {
	console.log(err);
});

app.post('/register', (req, res) => {
	console.log("consolelog:" + req.body);
	res.json(req.body);
	const { name, dob, comments } = req.body;
	db('people')
		.returning('*')
		.insert({
			id: db('people').count('id'),
			name: name,
			dob: dob,
			comments: comments
		}).then(newPeople => {
			res.json(newPeople[0]);
		})
		.catch(err => {
			res.status(400).json(err);
		})
})

app.get('/list', (req, res) => {
	const { dob } = req.body;
	db.select('*').from('people')
		.then(people => {
			res.json(people);
			console.log(people);
		})
		.catch(err => res.status(400).json(err))
})

app.get('/', (req, res) => {
	res.send(`app running in ${process.env.PORT}`);
	db.select('*').from('people').then(data => {
		res.send(data);
	}).catch((err) => {
		console.log(err);
	});
})

app.listen(process.env.PORT || 3000, () => {
	console.log(`app running in ${process.env.PORT}`);
})

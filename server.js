const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: true });
const express = require('express');
const mongo = require('mongo');
const mongoose = require('mongoose');
const morgan = require('morgan');
const {
	PORT,
	DATABASE_URL
} = require('./config/config');


const app = express();
const note = require('./models/noteModels');


app.use(morgan('common'));
app.use(jsonParser);
app.use(urlParser);
app.use(express.static('public'));


app.get('/getnotes', (req, res) => {
	note
		.find()
		.exec()
		.then(notes => {
			res.json(notes.map(note => note.apiRepr('listview')));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		})
});


app.get('/getnote', (req, res) => {
	note
		.findById(req.query.ID)
		.exec()
		.then(note => {
			res.json(note.apiRepr());
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		})
});


//Add note
app.post('/addnote', (req, res) => {
	note
		.create({
			Title: req.body.Title,
			Body: req.body.Body,
			Username: req.body.Username
		})
		.then((post) => {
			console.log(post);
			res.status(201).json(post.apiRepr().ID);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		});
});


//JSON.stringify
//Update note
app.post('/updatenote', (req, res) => {
	console.log(req.body);
	note
		.findByIdAndUpdate(req.body.ID,{$set:{Title:req.body.Title,Body:req.body.Body,Username:req.body.Username}}, {new: true})
		.exec()
		.then(() => {
			res.status(200).json({
				message: 'success'
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		});
});


app.delete('/deletenote', (req, res) => {
	note
		.findByIdAndRemove(req.query.ID)
		.exec()
		.then(() => {
			res.status(200).json({
				message: 'success'
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		});
});


let server;


function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}


function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}
if (require.main === module) {
	runServer().catch(err => console.error(err));
};


module.exports = {
	runServer,
	app,
	closeServer
};
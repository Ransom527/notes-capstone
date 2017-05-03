const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const note = require('./models/noteModels')

mongoose.Promise = global.Promise;







/*
module.exports = {
	list: (req, res) => {
		note		
			.find()
			.exec()
			.then(posts => {
				res.json(posts.map(post => post.apiRepr()));
			})
			.catch(err => {
				console.error(err);
				res.status(500).json({
					error: 'something went terribly wrong'
				});
			});
	},
	post: (req, res) => {
		//
	},
	get: (req, res) => {
		//
	},
	put: (req, res) => {
		//
	},
	delete: (req, res) => {
		//
	},
};
*/
const Sauce = require('../../models/sauce');
const fs = require('fs');
const sauce = require('../../models/sauce');

// Créer une sauce
exports.createSauce = (req, res, next) => {
	console.log(req.file)
	const sauce = new Sauce({
		...req.body,
		imageUrl: `http://localhost:3000/${req.file.destination}/${req.file.filename}`
	});
	sauce.save()
		.then(() => res.status(201).json({
			message: 'Sauce créé !'
		}))
		.catch(error => res.status(400).json({
			error
		}))
};

// Trouver une sauce
exports.findOneSauce = (req, res, next) => {
	console.log(sauce)
	Sauce.findOne({
			_id: req.params.id,
		})
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({
			error
		}));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
	Sauce.updateOne({
			_id: req.params.id
		}, {
			...req.body,
			_id: req.params.id
		})
		.then(() => res.status(200).json({
			message: 'Sauce modifiée !'
		}))
		.catch(error => res.status(400).json({
			error
		}))
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id})
		.then(sauce => {
			if (sauce.userId != req.auth.userId) {
				res.status(401).json({message: 'Not authorized'});
			} else {
				const filename = sauce.imageUrl.split('/static/')[1];
				fs.unlink(`static/${filename}`, () => {
					Sauce.deleteOne({_id: req.params.id})
						.then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
						.catch(error => res.status(401).json({ error }));
				});
			}
		})
		.catch( error => {
			res.status(500).json({ error });
		});
 };

// trouver toutes les sauces
exports.findAllSauce = (req, res, next) => {
	Sauce.find()
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(400).json({
			error
		}));
};

exports.likeOrDislike = (req, res, next) => {
	// Si l'utilisateur aime la sauce
	if (req.body.like === 1) {
	  // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
	  Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
		.then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
		.catch(error => res.status(400).json({ error }));
	} else if (req.body.like === -1) {
	  // Si l'utilisateur n'aime pas la sauce
	  // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
	  Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
		.then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
		.catch(error => res.status(400).json({ error }));
	} else {
	  // Si like === 0 l'utilisateur supprime son vote
	  Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
		  // Si le tableau "userLiked" contient l'ID de l'utilisateur
		  if (sauce.usersLiked.includes(req.body.userId)) {
			// On enlève un like du tableau "userLiked"
			Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
				.then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
				.catch(error => res.status(400).json({ error }))
		  } else if (sauce.usersDisliked.includes(req.body.userId)) {
			  // Si le tableau "userDisliked" contient l'ID de l'utilisateur
			  // On enlève un dislike du tableau "userDisliked"
			  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
				.then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
				.catch(error => res.status(400).json({ error }))
		  }
		})
		.catch(error => res.status(400).json({ error }));
	}
  };
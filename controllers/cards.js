const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(next)
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(user => res.send(user))
    .catch(next)
}

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (!card) {
        let err = new Error("Карточка не найдена");
        err.name = "NotFoundError";
        next(err);
      }
      res.send(card)
    })
    .catch(next)
}

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then(card => {
    res.send(card);
  })
  .catch(next)

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then(card => {
    res.send(card);
  })
  .catch(next)
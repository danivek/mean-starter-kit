'use strict';

var Thing = require('./thing.model');

/**
 * GET /things
 *
 * @description
 * list of things
 *
 */
exports.find = function(req, res, next) {
  Thing.find(function(err, things) {
    if (err) {
      return next(err);
    }
    return res.status(200).json(things);
  });
};

/**
 * GET /things/:id
 *
 * @description
 * Find thing by id
 *
 */
exports.get = function(req, res, next) {
  Thing.findById(req.params.id, function(err, thing) {
    if (err) {
      return next(err);
    }
    if (!thing) {
      return res.status(404).send('Not Found');
    }
    return res.status(200).json(thing);
  });
};

/**
 * POST /things
 *
 * @description
 * Create a new thing
 *
 */
exports.post = function(req, res, next) {
  Thing.create(req.body, function(err, thing) {
    if (err) {
      return next(err);
    }
    return res.status(201).json(thing);
  });
};

/**
 * PUT /things/:id
 *
 * @description
 * Update a thing
 *
 */
exports.put = function(req, res, next) {
  Thing.findById(req.params.id, function(err, thing) {
    if (err) {
      return next(err);
    }
    if (!thing) {
      return res.status(404).send('Not Found');
    }

    thing.name = req.body.name;
    thing.description = req.body.description;

    thing.save(function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json(thing);
    });
  });
};

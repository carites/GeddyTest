var crypto = require('crypto');
var ToDos = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.ToDo.all(function(err, toDos) {
      if (err) {
        throw err;
      }
      self.respondWith(toDos, {type:'ToDo'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , toDo = geddy.model.ToDo.create(params);

    if (!toDo.isValid()) {
      this.respondWith(toDo);
    }
    else {
      toDo.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(toDo, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.ToDo.first(params.id, function(err, toDo) {
      if (err) {
        throw err;
      }
      if (!toDo) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(toDo);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.ToDo.first(params.id, function(err, toDo) {
      if (err) {
        throw err;
      }
      if (!toDo) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(toDo);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.ToDo.first(params.id, function(err, toDo) {
      if (err) {
        throw err;
      }
      toDo.updateProperties(params);

      if (!toDo.isValid()) {
        self.respondWith(toDo);
      }
      else {
        toDo.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(toDo, {status: err});
        });
      }
    });
  };
  this.beibe = function (req,resp,params){
    var self = this;
    var shasum = crypto.createHash('md5');
    var title = params.title;
    shasum.update(title);
    title = shasum.digest('hex');
    var res = {"title":title, "status":params.status};
    self.respond(res, {format: 'json'});
  }
  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.ToDo.first(params.id, function(err, toDo) {
      if (err) {
        throw err;
      }
      if (!toDo) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.ToDo.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(toDo);
        });
      }
    });
  };

};

exports.ToDos = ToDos;

var crypto = require('crypto');

var Users = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      if (err) {
        throw err;
      }
      self.respondWith(users, {type:'User'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this;
    var password = params.password;
    var shasum = crypto.createHash('md5');
    shasum.update(password);
    password = shasum.digest('hex');
    var dati = {id:null, name:params.name,surname :params.surname,username:params.username,password:password};
    var user = geddy.model.User.create(dati);

    if (!user.isValid()) {
      this.respondWith(user);
    }
    else {
      user.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(user, {status: err});
      });
    }
  };
  this.login = function(req,resp,params){
    var self = this;
    var password = params.password;
    var shasum = crypto.createHash('md5');
    shasum.update(password);
    password = shasum.digest('hex');
    console.log(params.username+" "+password);
    geddy.model.User.load({username : params.username, password : password},
      function(err,user){
        if (err){
          throw err;
        }
        if(!user){
          throw new geddy.errors.NotFoundError();
        }else{
          var res = { id:user.iduser};
          self.respond(res, {format: 'json'});
        }
      })
  };

  // this.show = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (!user) {
  //       throw new geddy.errors.NotFoundError();
  //     }
  //     else {
  //       self.respondWith(user);
  //     }
  //   });
  // };

  // this.edit = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (!user) {
  //       throw new geddy.errors.BadRequestError();
  //     }
  //     else {
  //       self.respondWith(user);
  //     }
  //   });
  // };

  // this.update = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     if (err) {
  //       throw err;
  //     }
  //     user.updateProperties(params);

  //     if (!user.isValid()) {
  //       self.respondWith(user);
  //     }
  //     else {
  //       user.save(function(err, data) {
  //         if (err) {
  //           throw err;
  //         }
  //         self.respondWith(user, {status: err});
  //       });
  //     }
  //   });
  // };

  // this.remove = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (!user) {
  //       throw new geddy.errors.BadRequestError();
  //     }
  //     else {
  //       geddy.model.User.remove(params.id, function(err) {
  //         if (err) {
  //           throw err;
  //         }
  //         self.respondWith(user);
  //       });
  //     }
  //   });
  // };

};

exports.Users = Users;

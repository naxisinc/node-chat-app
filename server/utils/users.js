class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    return this.users.filter(user => user.room === room).map(user => user.name);
  }

  alreadyExist(name, room) {
    return this.users
      .filter(user => user.name === name)
      .filter(user => user.room === room)[0];
  }
}

// var users = new Users();

// users.addUser('1', 'Pedro', 'A');
// users.addUser('2', 'Deglis', 'A');
// users.addUser('3', 'Bianca', 'B');

// console.log('Users', users.users);
// console.log('getUserList', users.getUserList('a'));
// console.log('getUser', users.getUser('1'));
// console.log('removeUser', users.removeUser('1'));
// console.log('Users after remove', users);

module.exports = { Users };

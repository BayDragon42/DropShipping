class UsersHandler {
	constructor() {
		this.users = {};
	}
	
	addUser(token, user_id, session, expire) {
		this.users[token] = new User(token, user_id, session, expire);
	}
	
	removeUser(token) {
		if(this.users[token] != undefined) {
			delete this.users[token];
		}
	}
	
	findUser(token) {
		if(this.users[token] != undefined) {
			return this.users[token];
		}
	}
}

class User {
	constructor(token, user_id, session, expire) {
		this.token = token;
		this.user_id = user_id;
		this.session = session;
		this.expire = expire;
	}
  
	isExpired() {
		if(Date.now() > this.expire) {
			return true;
		}

		return false;
	}
}

module.exports = UsersHandler;

const cron = require("node-cron");

class UsersHandler {
	constructor(logHandler) {
		this.logHandler = logHandler;
		
		this.users = {};
		cron.schedule("*/1 * * * *", () => {
			for(var k in this.users) {
				if(this.users[k].isExpired()) {
					this.removeUser(this.users[k].token);
				}
			}
		});
	}
	
	addUser(token, user_id, session, expire) {
		this.users[token] = new User(token, user_id, session, expire, this.logHandler);
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
	constructor(token, user_id, session, expire, logHandler) {
		this.token = token;
		this.user_id = user_id;
		this.session = session;
		this.expire = expire;
		
		this.logHandler = logHandler;
	}
  
	isExpired() {
		if(Date.now() > this.expire) {
			this.logHandler.log(`${this.user_id} : validity expired`);
			return true;
		}

		return false;
	}
	
	setExpire(date) {
		this.expire = date;
		this.logHandler.log(`${this.user_id} : expire set to ${date}`);
	}
}

module.exports = UsersHandler;

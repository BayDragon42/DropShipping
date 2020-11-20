const messages = require("./requests_messages.js");
const users = require("../users/user_handler.js");

const moment = require("moment");
const jwt = require("jwt-simple");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const adminPassword = "youkoulélé";
const key = "oMim5OMvkTr-dUMpSfhOvZY-mHcf1UMdVSqJFoM0a4k6HxxiCzT2JRo_kmHRBgT5bk08kvR5ANAhDIvVFkGDq0B82hvGCHHeGaz2XrsJw5o6CUsYdOZeTyjje65zF1HPd6LvSq1rJUX-fW9QrdGOLuojP7arMxKOCRk0qXaiJsk";

class Requests {
	constructor(dbHandler, logHandler) {
		this.dbHandler = dbHandler;
		this.logHandler = logHandler;
		this.usersHandler = new users(logHandler);
	}
	
	getMenu(group, callback) {
		var t = this;
		var data = [];
		
		if(group == 0) {
			this.dbHandler.query(`SELECT m.id, m.parent_menu, l.name, m.href FROM menus m LEFT JOIN loc_keys lk ON m.value = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE m.item_group = ${group} AND m.parent_menu IS NULL AND (loc = "fr" OR m.value IS NULL)`, function(result) {
				t.dbHandler.query(`SELECT m.id, m.parent_menu, l.name, m.href FROM menus m LEFT JOIN loc_keys lk ON m.value = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE m.item_group = ${group} AND m.parent_menu IS NOT NULL AND (loc = "fr" OR m.value IS NULL)`, function(result2) {
					for(var i=0; i<result.length; i++) {
						var subMenu_data = [];
						result2.forEach(item => {
							if(item.parent_menu === result[i].id) {
								subMenu_data.push({
									value: item.name,
									href: item.href,
									subMenu: []
								});
							}
						});
						data.push({
							value: result[i].name,
							href: "",
							subMenu: subMenu_data
						});
					}
			
					callback(data);
				});
			});
		} else {
			this.getCategories(undefined, "fr", function(result) {
				var tmp;
				var subMenu_data = [];
				result.payload.categories.forEach(item => {
					if(item.parent == null) {
						if(tmp) {
							tmp.subMenu = subMenu_data;
							data.push(tmp);
							subMenu_data = [];
						}
						
						tmp = {
							value: item.name,
							href: "",
							subMenu: []
						};
					} else {
						subMenu_data.push({
							value: item.name,
							href: "",
							subMenu: []
						});
					}
				});
				
				tmp.subMenu = subMenu_data;
				data.push(tmp);
					
				t.dbHandler.query(`SELECT m.id, m.parent_menu, l.name, m.href FROM menus m LEFT JOIN loc_keys lk ON m.value = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE m.item_group = ${group} AND m.parent_menu IS NULL AND (loc = "fr" OR m.value IS NULL)`, function(result) {
					t.dbHandler.query(`SELECT m.id, m.parent_menu, l.name, m.href FROM menus m LEFT JOIN loc_keys lk ON m.value = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE m.item_group = ${group} AND m.parent_menu IS NOT NULL AND (loc = "fr" OR m.value IS NULL)`, function(result2) {
						for(var i=0; i<result.length; i++) {
							subMenu_data = [];
							result2.forEach(item => {
								if(item.parent_menu === result[i].id) {
									subMenu_data.push({
										value: item.name,
										href: item.href,
										subMenu: []
									});
								}
							});
							data.push({
								value: result[i].name,
								href: "",
								subMenu: subMenu_data
							});
						}
					
						callback(data);
					});
				});
			});
		}
	}

	authentificatePartnerUser(user_id, pass, callback) {
		var t = this;
		this.dbHandler.query(`SELECT g.id, a.password FROM admin a LEFT JOIN groups g ON a.group_id = g.id WHERE a.user_id = "${user_id}"`, function(result) {
			if(result.length != 0) {
				if(pass === result[0].password) {
					var expires = moment().add(10, "minutes").valueOf();
					
					var hash = crypto.createHmac("sha512", user_id);
					hash.update(`${expires}`);
					var token = hash.digest("hex");
					
					t.usersHandler.addUser(token, user_id, expires, 0);
					
					t.logHandler.log("User '" + user_id + "' logged in.");
					callback({
						msg: messages.PARTNER_LOGIN_SUCCESS,
						payload: {
							token: token
						}
					});
				} else {
					t.logHandler.log("User '" + user_id + "' tried to log in.");
					callback({
						msg: messages.PARTNER_LOGIN_PASSWORD_ERROR,
						payload: {
							error: "Wrong password"
						}
					});
				}
			} else {
				callback({
					msg: messages.PARTNER_LOGIN_USERNAME_ERROR,
					payload: {
						error: "User not found"
					}
				});
			}
		});
	}

	authentificateUser(user_id, pass, callback) {
		var t = this;
		console.log(`user: ${user_id}, pass: ${pass}`);
		this.dbHandler.query(`SELECT * FROM users WHERE user_id = "${user_id}"`, function(result) {
			if(result.length != 0) {
				if(pass === result[0].password) {
					var expires = moment().add(10, "minutes").valueOf();
					
					var hash = crypto.createHmac("sha512", user_id);
					hash.update(`${expires}`);
					var token = hash.digest("hex");
					
					t.usersHandler.addUser(token, user_id, expires, 1);
					
					t.logHandler.log("User '" + user_id + "' logged in.");
					callback({
						msg: messages.LOGIN_SUCCESS,
						payload: {
							token: token
						}
					});
				} else {
					t.logHandler.log("User '" + user_id + "' tried to log in.");
					callback({
						msg: messages.LOGIN_PASSWORD_ERROR,
						payload: {
							error: "Wrong password"
						}
					});
				}
			} else {
				callback({
					msg: messages.LOGIN_USERNAME_ERROR,
					payload: {
						error: "User not found"
					}
				});
			}
		});
	}

	verifyCredentials(token, s, callback) {
		if(token) {
			var user = this.usersHandler.findUser(token, s);
			if(user != undefined) {
				if(!user.isExpired() && user.token == token) {
					callback(messages.VERIFY_CREDENTIALS_SUCCESS);
				} else {
					this.logHandler.log("Token '" + token + "' has expired");
					callback({
						msg: messages.VERIFY_CREDENTIALS_ERROR,
						err: "Token has expired"
					});
				}
			} else {
				this.logHandler.log("Token '" + token + "' not registered");
				callback({
					msg: messages.VERIFY_CREDENTIALS_ERROR,
					err: "User not found"
				});
			}
		} else {
			callback({
				msg: messages.VERIFY_CREDENTIALS_ERROR,
				err: "Token is undefined"
			});
		}
	}
	
	keepAlive(token, s, callback) {
		console.log(`keepAlive token : ${token}`);
		var user = this.usersHandler.findUser(token, s);
		if(user != undefined) {
			this.logHandler.log(`${user.user_id} : keep alive`);
			var expires = moment().add(1, "minutes").valueOf();
			
			user.setExpire(expires);
			
			callback({
				msg: messages.SESSION_KEEP_ALIVE_SUCCESS,
				payload: {
					token: token
				}
			});
		} else {
			callback({
				msg: messages.SESSION_KEEP_ALIVE_ERROR,
				err: "token session not found"
			});
		}
	}
	
	getFilesFromPath(callback) {
		this.dbHandler.query(`SELECT DISTINCT loc FROM locale`, function(result) {
			if(result.length != 0) {
				var data = [];
				result.forEach(item => {
					data.push(item.loc);
				});
				
				callback({
					msg: messages.GET_FILES_FROM_PATH_SUCCESS,
					payload: {
						files: data
					}
				});
			} else {
				callback({
					msg: messages.GET_FILES_FROM_PATH_ERROR,
					payload: {
						err: "No results"
					}
				});
			}
		});
	}
	
	getLocaleContent(pth, callback) {
		this.dbHandler.query(`SELECT loc_id, name FROM locale WHERE loc = "${pth}" AND loc_id LIKE "%_core"`, function(result) {
			if(result.length != 0) {
				var data = {};
				result.forEach(item => {
					data[item.loc_id] = item.name;
				})
				callback({
					msg: messages.GET_LOCALE_CONTENT_SUCCESS,
					payload: {
						content: data
					}
				});
			} else {
				callback({
					msg: messages.GET_LOCALE_CONTENT_ERROR,
					payload: {
						err: "No results"
					}
				});
			}
		});
	}
	
	updateLocaleKeyValue(pth, key, value, callback) {
		this.dbHandler.query(`UPDATE locale SET name = "${value}" WHERE loc_id = "${key}" AND loc = "${pth}"`, function(result) {
			if(result.length != 0) {
				callback({
					msg: messages.UPDATE_LOCALE_KEY_VALUE_SUCCESS,
					payload: {
						key: key
					}
				});
			} else {
				callback({
					msg: messages.UPDATE_LOCALE_KEY_VALUE_ERROR,
					payload: {
						err: "No results"
					}
				});
			}
		});
	}
	
	addLocaleFile(file, callback) {
		this.dbHandler.query(`INSERT INTO locale (loc_id, name, loc) SELECT DISTINCT loc_id, "" AS name, "${file}" AS loc FROM locale WHERE loc_id LIKE "%_core"`, function(result) {
			if(result.length != 0) {
				callback({
					msg: messages.ADD_LOCALE_FILE_SUCCESS,
					payload: {
					}
				});
			} else {
				callback({
					msg: messages.ADD_LOCALE_FILE_ERROR,
					payload: {
						err: "No results"
					}
				});
			}
		});
	}
	
	getProductData(filter, loc, id, callback) {
		var byId = "";
		if(id !== undefined) {
			byId = `AND p.id = ${id}`;
		}
			
		this.dbHandler.query(`SELECT DISTINCT p.id, l1.name AS title, l1.loc_id AS title_locId, l2.name AS short_description, l2.loc_id AS sdesc_locId, l3.name AS description, l3.loc_id AS desc_locId, l9.name AS category, l9.loc_id AS cat_locId, i.img, i.default_img, p.price FROM products p
			LEFT JOIN loc_keys lk1 ON p.title = lk1.loc_id
			LEFT JOIN loc_keys lk2 ON p.short_description = lk2.loc_id
			LEFT JOIN loc_keys lk3 ON p.description = lk3.loc_id
			LEFT JOIN locale l1 ON lk1.loc_id = l1.loc_id
			LEFT JOIN locale l2 ON lk2.loc_id = l2.loc_id
			LEFT JOIN locale l3 ON lk3.loc_id = l3.loc_id
			LEFT JOIN categories c ON p.category = c.id
			LEFT JOIN locale l9 ON c.loc_id = l9.loc_id
			LEFT JOIN images i ON p.id = i.product_id
		WHERE l1.loc = "${loc}" AND l2.loc = "${loc}" AND l3.loc = "${loc}" AND l1.name LIKE "%${filter}%" ${byId}`, function(result) {
			var data = [];
			
			var id = 0;
			result.forEach(item => {
				if(id != item.id) {
					var img = [];
					result.forEach(item2 => {
						if(item2.id === item.id) {
							img.push([item2.img.toString(), item2.default_img]);
						}
					});
				
					data.push({
						id: item.id,
						title: item.title,
						title_id: item.title_locId,
						short_description: item.short_description,
						short_description_id: item.sdesc_locId,
						description: item.description,
						description_id: item.desc_locId,
						category: item.category,
						category_id: item.cat_locId,
						price: item.price,
						img: img
					});
				}
				
				id = item.id;
			});
			
			callback({
				msg: messages.GET_PRODUCT_DATA_SUCCESS,
				payload: {
					products: data
				}
			});
		});
	}
	
	getProductShortData(filter, loc, id, callback) {
		var byId = "";
		if(id !== undefined) {
			byId = `AND p.id = ${id}`;
		}
					
		this.dbHandler.query(`SELECT DISTINCT p.id, l1.name AS title, l2.name AS short_description, l3.name AS category, i.img, p.price FROM products p
			LEFT JOIN loc_keys lk1 ON p.title = lk1.loc_id
			LEFT JOIN loc_keys lk2 ON p.short_description = lk2.loc_id
			LEFT JOIN locale l1 ON lk1.loc_id = l1.loc_id
			LEFT JOIN locale l2 ON lk2.loc_id = l2.loc_id
			LEFT JOIN categories c ON p.category = c.id
			LEFT JOIN locale l3 ON c.loc_id = l3.loc_id
			LEFT JOIN images i ON p.id = i.product_id
		WHERE l1.loc = "${loc}" AND l1.name LIKE "%${filter}%" ${byId} AND i.default_img = 1`, function(result) {
			var data = [];
			
			var id = 0;
			result.forEach(item => {
				if(id != item.id) {				
					data.push({
						id: item.id,
						title: item.title,
						short_description: item.short_description,
						category: item.category,
						price: item.price,
						img: item.img.toString()
					});
				}
				
				id = item.id;
			});
			
			callback({
				msg: messages.GET_PRODUCTS_SHORT_DATA_SUCCESS,
				payload: {
					products: data
				}
			});
		});
	}
	
	deleteProduct(id, titleId, short_descriptionId, descriptionId, callback) {
		// delete loc_keys
		this.dbHandler.query(`DELETE FROM loc_keys WHERE
			loc_id = "${titleId}" OR
			loc_id = "${short_descriptionId}" OR
			loc_id = "${descriptionId}"`, function() {
		});
		
		// delete product
		this.dbHandler.query(`DELETE FROM products WHERE id = ${id}`, function() {
			callback({
				msg: messages.DELETE_PRODUCT_SUCCESS,
				payload: {}
			});
		});
	}
	
	updateProduct(id, img, title, short_description, description, category, price, loc, callback) {
		if(img.del) {
			img.del.forEach(item => {
				this.dbHandler.query(`DELETE FROM images WHERE product_id = ${id} AND img = "${item}"`, function() {
				});
			});
		}
		
		if(img.add) {
			img.add.forEach(item => {
				this.dbHandler.query(`INSERT INTO images (product_id, img, default_img) VALUES (${id}, "${item[0]}", ${item[1]})`, function() {
				});
			});
		}
		
		if(img.changed) {
			img.changed.forEach(item => {
				this.dbHandler.query(`UPDATE images SET default_img = ${item[1]} WHERE img = "${item[0]}"`, function() {
				});
			});
		}
		
		// Update locales values
		this.dbHandler.query(`UPDATE locale SET name = "${title}" WHERE loc_id = (SELECT title FROM products WHERE id = ${id}) AND loc = "${loc}"`, function() {
		});
		this.dbHandler.query(`UPDATE locale SET name = "${short_description}" WHERE loc_id = (SELECT short_description FROM products WHERE id = ${id}) AND loc = "${loc}"`, function() {
		});
		this.dbHandler.query(`UPDATE locale SET name = "${description}" WHERE loc_id = (SELECT description FROM products WHERE id = ${id}) AND loc = "${loc}"`, function() {
		});
		
		// Update product
		this.dbHandler.query(`UPDATE products SET category = (SELECT id FROM categories WHERE loc_id = "${category}"), price = ${price} WHERE id = ${id}`, function() {
		});
				
		callback({
			msg: messages.UPDATE_PRODUCT_DATA_SUCCESS,
			payload: {}
		});
	}
	
	addNewProduct(img, title, short_description, description, category, price, callback) {
		var t = this;
		
		this.dbHandler.query(`INSERT INTO products (category, price) VALUES ((SELECT id FROM categories WHERE loc_id = "${category}"), ${price})`, function(result) {
			var newProductId = result.insertId;
			
			// Adds locale values
			t.dbHandler.query(`INSERT INTO loc_keys (loc_id) VALUES ("product_title_##${newProductId}"), ("product_sdesc_##${newProductId}"), ("product_desc_##${newProductId}")`, function(result) {
				t.dbHandler.query(`INSERT INTO locale (loc, name, loc_id) SELECT DISTINCT loc, "${title}" AS name, "product_title_##${newProductId}" AS loc_id FROM locale`, function(result) {
					t.dbHandler.query(`INSERT INTO locale (loc, name, loc_id) SELECT DISTINCT loc, "${short_description}" AS name, "product_sdesc_##${newProductId}" AS loc_id FROM locale`, function(result) {
						t.dbHandler.query(`INSERT INTO locale (loc, name, loc_id) SELECT DISTINCT loc, "${description}" AS name, "product_desc_##${newProductId}" AS loc_id FROM locale`, function(result) {
							// Updates loc_id values
							t.dbHandler.query(`UPDATE products SET title = "product_title_##${newProductId}", short_description = "product_sdesc_##${newProductId}", description = "product_desc_##${newProductId}" WHERE id = ${newProductId}`, function(result) {
								var counter = 0;
								img.forEach(item => {
									t.dbHandler.query(`INSERT IGNORE INTO images (product_id, img, default_img) VALUES (${newProductId}, "${item[0]}", ${item[1]})`, function(result) {
										counter++;
						
										if(counter == img.length) {
											callback({
												msg: messages.ADD_NEW_PRODUCT_REQUEST,
												payload: {}
											});
										}
									});
								});
							});
						});
					});
				});
			});
		});
	}
	
	getCategories(parent, loc, callback) {
		var query = "";
		if(parent !== undefined) {
			var where = `= (SELECT id FROM categories WHERE loc_id = "${parent}")`;
			if(parent === null) {
				where = "IS NULL";
			}
			query = `SELECT c.id, l.loc_id, l.name, c.parent_cat FROM categories c LEFT JOIN loc_keys lk ON c.loc_id = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE c.parent_cat ${where} AND l.loc = "${loc}"`;
			
			this.dbHandler.query(query, function(result) {
				var data = [];
				result.forEach(item => {
					data.push({
						id: item.id,
						loc_id: item.loc_id,
						name: item.name,
						parent: item.parent_cat
					});
				});
				
				callback({
					msg: messages.GET_CATEGORIES_SUCCESS,
					payload: {
						categories: data
					}
				});
			});
		} else {
			var t = this;
			var data = [];
			this.dbHandler.query(`SELECT c.id, l.loc_id, l.name, c.parent_cat FROM categories c LEFT JOIN loc_keys lk ON c.loc_id = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE c.parent_cat IS NULL AND l.loc = "${loc}"`, function(result) {
				t.dbHandler.query(`SELECT c.id, l.loc_id, l.name, c.parent_cat FROM categories c LEFT JOIN loc_keys lk ON c.loc_id = lk.loc_id LEFT JOIN locale l ON lk.loc_id = l.loc_id WHERE c.parent_cat IS NOT NULL AND l.loc = "${loc}"`, function(result2) {
					for(var i=0; i<result.length; i++) {
						data.push({
							id: result[i].id,
							loc_id: result[i].loc_id,
							name: result[i].name,
							parent: result[i].parent_cat
						});
						
						result2.forEach(item => {
							if(item.parent_cat === result[i].id) {
								data.push({
									id: item.id,
									loc_id: item.loc_id,
									name: item.name,
									parent: item.parent_cat
								});
							}
						})
					}
					
					callback({
						msg: messages.GET_CATEGORIES_SUCCESS,
						payload: {
							categories: data
						}
					});
				});
			});
		}
	}
	
	updatecategory(key, loc, value, callback) {
		this.dbHandler.query(`UPDATE locale SET name = "${value}" WHERE loc_id = "${key}" AND loc = "${loc}"`, function(result) {
			callback({
				msg: messages.UPDATE_CATEGORY_SUCCESS,
				payload: {}
			});
		});
	}
	
	addNewCategory(parent, name, callback) {
		if(parent !== null) {
			parent = `SELECT id from categories WHERE loc_id = "${parent}"`;
		} else {
			parent = `VALUES (${parent})`;
		}
		var t = this;
		this.dbHandler.query(`INSERT INTO categories (parent_cat) ${parent}`, function(result) {
			var newCatId = result.insertId;
			
			t.dbHandler.query(`INSERT INTO loc_keys (loc_id) VALUES ("category_##${newCatId}")`, function(result) {
				t.dbHandler.query(`INSERT INTO locale (loc, name, loc_id) SELECT DISTINCT loc, "${name}" AS name, "category_##${newCatId}" AS loc_id FROM locale`, function(result) {
					t.dbHandler.query(`UPDATE categories SET loc_id = "category_##${newCatId}" WHERE id = ${newCatId}`, function(result) {
						callback({
							msg: messages.ADD_CATEGORY_SUCCESS,
							payload: {
								key: `category_##${newCatId}`
							}
						});
					});
				});
			});
		});
	}
	
	deleteCategory(key, callback) {
		this.dbHandler.query(`DELETE FROM loc_keys WHERE loc_id = "${key}"`, function(result) {
			callback({
				msg: messages.DELETE_CATEGORY_SUCCESS,
				payload: {}
			});
		});
	}
	
	deleteLocaleFile(file, callback) {
		this.dbHandler.query(`DELETE FROM locale WHERE loc = "${file}"`, function(result) {
			callback({
				msg: messages.DELETE_LOCALE_FILE_SUCCESS,
				payload: {}
			});
		});
	}
  
	parseRequest(msg, payload, callback) {
		switch(msg) {
			case messages.PARTNER_LOGIN_REQUEST:
				this.authentificatePartnerUser(payload.user_id, payload.pass, function(result) {
					callback(result);
				});
				break;
				
			case messages.LOGIN_REQUEST:
				this.authentificateUser(payload.user_id, payload.pass, function(result) {
					callback(result);
				});
				break;
			
			case messages.VERIFY_CREDENTIALS_REQUEST:
				this.verifyCredentials(payload.token, payload.s, function(result) {
					callback(result);
				});
				break;
			
			case messages.SESSION_KEEP_ALIVE_REQUEST:
				this.keepAlive(payload.token, payload.s, function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_FILES_FROM_PATH_REQUEST:
				this.getFilesFromPath(function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_LOCALE_CONTENT_REQUEST:
				this.getLocaleContent(payload.pth, function(result) {
					callback(result);
				});
				break;
			
			case messages.UPDATE_LOCALE_KEY_VALUE_REQUEST:
				this.updateLocaleKeyValue(payload.pth, payload.key, payload.value, function(result) {
					callback(result);
				});
				break;
			
			case messages.ADD_LOCALE_FILE_REQUEST:
				this.addLocaleFile(payload.file, function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_PRODUCT_DATA_REQUEST:
				this.getProductData(payload.filter, payload.loc, payload.id, function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_PRODUCTS_SHORT_DATA_REQUEST:
				this.getProductShortData(payload.filter, payload.loc, payload.id, function(result) {
					callback(result);
				});
				break;
			
			case messages.DELETE_PRODUCT_REQUEST:
				this.deleteProduct(payload.id, payload.titleId, payload.short_descriptionId, payload.descriptionId, function(result) {
					callback(result);
				});
				break;
			
			case messages.UPDATE_PRODUCT_DATA_REQUEST:
				this.updateProduct(payload.id, payload.img, payload.title, payload.short_description, payload.description, payload.category, payload.price, payload.loc, function(result) {
					callback(result);
				});
				break;
			
			case messages.ADD_NEW_PRODUCT_REQUEST:
				this.addNewProduct(payload.img, payload.title, payload.short_description, payload.description, payload.category, payload.price, function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_CATEGORIES_REQUEST:
				this.getCategories(payload.parent, payload.loc, function(result) {
					callback(result);
				});
				break;
			
			case messages.UPDATE_CATEGORY_REQUEST:
				this.updatecategory(payload.key, payload.loc, payload.value, function(result) {
					callback(result);
				});
				break;
			
			case messages.ADD_CATEGORY_REQUEST:
				this.addNewCategory(payload.parent, payload.name, function(result) {
					callback(result);
				});
				break;
			
			case messages.DELETE_CATEGORY_REQUEST:
				this.deleteCategory(payload.key, function(result) {
					callback(result);
				});
				break;
			
			case messages.DELETE_LOCALE_FILE_REQUEST:
				this.deleteLocaleFile(payload.file, function(result) {
					callback(result);
				});
				break;
		}
	}
}

module.exports = Requests;

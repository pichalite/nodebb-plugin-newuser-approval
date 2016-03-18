'use strict';

var winston = module.parent.require('winston');
var Meta = module.parent.require('./meta');
var SocketAdmin = module.parent.require('./socket.io/admin');
var Groups = module.parent.require('./groups');
var User = module.parent.require('./user');
var Posts = module.parent.require('./posts');
var Topics = module.parent.require('./topics');

var Approval = {};
var nonapprovedUserGroup = null;
var approvedUserGroup = null;

Approval.init = function(params, callback) {

	SocketAdmin.approval = {
		getUnapprovedUsers: function(socket, data, callback) {
			Approval.getUnapprovedUsers({
				userData: true
			}, callback);
		},
		approveUser: function(socket, data, callback) {
			Approval.approveUser(data, callback);
		},
		deleteUser: function(socket, data, callback) {
			Approval.deleteUser(data, callback);
		}
	};

	function render(req, res, next) {
		res.render('admin/plugins/newuser-approval', {});
	}

	Meta.settings.get('newuser-approval', function(err, settings) {
		if (!err && settings && settings.approvedUserGroup && settings.nonapprovedUserGroup) {
			approvedUserGroup = settings.approvedUserGroup;
			nonapprovedUserGroup = settings.nonapprovedUserGroup;
		}
		else {
			winston.error('[plugins/newuser-approval] User groups not set!');
		}
	});

	params.router.get('/admin/plugins/newuser-approval', params.middleware.admin.buildHeader, render);
	params.router.get('/api/admin/plugins/newuser-approval', render);

	callback();
};

Approval.moveUserToGroup = function(userData) {
	if (nonapprovedUserGroup != null) {
		Groups.join(nonapprovedUserGroup, userData.uid);
	}
};

Approval.approveUser = function(userData, callback) {
	if (approvedUserGroup != null) {
		Groups.leave(nonapprovedUserGroup, userData.uid);
		Groups.join(approvedUserGroup, userData.uid, callback);
	}
};

Approval.deleteUser = function(userData, callback) {
	User.delete(userData.uid, callback);
};

Approval.filterTids = function(data, callback) {
	Approval.getUnapprovedUsers({userData:false}, function(err, members) {
		User.isAdministrator(data.uid, function(err, isAdmin) {
			if (!isAdmin) {
				Topics.getTopicsFields(data.tids, ['uid'], function(err, fields) {
					data.tids = fields.reduce(function(prev, cur, idx) {
						if (parseInt(cur.uid, 10) === parseInt(data.uid, 10) || members.indexOf(cur.uid) === -1) {
							prev.push(data.tids[idx]);
						}
						return prev;
					}, []);
	
					callback(null, data);
				});
			} else {
				callback(null, data);
			}
		});
	});
};

Approval.filterCategory = function(data, callback) {
	
	Approval.getUnapprovedUsers({userData:false}, function(err, members) {
		User.isAdministrator(data.uid, function(err, isAdmin) {
			if (!isAdmin) {
				var filtered = [];
				if (data.topics && data.topics.length) {
					data.topics.forEach( function(topic) {
						if (parseInt(topic.uid, 10) === parseInt(data.uid, 10) || members.indexOf(topic.uid) === -1) {
							filtered.push(topic);
						}
					});
				}
				callback(null, {topics:filtered,uid:data.uid});
			} else {
				callback(null, data);
			}
		});		
	});
};

Approval.filterPids = function(data, callback) {
	Approval.getUnapprovedUsers({userData:false}, function(err, members) {
		User.isAdministrator(data.uid, function(err, isAdmin) {
			if (!isAdmin) {
				Posts.getPostsFields(data.pids, ['uid'], function(err, fields) {
					data.pids = fields.reduce(function(prev, cur, idx) {
						if (parseInt(cur.uid, 10) === parseInt(data.uid, 10) || members.indexOf(cur.uid) === -1) {
							prev.push(data.pids[idx]);
						}
						return prev;
					}, []);
	
					callback(null, data);
				});
			} else {
				callback(null, data);
			}
		});
	});
};

Approval.filterPosts = function(data, callback) {
	Approval.getUnapprovedUsers({userData:false}, function(err, members) {
		User.isAdministrator(data.req.uid, function(err, isAdmin) {
		    if(!isAdmin) {
		    	data.templateData.posts = data.templateData.posts.reduce(function(prev, cur, idx) {
		    		if (parseInt(cur.uid, 10) === parseInt(data.req.uid, 10) || members.indexOf(cur.uid) === -1) {
		    			prev.push(data.templateData.posts[idx]);
		    		}
		    		return prev;
		    	}, []);
				callback(null, data);
		    } else {
		    	callback(null, data);
		    }
		});
	});
};

Approval.getUnapprovedUsers = function(options, callback) {
	Groups.getMembers(nonapprovedUserGroup, 0, -1, function(err, members) {
		if (err) {
			winston.error(err.message);
		} else {
			if(options.userData) {
				User.getUsersData(members, callback);
			} else {
				callback(null, members);
			}
		}
	});
};

Approval.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/newuser-approval',
			"icon": 'fa-check',
			"name": 'New User Approval'
		});

		callback(null, custom_header);
	}
};

module.exports = Approval;
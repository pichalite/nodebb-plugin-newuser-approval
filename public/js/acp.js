'use strict';
/* globals define, $, socket, app */

define('admin/plugins/newuser-approval', ['settings'], function(Settings) {
	var Admin = {};

	Admin.init = function() {
	    Admin.initSettings();
	    Admin.loadNewUsers();
	
	    $('.users-list').on('click', '[data-action]', function(ev) {
	        var $this = this;
	        var parent = $(this).parents('[data-uid]');
	        var action = $(this).attr('data-action');
	        var uid = parent.attr('data-uid');
	        var method = action === 'accept' ? 'admin.approval.approveUser' : 'admin.approval.deleteUser';
	
	        socket.emit(method, {
	            uid: uid
	        }, function(err) {
	            if (err) {
	                return app.alertError(err.message);
	            }
	            parent.remove();
	        });
	        return false;
	    });
	};

	Admin.initSettings = function() {
	    Settings.load('newuser-approval', $('.newuser-approval-settings'));
	
	    $('#save').on('click', function() {
	        Settings.save('newuser-approval', $('.newuser-approval-settings'), function() {
	            app.alert({
	                type: 'success',
	                alert_id: 'newuser-approval-saved',
	                title: 'Settings Saved',
	                message: 'Click here to reload NodeBB',
	                timeout: 2500,
	                clickfn: function() {
	                    socket.emit('admin.reload');
	                }
	            });
	        });
	    });
	};
	
	Admin.loadNewUsers = function() {
	    socket.emit('admin.approval.getUnapprovedUsers', {}, function(err, data) {
	        if (err) {
	            console.log(err);
	        } else {
	            if (data.length > 0) {
	                for (var x = 0; x < data.length; x++) {
	                    var html = $('<tr />')
	                        .attr('data-uid', data[x].uid)
	                        .append($('<td />').append($('<a />').attr('href', '/user/' + data[x].username).attr('target', '_blank').html(data[x].username)))
	                        .append($('<td />').html(data[x].email))
	                        .append($('<td />').html(data[x].topiccount))
	                        .append($('<td />').html(data[x].postcount))
	                        .append('<td><div class="btn-group pull-right"><button class="btn btn-success btn-xs" data-action="accept"><i class="fa fa-check"></i></button><button class="btn btn-danger btn-xs" data-action="delete"><i class="fa fa-times"></i></button></div></td>');
	                    $('.users-list').append(html);
	                }
	            }
	        }
	    });
	}

	return Admin;
});
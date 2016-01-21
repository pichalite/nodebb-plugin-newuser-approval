<div class="row">
    <div class="col-lg-9">
        <div class="panel panel-default">
            <div class="panel-heading"><i class="fa fa-check"></i> New User Approval</div>
            <div class="panel-body">
                <p>Enter a group name for non approved users and approved users.</p>
                <form role="form" class="newuser-approval-settings">
                    <div class="form-group col-xs-6">
						<label for="nonapprovedUserGroup">Non approved users group</label>
						<input type="text" id="nonapprovedUserGroup" name="nonapprovedUserGroup" title="Non approved users group" class="form-control" placeholder="Non approved users group">
					</div>
                    <div class="form-group col-xs-6">
						<label for="approvedUserGroup">Approved users group</label>
						<input type="text" id="approvedUserGroup" name="approvedUserGroup" title="Approved users group" class="form-control" placeholder="Approved users group">
					</div>
                </form>
            </div>
        </div>
    </div>
    <div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-user"></i> New Users</div>
			<div class="panel-body">
				<table class="table table-striped users-list">
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Topics</th>
						<th>Posts</th>
						<th></th>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>
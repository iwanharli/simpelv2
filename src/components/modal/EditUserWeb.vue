<template>
  <div class="modal fade" id="modalEditUser" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">EDIT USER</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mb-3" style="display: none">
              <label class="form-label" for="validationDefault01">ID</label>
              <input type="text" class="form-control" v-model="user.id" disabled />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Nama</label>
              <input type="text" class="form-control" v-model="user.name" required="" />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Email</label>
              <input type="text" class="form-control" v-model="user.email" required="" />
            </div>
            <div class="col-12 mb-3">
              <label for="password" class="form-label">Password</label>
              <b-input-group size="md" class="mb-2">
                <b-form-input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="user.password" id="password" aria-describedby="password"></b-form-input>
                <b-input-group-append is-text>
                  <b-form-checkbox switch class="mr-n2" @click="togglePasswordVisibility"> </b-form-checkbox>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Role</label>
              <select class="form-select" v-model="user.role">
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer mt-2">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="submitEdit()">EDIT</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">CANCEL</button>
        </div>
      </div>
    </div>
  </div>
</template>

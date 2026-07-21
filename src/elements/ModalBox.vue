<template>
  <div class="offcanvas offcanvas-end customeoff" tabindex="-1" id="offcanvasExample1">
    <div class="offcanvas-header">
      <h5 class="modal-title" id="#gridSystemModal1">Add New Task</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="offcanvas-body">
      <div class="container-fluid">
        <form>
          <div class="row">
            <div class="col-xl-6 mb-3">
              <label for="exampleFormControlInputfirst" class="form-label"
                >Title<span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="exampleFormControlInputfirst"
                placeholder="Title"
              />
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Project<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">Project</option>
                <option value="html">Salesmate</option>
                <option value="css">ActiveCampaign</option>
                <option value="javascript">Insightly</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label for="exampleFormControlInputthree" class="form-label"
                >Start Date<span class="text-danger">*</span></label
              >
              <input type="date" class="form-control" id="exampleFormControlInputthree" />
            </div>
            <div class="col-xl-6 mb-3">
              <label for="exampleFormControlInputfour" class="form-label"
                >End Date<span class="text-danger">*</span></label
              >
              <input type="date" class="form-control" id="exampleFormControlInputfour" />
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Estimated Hour<span class="text-danger">*</span></label>
              <div class="input-group">
                <input type="text" class="form-control" value="09:30" /><span
                  class="input-group-text"
                  ><i class="fas fa-clock"></i
                ></span>
              </div>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Status<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">Status</option>
                <option value="html">In Progess</option>
                <option value="css">Pending</option>
                <option value="javascript">Completed</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">priority<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">priority</option>
                <option value="html">Hight</option>
                <option value="css">Medium</option>
                <option value="javascript">Low</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Category<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">Category</option>
                <option value="html">Designing</option>
                <option value="css">Development</option>
                <option value="javascript">react developer</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Permission<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">Permission</option>
                <option value="html">Public</option>
                <option value="css">Private</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Deadline add<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">Deadline</option>
                <option value="html">Yes</option>
                <option value="css">No</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Assigned to<span class="text-danger">*</span></label>
              <select class="default-select style-1 form-control">
                <option data-display="Select">Assigned</option>
                <option value="html">Bernard</option>
                <option value="css">Sergey Brin</option>
                <option value="javascript">Larry Ellison</option>
              </select>
            </div>
            <div class="col-xl-6 mb-3">
              <label class="form-label">Responsible Person<span class="text-danger">*</span></label>
              <input name="tagify" class="form-control py-0 ps-0" value="James, Harry" />
            </div>
            <div class="col-xl-12 mb-3">
              <label class="form-label">Description<span class="text-danger">*</span></label>
              <textarea rows="3" class="form-control"></textarea>
            </div>
            <div class="col-xl-12 mb-3">
              <label class="form-label">Summary<span class="text-danger">*</span></label>
              <textarea rows="3" class="form-control"></textarea>
            </div>
          </div>
          <div>
            <button class="btn btn-danger light me-1">Cancel</button>
            <button class="btn btn-primary me-1">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal fade" id="exampleModal3" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Your Profile</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control mb-3"
            placeholder="hello@gmail.com"
            id="exampleInputEmail7"
          />
          <label class="form-label">Phone</label>
          <input
            type="number"
            class="form-control mb-3"
            id="exampleInputEmail88"
            placeholder="number"
          />
          <label class="form-label">Date Of Birth</label>
          <input type="date" class="form-control mb-3" id="exampleInputEmail8" />
          <label class="form-label">Position</label>
          <input
            type="text"
            class="form-control mb-3"
            placeholder="Computer Engineer"
            id="exampleInputEmail9"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger light btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary btn-sm">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'modalBox',
  setup() {
    return {}
  }
})
</script>

<style scoped></style>

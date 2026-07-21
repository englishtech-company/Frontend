<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Email Template</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">CMS</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">Email Template</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="filter cm-content-box box-primary">
          <div class="content-title">
            <div class="cpa"><i class="fa-solid fa-filter me-1"></i> Filter</div>
            <div class="tools">
              <a
                @click="dropDown = !dropDown"
                href="#emailCollapes"
                :class="`${dropDown ? '' : 'expand'} SlideToolHeader`"
                data-bs-toggle="collapse"
                data-bs-target="#emailCollapes"
                aria-expanded="true"
                aria-controls="emailCollapes"
                ><i class="fal fa-angle-down"></i
              ></a>
            </div>
          </div>
          <div id="emailCollapes" :class="`cm-content-body form excerpt collapse show`">
            <div class="card-body">
              <div class="row">
                <div class="col-xl-3 col-sm-6">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control mb-xl-0 mb-3" id="exampleFormControlInput1" placeholder="Title" />
                </div>
                <div class="col-xl-3 col-sm-6 mb-3 mb-xl-0">
                  <label class="form-label">Status</label>
                  <div class="dropdown bootstrap-select form-control default-select h-auto wide">
                    <JobSelectOption :options="[{ title: 'Select Status' }, { title: 'Published' }, { title: 'Draft' }, { title: 'Trash' }, { title: 'Private' }, { title: 'Pending' }]" />
                  </div>
                </div>
                <div class="col-xl-3 col-sm-6" style="position: relative">
                  <label class="form-label">Date</label>
                  <datepicker class="form-control mb-xl-0 mb-3" :week-starts-on="1" startingView="day" dayPickerHeadingFormat="dd-mm-yyyy" id="datepicker" v-model="picked" />
                  <div class="icon calender_icon"><i class="far fa-calendar"></i></div>
                </div>
                <div class="col-xl-3 col-sm-6 align-self-end">
                  <div>
                    <button class="btn btn-primary light me-1" title="Click here to Search" type="button"><i class="fa fa-filter me-1"></i>Filter</button>{{ " " }}
                    <button class="btn btn-danger light" title="Click here to remove filter" type="button">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <ul class="d-flex align-items-center">
            <li><RouterLink to="/add-email" class="btn btn-primary">New Email Template</RouterLink></li>
          </ul>
        </div>
        <EmailTemplateTable />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CmsTable from "@/elements/CmsTable.vue";
import EmailCustomSelect from "@/components/EmailCustomSelect.vue";
// @ts-ignore
import Datepicker from "vue3-datepicker";
import EmailTemplateTable from "@/elements/tableDataContent/EmailTemplateTable.vue";
import JobSelectOption from "@/elements/JobSelectOption.vue";

export default defineComponent({
  name: "email_template",
  data() {
    return {
      picked: new Date(),
    };
  },
  setup() {
    const dropDown = ref(false);
    return { dropDown };
  },
  components: { CmsTable, EmailCustomSelect, Datepicker, EmailTemplateTable, JobSelectOption },
});
</script>


<style scoped>
.calender_icon{
  position: absolute;
  right: 35px;
  top: 56%;
}

@media screen and (max-width:1199px) {
  .calender_icon{
  top: 49%;
}

}

</style>

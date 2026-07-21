<script lang="ts" setup>
import { reactive } from "vue";
import handlePagination from "@/layouts/HandlePaginatin";
import { job_application } from "@/elements/TableArrayData";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const tableBtn = reactive([
  { name: "No" },
  { name: "Position" },
  { name: "Name" },
  { name: "Email" },
  { name: "Phone Number" },
  { name: "Applied On" },
  { name: "Submitted By" },
  { name: "Status" },
  { name: "Actions" },
]);
const { paginatedData, data, goToPage, nextPage, perPage, backPage, addActive, sortingArr } = handlePagination(job_application, 10);

const { paginationLength } = storeToRefs(useStore());
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center mb-4 flex-wrap">
      <h3 class="me-auto">Job Application</h3>
      <div>
        <RouterLink to="/new-job" class="btn btn-primary me-3"><i class="fas fa-plus me-2"></i>Add New Job</RouterLink>
        <a href="javascript:void(0);" class="icon-btn me-3"> <i class="fas fa-envelope"></i></a>
        <a href="javascript:void(0);" class="icon-btn me-3"><i class="fas fa-phone-alt"></i></a>
        <a href="javascript:void(0);" class="icon-btn"><i class="fas fa-info"></i></a>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-12">
        <div class="table-responsive">
          <table class="table display mb-4 dataTablesCard job-table table-responsive-xl card-table" id="example5">
            <thead>
              <tr>
                <th v-for="({ name }, ind) in tableBtn" @click="sortingArr(ind)">{{ name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="({ no, position, name, email, phone, applied, submited, status, action }, index) in paginatedData" :key="index">
                <td>{{ no }}.</td>
                <td class="wspace-no">{{ position }}</td>
                <td>{{ name }}</td>
                <td>{{ email }}</td>
                <td>{{ phone }}</td>
                <td>{{ applied }}</td>
                <td>{{ submited }}</td>
                <td>
                  <span class="badge badge-warning light">{{ status }}</span>
                </td>
                <td class="action-btn wspace-no" v-html="action"></td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex align-items-center justify-content-between">
            <div class="dataTables_info">Showing {{ paginationLength - 9 }} to {{ paginationLength }} of {{ job_application.length }} entries</div>
            <div class="dataTables_paginate paging_simple_numbers" id="empoloyees-tblwrapper_paginate">
              <a class="paginate_button previous" id="empoloyees-tblwrapper_previous" @click="backPage"><i class="fa fa-angle-double-left" aria-hidden="true"></i></a
              ><span>
                <a
                  :class="`paginate_button m-1 border-0 text-center ${addActive === item ? 'current' : ''}`"
                  v-for="item in Math.ceil(data.length / perPage)"
                  :key="item"
                  style="background-color: var(--rgba-primary-1)"
                  @click="() => goToPage(item)"
                  >{{ item }}</a
                >
              </span>
              <a
                class="paginate_button next disabled active"
                @click="nextPage"
                aria-controls="empoloyees-tblwrapper"
                data-dt-idx="3"
                tabindex="0"
                id="empoloyees-tblwrapper_next"
                ><i class="fa fa-angle-double-right" aria-hidden="true"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

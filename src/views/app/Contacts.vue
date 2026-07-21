<template>
  <div class="page-titles">
    <ol class="breadcrumb">
      <li><h5 class="bc-title">Dashboard</h5></li>
      <li class="breadcrumb-item">
        <a href="javascript:void(0)">
          <span v-html="homeIcon"></span>
          Apps
        </a>
      </li>
      <li class="breadcrumb-item active">
        <a href="javascript:void(0)">Contacts</a>
      </li>
    </ol>
    <a class="text-primary fs-13" data-bs-toggle="offcanvas" href="#offcanvasExample1" role="button" aria-controls="offcanvasExample1">+ Add Task</a>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-12 active-p">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h4 class="heading mb-0">Contacts</h4>
          <div>
            <a class="btn btn-primary btn-sm me-1" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">+ Add Contacts</a>
            <button type="button" class="btn btn-secondary btn-sm ms-1" data-bs-toggle="modal" data-bs-target="#exampleModal1">+ Invite Customer</button>
          </div>
        </div>
        <div class="card h-auto">
          <div class="card-body p-0">
            <div class="table-responsive active-projects style-1 shorting dt-filter exports">
              <div id="user-tbl_wrapper" class="dataTables_wrapper">
                <div class="dt-buttons">
                  <button
                    class="dt-button buttons-excel buttons-html5 btn btn-sm border-0"
                    tabindex="0"
                    aria-controls="user-tbl"
                    type="button"
                    style="margin-top: 1rem; margin-right: 1rem"
                  >
                    <span><i class="fa-solid fa-file-excel"></i> Export Report</span>
                  </button>
                </div>
                <div id="user-tbl_filter" class="dataTables_filter">
                  <label>
                    <i class="fa-solid fa-magnifying-glass"></i
                    ><input type="search" class="" placeholder="Search..." aria-controls="user-tbl" @input="(e) => searchData((e.target as HTMLInputElement).value)"
                  /></label>
                </div>
                <table id="contacts-tbl" class="table">
                  <thead>
                    <tr>
                      <th>
                        <div class="form-check custom-checkbox ms-0">
                          <input type="checkbox" class="form-check-input" id="checkAll" required @click="checkboxes = !checkboxes" />
                          <label class="form-check-label" for="checkAll"></label>
                        </div>
                      </th>
                      <th @click="sortingArr(ind)" v-for="({ name }, ind) in tableBtn" :key="ind">{{ name }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="({ img, name, email, status, phone, status_color, status_text, date, status2, badge_color }, ind) in paginatedData" :key="ind">
                      <td>
                        <div class="form-check custom-checkbox">
                          <input type="checkbox" class="form-check-input" id="customCheckBox12" required :checked="checkboxes" />
                          <label class="form-check-label" for="customCheckBox12"></label>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <img :src="img" class="avatar rounded-circle" alt="" />
                          <p class="mb-0 ms-2">{{ name }}</p>
                        </div>
                      </td>
                      <td>{{ email }}</td>

                      <td class="pe-0">
                        <span :class="`badge ${badge_color}  light border-0 badge-sm`">{{ status }}</span>
                        {{ " " }}
                        <span :class="`badge badge-warning light border-0 badge-sm`">{{ status2 }}</span>
                      </td>
                      <td class="pe-0">{{ phone }}</td>
                      <td class="pe-0 c-status">
                        <span><i :class="`fa-solid fa-circle ${status_color}`"></i>{{ status_text }}</span>
                      </td>
                      <td>
                        <span>{{ date }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="dataTables_info">Showing 11 to 12 of {{ paginatedData.length }} entries</div>
                  <div class="dataTables_paginate paging_simple_numbers" id="empoloyees-tblwrapper_paginate">
                    <a class="paginate_button previous" id="empoloyees-tblwrapper_previous" @click="backPage"><i class="fa-solid fa-angle-left"></i></a
                    ><span>
                      <a
                        class="paginate_button"
                        v-for="item in Math.ceil(data.length / perPage)"
                        :key="item"
                        :style="`background-color:${addActive == item ? 'var(--primary);' : ''};color:${addActive == item ? '#fff !important' : ''}`"
                        @click="() => goToPage(item)"
                        >{{ item }}</a
                      >
                    </span>
                    <a class="paginate_button next" @click="nextPage" aria-controls="empoloyees-tblwrapper" data-dt-idx="3" tabindex="0" id="empoloyees-tblwrapper_next"
                      ><i class="fa-solid fa-angle-right"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import handlePagination from "@/layouts/HandlePaginatin";
import { customerProfileTable } from "@/elements/TableArrayData";
import { SVGImage } from "@/constent/Theme";

export default defineComponent({
  name: "contacts_",
  data() {
    return SVGImage;
  },
  setup() {
    const checkboxes = ref(false);
    const handlePaginationValue = handlePagination(customerProfileTable, 13);
    return {
      ...handlePaginationValue,
      checkboxes,
      tableBtn: [{ name: "Name" }, { name: "Email" }, { name: "Tags" }, { name: "Phone" }, { name: "Status" }, { name: "Dob" }],
    };
  },
});
</script>

<style scoped>
.paginate_button {
  height: 24px;
  width: 24px;
  padding: 0;
  margin-left: 0rem;
  margin: 0 0.125rem;
  line-height: 25px;
  text-align: center;
  font-size: 13px;
  border-radius: 0.375rem;
  border: 0;
  color: #0d99ff !important;
  cursor: pointer;
  box-shadow: none;
  box-sizing: border-box;
  display: inline-block;
}

#user-tbl_filter {
  color: #888888;
  border-radius: 1rem;
  margin-bottom: 0.35rem;
  padding-top: 1rem;
}
</style>

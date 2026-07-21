<!-- @format -->

<script lang="ts" setup>
import { reactive, ref } from "vue";
import handlePagination from "@/layouts/HandlePaginatin";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/Store";
import user1 from "../../../assets/images/users/pic1.jpg";
import user2 from "../../../assets/images/users/pic2.jpg";
import user3 from "../../../assets/images/users/pic3.jpg";
import user4 from "../../../assets/images/users/pic4.jpg";
import user5 from "../../../assets/images/users/pic5.jpg";
import user6 from "../../../assets/images/users/pic6.jpg";
import user7 from "../../../assets/images/users/pic7.jpg";
import user8 from "../../../assets/images/users/pic8.jpg";

const talebData = reactive([
  { img: user1, status: "Pending", badge: "warning" },
  { img: user3, status: "Pending", badge: "warning" },
  { img: user4, status: "Pending", badge: "warning" },
  { img: user5, status: "Pending", badge: "warning" },
  { img: user6, status: "Pending", badge: "warning" },
  { img: user7, status: "Pending", badge: "warning" },
  { img: user8, status: "Pending", badge: "warning" },
  { img: user1, status: "Pending", badge: "warning" },
  { img: user2, status: "Pending", badge: "warning" },
  { img: user3, status: "Pending", badge: "warning" },
  { img: user2, status: "Closed", badge: "danger" },
]);

const tableBtn = reactive([
  { name: "#" },
  { name: "CUSTOMER" },
  { name: "COUNTRY" },
  { name: "DATE" },
  { name: "COMPANY NAME" },
  { name: "STATUS" },
  { name: "ACTION" },
]);

const qtyPage = ref(10);

const {
  paginatedData,
  data,
  goToPage,
  nextPage,
  perPage,
  backPage,
  addActive,
  sortingArr,
} = handlePagination(talebData, qtyPage.value);
const { paginationLength } = storeToRefs(useStore());
</script>

<template>
  <!-- <div class="container-fluid">
    <div class="card">
      <div class="card-header d-sm-flex d-block">
        <div class="me-auto mb-sm-0 mb-3">
          <h4 class="card-title mb-2">Contact Listing</h4>
          <span>Lorem Ipsum sit amet</span>
        </div>
        <a href="javascript:void(0);" class="btn btn-info light me-3"
          ><i class="las la-download scale3 me-2"></i>Import Csv</a
        >
        <a href="javascript:void(0);" class="btn btn-info">+ Add Customer</a>
      </div>
      <div class="card-body">
        <AppTable />
      </div>
    </div>
  </div> -->
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-sm-flex d-block">
        <div class="me-auto mb-sm-0 mb-3">
          <h4 class="card-title mb-2">Contact Listing</h4>
          <span>Lorem Ipsum sit amet</span>
        </div>
        <a href="javascript:void(0);" class="btn btn-info light me-3"
          ><i class="las la-download scale3 me-2"></i>Import Csv</a
        >
        <a href="javascript:void(0);" class="btn btn-info">+ Add Customer</a>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <div
            id="ListDatatableView_wrapper"
            class="dataTables_wrapper no-footer"
          >
            <table
              class="table style-1 dataTable no-footer"
              id="ListDatatableView"
              role="grid"
              aria-describedby="ListDatatableView_info"
            >
              <thead>
                <tr role="row">
                  <th
                    @click="sortingArr(ind)"
                    class="sorting"
                    v-for="({ name }, ind) in tableBtn"
                    :key="ind"
                  >
                    {{ name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  role="row"
                  class="odd"
                  v-for="({ img, status, badge }, ind) in paginatedData"
                  :key="ind"
                >
                  <td class="">
                    <h6>{{ ind + 1 }}.</h6>
                  </td>
                  <td class="">
                    <div class="media style-1">
                      <img :src="img" class="img-fluid me-3" alt="" />
                      <div class="media-body">
                        <h6>John Doe</h6>
                        <span>johndoe@gmail.com</span>
                      </div>
                    </div>
                  </td>
                  <td class="sorting_1">
                    <div>
                      <h6>England</h6>
                      <span>COde:En</span>
                    </div>
                  </td>
                  <td class="">
                    <div>
                      <h6 class="text-primary">10/21/2016</h6>
                      <span>Paid</span>
                    </div>
                  </td>
                  <td class="">Abbott-Jacobs</td>
                  <td>
                    <span :class="`badge badge-${badge} light`">{{
                      status
                    }}</span>
                  </td>
                  <td>
                    <div class="d-flex action-button">
                      <a
                        href="javascript:void(0);"
                        class="btn btn-info btn-xs light px-2"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                            stroke="#fff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </a>
                      <a
                        href="javascript:void(0);"
                        class="ms-2 btn btn-xs px-2 light btn-danger"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 6H5H21"
                            stroke="#fff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                            stroke="#fff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              class="d-flex align-items-center justify-content-between basic-data_table_pagination"
            >
              <div class="dataTables_info">
                Showing {{ paginationLength - 9 }} to {{ paginationLength }} of
                {{ talebData.length }} entries
              </div>
              <div
                class="dataTables_paginate paging_simple_numbers"
                id="empoloyees-tblwrapper_paginate"
              >
                <a
                  class="paginate_button previous"
                  id="empoloyees-tblwrapper_previous"
                  @click="backPage"
                  ><i class="fa fa-angle-double-left" aria-hidden="true"></i></a
                ><span>
                  <a
                    :class="`paginate_button border-0 text-center m-1 ${
                      addActive === item ? 'current' : ''
                    }`"
                    v-for="item in Math.ceil(data.length / perPage)"
                    :key="item"
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
  </div>
</template>

<!-- @format -->

<template>
  <table id="projects-tbl1" class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date Added</th>
        <th>Last active</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="({ name, date, day, img }, index) in paginatedData"
        :key="index"
      >
        <td>
          <div class="d-flex align-items-center">
            <img :src="img" class="avatar avatar-md rounded-circle" alt="" />
            <div class="ms-2">
              <p class="mb-0 text-start text-black font-w500">{{ name }}</p>
              <span>demo@gmail.com</span>
            </div>
          </div>
        </td>
        <td>{{ date }}</td>
        <td>{{ day }}</td>
        <td>
          <div class="action-button">
            <button type="button" class="btn btn-primary btn-icon-xxs">
              <i class="fas fa-pencil-alt"></i>
            </button>
            {{ " " }}
            <button type="button" class="btn btn-danger btn-icon-xxs">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="d-flex align-items-center justify-content-between">
    <div class="dataTables_info">Showing 11 to 12 of {{ "" }} entries</div>
    <div
      class="dataTables_paginate paging_simple_numbers"
      id="empoloyees-tblwrapper_paginate"
    >
      <a
        class="paginate_button previous"
        id="empoloyees-tblwrapper_previous"
        @click="backPage"
        ><i class="fa-solid fa-angle-left"></i></a
      ><span>
        <a
          class="paginate_button"
          v-for="item in Math.ceil(data.length / perPage)"
          :key="item"
          :style="`background-color:${
            addActive == item ? 'var(--primary);' : ''
          };color:${addActive == item ? '#fff' : ''} `"
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
        ><i class="fa-solid fa-angle-right"></i
      ></a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import handlePagination from "@/layouts/HandlePaginatin";
import { tableDatabase } from "@/elements/TableArrayData";

export default defineComponent({
  setup() {
    const handlePaginationValue = handlePagination(tableDatabase, 5);
    return { ...handlePaginationValue };
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

.paginate_button:hover {
  color: var(--primary);
  background: var(--rgba-primary-1);
}

#tbl_filter {
  color: #888888;
  border-radius: 1rem;
  padding: 0.125rem 0;
  margin-bottom: 0.35rem;
}
</style>

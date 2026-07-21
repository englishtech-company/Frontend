<script lang="ts" setup>
import { RouterLink } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";
import { reactive } from "vue";

DataTable.use(DataTablesLib);

const tableData = reactive([
  [
    "01 ",
    "Festival",
    "National Holiday",
    "31 July 1998",
    "12 August 2021",
    "Lorem Ipsum is simply dummy",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "02",
    "Republic Day",
    "Office Holiday",
    "23 August 2005",
    "25 May 2019 ",
    "When an unknown printer took ",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "03",
    "Festival",
    "National Holiday",
    "15 March 2001",
    "28 May 2021",
    "Aldus Page Maker including versions",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "04",
    "Republic Day",
    "Office Holiday",
    "31 July 1998",
    "12 August 2021",
    "Lorem Ipsum is simply dummy",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "05",
    "Festival",
    "National Holiday",
    "15 March 2001",
    "28 May 2021",
    "When an unknown printer took ",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "06",
    "Republic Day",
    "Office Holiday",
    "31 July 1998",
    "12 August 2021",
    "Aldus Page Maker including versions",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "07",
    "Festival",
    "Public Holiday",
    "23 August 2005",
    "25 May 2019",
    "Lorem Ipsum is simply dummy ",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "08",
    "Memorial Day",
    "National Holiday",
    "15 March 2001",
    "28 May 2021",
    "When an unknown printer took",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "09",
    "Republic Day",
    "National Holiday",
    "31 July 1998",
    "12 August 2021",
    "Aldus Page Maker including versions",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "10",
    "Independence Day",
    "Office Holiday",
    "23 August 2005",
    "25 May 2019",
    "When an unknown printer took",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "11",
    "Memorial Day",
    "National Holiday",
    "15 March 2001",
    "28 May 2021",
    "When an unknown printer took",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "12",
    "Independence Day",
    "Office Holiday",
    "23 August 2005",
    "25 May 2019",
    "When an unknown printer took",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "13",
    "Festival",
    "Public Holiday",
    "23 August 2005",
    "25 May 2019",
    "Lorem Ipsum is simply dummy ",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "14",
    "Independence Day",
    "Office Holiday",
    "23 August 2005",
    "25 May 2019",
    "When an unknown printer took",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "15",
    "Memorial Day",
    "National Holiday",
    "15 March 2001",
    "28 May 2021",
    "When an unknown printer took",
    `
  <td>
													<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
]);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>All Holiday</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">Holiday</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">All Holiday</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Holiday List</h4>
            <RouterLink to="/add-holiday" class="btn btn-primary">+ Add New</RouterLink>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <DataTable
                :data="tableData"
                id="example3"
                class="display text-nowrap"
                style="min-width: 845px"
                :options="{
                  language: {
                    paginate: {
                      first: undefined,
                      last: undefined,
                      next: 'Next',
                      previous: `Previous`,
                    },
                  },
                }"
              >
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Start date</th>
                    <th>End Date</th>
                    <th>Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

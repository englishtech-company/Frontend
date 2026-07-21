<script lang="ts" setup>
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";
import { reactive } from "vue";

DataTable.use(DataTablesLib);

const tableData = reactive([
  [
    "01",
    "Clerk",
    "Rhona Davidson",
    "123 456 7890",
    "info@example.com",
    "2015",
    "210",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "02",
    "Accountant",
    "Michael Silva",
    "987 654 3210",
    "info@example.com",
    "2017",
    "10",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "03",
    "Junior Technical",
    "Ashton Cox",
    "(123) 4567 890",
    "info@example.com",
    "2016",
    "20",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "04",
    "Developer",
    "Cedric Kelly",
    "123 456 7890",
    "info@example.com",
    "2015 ",
    "30",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "05",
    "Accountant",
    "Airi Satou",
    "987 654 3210",
    "info@example.com",
    "2017",
    "40",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "06",
    "Specialist",
    "Brielle Williamson",
    "123 456 7890",
    "info@example.com",
    "2016",
    "50",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "07",
    "Sales Assistant",
    "Herrod Chandler",
    "987 654 3210",
    "info@example.com",
    "2015",
    "60",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "08",
    "Librarian",
    "Rhona Davidson",
    "(123) 4567 890",
    "info@example.com",
    "2017",
    "70",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "09",
    "Librarian",
    "Colleen Hurst",
    "(123) 4567 890",
    "info@example.com",
    "2017",
    "80",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "10",
    "Librarian",
    "Sonya Frost",
    "123 456 7890",
    "info@example.com",
    "2015",
    "90",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "11",
    "Office Manager",
    "Jena Gaines",
    "123 456 7890",
    "info@example.com",
    "2015",
    "210",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "12",
    "Support Lead",
    "Quinn Flynn",
    "987 654 3210",
    "info@example.com",
    "2017",
    "10",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "13",
    "Regional Director",
    "Charde Marshall",
    "(123) 4567 890",
    "info@example.com",
    "2016",
    "20",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "14",
    "Librarian",
    "Haley Kennedy",
    "123 456 7890",
    "info@example.com",
    "2015 ",
    "30",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "15",
    "Region al Director",
    "Tatyana Fitzpatrick",
    "987 654 3210",
    "info@example.com",
    "2017",
    "40",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "16",
    "Librarian",
    "Brielle Michael Silva",
    "123 456 7890",
    "info@example.com",
    "2016",
    "50",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "17",
    "Financial Officer",
    "Paul Byrd",
    "987 654 3210",
    "info@example.com",
    "2015",
    "60",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "18",
    "Systems Administrator",
    "Gloria Little",
    "(123) 4567 890",
    "info@example.com",
    "2017",
    "70",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "19",
    "Librarian",
    "Bradley Greer",
    "(123) 4567 890",
    "info@example.com",
    "2017",
    "80",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
  [
    "20",
    "Personnel Lead",
    "Dai Rios",
    "123 456 7890",
    "info@example.com",
    "2015",
    "90",
    `<td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>`,
  ],
]);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>All Departments</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">Departments</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">All Departments</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Department List</h4>
            <RouterLink to="/add-departments" class="btn btn-primary"> + Add List</RouterLink>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <DataTable
                id="example3"
                class="display"
                style="min-width: 845px"
                :data="tableData"
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
                    <th>Department</th>
                    <th>Head Of Dept.</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Starting Year</th>
                    <th>Stu. Capacity</th>
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

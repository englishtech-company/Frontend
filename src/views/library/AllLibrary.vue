<script lang="ts" setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";

DataTable.use(DataTablesLib);

const tableData = reactive([
  [
    "01",
    "Technical Author",
    "Designing",
    "Architecture",
    " 3 Year ",
    "Book",
    " Out of Stock",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "02",
    "Team Leader",
    "Computer",
    "Office Manager",
    "2 Year  ",
    "Comics",
    " Out of Stock ",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "03",
    "Software Engineer",
    "Computer",
    "Architecture ",
    "1 Year  ",
    "Book",
    " In Stock 	",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "04",
    "Software Engineer",
    "Designing",
    " Data Entry 	",
    " 3 Year	 ",
    "Newspaper",
    "In Stock 	",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "05",
    "Marketing Designer",
    "Politics",
    " Office Manager ",
    "1 Year  ",
    "Book",
    "   In Stock ",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "06",
    "Office Manager",
    "Computer",
    "  Data Entry 	",
    "1 Year ",
    "Newspaper",
    "Out of Stock",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "07",
    "Regional Marketing",
    "Science",
    "Architecture ",
    "2 Year ",
    "Comics",
    "In Stock ",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "08",
    "Integration Specialist",
    "Designing",
    " Office Manager ",
    "3 Year  ",
    "Newspaper",
    "In Stock",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "09",
    "Integration Specialist",
    "Politics",
    " Data Entry ",
    "1 Year  ",
    "Book",
    " In Stock",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "10",
    "Networking 	",
    "B.COM., M.COM.",
    " Security Department",
    "1 Year ",
    "Newspaper",
    "Out of Stock",
    `
    <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
    `,
  ],
  [
    "11",
    "Javascript Developer",
    "Computer",
    "Architecture",
    "2 Year",
    "Newspaper",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "12",
    "Javascript Developer",
    "Science",
    "Security Department",
    "3 Year",
    "Comics",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "13",
    "Javascript Developer",
    "Designing",
    "Office Manager",
    "1 Year",
    "Book",
    "Out of Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "14",
    "Javascript Developer",
    "Computer",
    "Architecture",
    "1 Year",
    "Comics",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "15",
    "Javascript Developer",
    "Politics",
    "Data Entry",
    "2 Year",
    "Newspaper",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "16",
    "Systems Administrator",
    "Science",
    " 	Security Department",
    "1 Year",
    "Newspaper",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "17",
    "Systems Administrator",
    "Politics",
    "Office Manager",
    "3 Year",
    "Book",
    "Out of Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "18",
    "Systems Administrator",
    "Designing",
    "Security Department",
    "2 Year",
    "Comics",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "19",
    "Systems Administrator",
    "Computer",
    "Office Manager",
    "2 Year",
    "Book",
    "In Stock",
    `
  <td>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
                                                    <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                                                </td>
  `,
  ],
  [
    "20",
    "Systems Administrator",
    "Computer",
    "Data Entry",
    "1 Year",
    "Comics",
    "In Stock",
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
          <h4>All Library</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">Library</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">All Library</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Asset List</h4>
            <RouterLink to="/add-library" class="btn btn-primary">+ Add new</RouterLink>
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
                    <th>Subject</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Type</th>
                    <th>Status</th>
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

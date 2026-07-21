<script setup lang="ts">
import { reactive } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";
import IMAGE from "@/constent/Theme";

DataTable.use(DataTablesLib);

const tableData = reactive([
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "123 456 7890",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic2}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Male",
    "Tokyo",
    "123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic3}" alt="">`,
    "Ashton Cox",
    "Junior Technical Author",
    "Male",
    "San Francisco",
    "  123 456 7890 ",
    "info@example.com",
    "2009/01/12",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic4}" alt="">`,
    "Cedric Kelly",
    "Senior Javascript Developer",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2012/03/29",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic5}" alt="">`,
    "Airi Satou",
    "Accountant",
    "Male",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2008/11/28",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic6}" alt="">`,
    "Cedric Kelly",
    "Senior Javascript Developer",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2012/03/29",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic7}" alt="">`,
    "Airi Satou",
    "Accountant",
    "Male",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2008/11/28",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic8}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic9}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Male",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic10}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Female",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic2}" alt="">`,
    "Ashton Cox",
    "Junior Technical Author",
    "Male",
    "San Francisco",
    "  123 456 7890 ",
    "info@example.com",
    "2009/01/12",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic3}" alt="">`,
    "Ashton Cox",
    "Junior Technical Author",
    "Male",
    "San Francisco",
    "  123 456 7890 ",
    "info@example.com",
    "2009/01/12",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic4}" alt="">`,
    "Cedric Kelly",
    "Senior Javascript Developer",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2012/03/29",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic5}" alt="">`,
    "Ashton Cox",
    "Junior Technical Author",
    "Male",
    "San Francisco",
    "  123 456 7890 ",
    "info@example.com",
    "2009/01/12",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic6}" alt="">`,
    "Cedric Kelly",
    "Senior Javascript Developer",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2012/03/29",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic7}" alt="">`,
    "Airi Satou",
    "Accountant",
    "Male",
    "Tokyo",
    " 123 456 7890 ",
    "info@example.com",
    "2008/11/28",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic8}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic9}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Male",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic10}" alt="">`,
    "Airi Satou",
    "Accountant",
    "Female",
    "Tokyo",
    " 123 456 7890 ",
    "info@example.com",
    "2008/11/28",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic2}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Male",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic3}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Male",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic4}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Female",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic5}" alt="">`,
    "Ashton Cox",
    "Junior Technical Author",
    "Male",
    "San Francisco",
    "  123 456 7890 ",
    "info@example.com",
    "2009/01/12",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic6}" alt="">`,
    "Cedric Kelly",
    "Senior Javascript Developer",
    "Female",
    "Edinburgh",
    "  123 456 7890 ",
    "info@example.com",
    "2012/03/29",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic7}" alt="">`,
    "Airi Satou",
    "Accountant",
    "Male",
    "Tokyo",
    " 123 456 7890 ",
    "info@example.com",
    "2008/11/28",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic8}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "123 456 7890 ",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic9}" alt="">`,
    "Garrett Winters",
    "Accountant",
    "Male",
    "Tokyo",
    "  123 456 7890 ",
    "info@example.com",
    "2011/07/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Tiger Nixon",
    "System Architect",
    "Female",
    "Edinburgh",
    "123 456 7890",
    "info@example.com",
    "2011/04/25",
    `
  <td>
													<div class="d-flex">
														<a href="javascript:void(0);" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>
														<a href="javascript:void(0);" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
													</div>
												</td>
  `,
  ],
]);
</script>

<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Profile Datatable</h4>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <DataTable
            :data="tableData"
            id="example3"
            class="stripe row-border order-column nowrap"
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
                <th>S. no.</th>
                <th>Name</th>
                <th>Department</th>
                <th>Gender</th>
                <th>Education</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Joining Date</th>
                <th>Action</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

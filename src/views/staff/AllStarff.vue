<script lang="ts" setup>
import { RouterLink } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";
import { reactive } from "vue";
import IMAGE from "@/constent/Theme";
DataTable.use(DataTablesLib);

const tableData = reactive([
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Tiger Nixon",
    "Clerk",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2011/04/25",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic2}" alt="">`,
    "Garrett Winters ",
    "Accountant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2011/07/25",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic3}" alt="">`,
    "Ashton Cox",
    "Junior Technical",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2009/01/12",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic4}" alt="">`,
    "Cedric Kelly",
    "Developer",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2012/03/29",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic5}" alt="">`,
    "Airi Satou",
    "Accountant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2008/11/28",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic6}" alt="">`,
    "Brielle Williamson",
    "Specialist",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2012/12/02",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic7}" alt="">`,
    "Herrod Chandler",
    "Sales Assistant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2012/08/06",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic8}" alt="">`,
    "Rhona Davidson",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2010/10/14",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic9}" alt="">`,
    "Colleen Hurst",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2009/09/15",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic10}" alt="">`,
    "Sonya Frost",
    "Librarian",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2008/12/13",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Brielle Williamson",
    "Specialist",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2012/12/02",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic2}" alt="">`,
    "Herrod Chandler",
    "Sales Assistant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2012/08/06",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic3}" alt="">`,
    "Rhona Davidson",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2010/10/14",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic4}" alt="">`,
    "Colleen Hurst",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2009/09/15",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic5}" alt="">`,
    "Sonya Frost",
    "Librarian",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2008/12/13",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic6}" alt="">`,
    "Tiger Nixon",
    "Clerk",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2011/04/25",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic7}" alt="">`,
    "Garrett Winters ",
    "Accountant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2011/07/25",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic8}" alt="">`,
    "Ashton Cox",
    "Junior Technical",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2009/01/12",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic9}" alt="">`,
    "Cedric Kelly",
    "Developer",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2012/03/29",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic10}" alt="">`,
    "Airi Satou",
    "Accountant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2008/11/28",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic1}" alt="">`,
    "Airi Satou",
    "Accountant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2008/11/28",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic2}" alt="">`,
    "Brielle Williamson",
    "Specialist",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2012/12/02",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic3}" alt="">`,
    "Herrod Chandler",
    "Sales Assistant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2012/08/06",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic4}" alt="">`,
    "Rhona Davidson",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2010/10/14",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic5}" alt="">`,
    "Colleen Hurst",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2009/09/15",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic6}" alt="">`,
    "Sonya Frost",
    "Librarian",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2008/12/13",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic7}" alt="">`,
    "Brielle Williamson",
    "Specialist",
    "123 456 7890",
    "info@example.com",
    "#8901 Demo Road",
    "2012/12/02",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic8}" alt="">`,
    "Herrod Chandler",
    "Sales Assistant",
    "987 654 3210",
    "info@example.com",
    "#8901 Demo Road",
    "2012/08/06",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic9}" alt="">`,
    "Rhona Davidson",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2010/10/14",
    `
  <td>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-primary"><i class="fa fa-pencil"></i></a>
															<a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
														</td>
  `,
  ],
  [
    `<img class="rounded-circle" width="35" src="${IMAGE.profile_small_pic10}" alt="">`,
    "Colleen Hurst",
    "Librarian",
    "(123) 4567 890",
    "info@example.com",
    "#8901 Demo Road",
    "2009/09/15",
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
          <h4>All Staff</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">Staff</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">All Staff</a></li>
        </ol>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <ul class="nav nav-pills mb-3">
          <li class="nav-item"><a href="#list-view" data-bs-toggle="tab" class="nav-link me-1 show active">List View</a></li>
          <li class="nav-item"><a href="#grid-view" data-bs-toggle="tab" class="nav-link">Grid View</a></li>
        </ul>
      </div>
      <div class="col-lg-12">
        <div class="row tab-content">
          <div id="list-view" class="tab-pane fade active show col-lg-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">All Staff</h4>
                <RouterLink to="/add-staff" class="btn btn-primary">+ Add new</RouterLink>
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
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Joining Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
          <div id="grid-view" class="tab-pane fade col-lg-12">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic2.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Alexander</h3>
                      <p class="text-muted">M.COM., P.H.D.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Male</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic3.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Elizabeth</h3>
                      <p class="text-muted">B.COM., M.COM.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Female</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic4.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Amelia</h3>
                      <p class="text-muted">M.COM., P.H.D.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Female</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic5.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Charlotte</h3>
                      <p class="text-muted">B.COM., M.COM.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Female</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic6.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Isabella</h3>
                      <p class="text-muted">B.A, B.C.A</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Female</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic7.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Sebastian</h3>
                      <p class="text-muted">M.COM., P.H.D.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Male</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic8.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Olivia</h3>
                      <p class="text-muted">B.COM., M.COM.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Female</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profilehtml">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic9.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Emma</h3>
                      <p class="text-muted">B.A, B.C.A</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Female</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="card card-profile">
                  <div class="card-header justify-content-end pb-0 border-0">
                    <div class="dropdown">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <span class="dropdown-dots fs--1"></span>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right border py-0">
                        <div class="py-2">
                          <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <div class="text-center">
                      <div class="profile-photo">
                        <img src="../../assets/images/profile/small/pic10.jpg" width="100" class="img-fluid rounded-circle" alt="" />
                      </div>
                      <h3 class="mt-4 mb-1">Jackson</h3>
                      <p class="text-muted">M.COM., P.H.D.</p>
                      <ul class="list-group mb-3 list-group-flush">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Gender :</span><strong>Male</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Phone No. :</span><strong>+01 123 456 7890</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Email:</span><strong>info@example.com</strong></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Address:</span><strong>#8901 Marmora Road</strong></li>
                      </ul>
                      <RouterLink class="btn btn-outline-primary btn-rounded mt-3 px-4" to="/professor-profile">Read More</RouterLink>
                    </div>
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

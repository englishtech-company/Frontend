<!-- @format -->

<script setup lang="ts">
import { reactive } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";
import { ref } from "vue";

DataTable.use(DataTablesLib);



const btn = () => {
  return `<div class="dropdown ms-auto text-end c-pointer">
														<div class="btn-link" data-bs-toggle="dropdown" aria-expanded="false">
															<i class="fa fa-ellipsis-h fs-20"></i>
                                                        </div>
														<div class="dropdown-menu dropdown-menu-end" style="">
															<a class="dropdown-item" href="javascript:void(0);">Accept Patient</a>
															<a class="dropdown-item" href="javascript:void(0);">Reject Order</a>
															<a class="dropdown-item" href="javascript:void(0);">View Details</a>
														</div>
													</div>`;
};

const tableData = reactive([
  [
    `<div class="form-check custom-checkbox ms-2">
														<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
														<label class="form-check-label" for="customCheckBox12"></label>
													</div>`,
    "#P-00001",
    "26/02/2021, 12:42 AM",
    "Tiger Nixon",
    "Dr.Cedric",
    "Cold & Flu",
    `<span class="badge light badge-danger">
														<i class="fa fa-circle text-danger me-1"></i>
														New Patient
													</span>`,
    "AB-001",
    ,
    `<span class="badge light badge-danger">
														<i class="fa fa-circle text-danger me-1"></i>
														New Patient
													</span>`,
  ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00002",
  //   "26/02/2021, 12:42 AM",
  //   "Garrett Winters",
  //   "Dr.Cedric",
  //   "Sleep Problem",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-002",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00003",
  //   "26/02/2021, 12:42 AM",
  //   "Ashton Cox",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   `<span class="badge light badge-success">
  // 													<i class="fa fa-circle text-success me-1"></i>
  // 													Recovered
  // 												</span> `,
  //   "AB-003",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00004",
  //   "26/02/2021, 12:42 AM",
  //   "Ashton Cox",
  //   "Dr.Cedric",
  //   "Cold & Flu",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-004",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00005",
  //   "26/02/2021, 12:42 AM",
  //   "Ashton Cox",
  //   "Dr.Cedric",
  //   "Cold & Flu",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-005",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00006",
  //   "26/02/2021, 12:42 AM",
  //   "Ashton Cox",
  //   "Dr.Rhona",
  //   "Sleep Problem",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-006",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00007",
  //   "26/02/2021, 12:42 AM",
  //   "Airi Satou",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-007",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00008",
  //   "26/02/2021, 12:42 AM",
  //   "Airi Satou",
  //   "Dr.Garrett",
  //   "Sleep Problem",
  //   `<span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span>`,
  //   "AB-008",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-00009",
  //   "26/02/2021, 12:42 AM",
  //   "Airi Satou",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span> `,
  //   "AB-009",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000010",
  //   "26/02/2021, 12:42 AM",
  //   "Airi Satou",
  //   "Dr.Rhona",
  //   "Sleep Problem",
  //   ` <span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span>`,
  //   "AB-010",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000011",
  //   "26/02/2021, 12:42 AM",
  //   "Airi Satou",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   `<span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span> `,
  //   "AB-011",
  //   ,
  //   `<div class="dropdown ms-auto text-end c-pointer">
  // 													<div class="btn-link" data-bs-toggle="dropdown">
  // 														<i class="fa fa-ellipsis-h fs-20"></i>
  //            </div>
  // 													<div class="dropdown-menu dropdown-menu-end">
  // 														<a class="dropdown-item" href="javascript:void(0);">Accept Patient</a>
  // 														<a class="dropdown-item" href="javascript:void(0);">Reject Order</a>
  // 														<a class="dropdown-item" href="javascript:void(0);">View Details</a>
  // 													</div>
  // 												</div>`,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000012",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Garrett",
  //   "Sleep Problem",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-012",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000013",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   ` <span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span>`,
  //   "AB-013",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000014",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Garrett",
  //   "Sleep Problem",
  //   ` <span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span>`,
  //   "AB-014",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000015",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span> `,
  //   "AB-015",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000016",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Garrett",
  //   "Sleep Problem",
  //   ` <span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-016",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000017",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   ` <span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span>`,
  //   "AB-017",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000018",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Rhona",
  //   "Sleep Problem",
  //   `<span class="badge light badge-danger">
  // 													<i class="fa fa-circle text-danger me-1"></i>
  // 													New Patient
  // 												</span> `,
  //   "AB-018",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000019",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Rhona",
  //   "Cold & Flu",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-019",
  //   ,
  // ],
  // [
  //   `<div class="form-check custom-checkbox ms-2">
  // 													<input type="checkbox" class="form-check-input" id="customCheckBox12" required="">
  // 													<label class="form-check-label" for="customCheckBox12"></label>
  // 												</div>`,
  //   "#P-000020",
  //   "26/02/2021, 12:42 AM",
  //   "Sonya Frost",
  //   "Dr.Garrett",
  //   "Sleep Problem",
  //   `<span class="badge light badge-warning">
  // 													<i class="fa fa-circle text-warning me-1"></i>
  // 													In Treatment
  // 												</span>`,
  //   "AB-020",
  //   ,
  // ],
]);
</script>

<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Patient</h4>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <DataTable
            :data="tableData"
            id="example3"
            class="display"
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
                <th>
                  <div class="form-check custom-checkbox ms-2">
                    <input type="checkbox" class="form-check-input" id="checkAll" required />
                    <label class="form-check-label" for="checkAll"></label>
                  </div>
                </th>
                <th>Patient ID</th>
                <th>Date Check in</th>
                <th>Patient Name</th>
                <th>Doctor Assgined</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Room no</th>
                <th>Action</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

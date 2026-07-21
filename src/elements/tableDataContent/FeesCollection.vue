<!-- @format -->

<script setup lang="ts">
import { reactive } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";

DataTable.use(DataTablesLib);

const tableData = reactive([
  ["01", "Tiger Nixon", "#54605", "Library", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/04/25", "120$"],
  ["02", "Garrett Winters", "#54687", "Library", "Credit Card", `<span class="badge light badge-warning">Pending</span>`, "2011/07/25", "120$"],
  ["03", "Ashton Cox", "#35672", "Tuition", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/01/25", "120$"],
  ["04", "Cedric Kelly", "#57984", "Annual", "Credit Card", `<span class="badge light badge-warning">Pending</span>`, "2011/03/25", "120$"],
  ["05", "Airi Satou", "#12453", "Library", "Cheque", `<span class="badge light badge-warning">Pending</span>`, "2011/11/25", "120$"],
  ["06", "Brielle Williamson", "#59723", "Tuition", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/12/25", "120$"],
  ["07", "Herrod Chandler", "#98726", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/08/25", "120$"],
  ["08", "Rhona Davidson", "#98721", "Library", "Cheque", `<span class="badge light badge-danger">Udpaid</span>`, "2011/10/25", "120$"],
  ["09", "Colleen Hurst", "#54605", "Annual", "Cheque", `<span class="badge light badge-success">Paid</span>`, "2011/09/25", "120$"],
  ["10", "Sonya Frost", "#98734", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/12/25", "120$"],
  ["11", "Brielle Williamson", "#59723", "Tuition", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/12/25", "120$"],
  ["12", "Herrod Chandler", "#98726", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/08/25", "120$"],
  ["13", "Rhona Davidson", "#98721", "Library", "Cheque", `<span class="badge light badge-danger">Udpaid</span>`, "2011/10/25", "120$"],
  ["14", "Colleen Hurst", "#54605", "Annual", "Cheque", `<span class="badge light badge-success">Paid</span>`, "2011/09/25", "120$"],
  ["15", "Sonya Frost", "#98734", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/12/25", "120$"],
  ["16", "Tiger Nixon", "#54605", "Library", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/04/25", "120$"],
  ["17", "Garrett Winters", "#54687", "Library", "Credit Card", `<span class="badge light badge-warning">Pending</span>`, "2011/07/25", "120$"],
  ["18", "Ashton Cox", "#35672", "Tuition", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/01/25", "120$"],
  ["19", "Cedric Kelly", "#57984", "Annual", "Credit Card", `<span class="badge light badge-warning">Pending</span>`, "2011/03/25", "120$"],
  ["20", "Airi Satou", "#12453", "Library", "Cheque", `<span class="badge light badge-warning">Pending</span>`, "2011/11/25", "120$"],
  ["21", "Airi Satou", "#12453", "Library", "Cheque", `<span class="badge light badge-warning">Pending</span>`, "2011/11/25", "120$"],
  ["22", "Brielle Williamson", "#59723", "Tuition", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/12/25", "120$"],
  ["23", "Herrod Chandler", "#98726", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/08/25", "120$"],
  ["24", "Rhona Davidson", "#98721", "Library", "Cheque", `<span class="badge light badge-danger">Udpaid</span>`, "2011/10/25", "120$"],
  ["25", "Colleen Hurst", "#54605", "Annual", "Cheque", `<span class="badge light badge-success">Paid</span>`, "2011/09/25", "120$"],
  ["26", "Sonya Frost", "#98734", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/12/25", "120$"],
  ["27", "Brielle Williamson", "#59723", "Tuition", "Cash", `<span class="badge light badge-success">Paid</span>`, "2011/12/25", "120$"],
  ["28", "Herrod Chandler", "#98726", "Tuition", "Credit Card", `<span class="badge light badge-danger">Udpaid</span>`, "2011/08/25", "120$"],
  ["29", "Rhona Davidson", "#98721", "Library", "Cheque", `<span class="badge light badge-danger">Udpaid</span>`, "2011/10/25", "120$"],
  ["30", "Colleen Hurst", "#54605", "Annual", "Cheque", `<span class="badge light badge-success">Paid</span>`, "2011/09/25", "120$"],
]);
</script>

<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Fees Collection</h4>
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
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Invoice number</th>
                <th>Fees Type</th>
                <th>Payment Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

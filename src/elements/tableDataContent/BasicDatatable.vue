<!-- @format -->

<script setup lang="ts">
import { reactive } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net";

DataTable.use(DataTablesLib);

const tableData = reactive([
  ["Tiger Nixon", "System Architect", "Edinburgh", 61, "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", 63, "2011/07/25", "$170,750"],
  ["Ashton Cox", "Junior Technical Author", "San Francisco", 66, "2009/01/12", "$86,000"],
  ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", 22, "2012/03/29", "$433,060"],
  ["Airi Satou", "Accountant", "Tokyo", 33, "2008/11/28", "$162,700"],
  ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", 22, "2012/03/29", "$433,060"],
  ["Airi Satou", "Accountant", "Tokyo", "33", "2008/11/28", "$162,700"],
  ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
  ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
  ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000"],
  ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000"],
  ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060"],
  ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000"],
  ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060"],
  ["Airi Satou", "Accountant", "Tokyo", "33", "2008/11/28", "$162,700"],
  ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
  ["Airi Satou", "Accountant", "Tokyo", "33", "2008/11/28", "$162,700"],
  ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
  ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
  ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000"],
  ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060"],
  ["Airi Satou", "Accountant", "Tokyo", "33", "2008/11/28", "$162,700"],
  ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"],
  ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
]);
</script>

<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Basic Datatable</h4>
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
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th style="border-top: 1px solid rgba(0, 0, 0, 0.3)">Name</th>
                <th style="border-top: 1px solid rgba(0, 0, 0, 0.3)">Position</th>
                <th style="border-top: 1px solid rgba(0, 0, 0, 0.3)">Office</th>
                <th style="border-top: 1px solid rgba(0, 0, 0, 0.3)">Age</th>
                <th style="border-top: 1px solid rgba(0, 0, 0, 0.3)">Start date</th>
                <th style="border-top: 1px solid rgba(0, 0, 0, 0.3)">Salary</th>
              </tr>
            </tfoot>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

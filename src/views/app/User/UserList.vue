<!-- @format -->

<script lang="ts" setup>
import AppTable from "@/components/AppTable.vue";
</script>

<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-sm-flex d-block">
        <div class="me-auto mb-sm-0 mb-3">
          <h4 class="card-title mb-2">User Listing</h4>
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
  </div>

</template>

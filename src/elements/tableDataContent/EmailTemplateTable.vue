<script lang="ts" setup>
import { ref } from "vue";

const dropDown = ref(false);
</script>

<template>
  <div class="filter cm-content-box box-primary">
    <div class="content-title SlideToolHeader">
      <div class="cpa"><i class="fa-solid fa-envelope me-1"></i> Email Template List</div>
      <div class="tools">
        <a href="javascript:void(0);" @click="dropDown = !dropDown"
          :class="`${dropDown ? '' : 'expand'} SlideToolHeader`" data-bs-toggle="collapse"
          data-bs-target="#emaltemplate" aria-expanded="true" aria-controls="emaltemplate"><i
            class="fal fa-angle-down"></i></a>
      </div>
    </div>
    <div class="cm-content-body form excerpt collapse show" id="emaltemplate">
      <div class="card-body py-3">
        <div class="table-responsive">
          <table class="table text-nowrap">
            <thead>
              <tr>
                <th class="icon_none">Sr.No</th>
                <th class="icon_none">Title</th>
                <th class="icon_none">Status</th>
                <th class="icon_none">Modified</th>
                <th class="text-end icon_none">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>User Registration</td>



                <td><a class=" btn btn-primary btn-sm content-icon status m-0"><i class="fa-solid fa-check"></i> </a>
                </td>
                <td>03 Feb, 2024</td>
                <td class="text-end">
                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon me-0">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </td>

              </tr>
              <tr>
                <td>2</td>
                <td>User Forgot Password</td>
                <td><a href="javascript:void(0);" class=" btn btn-primary btn-sm content-icon m-0"><i
                      class="fa-solid fa-check"></i></a></td>
                <td>04 Feb, 2024</td>
                <td class="text-end">
                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon me-0">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </td>

              </tr>
              <tr>
                <td>3</td>
                <td>User Activation</td>
                <td><a href="javascript:void(0);" class=" btn btn-primary btn-sm content-icon m-0"><i
                      class="fa-solid fa-check"></i></a></td>
                <td>05 Feb, 2024</td>
                <td class="text-end">
                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon me-0">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </td>

              </tr>
              <tr>
                <td>4</td>
                <td>User Login</td>
                <td><a href="javascript:void(0);" class=" btn btn-primary btn-sm content-icon m-0"><i
                      class="fa-solid fa-check"></i></a></td>
                <td>06 Feb, 2024</td>
                <td class="text-end">
                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon me-0">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </td>

              </tr>
              <tr>
                <td>5</td>
                <td>User Account Locked</td>
                <td><a href="javascript:void(0);" class=" btn btn-primary btn-sm content-icon m-0"><i
                      class="fa-solid fa-check"></i></a></td>
                <td>07 Feb, 2024</td>
                <td class="text-end">
                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon me-0">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </td>

              </tr>

            </tbody>
          </table>
          <div class="d-flex align-items-center justify-content-between flex-column flex-lg-row py-3">
            <small class="mb-xl-0 mb-2">Page 1 of 4, showing 2 records out of 8 total, starting on record 1, ending on
              2</small>
            <nav aria-label="Page navigation example">
              <ul class="pagination  my-2 my-md-0">
                <li class="page-item"><a class="page-link" href="javascript:void(0);"><i
                      class="fa-solid fa-angle-left"></i></a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);">1</a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);">2</a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);">3</a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);"><i
                      class="fa-solid fa-angle-right"></i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

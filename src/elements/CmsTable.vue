<template>
  <div class="filter cm-content-box box-primary">
    <div class="content-title SlideToolHeader">
      <div class="cpa"><i :class="icon"> </i>{{ title }}</div>
      <div class="tools">
        <a href="javascript:void(0);" @click="dropDown = !dropDown"
          :class="`${dropDown ? '' : 'expand'} SlideToolHeader`" data-bs-toggle="collapse"
          data-bs-target="#contentCollapseExample2" aria-expanded="true" aria-controls="contentCollapseExample2"><i
            class="fal fa-angle-down"></i></a>
      </div>
    </div>
    <div class="cm-content-body form excerpt collapse show" id="contentCollapseExample2">
      <div class="card-body py-3">
        <div class="table-responsive">
          <table class="table text-nowrap">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Status</th>
                <th>Modified</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>About Us</td>
                <td>Published</td>
                <td>18 Feb, 2024</td>
                <td class="text-end">

                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                    <i class="fa fa-times"></i>
                  </a>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>FAQ</td>
                <td>Published</td>
                <td>13 Jan, 2024</td>
                <td class="text-end">

                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                    <i class="fa fa-times"></i>
                  </a>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Pricing</td>
                <td>Published</td>
                <td>13 Jan, 2024</td>
                <td class="text-end">

                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                    <i class="fa fa-times"></i>
                  </a>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Schedule</td>
                <td>Published</td>
                <td>13 Jan, 2024</td>
                <td class="text-end">

                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                    <i class="fa fa-times"></i>
                  </a>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Under Maintenance</td>
                <td>Published</td>
                <td>25 Jan, 2024</td>
                <td class="text-end">

                  <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                    <i class="fa fa-times"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex align-items-center justify-content-between flex-column flex-lg-row py-3">
            <small class="mb-xl-0 mb-2">Page 1 of 5, showing 2 records out of 8 total, starting on record 1, ending on
              2</small>
            <nav aria-label="Page navigation example">
              <ul class="pagination mb-2 mb-sm-0">
                <li class="page-item"><a class="page-link" href="javascript:void(0);"><i
                      class="fa-solid fa-angle-left"></i></a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);">1</a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);">2</a></li>
                <li class="page-item"><a class="page-link" href="javascript:void(0);">3</a></li>
                <li class="page-item"><a class="page-link " href="javascript:void(0);"><i
                      class="fa-solid fa-angle-right"></i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "cmsTable_",
  props: {
    title: String as () => string,
    icon: String as () => string,
  },
  setup() {
    const dropDown = ref(false);
    return { dropDown };
  },
});
</script>

<style scoped>
.cm-content-box table thead tr th::after {
  display: none !important;
}
</style>

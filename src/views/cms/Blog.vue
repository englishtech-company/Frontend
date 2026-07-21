x<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Blog</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">CMS</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">Blog</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="filter cm-content-box box-primary">
          <div class="content-title">
            <div class="cpa"><i class="fa-solid fa-filter me-2"></i>Filter</div>
            <div class="tools">
              <a @click="dropDown = !dropDown" href="javascript:void(0);"
                :class="`${dropDown ? '' : 'expand'} SlideToolHeader`" data-bs-toggle="collapse"
                data-bs-target="#blogCollapse" aria-expanded="false" aria-controls="blogCollapse"><i
                  class="fal fa-angle-down"></i></a>
            </div>
          </div>
          <div class="cm-content-body form excerpt collapse show" id="blogCollapse">
            <div class="card-body">
              <div class="row">
                <div class="col-xl-3 col-sm-6">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control mb-3 mb-xl-0" id="exampleFormControlInput1"
                    placeholder="Title" />
                </div>
                <div class="col-xl-3 col-sm-6 mb-3 mb-xl-0">
                  <label class="form-label">Status</label>
                  <CustomSelectOption2 class="form-control" value-one="Select Status" value-two="Published"
                    value-three="Draft" value-four="Trash" value-five="Private" value-six="Pending" />
                </div>
                <div class="col-xl-3 col-sm-6" style="position: relative">
                  <label class="form-label">Date</label>
                  <datepicker class="form-control mb-xl-0 mb-3" :week-starts-on="1" startingView="day"
                    dayPickerHeadingFormat="dd-mm-yyyy" id="datepicker" v-model="picked" />
                  <div class="icon calender_icon"><i
                      class="far fa-calendar"></i></div>
                </div>
                <div class="col-xl-3 col-sm-6 align-self-end mb-sm-3 mb-xl-0">
                  <div>
                    <button class="btn btn-primary light me-1" title="Click here to Search" type="button"><i
                        class="fa fa-filter me-1"></i>Filter</button>{{ " " }}
                    <button class="btn btn-danger light" title="Click here to remove filter"
                      type="button">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <ul class="d-flex align-items-center flex-wrap">
            <li>
              <RouterLink to="/add-blog" class="btn btn-primary ">Add Blog</RouterLink>
            </li>
            <li>
              <RouterLink to="/blog-category" class="btn btn-primary  mx-1">Blog Category</RouterLink>
            </li>
            <li>
              <RouterLink to="/blog-category" class="btn btn-primary  mt-sm-0 mt-1">Add Blog Category</RouterLink>
            </li>
          </ul>
        </div>
        <!-- <CmsTable title="Blogs List" icon="fa-solid fa-file-lines me-1" /> -->
        <div class="filter cm-content-box box-primary">
          <div class="content-title SlideToolHeader">
            <div class="cpa">
              <i class="fa-solid fa-file-lines me-1"></i>Blogs List
            </div>
            <div class="tools">
              <a @click="dropDown2 = !dropDown2" href="javascript:void(0);"
                :class="`${dropDown2 ? '' : 'expand'} SlideToolHeader`" data-bs-toggle="collapse"
                data-bs-target="#blogCollapse2" aria-expanded="false" aria-controls="blogCollapse2"><i
                  class="fal fa-angle-down"></i></a>
            
            </div>
          </div>
          <div class="cm-content-body form excerpt  collapse show" id="blogCollapse2">
            <div class="card-body py-3">
              <div class="table-responsive">
                <table class="table text-nowrap">
                  <thead>
                    <tr>
                      <th class="icon_none">S.No</th>
                      <th class="icon_none">Title</th>
                      <th class="icon_none">Status</th>
                      <th class="icon_none">Modified</th>
                      <th class="text-end icon_none">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Title of first blog post entry</td>
                      <td>Published</td>
                      <td>09 Jan, 2024</td>
                      <td class="text-end">
                        <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>{{ " " }}
                        <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Why Go For A VFX Course?</td>
                      <td>Published</td>
                      <td>13 May, 20224</td>
                      <td class="text-end">
                        <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>{{ " " }}
                        <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </td>

                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Reasons To Choose Animation Courses</td>
                      <td>Published</td>
                      <td>13 Apr, 2024</td>
                      <td class="text-end">
                        <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>{{ " " }}
                        <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </td>

                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Blue Screen Vs. Green Screen For VFX</td>
                      <td>Published</td>
                      <td>13 June, 2024</td>
                      <td class="text-end">
                        <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>{{ " " }}
                        <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </td>

                    </tr>
                    <tr>
                      <td>5</td>
                      <td>All About Animation</td>
                      <td>Published</td>
                      <td>13 Apr, 2024</td>
                      <td class="text-end">
                        <a href="javascript:void(0);" class="btn btn-warning btn-sm content-icon">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>{{ " " }}
                        <a href="javascript:void(0);" class="btn btn-danger btn-sm content-icon">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </td>

                    </tr>

                  </tbody>
                </table>
                <div class="d-flex align-items-center justify-content-between flex-column flex-lg-row py-3">
                  <small class="mb-xl-0 mb-2">Page 1 of 5, showing 2 records out of 8 total, starting on record 1,
                    ending on 2</small>
                  <nav aria-label="Page navigation example">
                    <ul class="pagination my-2 my-md-0">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CustomSelectOption2 from "@/components/CustomSelectOption2.vue";
import CmsTable from "@/elements/CmsTable.vue";
import { RouterLink } from "vue-router";
// @ts-ignore
import Datepicker from "vue3-datepicker";
export default defineComponent({
  name: "blog_",
  data() {
    return {
      picked: new Date(),
    };
  },
  setup() {
    const dropDown = ref(false);
    const dropDown2 = ref(false);
    return { dropDown,dropDown2 };
  },
  components: { CmsTable, CustomSelectOption2, Datepicker, RouterLink },
});
</script>


<style scoped>
.calender_icon{
  position: absolute;
  right: 35px;
  top: 56%;
}

@media screen and (max-width:1199px) {
  .calender_icon{
  top: 49%;
}

}

</style>

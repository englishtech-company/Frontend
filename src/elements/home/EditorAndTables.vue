<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// @ts-ignore
import CKEditor from "@ckeditor/ckeditor5-vue";
import ExamTopper from "./ExamTopper.vue";

export default defineComponent({
  name: "editor_",
  // @ts-ignore
  components: { ckeditor: CKEditor.component, ExamTopper },
  setup() {
    const editor = ref(ClassicEditor);
    const editorData = ref("");
    const like = reactive({
      one: false,
      two: false,
      three: false,
      four: false,
    });
    const editorConfig = {
      toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"],
    };
    return {
      editor,
      editorData,
      editorConfig,
      like,
    };
  },
});
</script>

<template>
  <div class="col-xl-3 col-md-6">
    <div class="card">
      <img class="img-fluid rounded-top" src="../../assets/images/courses/pic1.jpg" alt="" />
      <div class="card-body">
        <h4><RouterLink to="/about-courses">When Is the Best Time to Take an Education Course?</RouterLink></h4>
        <ul class="list-group mb-3 list-group-flush">
          <li class="list-group-item px-0 border-top-0 d-flex justify-content-between">
            <span class="mb-0">April 23</span>
            <a href="javascript:void(0);" :class="`add-wishlist-btn ${like.one ? 'active' : ''}`" @click="like.one = !like.one">
              <i class="la la-heart-o outline"></i>
              <i class="la la-heart fill"></i>{{ "  " }}
              <span>{{ like.one ? 231 : 230 }}</span>
            </a>
          </li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Duration :</span><strong>12 Months</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Professor :</span><strong>Jack Ronan</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between">
            <span><i class="fa fa-graduation-cap text-primary me-2"></i>Student</span><strong>+120</strong>
          </li>
        </ul>
        <RouterLink to="/about-courses" class="btn btn-primary">Read More</RouterLink>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-md-6">
    <div class="card">
      <img class="img-fluid rounded-top" src="../../assets/images/courses/pic2.jpg" alt="" />
      <div class="card-body">
        <h4><RouterLink to="/about-courses">Education Courses: A Guide to Unlocking Your Potential</RouterLink></h4>
        <ul class="list-group mb-3 list-group-flush">
          <li class="list-group-item px-0 border-top-0 d-flex justify-content-between">
            <span class="mb-0">April 23</span>
            <a href="javascript:void(0);" :class="`add-wishlist-btn ${like.two ? 'active' : ''}`" @click="like.two = !like.two">
              <i class="la la-heart-o outline"></i>
              <i class="la la-heart fill"></i>{{ "  " }}
              <span>{{ like.two ? 451 : 450 }}</span>
            </a>
          </li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Duration :</span><strong>12 Months</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Professor :</span><strong>Jimmy Morris</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between">
            <span><i class="fa fa-graduation-cap text-primary me-2"></i>Student</span><strong>+120</strong>
          </li>
        </ul>
        <RouterLink to="/about-courses" class="btn btn-primary">Read More</RouterLink>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-md-6">
    <div class="card">
      <img class="img-fluid rounded-top" src="../../assets/images/courses/pic3.jpg" alt="" />
      <div class="card-body">
        <h4><RouterLink to="/about-courses">A Comprehensive Guide to Taking an Education Course</RouterLink></h4>
        <ul class="list-group mb-3 list-group-flush">
          <li class="list-group-item px-0 border-top-0 d-flex justify-content-between">
            <span class="mb-0">April 23</span>
            <a href="javascript:void(0);" :class="`add-wishlist-btn ${like.three ? 'active' : ''}`" @click="like.three = !like.three">
              <i class="la la-heart-o outline"></i>
              <i class="la la-heart fill"></i>{{ "  " }}
              <span>{{ like.three ? 121 : 120 }}</span>
            </a>
          </li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Duration :</span><strong>12 Months</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Professor :</span><strong>Konne Backfield</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between">
            <span><i class="fa fa-graduation-cap text-primary me-2"></i>Student</span><strong>+120</strong>
          </li>
        </ul>
        <RouterLink to="/about-courses" class="btn btn-primary">Read More</RouterLink>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-md-6">
    <div class="card">
      <img class="img-fluid rounded-top" src="../../assets/images/courses/pic4.jpg" alt="" />
      <div class="card-body">
        <h4><RouterLink to="/about-courses">Why Should You Consider Taking an Education Course?</RouterLink></h4>
        <ul class="list-group mb-3 list-group-flush">
          <li class="list-group-item px-0 border-top-0 d-flex justify-content-between">
            <span class="mb-0">April 23</span>
            <a href="javascript:void(0);" :class="`add-wishlist-btn ${like.four ? 'active' : ''}`" @click="like.four = !like.four">
              <i class="la la-heart-o outline"></i>
              <i class="la la-heart fill"></i>{{ "  " }}
              <span>{{ like.four ? 276 : 275 }}</span>
            </a>
          </li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Duration :</span><strong>12 Months</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between"><span class="mb-0">Professor :</span><strong>Nashid Martines</strong></li>
          <li class="list-group-item px-0 d-flex justify-content-between">
            <span><i class="fa fa-graduation-cap text-primary me-2"></i>Student</span><strong>+120</strong>
          </li>
        </ul>
        <RouterLink to="/about-courses" class="btn btn-primary">Read More</RouterLink>
      </div>
    </div>
  </div>

  <div class="col-lg-6">
    <div class="card">
      <div class="card-body">
        <form action="#" method="post">
          <div class="form-group">
            <div class="input-group mb-3">
              <span class="input-group-text">To</span>
              <input type="text" class="form-control" placeholder="Username" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text">Subject</span>
              <input type="text" class="form-control" placeholder="Subject" />
            </div>
          </div>
          <div class="form-group">
            <div class="custom-ekeditor">
              <div id="ckeditor">
                <ckeditor :editor="editor" :config="editorConfig" v-model="editorData"></ckeditor>
              </div>
            </div>
          </div>
          <div class="row align-items-center my-3">
            <div class="col-xl-6">
              <div class="mb-xl-0 mb-3">
                <input type="file" class="form-control" data-default-file="" />
              </div>
            </div>
            <div class="col-xl-6">
              <button type="submit" class="btn btn-primary float-xl-end">Send <i class="fa fa-paper-plane-o"></i></button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Exam Toppers</h4>
      </div>
      <ExamTopper />
    </div>
  </div>
  <div class="col-xl-12 col-xxl-12 col-lg-12 col-md-12 col-sm-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">New Student List</h4>
      </div>
      <div class="card-body pt-2">
        <div class="table-responsive recentOrderTable">
          <table class="table verticle-middle text-nowrap table-responsive-md">
            <thead>
              <tr>
                <th class="icon_none" scope="col">No.</th>
                <th class="icon_none" scope="col">Name</th>
                <th class="icon_none" scope="col">Assigned Professor</th>
                <th class="icon_none" scope="col">Date Of Admit</th>
                <th class="icon_none" scope="col">Status</th>
                <th class="icon_none" scope="col">Subject</th>
                <th class="icon_none" scope="col">Fees</th>
                <th class="icon_none" scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>Jack Ronan</td>
                <td>Airi Satou</td>
                <td>01 August 2021</td>
                <td><span class="badge badge-rounded badge-primary">Checkin</span></td>
                <td>Commerce</td>
                <td>120$</td>
                <td>
                  <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                  <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                </td>
              </tr>
              <tr>
                <td>02</td>
                <td>Jimmy Morris</td>
                <td>Angelica Ramos</td>
                <td>31 July 2021</td>
                <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                <td>Mechanical</td>
                <td>120$</td>
                <td>
                  <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                  <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                </td>
              </tr>
              <tr>
                <td>03</td>
                <td>Nashid Martines</td>
                <td>Ashton Cox</td>
                <td>30 July 2021</td>
                <td><span class="badge badge-rounded badge-danger">Canceled</span></td>
                <td>Science</td>
                <td>520$</td>
                <td>
                  <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                  <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                </td>
              </tr>
              <tr>
                <td>04</td>
                <td>Roman Aurora</td>
                <td>Cara Stevens</td>
                <td>29 July 2021</td>
                <td><span class="badge badge-rounded badge-primary">Checkin</span></td>
                <td>Arts</td>
                <td>220$</td>
                <td>
                  <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                  <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                </td>
              </tr>
              <tr>
                <td>05</td>
                <td>Samantha</td>
                <td>Bruno Nash</td>
                <td>28 July 2021</td>
                <td><span class="badge badge-rounded badge-primary">Checkin</span></td>
                <td>Maths</td>
                <td>130$</td>
                <td>
                  <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                  <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

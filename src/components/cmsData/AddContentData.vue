<script lang="ts">
import { defineComponent, ref, reactive } from "vue";

// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// @ts-ignore
import CKEditor from "@ckeditor/ckeditor5-vue";
import IMAGE from "../../constent/Theme";
import VueMultiselect from "vue-multiselect";
import JobSelectOption from "@/elements/JobSelectOption.vue";
import avatar from "@/assets/images/no-img-avatar.png";
// @ts-ignore
import vSelect from "vue-select";

export default defineComponent({
  name: "addContent",
  // @ts-ignore
  components: { ckeditor: CKEditor.component, VueMultiselect, JobSelectOption, vSelect },
  setup() {
    const editor = ref(ClassicEditor);
    const editorData = ref("");
    const dropDown = reactive({ one: false, two: false, three: false, four: false, five: false, six: false, seven: false, eight: false, nine: false });
    const editorConfig = {
      toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"],
    };

    const src = ref(avatar);
    const handleUpload = (e: any) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        src.value = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    };
    return {
      editor,
      editorData,
      editorConfig,
      handleUpload,
      src,
      dropDown,
    };
  },
  data() {
    return {
      imageData: "",
      IMAGE,
      selector: false,
    };
  },
});
</script>
<template>
  <div class="main-check collapse" id="CheckBoxes">
    <div class="row">
      <h6 class="mb-3">Show on screen</h6>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-1" />
          <label class="form-check-label mb-0 text-nowrap" for="flexCheckDefault-1"> Page Attributes </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-2" />
          <label class="form-check-label mb-0 text-nowrap" for="flexCheckDefault-2"> Featured Image </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-3" />
          <label class="form-check-label mb-0" for="flexCheckDefault-3"> Excerpt </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-4" />
          <label class="form-check-label mb-0 text-nowrap" for="flexCheckDefault-4"> Custom Fields </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-5" />
          <label class="form-check-label mb-0 text-nowrap" for="flexCheckDefault-5"> Discussion </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-6" />
          <label class="form-check-label mb-0 text-nowrap" for="flexCheckDefault-6"> Slug </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-7" />
          <label class="form-check-label mb-0" for="flexCheckDefault-7"> Author </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-8" />
          <label class="form-check-label mb-0" for="flexCheckDefault-8"> Page Type </label>
        </div>
      </div>
      <div class="col-xl-2 col-lg-3 col-sm-4">
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-9" />
          <label class="form-check-label mb-0" for="flexCheckDefault-9"> Seo </label>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-8">
      <div class="card h-auto">
        <div class="card-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Title</label>
              <!-- <input type="text" class="form-control" placeholder="Title" /> -->
              <input id="Title" name="Title" type="text" class="form-control solid" placeholder="Title" />
            </div>
          </form>
          <label class="form-label">Description</label>
          <ckeditor :editor="editor" :config="editorConfig" v-model="editorData"></ckeditor>
        </div>
      </div>
      <div class="filter cm-content-box box-primary">
        <div
          class="content-title SlideToolHeader collapse"
          data-bs-toggle="collapse"
          data-bs-target="#SlideToolHeader"
          aria-controls="SlideToolHeader"
          aria-expanded="true"
          @click="dropDown.one = !dropDown.one"
        >
          <div class="cpa">Custom Fields</div>
          <div class="tools">
            <a href="javascript:void(0);" :class="`${dropDown.one ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
          </div>
        </div>
        <div class="cm-content-body form excerpt collapse show" id="SlideToolHeader">
          <div class="card-body">
            <h6 class="mb-4 font-w500">Add New Custom Field:</h6>
            <div class="row">
              <div class="col-xl-6 col-sm-6">
                <form>
                  <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-control" placeholder="Title" />
                  </div>
                </form>
              </div>
              <div class="col-xl-6 col-sm-6">
                <label class="form-label">Value</label>
                <textarea class="form-control" rows="2"></textarea>
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-sm mt-3 mt-sm-0">Add Custom Field</button>
            <p class="mt-3 mb-0">Custom fields can be used to extra metadata to a post that you can use in your theme.</p>
          </div>
        </div>
      </div>
      <div class="filter cm-content-box box-primary">
        <div
          @click="dropDown.two = !dropDown.two"
          class="content-title SlideToolHeader collapse"
          data-bs-toggle="collapse"
          data-bs-target="#Discussion"
          aria-controls="Discussion"
          aria-expanded="true"
        >
          <div class="cpa">Discussion</div>
          <div class="tools">
            <a href="javascript:void(0);" :class="`${dropDown.two ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
          </div>
        </div>
        <div class="cm-content-body form excerpt collapse show" id="Discussion">
          <div class="card-body">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Allow comments. </label>
            </div>
          </div>
        </div>
      </div>
      <div class="filter cm-content-box box-primary">
        <div @click="dropDown.three = !dropDown.three" class="content-title SlideToolHeader" data-bs-toggle="collapse" data-bs-target="#Slug" aria-controls="Slug" aria-expanded="true">
          <div class="cpa">Slug</div>
          <div class="tools">
            <a href="javascript:void(0);" :class="`${dropDown.three ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
          </div>
        </div>
        <div class="cm-content-body form excerpt collapse show" id="Slug">
          <div class="card-body">
            <label class="form-label">Slug</label>
            <input type="text" class="form-control" />
          </div>
        </div>
      </div>
      <div class="filter cm-content-box box-primary">
        <div @click="dropDown.four = !dropDown.four" class="content-title SlideToolHeader collapse" data-bs-toggle="collapse" data-bs-target="#Author" aria-controls="Author" aria-expanded="true">
          <div class="cpa">Author</div>
          <div class="tools">
            <a href="javascript:void(0);" :class="`${dropDown.four ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
          </div>
        </div>
        <div class="cm-content-body form excerpt collapse show" id="Author">
          <div class="card-body">
            <label class="form-label">User</label>
            <div class="dropdown bootstrap-select form-control default-select h-auto wide">
              <JobSelectOption :options="[{ title: 'admin@gmail.com' }, { title: 'India' }, { title: 'Information' }, { title: 'New Menu' }, { title: 'Page Menu' }]" />
            </div>
          </div>
        </div>
      </div>
      <div class="filter cm-content-box box-primary">
        <div @click="dropDown.five = !dropDown.five" class="content-title SlideToolHeader collapse" data-bs-toggle="collapse" data-bs-target="#Seo" aria-controls="Seo" aria-expanded="true">
          <div class="cpa">Seo</div>
          <div class="tools">
            <a href="javascript:void(0);" :class="`${dropDown.five ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
          </div>
        </div>
        <div class="cm-content-body form excerpt collapse show" id="Seo">
          <div class="card-body">
            <label class="form-label">Page Title</label>
            <input type="text" class="form-control mb-3" placeholder="Page title" />
            <div class="row">
              <div class="col-xl-6 col-sm-6">
                <label class="form-label">Keywords</label>
                <input type="text" class="form-control mb-3 mb-sm-0" placeholder="Enter meta Keywords" />
              </div>
              <div class="col-xl-6 col-sm-6">
                <label class="form-label">Descriptions</label>
                <textarea class="form-control" rows="3" placeholder="Enter meta Keywords"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-4">
      <div class="right-sidebar-sticky">
        <div class="filter cm-content-box box-primary">
          <div
            @click="dropDown.six = !dropDown.six"
            class="content-title SlideToolHeader collapse"
            data-bs-toggle="collapse"
            data-bs-target="#Published"
            aria-controls="Published"
            aria-expanded="true"
          >
            <div class="cpa">Published</div>
            <div class="tools">
              <a href="javascript:void(0);" :class="`${dropDown.six ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
            </div>
          </div>
          <div class="cm-content-body publish-content form excerpt collapse show" id="Published">
            <div class="card-body py-3">
              <ul class="list-style-1 block">
                <li>
                  <div>
                    <label class="form-label mb-0 me-2">
                      <i class="fa-solid fa-key"></i>
                      Status:
                    </label>
                    <span class="font-w500">Published</span>{{ " " }}
                    <a
                      href="javascript:void(0);"
                      class="badge badge-primary light ms-3"
                      id="headingOne"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-controls="collapseOne"
                      aria-expanded="true"
                      role="button"
                      >Edit</a
                    >
                  </div>
                  <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-bs-parent="#accordion-one">
                    <div class="border rounded p-3 mt-3">
                      <div class="mb-2">
                        <label class="form-label w-100">Content Type</label>
                        <div class="dropdown bootstrap-select form-control default-select h-auto wide">
                          <JobSelectOption :options="[{ title: 'Select Status' }, { title: 'Published' }, { title: 'Draft' }, { title: 'Trash' }, { title: 'Private' }, { title: 'Pending' }]" />
                        </div>
                      </div>
                      <div class="mt-3">
                        <button class="btn btn-primary btn-sm me-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">Ok</button>
                        <button class="btn btn-danger light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <label class="form-label mb-0 me-2">
                      <i class="fa-solid fa-eye"></i>
                      Visible:
                    </label>
                    <span class="font-w500">Public</span>
                    <a
                      href="javascript:void(0);"
                      class="badge badge-primary light ms-3"
                      id="headingtwo"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsetwo"
                      aria-controls="collapsetwo"
                      aria-expanded="true"
                      role="button"
                      >Edit</a
                    >
                  </div>
                  <div id="collapsetwo" class="collapse" aria-labelledby="headingtwo" data-bs-parent="#accordion-one">
                    <div class="p-3 mt-3 border rounded">
                      <div class="basic-form">
                        <form>
                          <div class="mb-3 mb-0">
                            <div class="radio">
                              <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label class="form-check-label" for="flexRadioDefault1"> Public </label>
                              </div>
                            </div>
                            <div class="radio">
                              <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label class="form-check-label" for="flexRadioDefault2"> Password Protected </label>
                              </div>
                            </div>
                            <div class="radio disabled">
                              <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                <label class="form-check-label" for="flexRadioDefault3"> Private </label>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div>
                        <button class="btn btn-primary btn-sm me-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapsetwo" aria-expanded="false" aria-controls="collapsetwo">Ok</button>
                        <button class="btn btn-danger light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapsetwo" aria-expanded="false" aria-controls="collapsetwo">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="border-bottom-0">
                  <div>
                    <label class="form-label mb-0 me-2">
                      <i class="fa-solid fa-calendar-days"></i>
                      Published
                    </label>
                    <span class="font-w500">on :24-09-2023 16:22:52</span>
                    <a
                      href="javascript:void(0);"
                      class="badge badge-primary light ms-3"
                      id="headingthree"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsethree"
                      aria-controls="collapsethree"
                      aria-expanded="true"
                      role="button"
                      >Edit</a
                    >
                  </div>
                  <div id="collapsethree" class="collapse" aria-labelledby="headingthree" data-bs-parent="#accordion-one">
                    <div class="p-3 mt-3 border rounded">
                      <div class="input-hasicon">
                        <input name="datepicker" class="form-control bt-datepicker solid" type="date" />
                      </div>
                      <div class="mt-3">
                        <button class="btn btn-primary btn-sm me-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapsethree" aria-expanded="false" aria-controls="collapsethree">
                          Ok
                        </button>
                        <button class="btn btn-danger light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapsethree" aria-expanded="false" aria-controls="collapsethree">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="card-footer border-top text-end py-3">
              <a href="javascript:void(0);" class="btn btn-primary btn-sm">Publish</a>
            </div>
          </div>
        </div>
        <div class="filter cm-content-box box-primary">
          <div
            @click="dropDown.seven = !dropDown.seven"
            class="content-title SlideToolHeader"
            data-bs-toggle="collapse"
            data-bs-target="#CollapsePage"
            aria-controls="CollapsePage"
            aria-expanded="true"
          >
            <div class="cpa">Categories</div>
            <div class="tools">
              <a href="javascript:void(0);" :class="`${dropDown.seven ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
            </div>
          </div>
          <div class="cm-content-body publish-content form excerpt collapse show" id="CollapsePage">
            <div class="card-body">
              <div class="border rounded p-3 mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-10" />
                  <label class="form-check-label" for="flexCheckDefault-10"> Beauty </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-11" />
                  <label class="form-check-label" for="flexCheckDefault-11"> Fashion </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-12" />
                  <label class="form-check-label" for="flexCheckDefault-12"> Lifestyle </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-13" />
                  <label class="form-check-label" for="flexCheckDefault-13"> Food </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault-14" />
                  <label class="form-check-label" for="flexCheckDefault-14"> Beauty </label>
                </div>
              </div>
              <a href="javascript:void(0);"><i class="fa-solid fa-plus"></i> Add New Categories</a>
              <div class="input-group mt-3">
                <input type="text" class="form-control" placeholder="Username" aria-label="Username" />
                <button class="btn btn-primary" type="button">Add New</button>
              </div>
            </div>
          </div>
        </div>
        <div class="filter cm-content-box box-primary">
          <div
            class="content-title SlideToolHeader collapse"
            data-bs-toggle="collapse"
            data-bs-target="#CollapsePageType"
            aria-controls="CollapsePageType"
            aria-expanded="true"
            @click="dropDown.eight = !dropDown.eight"
          >
            <div class="cpa">Tag</div>
            <div class="tools">
              <a href="javascript:void(0);" :class="`${dropDown.eight ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
            </div>
          </div>
          <div class="cm-content-body form excerpt collapse show" id="CollapsePageType">
            <div class="card-body" style="position: relative">
              <vSelect multiple :options="['Canada', 'United States']" />
            </div>
          </div>
        </div>
        <div class="filter cm-content-box box-primary">
          <div
            class="content-title SlideToolHeader collapse"
            data-bs-toggle="collapse"
            data-bs-target="#CollapsePageType2"
            aria-controls="CollapsePageType2"
            aria-expanded="true"
            @click="dropDown.nine = !dropDown.nine"
          >
            <div class="cpa">Featured Image</div>
            <div class="tools">
              <a href="javascript:void(0);" :class="`${dropDown.nine ? '' : 'expand'} handle`"><i class="fal fa-angle-down"></i></a>
            </div>
          </div>
          <div class="cm-content-body publish-content form excerpt collapse show" id="CollapsePageType2">
            <div class="card-body">
              <div class="avatar-upload d-flex align-items-center">
                <div class="position-relative">
                  <div class="avatar-preview">
                    <div id="imagePreview" :style="`background-image: url(${src})`"></div>
                  </div>
                  <div class="change-btn d-flex align-items-center flex-wrap">
                    <input ref="fileInput" type="file" @change="handleUpload" class="form-control d-none" id="imageUpload" accept=".png, .jpg, .jpeg" />
                    <label for="imageUpload" class="btn btn-primary ms-0">Select Image</label>
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

<style scoped>
.custome_input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>

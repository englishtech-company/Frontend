<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Add Blog</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">CMS</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">Add Blog</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div>
          <RouterLink to="/blog" class="btn btn-primary mb-4 me-1">Blog List</RouterLink>
          <RouterLink to="/blog-category" class="btn btn-primary mb-4 me-1">Blog Category</RouterLink>
          <RouterLink to="/blog-category" class="btn btn-primary mb-4 me-1">Add Blog Category</RouterLink>
          <button type="button" class="btn btn-primary mb-4 open" data-bs-toggle="collapse" data-bs-target="#CheckBoxes" aria-controls="CheckBoxes" aria-expanded="false">Screen Option</button>
        </div>
        <AddContentData />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-vue";
import IMAGE from "../../constent/Theme";
import VueMultiselect from "vue-multiselect";
import JobSelectOption from "@/elements/JobSelectOption.vue";
import AddContentData from "@/components/cmsData/AddContentData.vue";

export default defineComponent({
  name: "addContent",
  // @ts-ignore
  components: { ckeditor: CKEditor.component, VueMultiselect, JobSelectOption, AddContentData },
  setup() {
    const editor = ref(ClassicEditor);
    const editorData = ref("");
    const editorConfig = {
      toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"],
    };

    const src = ref(IMAGE.avatar1);
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
    };
  },
  data() {
    return {
      imageData: "",
      IMAGE,
    };
  },
});
</script>

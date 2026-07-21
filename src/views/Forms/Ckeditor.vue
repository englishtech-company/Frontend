<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Form</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">CkEditor</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12 col-xxl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Form CkEditor </h4>
          </div>
          <div class="card-body custom-ekeditor">
            <div id="ckeditor">
              <ckeditor :editor="editor" :config="editorConfig" v-model="editorData"></ckeditor>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// @ts-ignore
import CKEditor from "@ckeditor/ckeditor5-vue";

export default defineComponent({
  name: "editor_",
  // @ts-ignore
  components: { ckeditor: CKEditor.component },
  setup() {
    const editor = ref(ClassicEditor);
    const editorData = ref("");
    const editorConfig = {
      toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"],
    };
    return {
      editor,
      editorData,
      editorConfig,
    };
  },
});
</script>

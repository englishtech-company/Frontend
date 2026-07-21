<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Email</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Compose</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div :class="`col-lg-3 email-left-body ${toggleSidebar ? 'active' : ''}`">
                <EmailRightContent />
              </div>
              <div class="col-lg-9">
                <div class="email-right-box">
                  <div class="d-flex align-items-center">
                    <h4 class="card-title d-sm-none d-block">Email</h4>
                    <div :class="`email-tools-box float-end mb-2 ${toggleSidebar ? 'active' : ''}`" @click="toggleSidebar = !toggleSidebar">
                      <i class="fa-solid fa-list-ul"></i>
                    </div>
                  </div>
                  <div class="compose-content">
                    <form action="#">
                      <div class="mb-3">
                        <input type="text" class="form-control bg-transparent" placeholder=" To:" />
                      </div>
                      <div class="mb-3">
                        <input type="text" class="form-control bg-transparent" placeholder=" Subject:" />
                      </div>
                      <div class="mb-3">
                        <textarea id="email-compose-editor" class="textarea_editor form-control bg-transparent" rows="8" placeholder="Enter text ..."></textarea>
                      </div>
                    </form>
                    <h5 class="mb-4"><i class="fa fa-paperclip"></i> Attatchment</h5>
                    <form action="#" class="dropzone dz-clickable" @click="open">
                      <div class="fallback" v-bind="getRootProps()" :style="`justify-content: ${urls.length > 0 ? 'start' : 'center'}`">
                        <input name="file" v-bind="getInputProps()" />
                        <div v-if="urls[0]" class="doropImagebox" v-for="(ele, ind) in urls" :key="ind">
                          <img class="dropImage" :src="ele" alt="" srcset="" />
                        </div>
                        <p v-else>Drop files here to upload</p>
                      </div>
                    </form>
                  </div>
                  <div class="text-start mt-4 mb-3">
                    <button class="btn btn-primary btn-sl-sm me-2" type="button">
                      <span class="me-2"><i class="fa fa-paper-plane"></i></span>Send
                    </button>
                    <button class="btn btn-danger light btn-sl-sm" type="button">
                      <span class="me-2"><i class="fa fa-times"></i></span>Discard
                    </button>
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

<script lang="ts">
import { defineComponent, ref } from "vue";
import EmailRightContent from "@/elements/EmailRightContent.vue";
// @ts-ignore
import { useDropzone } from "vue3-dropzone";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "compose_",
  components: { EmailRightContent },
  data() {
    return {
      toggleSidebar: false,
    };
  },
  setup() {
    const urls = ref([]);
    const { emaiComposeMenuToggle } = storeToRefs(useStore());
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      maxFiles: 4,
      accept: ".jpg, .jpeg, .png",
      onDrop: (acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
          const fileSrc = URL.createObjectURL(file);
          // @ts-ignore
          urls.value.push(fileSrc);
          setTimeout(() => {
            URL.revokeObjectURL(fileSrc);
          }, 1000);
        });
      },
    });
    return {
      getRootProps,
      getInputProps,
      isDragActive,
      open,
      urls,
      emaiComposeMenuToggle,
    };
  },
});
</script>

<style scoped>
.dropzone {
  display: grid;
  place-items: center;
}

.dropImage {
  border-radius: 20px;
  overflow: hidden;
  width: 90px;
  height: 90px;
  position: relative;
  display: block;
  z-index: 10;
}

.fallback {
  display: flex;
  flex-wrap: wrap;
  gap: 2vmax;
  width: 100%;
  padding: 10px;
}
</style>

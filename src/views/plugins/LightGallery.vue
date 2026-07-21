<!-- @format -->

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
          <li class="breadcrumb-item"><a href="javascript:void(0)">Advanced</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Light Gallery</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Light Gallery</h4>
          </div>
          <div class="card-body pb-1">
            <Lightgallery id="lightgallery" class="row" :settings="{ speed: 500, plugins: plugins }">
              <a v-for="({ img }, ind) in galleryBlog" :key="ind" :href="img" :data-src="img"
                class="col-lg-3 col-md-6 mb-4">
                <img :src="img" alt="" class="w-100 rounded" />
              </a>
            </Lightgallery>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IMAGE from "@/constent/Theme";
import Lightgallery from "lightgallery/vue";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

export default defineComponent({
  name: "lightGallery_",
  setup() {
    return {
      galleryBlog: [
        { img: IMAGE.bigImg1 },
        { img: IMAGE.bigImg2 },
        { img: IMAGE.bigImg3 },
        { img: IMAGE.bigImg4 },
        { img: IMAGE.bigImg5 },
        { img: IMAGE.bigImg6 },
        { img: IMAGE.bigImg7 },
        { img: IMAGE.bigImg8 },
      ],
    };
  },
  components: {
    Lightgallery,
  },
  data: () => ({
    plugins: [lgThumbnail, lgZoom],
  }),
});
</script>

<style scoped></style>

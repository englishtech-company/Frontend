<template>
  <div class="col-xl-12">
    <div class="card">
      <div class="card-body">
        <div class="profile-interest">
          <h5 class="text-primary d-inline">Interest</h5>
          <Lightgallery class="row mt-3 sp4" id="lightgallery" :settings="{ speed: 500, plugins: plugins }">
            <a v-for="({ img }, ind) in gallery" :key="ind" href="javascript:void(0)" :data-src="img" class="mb-1 col-lg-4 col-xl-4 col-sm-4 col-6">
              <img :src="img" alt="" class="px-1 py-1 img-fluid rounded" />
            </a>
          </Lightgallery>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-12">
    <div class="card">
      <div class="card-body">
        <div class="profile-news">
          <h5 class="text-primary d-inline">Our Latest News</h5>
          <div class="media pt-3 pb-3">
            <img src="../../assets/images/profile/5.jpg" alt="image" class="me-3 rounded" width="75" />
            <div class="media-body">
              <h5 class="m-b-5">
                <RouterLink to="/post-details" class="">Compete this projects Monday</RouterLink>
              </h5>
              <p class="mb-0">I shared this on my fb wall a few months back, and I thought.</p>
            </div>
          </div>
          <div class="media pt-3 pb-3">
            <img src="../../assets/images/profile/6.jpg" alt="image" class="me-3 rounded" width="75" />
            <div class="media-body">
              <h5 class="m-b-5">
                <RouterLink to="/post-details" class="">Development planning</RouterLink>
              </h5>
              <p class="mb-0">I shared this on my fb wall a few months back, and I thought.</p>
            </div>
          </div>
          <div class="media pt-3 pb-0">
            <img src="../../assets/images/profile/7.jpg" alt="image" class="me-3 rounded" width="75" />
            <div class="media-body">
              <h5 class="m-b-5">
                <RouterLink to="/post-details" class="">Software planning</RouterLink>
              </h5>
              <p class="mb-0">I shared this on my fb wall a few months back, and I thought.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IMAGE from "../../constent/Theme";
import Lightgallery from "lightgallery/vue";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "lightGallery",
  components: { Lightgallery, RouterLink },
  data: () => ({
    plugins: [lgThumbnail, lgZoom],
  }),
  setup() {
    return {
      gallery: [
        { img: IMAGE.profilePic2 },
        { img: IMAGE.profilePic3 },
        { img: IMAGE.profilePic4 },
        { img: IMAGE.profilePic2 },
        { img: IMAGE.profilePic3 },
        { img: IMAGE.profilePic4 },
      ],
    };
  },
});
</script>

<style scoped></style>

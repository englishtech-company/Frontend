<!-- @format -->

<template>
  <div class="container-fluid mh-auto">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="javascript:void(0)">Shop</a>
          </li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Product Grid</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6" v-for="(
          { img, title, price, fillstar, fillstar2, discount }, ind
        ) in productGrid" :key="ind">
        <div class="card">
          <div class="card-body">
            <div class="new-arrival-product">
              <div class="new-arrivals-img-contnent">
                <img class="img-fluid" :src="img" alt="" />
              </div>
              <div class="new-arrival-content text-center mt-3">
                <h4>
                  <RouterLink to="/ecom-product-detail">{{ title }}</RouterLink>
                </h4>
                <ul class="star-rating">
                  <li class="me-1"><i class="fa fa-star"></i></li>
                  <li class="me-1"><i class="fa fa-star"></i></li>
                  <li class="me-1"><i class="fa fa-star"></i></li>
                  <li class="me-1"><i :class="fillstar"></i></li>
                  <li class=""><i :class="fillstar2"></i></li>
                </ul>
                <del class="discount">{{ discount }}</del>
                <span class="price">{{ price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { productGrid } from "@/elements/TableArrayData";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "productGrid_",
  components: { RouterLink },
  data() {
    return { productGrid };
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>

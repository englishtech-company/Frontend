<!-- @format -->

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
          <li class="breadcrumb-item">
            <a href="javascript:void(0)">Shop</a>
          </li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Product Detail</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-xl-3 col-lg-6  col-md-6 col-xxl-5 ">
                <!-- Tab panes -->
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                    tabindex="0">
                    <img class="img-fluid rounded " src="../../../assets/images/product/1.jpg" alt="">
                  </div>
                  <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab"
                    tabindex="0">
                    <img class="img-fluid  rounded" src="../../../assets/images/product/2.jpg" alt="">
                  </div>
                  <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab"
                    tabindex="0">
                    <img class="img-fluid rounded" src="../../../assets/images/product/3.jpg" alt="">
                  </div>
                  <div class="tab-pane fade" id="end-tab-pane" role="tabpanel" aria-labelledby="end-tab" tabindex="0">
                    <img class="img-fluid rounded" src="../../../assets/images/product/3.jpg" alt="">
                  </div>

                </div>
                <ul class="nav nav-tabs slide-item-list mt-3" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <a href="#first" class="nav-link active" id="home-tab" data-bs-toggle="tab"
                      data-bs-target="#home-tab-pane" role="tab" aria-controls="home-tab-pane" aria-selected="true"><img
                        class="img-fluid me-2 rounded" src="../../../assets/images/tab/1.jpg" alt="" width="80"></a>
                  </li>
                  <li class="nav-item" role="presentation">
                    <a href="#second" class="nav-link" id="profile-tab" data-bs-toggle="tab"
                      data-bs-target="#profile-tab-pane" role="tab" aria-controls="profile-tab-pane"
                      aria-selected="false" tabindex="-1"><img class="img-fluid me-2 rounded"
                        src="../../../assets/images/tab/2.jpg" alt="" width="80"></a>
                  </li>
                  <li class="nav-item" role="presentation">
                    <a href="#third" class="nav-link" id="contact-tab" data-bs-toggle="tab"
                      data-bs-target="#contact-tab-pane" role="tab" aria-controls="contact-tab-pane"
                      aria-selected="false" tabindex="-1"><img class="img-fluid me-2 rounded"
                        src="../../../assets/images/tab/3.jpg" alt="" width="80"></a>
                  </li>
                  <li class="nav-item" role="presentation">
                    <a href="#for" class="nav-link" id="end-tab" data-bs-toggle="tab" data-bs-target="#end-tab-pane"
                      role="tab" aria-controls="end-tab-pane" aria-selected="false" tabindex="-1"><img
                        class="img-fluid rounded" src="../../../assets/images/tab/4.jpg" alt="" width="80"></a>
                  </li>

                </ul>
              </div>
              <!--Tab slider End-->
              <div class="col-xl-9 col-lg-6  col-md-6 col-xxl-7 col-sm-12">
                <div class="product-detail-content">
                  <!--Product details-->
                  <div class="new-arrival-content mt-md-0 mt-3 pr">
                    <h4>School Bag</h4>
                    <div class="comment-review star-rating">
                      <ul>
                        <li><i class="fa fa-star me-1"></i></li>
                        <li><i class="fa fa-star me-1"></i></li>
                        <li><i class="fa fa-star me-1"></i></li>
                        <li><i class="fa fa-star me-1"></i></li>
                        <li><i class="fa fa-star"></i></li>

                      </ul>
                      <span class="review-text">(34 reviews) / </span><a class="product-review" href=""
                        data-bs-toggle="modal" data-bs-target="#reviewModal">Write a review?</a>
                    </div>
                    <div class="d-table mb-2">
                      <p class="price float-start d-block">$325.00</p>
                    </div>
                    <p>Availability: <span class="item"> In stock <i class="fa fa-shopping-basket"></i></span>
                    </p>
                    <p>Product code: <span class="item">0405689</span> </p>
                    <p>Brand: <span class="item">Lee</span></p>
                    <p>Product tags:&nbsp;&nbsp;
                      <span class="badge badge-success light me-1">bags</span>
                      <span class="badge badge-danger light me-1">clothes</span>
                      <span class="badge badge-warning light me-1">shoes</span>
                      <span class="badge badge-info light">dresses</span>
                    </p>
                    <p class="text-content">There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form, by injected humour, or randomised words which
                      don't look even slightly believable.
                      If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
                      embarrassing.</p>
                    <div class="d-flex align-items-end flex-wrap mt-4">
                      <div class="filtaring-area me-3">
                        <div class="size-filter">
                          <h4 class="m-b-15 text-dark">Select size</h4>
                          <div class="btn-group mb-sm-0 mb-2" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio1" checked>
                            <label class="btn btn-outline-primary form-label mb-0" for="btnradio1">XS</label>
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio2">
                            <label class="btn btn-outline-primary form-label mb-0" for="btnradio2">SM</label>
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio3">
                            <label class="btn btn-outline-primary form-label mb-0" for="btnradio3">MD</label>
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio4">
                            <label class="btn btn-outline-primary form-label mb-0" for="btnradio4">LG</label>
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio5">
                            <label class="btn btn-outline-primary form-label mb-0" for="btnradio5">XL</label>
                          </div>

                        </div>
                      </div>
                      <!--Quantity start-->
                      <div class="col-2 px-0  me-3">
                        <input type="number" name="num" class="form-control input-btn input-number" value="1">
                      </div>
                      <!--Quanatity End-->
                      <div class="shopping-cart  me-3">
                        <a class="btn btn-primary mt-2" href="javascript:void(0);"><i
                            class="fa fa-shopping-basket me-2"></i>Add
                          to cart</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="reviewModal">
        <div class="modal-dialog modal-dialog-center" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Review</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="text-center mb-4">
                  <img class="img-fluid rounded" width="78" src="./../../../assets/images/avatar/1.jpg"
                    alt="DexignZone" />
                </div>
                <div class="mb-3">
                  <div class="rating-widget mb-4 text-center">
                    <div class="rating-stars d-flex justify-content-center">
                      <vue3-star-ratings id="stars" v-model="rating" />
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <textarea class="form-control" placeholder="Comment" rows="5"></textarea>
                </div>
                <button class="btn btn-success btn-block">RATE</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 class="fs-20 font-w700 my-4">SIMILAR PRODUCTS</h4>
        <Swiper class="owl-carousel card-slider owl-rtl owl-loaded owl-drag" :slides-per-view="6" :space-between="20"
          :loop="true" :breakpoints="{
            1600: { slidesPerView: 6 },
            1200: { slidesPerView: 5 },
            768: { slidesPerView: 4 },
            425: { slidesPerView: 3 },
            240: { slidesPerView: 1 },
          }">
          <SwiperSlide class="owl-stage" v-for="({ img, price, title, discount }, ind) in products" :key="ind">
            <div class="card product-grid-card">
              <div class="card-body">
                <div class="new-arrival-product">
                  <div class="new-arrivals-img-contnent">
                    <img class="img-fluid" :src="img" alt="" />
                  </div>
                  <div class="new-arrival-content text-center mt-3">
                    <h4>
                      <RouterLink to="/ecom-product-detail">{{
                        title
                      }}</RouterLink>
                    </h4>
                    <ul class="star-rating">
                      <li><i class="fa fa-star me-1"></i></li>
                      <li><i class="fa fa-star me-1"></i></li>
                      <li><i class="fa fa-star me-1"></i></li>
                    </ul>
                    <span class="price">{{ price }}</span>{{ " " }}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import IMAGE from "@/constent/Theme";
import { RouterLink } from "vue-router";
// @ts-ignore
import vue3StarRatings from "vue3-star-ratings";
export default defineComponent({
  name: "productDetails",
  components: { Swiper, SwiperSlide, RouterLink, vue3StarRatings },
  setup() {
    const rating = ref(0);
    return {
      rating,
      products: [
        {
          img: IMAGE.product1,
          title: "Sales Motivation and Incentives",
          price: "$761.00",
          discount: "245",
        },
        {
          img: IMAGE.product2,
          title: "Performance Management",
          price: "$61.00",
          discount: "348",
        },
        {
          img: IMAGE.product3,
          title: "Recruitment, Training",
          price: "$50.00",
          discount: "564",
        },
        {
          img: IMAGE.product4,
          title: "Sales Organization",
          price: "$40.00",
          discount: "245",
        },
        {
          img: IMAGE.product5,
          title: "Sales ForecastinG",
          price: "$30.00",
          discount: "348",
        },
        {
          img: IMAGE.product6,
          title: "Sales Planning and Strategy",
          price: "$20.00",
          discount: "564",
        },
        {
          img: IMAGE.product1,
          title: "Sales Motivation and Incentives",
          price: "$761.00",
          discount: "245",
        },
        {
          img: IMAGE.product2,
          title: "Performance Management",
          price: "$61.00",
          discount: "348",
        },
      ],
    };
  },
});
</script>

<style>
.vue3-star-ratings__icon {
  margin-left: 5px !important;
  width: 15px !important;
  /* color: aliceblue; */
}

.vue3-star-ratings__inner {
  color: #ccc !important;
}
</style>

<template>
  <div class="page-titles">
    <ol class="breadcrumb">
      <li><h5 class="bc-title">Dashboard</h5></li>
      <li class="breadcrumb-item">
        <a href="javascript:void(0)">
          <span v-html="homeIcon"></span>
          Apps
        </a>
      </li>
      <li class="breadcrumb-item active">
        <a href="javascript:void(0)">Customer Profile</a>
      </li>
    </ol>
    <a
      class="text-primary fs-13"
      data-bs-toggle="offcanvas"
      href="#offcanvasExample1"
      role="button"
      aria-controls="offcanvasExample1"
      >+ Add Task</a
    >
  </div>
  <div class="container-fluid vh-90">
    <div class="row">
      <div class="col-xl-3">
        <div class="card h-auto">
          <div class="card-body">
            <div class="c-profile text-center">
              <img src="../../../assets/images/user1.jpg" class="rounded-circle mb-2" alt="" />
              <h4>Thomas Fleming</h4>
            </div>
            <div class="c-details">
              <ul>
                <li>
                  <span>Email</span>
                  <p>demo123@gmail.com</p>
                </li>
                <li>
                  <span>Phone</span>
                  <p>+91 12345647890</p>
                </li>
                <li>
                  <span>Date of birth</span>
                  <p>13 June 1996</p>
                </li>
                <li>
                  <span>Position</span>
                  <p>Computer Engineer</p>
                </li>
              </ul>
            </div>
            <span class="mt-3 d-block">Social</span>
            <ul class="c-social">
              <li>
                <a href="javascript:void(0);" class="bg-facebook"
                  ><i class="fa-brands fa-facebook-f"></i
                ></a>
              </li>
              <li>
                <a href="javascript:void(0);" class="bg-whatsapp"
                  ><i class="fa-brands fa-whatsapp"></i
                ></a>
              </li>
              <li>
                <a href="javascript:void(0);" class="bg-linkedin"
                  ><i class="fa-brands fa-linkedin-in"></i
                ></a>
              </li>
              <li>
                <a href="javascript:void(0);" class="bg-skype"
                  ><i class="fa-brands fa-skype"></i
                ></a>
              </li>
            </ul>
            <div class="d-flex mt-4 justify-content-end">
              <a href="javascript:void(0)" class="btn btn-danger btn-sm light me-2"
                ><i class="fa-solid fa-trash me-1"></i>Delete</a
              >
              <button
                type="button"
                class="modal-btn btn btn-primary btn-sm ms-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal3"
              >
                <i class="fa-solid fa-pen-to-square me-1"></i>
                <span>Edit </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9">
        <h4 class="heading">Membership</h4>
        <div class="card h-auto">
          <div class="card-body d-flex align-items-center justify-content-between flex-wrap">
            <div class="d-flex align-items-center c-busiess">
              <img src="../../../assets/images/economics.png" class="avatar" alt="" />
              <div>
                <h5 class="mb-0">
                  Business board pro<span class="badge badge-danger badge-xs ms-1">Active</span>
                </h5>
                <span>Billing monthly | Next payment on 15/02/2023for$590.40</span>
              </div>
            </div>
            <div>
              <a href="javascript:void(0)" class="btn btn-danger btn-sm me-2">Cancel plan</a>
              <a href="javascript:void(0)" class="btn btn-primary btn-sm ms-2">Update plan</a>
            </div>
          </div>
        </div>
        <div class="card h-auto">
          <div class="card-header py-3">
            <h4 class="heading mb-0">Payment History</h4>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive active-projects style-1">
              <table id="empoloyees-tbl" class="table mb-0">
                <thead>
                  <tr>
                    <th>REFERENCE</th>
                    <th>PRODUCT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="({ id, product, status, date, cost, badge }, ind) in paginatedData"
                    :key="ind"
                  >
                    <td>
                      <span>{{ id }}</span>
                    </td>
                    <td>
                      <span>{{ product }}</span>
                    </td>
                    <td>
                      <span :class="`badge badge-${badge} light border-0`">{{ status }}</span>
                    </td>
                    <td>
                      <span>{{ date }}</span>
                    </td>
                    <td>
                      <span>{{ cost }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex align-items-center justify-content-between">
                <div class="dataTables_info">
                  Showing {{ paginationLength - 4 }} to {{ paginationLength }} of
                  {{ customerProfileTable.length }} entries
                </div>
                <div
                  class="dataTables_paginate paging_simple_numbers"
                  id="empoloyees-tblwrapper_paginate"
                >
                  <a
                    class="paginate_button previous"
                    id="empoloyees-tblwrapper_previous"
                    @click="backPage"
                    ><i class="fa-solid fa-angle-left"></i></a
                  ><span>
                    <a
                      class="paginate_button"
                      v-for="item in Math.ceil(data.length / perPage)"
                      :key="item"
                      :style="`background-color:${addActive == item ? 'var(--primary);' : ''};color:${addActive == item ? '#fff !important' : ''}`"
                      @click="() => goToPage(item)"
                      >{{ item }}</a
                    >
                  </span>
                  <a
                    class="paginate_button next"
                    @click="nextPage"
                    aria-controls="empoloyees-tblwrapper"
                    data-dt-idx="3"
                    tabindex="0"
                    id="empoloyees-tblwrapper_next"
                    ><i class="fa-solid fa-angle-right"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-xxl-8">
        <div class="card">
          <div class="card-header border-0">
            <h4 class="heading mb-0">Payment Methods</h4>
          </div>
          <div class="card-body pt-0">
            <div class="row">
              <div class="col-xl-4 col-lg-4">
                <img src="../../../assets/images/credit.png" alt="" class="w-100" />
              </div>
              <div class="col-xl-8 col-lg-8">
                <div class="row">
                  <div class="col-xl-6 col-lg-6">
                    <div class="c-card-details">
                      <ul>
                        <li>
                          <h6 class="me-1 mb-0">Name:</h6>
                          <span class="fs-13">Henry Saiplay</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Number:</h6>
                          <span class="fs-13">1234 5678 9101 1213</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Expires:</h6>
                          <span class="fs-13">11/2023</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Type:</h6>
                          <span class="fs-13">Master Card</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Issuer:</h6>
                          <span class="fs-13">IDBF</span>
                        </li>
                        <li>
                          <h6 class="mb-0 me-1">Id:</h6>
                          <span class="fs-13">1-85222gfgvv52</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6">
                    <div class="c-card-details">
                      <ul>
                        <li>
                          <h6 class="me-1 mb-0">Billing address:</h6>
                          <span class="fs-13">USA </span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Phone:</h6>
                          <span class="fs-13">+01 123 456 789 0</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Email:</h6>
                          <span class="fs-13">demo@gmail.com</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">Origin:</h6>
                          <span class="fs-13">Uk</span>
                        </li>
                        <li>
                          <h6 class="me-1 mb-0">CVC check:</h6>
                          <span class="fs-13">Done</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4">
        <div class="card">
          <div class="card-header border-0">
            <h4 class="heading mb-0">Premium user</h4>
          </div>
          <div class="card-body pt-0">
            <div class="c-work">
              <div class="c-task bg-primary">
                <p>Earnings<i class="fa-solid fa-arrow-down ms-2"></i></p>
                <span>$50,585</span>
              </div>
              <div class="c-task bg-success">
                <p>Project <i class="fa-solid fa-arrow-up ms-2"></i></p>
                <span>415</span>
              </div>
              <div class="c-task bg-secondary">
                <p>Hours <i class="fa-solid fa-arrow-up ms-2"></i></p>
                <span>200</span>
              </div>
            </div>
            <ul class="c-primium">
              <li>
                <h6>Account ID:</h6>
                <span class="fs-13">#5-658A555c</span>
              </li>
              <li>
                <h6>Billing Email:</h6>
                <span class="fs-13">demo@gmail.com</span>
              </li>
              <li>
                <h6>Billing Address:</h6>
                <span class="fs-13">Po.123 USA</span>
              </li>
              <li>
                <h6>Language:</h6>
                <span class="fs-13">English</span>
              </li>
              <li>
                <h6>Tax ID:</h6>
                <span class="fs-13">W3-52325</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalBox />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { customerProfileTable } from '@/elements/TableArrayData'
import handlePagination from '@/layouts/HandlePaginatin'
import ModalBox from '@/elements/ModalBox.vue'
import { SVGImage } from '@/constent/Theme'
import { useStore } from '@/stores/Store'
import { storeToRefs } from 'pinia'
export default defineComponent({
  name: 'customer_',
  components: { ModalBox },
  data() {
    return SVGImage
  },
  setup() {
    const checkboxes = ref(false)
    const { paginationLength } = storeToRefs(useStore())
    const handlePaginationValue = handlePagination(customerProfileTable, 5)
    return { ...handlePaginationValue, checkboxes, customerProfileTable, paginationLength }
  }
})
</script>

<style scoped>
.paginate_button {
  height: 24px;
  width: 24px;
  padding: 0;
  margin-left: 0rem;
  margin: 0 0.125rem;
  line-height: 25px;
  text-align: center;
  font-size: 13px;
  border-radius: 0.375rem;
  border: 0;
  color: #0d99ff !important;
  cursor: pointer;
  box-shadow: none;
  box-sizing: border-box;
  display: inline-block;
}
</style>

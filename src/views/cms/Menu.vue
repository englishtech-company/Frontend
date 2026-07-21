<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Menu</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">CMS</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">Menu</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="filter cm-content-box box-primary">
          <div class="content-title SlideToolHeader">
            <div class="cpa"><i class="fa fa-list-alt me-1"></i>Menus</div>
            <div class="tools">
              <a
                @click="dropDown.four = !dropDown.four"
                :class="dropDown.four ? '' : 'expand'"
                data-bs-toggle="collapse"
                href="#menuCollapese"
                role="button"
                aria-expanded="false"
                aria-controls="menuCollapese"
                ><i class="fal fa-angle-down"></i
              ></a>
            </div>
          </div>
          <div id="menuCollapese" class="cm-content-body form excerpt">
            <div class="card-body">
              <div class="row align-items-center p-sm-3">
                <div class="col-xl-3 col-xxl-3 mb-xl-0 mb-3">
                  <h6 class="mb-0">Select a menu to edit: *</h6>
                </div>
                <div class="col-xl-6 col-xxl-5 mb-xl-0 mb-3">
                  <CustomSelectOption2 valueOne="Select Menu" valueTwo="India" valueThree="Information" valueFour="New Menu" valueFive="Page Menu" />
                </div>
                <div class="col-xl-3 col-xxl-4">
                  <a href="javascript:void(0);" class="btn btn-primary">Select</a>{{ " " }}
                  <span class="mx-2">or</span>
                  <a href="javascript:void(0);" class="text-primary">create new menu</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-4">
            <div class="filter cm-content-box box-primary">
              <div class="content-title">
                <div class="cpa">Menus</div>
                <div class="tools">
                  <a
                    @click="dropDown.one = !dropDown.one"
                    :class="`${dropDown.one ? '' : 'expand'} SlideToolHeader`"
                    data-bs-toggle="collapse"
                    href="#menuCollapese2"
                    role="button"
                    aria-expanded="false"
                    aria-controls="menuCollapese2"
                    ><i class="fal fa-angle-down"></i
                  ></a>
                </div>
              </div>
              <div class="cm-content-body form excerpt collapse show" id="menuCollapese2">
                <div class="card-body">
                  <div class="filter cm-content-box box-primary border">
                    <div class="content-title border-0">
                      <div class="cpa">Page</div>
                      <div class="tools">
                        <a
                          @click="dropDown.two = !dropDown.two"
                          :class="`${dropDown.two ? '' : 'expand'} SlideToolHeader`"
                          data-bs-toggle="collapse"
                          href="#menuCollapese3"
                          role="button"
                          aria-expanded="false"
                          aria-controls="menuCollapese3"
                          ><i class="fal fa-angle-down"></i
                        ></a>
                      </div>
                    </div>
                    <div class="cm-content-body form excerpt border-top collapse show" id="menuCollapese3">
                      <div class="card-body ItemsCheckboxSec">
                        <ul class="tab-my nav nav-tabs" id="myTab" role="tablist">
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link active"
                              id="Viewall-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Viewall-tab-pane"
                              type="button"
                              role="tab"
                              aria-controls="Viewall-tab-pane"
                              aria-selected="true"
                            >
                              View All
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
                              id="Search-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Search-tab-pane"
                              type="button"
                              role="tab"
                              aria-controls="Search-tab-pane"
                              aria-selected="false"
                            >
                              Search
                            </button>
                          </li>
                        </ul>
                        <div class="tab-content" id="myTabContent">
                          <div class="tab-pane fade show active" id="Viewall-tab-pane" role="tabpanel" aria-labelledby="Viewall-tab" tabindex="0">
                            <div class="menu-tabs">
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" :checked="checkAllInput" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault"> Privacy Policy </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" :checked="checkAllInput" value="" id="flexCheckDefault-1" />
                                <label class="form-check-label" for="flexCheckDefault-1"> Contact Us </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" :checked="checkAllInput" value="" id="flexCheckDefault-2" />
                                <label class="form-check-label" for="flexCheckDefault-2"> Important Information </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" :checked="checkAllInput" value="" id="flexCheckDefault-3" />
                                <label class="form-check-label" for="flexCheckDefault-3"> About Us </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" :checked="checkAllInput" value="" id="flexCheckDefault-4" />
                                <label class="form-check-label" for="flexCheckDefault-4"> Dummy Co </label>
                              </div>
                            </div>
                          </div>
                          <div class="tab-pane fade" id="Search-tab-pane" role="tabpanel" aria-labelledby="Search-tab" tabindex="0">
                            <div class="menu-tabs">
                              <label for="exampleFormControlInput1" class="form-label">Search</label>
                              <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Page Name" />
                            </div>
                          </div>
                          <div class="d-flex align-items-center flex-wrap">
                            <a href="javascript:void(0);" class="checkAllInput" @click="checkAllInput = true">Select All</a><span class="mx-2">|</span>
                            <a href="javascript:void(0);" class="unCheckAllInput" @click="checkAllInput = false">Deselect All</a>
                          </div>
                          <a class="btn btn-primary btn-sm dz-menu-btn">Add to Menu</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="filter cm-content-box box-primary border">
                    <div class="content-title border-0">
                      <div class="cpa">Links</div>
                      <div class="tools">
                        <a
                          @click="dropDown.three = !dropDown.three"
                          :class="`${dropDown.three ? '' : 'expand'} SlideToolHeader`"
                          data-bs-toggle="collapse"
                          href="#menuCollapese4"
                          role="button"
                          aria-expanded="false"
                          aria-controls="menuCollapese4"
                          ><i class="fal fa-angle-down"></i
                        ></a>
                      </div>
                    </div>
                    <div class="cm-content-body form excerpt border-top collapse show" id="menuCollapese4">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-xl-4">
                            <h6>URL</h6>
                          </div>
                          <div class="col-xl-8">
                            <input type="text" class="form-control mb-2" placeholder="" />
                          </div>
                          <div class="col-xl-4">
                            <h6 class="mb-xl-0 text-nowrap">Link Text</h6>
                          </div>
                          <div class="col-xl-8">
                            <input type="text" class="form-control" placeholder="Menu items" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-8">
            <div class="filter cm-content-box box-primary">
              <div class="content-title d-sm-flex d-block flex-wrap">
                <div class="cpa d-flex align-items-center flex-wrap">
                  <span class="pe-3 pb-sm-0 pb-3">Menu Name</span>
                  <input type="text" class="form-control w-auto mb-sm-0 mb-3" placeholder="information" />
                </div>
                <button type="button" class="btn btn-secondary light ms-sm-auto mb-2 mb-sm-0">Save Menu</button>
              </div>
              <div class="cm-content-body form excerpt rounded-0">
                <div class="card-body">
                  <h6 class="mb-1">Menus Structure</h6>
                  <p class="fs-13 mb-4">Add menu items from the column on the left.</p>
                  <div class="col-xl-12">
                    <div class="dd" id="nestable">
                      <draggable class="dd-list" ghost-class="ghost" item-key="dd-item" @start="dragging = true" @end="dragging = false">
                        <li class="accordion-item dd-item menu-ac-item" data-id="1">
                          <div class="accordion-header position-relative">
                            <div class="move-media dd-handle">
                              <i class="fa-solid fa-arrows-up-down-left-right"></i>
                            </div>
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                              Contact Us
                            </button>
                          </div>
                          <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
                            <div class="accordion-body">
                              <form>
                                <div class="row">
                                  <div class="col-xl-12">
                                    <div class="mb-3">
                                      <label class="form-label">URL</label>
                                      <input type="text" class="form-control solid" placeholder="https://bodyclub.dexignzone.com/xhtml/about-us.html" />
                                    </div>
                                  </div>
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Navigation Label</label>
                                      <input type="text" class="form-control solid" placeholder="Contact Us" />
                                    </div>
                                  </div>
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Title Attribute</label>
                                      <input type="text" class="form-control solid" placeholder="Contact Us" />
                                    </div>
                                  </div>
                                  <div class="d-flex align-items-center">
                                    <a class="text-hover remove" href="javascript:void(0);">Remove</a><span class="mx-2">|</span>
                                    <a
                                      class="text-hover cancel collapsed"
                                      href="javascript:void(0);"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseOne"
                                      aria-expanded="false"
                                      aria-controls="collapseOne"
                                    >
                                      Cancel
                                    </a>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </li>
                        <li class="accordion-item dd-item menu-ac-item" data-id="2">
                          <div class="accordion-header position-relative">
                            <div class="move-media dd-handle">
                              <i class="fa-solid fa-arrows-up-down-left-right"></i>
                            </div>
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                              Privacy Policy
                            </button>
                          </div>
                          <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                              <form>
                                <div class="row">
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Navigation Label</label>
                                      <input type="text" class="form-control solid" placeholder="Privacy Policy" />
                                    </div>
                                  </div>
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Title Attribute</label>
                                      <input type="text" class="form-control solid" placeholder="Privacy Policy" />
                                    </div>
                                  </div>
                                  <div class="col-xl-12">
                                    <p class="dz-terms">Original: <a href="javascript:void(0);">Privacy Policy</a></p>
                                  </div>
                                  <div class="d-flex align-items-center">
                                    <a class="text-hover remove" href="javascript:void(0);">Remove</a><span class="mx-2">|</span>
                                    <a
                                      class="text-hover cancel collapsed"
                                      href="javascript:void(0);"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseTwo"
                                      aria-expanded="false"
                                      aria-controls="collapseTwo"
                                    >
                                      Cancel
                                    </a>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </li>
                        <li class="accordion-item dd-item menu-ac-item" data-id="3">
                          <div class="accordion-header position-relative">
                            <div class="move-media dd-handle">
                              <i class="fa-solid fa-arrows-up-down-left-right"></i>
                            </div>
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                              Terms and Conditions
                            </button>
                          </div>
                          <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                              <form>
                                <div class="row">
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Navigation Label</label>
                                      <input type="text" class="form-control solid" placeholder="Terms and Conditions" />
                                    </div>
                                  </div>
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Title Attribute</label>
                                      <input type="text" class="form-control solid" placeholder="Terms and Conditions" />
                                    </div>
                                  </div>
                                  <div class="col-xl-12">
                                    <p class="dz-terms">Original: <a href="javascript:void(0);">Terms and Conditions</a></p>
                                  </div>
                                  <div class="d-flex align-items-center">
                                    <a class="text-hover remove" href="javascript:void(0);">Remove</a><span class="mx-2">|</span>
                                    <a
                                      class="text-hover cancel collapsed"
                                      href="javascript:void(0);"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseThree"
                                      aria-expanded="false"
                                      aria-controls="collapseThree"
                                    >
                                      Cancel
                                    </a>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </li>
                        <li class="accordion-item dd-item menu-ac-item" data-id="4">
                          <div class="accordion-header position-relative">
                            <div class="move-media dd-handle">
                              <i class="fa-solid fa-arrows-up-down-left-right"></i>
                            </div>
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                              About Us
                            </button>
                          </div>
                          <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                              <form>
                                <div class="row">
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Navigation Label</label>
                                      <input type="text" class="form-control solid" placeholder="About Us" />
                                    </div>
                                  </div>
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Title Attribute</label>
                                      <input type="text" class="form-control solid" placeholder="About Us" />
                                    </div>
                                  </div>
                                  <div class="col-xl-12">
                                    <p class="dz-terms">Original: <a href="javascript:void(0);">About Us</a></p>
                                  </div>
                                  <div class="d-flex align-items-center">
                                    <a class="text-hover remove" href="javascript:void(0);">Remove</a><span class="mx-2">|</span>
                                    <a
                                      class="text-hover cancel collapsed"
                                      href="javascript:void(0);"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseFour"
                                      aria-expanded="false"
                                      aria-controls="collapseFour"
                                    >
                                      Cancel
                                    </a>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </li>
                        <li class="accordion-item dd-item menu-ac-item" data-id="5">
                          <div class="accordion-header position-relative">
                            <div class="move-media dd-handle">
                              <i class="fa-solid fa-arrows-up-down-left-right"></i>
                            </div>
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                              Important Information
                            </button>
                          </div>
                          <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                              <form>
                                <div class="row">
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Navigation Label</label>
                                      <input type="text" class="form-control solid" placeholder="Important Information" />
                                    </div>
                                  </div>
                                  <div class="col-xl-6">
                                    <div class="mb-3">
                                      <label class="form-label">Title Attribute</label>
                                      <input type="text" class="form-control solid" placeholder="" />
                                    </div>
                                  </div>
                                  <div class="col-xl-12">
                                    <p class="dz-terms">Original: <a href="javascript:void(0);">Terms and Conditions</a></p>
                                  </div>
                                  <div class="d-flex align-items-center">
                                    <a href="javascript:void(0);">Remove</a><span class="mx-2">|</span>
                                    <a href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive" class="collapsed">
                                      Cancel
                                    </a>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </li>
                      </draggable>
                    </div>
                  </div>
                </div>
              </div>
              <div class="filter cm-content-box box-primary style-1 mb-0 border-0">
                <div class="content-title">
                  <div class="cpa">Delete Menu</div>
                  <button type="button" class="btn btn-secondary light my-2">Save Menu</button>
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
import { defineComponent, ref, reactive } from "vue";
import CustomSelectOption2 from "@/components/CustomSelectOption2.vue";
// @ts-ignore
import { VueDraggableNext } from "vue-draggable-next";

export default defineComponent({
  name: "menu_",
  setup() {
    const checkAllInput = ref(false);
    const dropDown = reactive({ one: false, two: false, three: false, four: false });
    return { checkAllInput, dropDown };
  },
  data() {
    return { dragging: false };
  },
  components: { CustomSelectOption2, draggable: VueDraggableNext },
});
</script>

<style scoped>
#nestable {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  max-width: 600px;
  list-style: none;
  font-size: 13px;
  line-height: 20px;
}
</style>

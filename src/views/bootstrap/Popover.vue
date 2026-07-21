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
          <li class="breadcrumb-item"><a href="javascript:void(0)">Bootstrap</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Popover</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Bootstrap popover</h4>
          </div>
          <div class="card-body">
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam laborum dolorum culpa a maiores officia
              ab. Cumque necessitatibus voluptates soluta, ullam
              numquam nulla. Et a architecto veritatis sint, autem cupiditate iure illo pariatur eum, praesentium
              numquam ea quaerat ipsam? Corrupti nobis illo itaque
              quae, qui numquam vero ipsa, reiciendis sit repudiandae molestiae natus vel voluptatibus exercitationem
              ducimus neque harum ad, commodi excepturi repellat
              eos fugiat minus eius. Doloremque itaque repudiandae saepe quia temporibus? Vitae, reprehenderit aliquam
              facilis qui at quis provident in maiores illo
              laborum, voluptatem recusandae cupiditate nemo. Nulla iusto ad consequatur reprehenderit quod accusamus,
              vitae, blanditiis quae ut tenetur nobis animi
              dolorum consectetur dignissimos amet illo provident nam obcaecati eligendi molestias tempora? Ad nam nobis
              eaque consequatur tempore tenetur eius ipsum
              reprehenderit dignissimos inventore. Id recusandae nemo dicta rerum. Distinctio itaque, veniam dolore
              inventore aliquid assumenda neque. Deserunt!
            </p>
            <div class="bootstrap-popover-wrapper">
              <div class="bootstrap-popover d-inline-block">
                <button type="button" class="btn btn-primary btn-sm px-4" style="position: relative"
                  @click="popoverLeft">
                  Left
                  <div :class="`popover bs-popover-auto fade collapse ${showPopover.left ? 'show' : ''}`" role="tooltip"
                    id="popover29239"
                    :style="`position: absolute; top: -117px; left: ${popoverResponsiv ? '-103px' : '5px'}`"
                    data-popper-placement="top">
                    <div class="popover-arrow"
                      :style="`position: absolute; left:  ${popoverResponsiv ? '0' : '-110px'}; transform: translate(130px)`">
                    </div>
                    <h3 class="popover-header">Popover in Left</h3>
                    <div class="popover-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor.</div>
                  </div>
                </button>
              </div>
              <div class="bootstrap-popover d-inline-block">
                <button type="button" class="btn btn-primary btn-sm px-4" style="position: relative"
                  @click="popoverTop">
                  Top
                  <div :class="`popover bs-popover-auto fade collapse ${showPopover.top ? 'show' : ''}`" role="tooltip"
                    id="popover91613" style="position: absolute; top: -117px; left: 50%; transform: translateX(-50%)"
                    data-popper-placement="top">
                    <div class="popover-arrow" style="position: absolute; left: 50%; transform: translateX(-50%)"></div>
                    <h3 class="popover-header">Popover in Top</h3>
                    <div class="popover-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor.</div>
                  </div>
                </button>
              </div>
              <div class="bootstrap-popover d-inline-block">
                <button type="button" class="btn btn-primary btn-sm px-4" style="position: relative"
                  @click="popoverBottom">
                  Bottom
                  <div :class="`popover bs-popover-auto fade collapse ${showPopover.bottom ? 'show' : ''}`"
                    role="tooltip" id="popover789558"
                    style="position: absolute; top: 36px; left: 5%; transform: translateX(-50%)"
                    data-popper-placement="bottom">
                    <div class="popover-arrow" style="position: absolute; left: 0px; transform: translate(130px)"></div>
                    <h3 class="popover-header">Popover in Bottom</h3>
                    <div class="popover-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor.</div>
                  </div>
                </button>
              </div>
              <div class="bootstrap-popover d-inline-block">
                <button type="button" class="btn btn-primary btn-sm px-4" style="position: relative"
                  @click="popoverRight">
                  Right
                  <div :class="`popover bs-popover-auto collapse ${showPopover.right ? 'show' : ''}`" role="tooltip"
                    id="popover888332"
                    :style="`position: absolute; top: ${popoverResponsivRight ? '-35px' : '-125px'}; left: ${popoverResponsivRight ? '111%' : '-172%'}`"
                    data-popper-placement="right">
                    <div class="popover-arrow" style="position: absolute; top: 0px; transform: translate(0px, 40px)"
                      v-if="popoverResponsivRight"></div>
                    <div class="popover-arrow"
                      style="position: absolute; left: 0px; bottom: -12px; transform: translate(152px) rotate(270deg)"
                      v-else></div>
                    <h3 class="popover-header">Popover in Right</h3>
                    <div class="popover-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor.</div>
                  </div>
                </button>
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

export default defineComponent({
  name: "popover_",
  setup() {
    const showPopover = ref({
      left: false,
      right: false,
      bottom: false,
      top: false,
    });
    const popoverResponsiv = ref(false);
    const popoverResponsivRight = ref(false);

    function popoverMedia() {
      if (window.innerWidth > 1020) {
        popoverResponsiv.value = true;
      } else {
        popoverResponsiv.value = false;
      }
      if (window.innerWidth > 538) {
        popoverResponsivRight.value = true;
      } else {
        if (window.innerWidth > 360) {
          popoverResponsivRight.value = false;
        } else {
          popoverResponsivRight.value = true;
        }
      }
    }

    return { showPopover, popoverResponsiv, popoverMedia, popoverResponsivRight };
  },
  mounted: function () {
    this.popoverMedia();
    window.addEventListener("resize", this.popoverHandler);
  },
  unmounted: function () {
    window.removeEventListener("resize", this.popoverHandler);
  },
  methods: {
    popoverLeft() {
      this.showPopover.left = !this.showPopover.left;
    },
    popoverRight() {
      this.showPopover.right = !this.showPopover.right;
    },
    popoverBottom() {
      this.showPopover.bottom = !this.showPopover.bottom;
    },
    popoverTop() {
      this.showPopover.top = !this.showPopover.top;
    },
    popoverHandler() {
      this.popoverMedia();
    },
  },
});
</script>

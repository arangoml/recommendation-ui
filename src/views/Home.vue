<template>
  <transition name="slide-fade">
    <div id="parent-grid" class="p-grid nested-grid movie-grid p-jc-center">
      <div v-show="loadingData" class="spinner">
      <ProgressSpinner />
      </div>
      <div
        class="p-shadow-5 top-elements leftPanel"
        :class="showLeftPanel ? 'p-col-3' : 'p-col-1'"
      >
        <div class="p-grid" v-on:click="toggleLeftPanel">
          <div v-show="showLeftPanel" class="p-col-2">
            <transition name="slide-fade-reverse">
              <Button
                icon="pi pi-angle-left"
                class="p-button-text left-panel-icon p-offset-0 closeButton"
              ></Button>
            </transition>
          </div>
          <h3 class="p-col-6">{{ !showLeftPanel ? showHide : "" }} Filters</h3>
          <div class="p-col-1">
            <transition name="slide-fade">
              <Button
                v-show="!showLeftPanel"
                icon="pi pi-angle-right"
                class="p-button-text left-panel-icon p-offset-6"
              ></Button>
            </transition>
          </div>
          <Divider
            class="divider"
            layout="horizontal"
            type="solid"
            align="right"
          />
        </div>
        <transition name="slide-fade">
          <FilterPanel v-show="showLeftPanel" class="filterPanel" />
        </transition>
        <transition name="slide-fade">
          <div v-show="showLeftPanel" v-on:click="toggleLeftPanel">
            <Divider
              class="divider"
              layout="horizontal"
              type="solid"
              align="right"
            />
            Hide
          </div>
        </transition>
      </div>
      <div
        class="top-panel p-shadow-5 top-elements"
        :class="showLeftPanel ? 'p-col-8 p-mx-auto' : 'p-col-10 p-mx-auto'"
      >
        <div class="p-grid">
          <div class="p-col-12 userHeader">
            <UserHeader />
          </div>
          <div class="p-col-12 carousel" >
            <CarouselView />
          </div>
          
        </div>
      </div>
      <div 
      class="p-shadow-5 p-col-11"
      :class="expandBottomPanel ? 'p-col-12 bottom-panel-expanded' : 'p-col-11 bottom-panel-collapsed'"
      >
        <Button :icon="expandBottomPanel ? 'pi pi-angle-down' : 'pi pi-angle-up'" class="bottom-panel-button p-button-outlined" v-on:click="toggleBottomPanel"/>
        <div>
          
        <DetailsPanel :expanded="expandBottomPanel" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import UserHeader from "../components/UserHeader.vue";
import CarouselView from "../components/CarouselView.vue";
import FilterPanel from "../components/FilterPanel.vue";
import DetailsPanel from "../components/DetailsPanel.vue";

import {mapMutations, mapState} from 'vuex';

export default {
  name: "Home",
  components: {
    UserHeader,
    CarouselView,
    FilterPanel,
    DetailsPanel,
  },
  data() {
    return {
      expandBottomPanel: false,
      showHide: "Show",
      movieData: null
    };
  },
  computed: {
    ...mapState({
      showLeftPanel: state => state.showLeftPanel,
      loadingData: state => state.loadingData
    })
  },
  methods: {
    toggleBottomPanel: function () {
      this.expandBottomPanel = !this.expandBottomPanel;
    },
    ...mapMutations({
      toggleLeftPanel: 'toggleLeftPanel'
    })
  },
};
</script>

<style>
#parent-grid {
  max-height: 100vh;
  /* overflow: scroll; */
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
}

div.top-panel {
  overflow: scroll;
  background: url("../assets/graphbackgroundlightened2.png") no-repeat right top fixed;
  background-color: var(--panel-background);
}
.carousel {
  background-color: var(--panel-background);  
}
.userHeader {
  background-color: var(--panel-background-some-opacity);  
}
.top-elements {
  height: 70vh;
  
  overflow: scroll;
  background-color: var(--panel-background);
}
.bottom-panel-collapsed {
  background-color: var(--panel-background);
  height: 23vh;
  margin-top: 2vh;
  transition: width .5s, transform 1s;
  top: 0px;


}
.bottom-panel-expanded {
  background-color: var(--panel-background);
  height: 70vh;
  margin-top: 29vh;
  z-index: 1 !important;
  position: absolute;
  border: 2px double var(--surface-border);;
  transition: height 1s, width .5s, transform 1s;
  top: 0px;
}
.bottom-panel {
  margin: center;
}
.bottom-panel-button.p-button {
  width: 88vw !important;
  height: 2vh !important;
  margin-bottom: 1vh;
  border: 1px solid var(--surface-b) !important;
  color: var(--surface-b) !important;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out !important;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10vw) !important;
  opacity: 0 !important;
}

.slide-fade-reverse-enter-active {
  transition: all 0.5s ease-in !important;
}

.slide-fade-reverse-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-reverse-enter-from,
.slide-fade-reverse-leave-to {
  transform: translateX(-10vw) !important;
  opacity: 0 !important;
}

/* Scroll bar stylings */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar:vertical {
  background-color: var(--panel-background);
}
.top-elements::-webkit-scrollbar:horizontal {
  background-color: var(--panel-background);
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--lightestgrey);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
::-webkit-scrollbar-corner {
  color: var(--surface-a);
}
</style>
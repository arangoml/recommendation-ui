<template>
<div class="card">

  <div class="p-grid bottom-panel-components">
      <div class="p-col-4">
      <AQLView :expanded=expanded />
      </div>
      <transition name="fade-from-top" >
      <Divider v-if="expanded" layout="vertical" style="margin: 0;" />
      </transition>
      <div class="p-col-4">
      <RecommendationInfo :expanded=expanded />
      </div>
      <transition name="fade-from-top" >
      <Divider v-if="expanded" layout="vertical" style="margin: 0;" />
      </transition>
      <transition name="fade-from-top" >
      <div class="p-col-4 resources">
      <ResourcesComponent :expanded=expanded />
        <p v-if="!expanded" class="tmdb-attribution" >This product uses the TMDB API but is not endorsed or certified by TMDB. <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" class="tmdb-logo" /></p>
      </div>
      </transition>
  </div>
</div>
</template>

<script>
import AQLView from './AQLView.vue'
import RecommendationInfo from './RecommendationInfo.vue'
import ResourcesComponent from './ResourcesComponent.vue'

export default {
    name: 'DetailsPanel',
    components: {
        AQLView,
        RecommendationInfo,
        ResourcesComponent
    },
    props: {
        expanded: {
            type: Boolean,
            default: false
        }
    }

}
</script>

<style>
.bottom-panel-components {
    overflow: scroll;
    max-height: 68vh;
}

.fade-from-top-enter-active {
  transition: all .5s ease .25s !important;
  opacity: 1;
}
.fade-from-top-leave-active {
  transition: opacity 0s !important;
}

.fade-from-top-enter-from, .fade-test-leave-to {
  transform: translateY(-75px);
  opacity: 0;
}
.tmdb-attribution {
  font-size: .9em;
}
.tmdb-logo {
  width: 2vw;
}
</style>
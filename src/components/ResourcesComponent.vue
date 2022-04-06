<template>
  <div class="resourcesContainer">
      <h2>Resources</h2>
      <p v-if="!expanded">Explore the resources section for links to the notebooks we used to generate the recommendations, relevant papers, datasets, and more.</p>
      <div v-if="expanded">
      <p>
          Use these resources to learn more about how we generated these recommendations.
      </p>
          <div v-for="resources, index in queryInfo.resources" :key="index">
              <h2> {{resources.title}} </h2>
              <p> {{ resources.description}} </p>
              <p><a :href=resources.url >Link to {{resources.title}}</a> </p>
              <p v-if="resources.image"><img :src="resources.image" /></p>
              <br>
      </div>
      </div>
      <p v-if="!expanded" >
      ...expand for more
      </p>
      <transition name="fade-from-top" >
          <div v-if="expanded">
    <p class="tmdb-attribution" >This product uses the TMDB API but is not endorsed or certified by TMDB. <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" class="tmdb-logo" /></p>
          </div>
      </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: "ResourcesComponent",
    data () {
        return {
        }
    },
      computed: {
    ...mapState({
        queryInfo: state => state.queryInfo[state.currentQuery]
    })
    },
    props: {
        expanded: Boolean
    },

}
</script>

<style >

</style>
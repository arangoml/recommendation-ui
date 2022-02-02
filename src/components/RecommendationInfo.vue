<template>
  <div>
      <h2>{{ queryInfo.name }}</h2>
      <p v-if="!expanded" style="white-space: pre;">{{queryInfo.shortDescription}}</p>
<transition name="fade-from-top">
      <div v-if="expanded">
      <p style="white-space: pre;">{{ queryInfo.description}}</p>
      </div>
</transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "RecommendationInfo",
    data() {
        return {

        }
    },
    computed: {
        ...mapState({
        currentQuery: state => state.currentQuery,
        queryInfo: state => state.queryInfo[state.currentQuery]
      })
    },
    props: {
        expanded: Boolean
    }

}
</script>

<style scoped>

</style>
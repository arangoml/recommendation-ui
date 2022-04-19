<template>
  <div class="p-jc-left">
    <h2>AQL</h2> 
  <div class="p-jc-left">
    <p v-show="!expanded">Expand this panel to see the full AQL query and learn more about the Machine Learning concepts used. </p>
    <p v-show="expanded">This is the AQL query used for {{queryInfo[currentQuery].name}}.</p>
    <p v-show="expanded">See the panel to the right to learn more.</p>
    <transition name="fade-from-top">
    <div class="p-grid p-jc-center aql-code" v-show="expanded">
      <pre><span v-html="aqlQuery"></span></pre>
      
      <div class="aql-details p-row-1">
      
      </div>
    </div>
  </transition>
  </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "aql",
  computed: {
        ...mapState({
            queryInfo: state => state.queryInfo,
            currentQuery: state => state.currentQuery,
            aqlQuery: (state) => {
              return state.queryInfo[state.currentQuery].query
              }
        }),

  },
  methods: {
    
  },
  created: function() {
  },
  props: {
    expanded: {
        type: Boolean,
        default: false
    }
  }
}
</script>

<style scoped>
pre {
      white-space: pre-wrap; /* CSS3 */
      text-align: left;
      margin-left: 50px;
}
</style>
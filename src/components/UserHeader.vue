<template>
  <div class="flexgrid">
    <h1>ArangoFlix</h1>
        <h2>Recommendation Method</h2>
        <div style="margin-top: .5em;" class="p-d-flex p-flex-row p-jc-center recommendation-preference-row">
        <div class=" p-mr-2">
            <Button v-on:click="recommendMoviesCollaborativeFilteringAQL(user)" :class="currentQuery == 0 ? 'selectedButton' : ''" class="rec-pref-button" label="AQL Collaborative Filtering" />
        </div>
        <div class="p-mr-2">
            <Button v-on:click="recommendMoviesContentBasedML(user)" :class="currentQuery == 1 ? 'selectedButton' : ''" class="rec-pref-button" label="Content Based ML " />
        </div>
        <div class="p-mr-2">
            <Button v-on:click="recommendMoviesEmbeddingML(user)" :class="currentQuery == 2 ? 'selectedButton' : ''" class="rec-pref-button" label="ML Graph Embeddings " />
        </div>
        </div>
    <h2>Who's watching?</h2>
        <!-- <Button type="button" icon="pi pi-plus" title="Add Column" @click="addColumn" :disabled="columns.length === 20" style="margin-right: .5em" />
        <Button type="button" icon="pi pi-minus" title="Remove Column" @click="removeColumn" :disabled="columns.length === 1" /> -->

        <div style="margin-top: .5em" class="p-grid user-row">
                <div v-for="col of 10" :key="col" class="p-col">
                    <Button v-on:click="updateUser(col)" class="user-button" :class="col == user ? 'selectedButton' : ''" icon="pi pi-user" :label="'User ' + col" />
                </div>
        </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'UserHeader',
  props: {
    msg: String
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      currentQuery: state => state.currentQuery
    })
  },
  methods: {
      addColumn() {
          this.columns = [...this.columns, this.columns.length];
      },
      removeColumn() {
          this.columns.pop();
      },
      ...mapActions({
      userRecommendation: 'userRecommendation',
      recommendMoviesCollaborativeFilteringAQL: 'recommendMoviesCollaborativeFilteringAQL',
      recommendMoviesContentBasedML: 'recommendMoviesContentBasedML',
      recommendMoviesEmbeddingML: 'recommendMoviesEmbeddingML',
      updateUser: 'updateUser'
      }),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flexgrid{
  /* background-color: var(--surface-b); */

  }
.user-row {
  overflow-x: scroll;
}
.user-button {
  width: 6em;
  height: 6em;
}
.selectedButton {
text-decoration:underline;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<template>
  <div class="flexgrid">
    <div class="headerContainer" >
    <h1><img class="headerImage" src="../assets/ArangoFlix.png" alt=""></h1>
      <Divider layout="horizontal" style="margin: 0;" />
    </div>
    <div>

        <h2>Recommendation Method</h2>
        <div style="margin-top: .5em;" class="p-d-flex p-flex-row p-jc-center recommendation-preference-row">
          <div class="p-mr-2">
            <Button v-for="query, index in queryInfo" :key="index" v-on:click="this.$store.dispatch(queryInfo[index].queryName.toString(), user)" :class="currentQuery == index ? 'selectedButton' : ''" class="rec-pref-button" :label="queryInfo[index].name" />
          </div>
        </div>
    <h2>Who's watching?</h2>
        <!-- <Button type="button" icon="pi pi-plus" title="Add Column" @click="addColumn" :disabled="columns.length === 20" style="margin-right: .5em" />
        <Button type="button" icon="pi pi-minus" title="Remove Column" @click="removeColumn" :disabled="columns.length === 1" /> -->

        <div style="margin-top: .5em" class="p-grid user-row">
                <div v-for="u, index of users" :key="index" class="p-col userButtonDiv">
                  <Button  v-on:click="updateUser(index+1)" class="user-button" :class="index+1 == user ? 'selectedButton' : ''" ><i class="pi pi-user">&nbsp;</i><p> {{u}}</p></Button>
                </div>
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
      users: [
        "Arthur",
        "Rajiv",
        "Alex",
        "Naomi",
        "Grace",
        "Oliver",
        "Mathias",
        "Lupen"
      ],
      colors: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      currentQuery: state => state.currentQuery,
      queryInfo: state => state.queryInfo
    }),
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
      generateRandomColor(){
      let maxVal = 0xFFFFFF; // 16777215
      let randomNumber = Math.random() * maxVal; 
      randomNumber = Math.floor(randomNumber);
      randomNumber = randomNumber.toString(16);
      let randColor = randomNumber.padStart(6, 0);   
      return `#${randColor.toUpperCase()}`
    } 
    },
  beforeMount() {
    this.colors.push(this.generateRandomColor())
  },
}
</script>

<style scoped>
.user-row {
  overflow-x: scroll;
}
.user-button {
  width: 6vw;
  height: 7vh;
  text-align: left;  
} 
.user-button>p::first-letter{
  font-size: 120%;
  font-weight: bold;
  
}
.p-button:hover {
background-color: var(--selected-button) !important;

}

.selectedButton {
text-decoration:underline;
background-color: var(--selected-button);
}
.rec-pref-button {
  margin: 1vh;
  padding: 15px;
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
.headerImage {
  opacity: 1 !important;
}
</style>

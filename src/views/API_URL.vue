<template>
<div :class="APIRESPONSE != 200 ? 'APIURL' : 'Hidden'">
    <div class="headerContainer" >
        <h1><img class="headerImage" src="../assets/ArangoFlix.png" alt=""></h1>
      <Divider layout="horizontal" style="margin: 0;" />
    </div>
    <div v-show="APIRESPONSE != 200">
        <h2>Please paste your ArangoDB Oasis Endpoint here.</h2>
        <span class="p-float-label">
            <h5>Enter Movie Demo GraphQL Endpoint URL</h5>
            <InputText id="APIURL" type="text" v-model="API_URL" />
        </span>
        <p class="errorResponse" >{{ APIRESPONSE > 399 ? 'Invalid URL or issue with GraphQL Endpoint' : ''  }}</p>
    </div>
    <Button @click="setAPI(API_URL)" > Submit </Button>
        <p><a class="oasisLink" href="https://www.arangodb.com/docs/stable/oasis/getting-started.html#get-a-deployment-up-and-running">Click here for instructions on setting up your first deployment and installing the movie recommendation example on Oasis.</a></p>
    <div class="oasisBanner">
        <h2>This demo runs on ArangoDB Oasis</h2>
        <h2><img class="headerImage" src="../assets/oasisLogo.svg" alt=""></h2>

        <p>If you don't already have an ArangoDB Oasis account you 
            can sign up for a free 14 day trial!
            <span><a class="oasisLink" href="https://cloud.arangodb.com/">Sign up now!</a></span>
        </p>
    </div>
</div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
    data() {
        return {
            hide: true,
            API_URL: new URL(location.href).searchParams.get('OasisURL')
        }
    },
  computed: {
      ...mapState({
          APIRESPONSE: state => state.APIRESPONSE
      }),
  },
  methods: {
      ...mapActions([
         'setAPIURL' 
      ]),
      async setAPI(API_URL) {
        //   this.$store.commit('loading', true)
          await this.setAPIURL(API_URL)
        //   this.$store.commit('loading', false)


      }
  }  

}
</script>

<style>
.APIURL {
    width: 100vw;
    height: 100vh;
    z-index: 4;
    position: absolute;
    background-color: var(--panel-background);
}
.APIBUTTON {
    width: 1vw;
    height: 1vh;
    z-index: 4;
    position: absolute;
    right: 10vw;
}
.Hidden {
    display: none;
}
.oasisLink {
    font-weight: bold;
    color: var(--arangodb-button-color-primary-a);
}
.oasisBanner {
      border: 2px var(--arangodb-button-color-primary-a) solid;
      width: 50vw;
      margin: auto;
      margin-top: 5vh;
}
.errorResponse {
    font-size: .9em;
    color: var(--arangodb-button-color-downloads-a);
}
</style>
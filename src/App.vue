<template>
<div class="body-wrapper">
  <Home/>
</div>
</template>

<script>
import Home from './views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  },
}
</script>

<style lang="scss">
  body {
      color: var(--text-color);
      background-color: var(--arangodb-background-b);
      }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  margin-top: 30px;
}
</style>
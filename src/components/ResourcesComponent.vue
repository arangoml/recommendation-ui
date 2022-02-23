<template>
  <div class="resourcesContainer">
      <h2>Resources</h2>
      <p>
          You can see how we generated the analytical data for this in the following notebook:
          <a href="https://www.arangodb.com/">
          <img src="https://colab.research.google.com/assets/colab-badge.svg" />
          </a>
      </p>
      <p v-if="!expanded" >
      ...expand for more
      </p>
      <transition name="fade-from-top" >
      <p v-if="expanded" >
          Trifecta, robusta ut extraction, qui, café au lait strong cappuccino macchiato wings. Frappuccino aroma, macchiato redeye qui, caramelization spoon, cup variety wings coffee cream.

    Extraction saucer café au lait crema, pumpkin spice mazagran fair trade java as caffeine. Acerbic, id, bar  caffeine sweet skinny sit skinny.
    </p>
      </transition>
  </div>
</template>

<script>

export default {
    name: "ResourcesComponent",
    data () {
        return {
        }
    },
    props: {
        expanded: Boolean
    },

}
</script>

<style >

</style>
<template>
    <div>
      <img v-for="avocado, index in avocados" :key="index" class="avocado" :class="avocado.clicked ? 'avocadoRatingClicked' : 'avocadoRating'" src="../assets/adblogo.png" v-on:click="ratingClicked(index)" />
    </div>
  
</template>

<script>


export default {
    data () {
        return {
            avocados: []
        }
    },
    props: {
        numberOfAvocados: {
            type: Number,
            default: 10
        }
    },
    computed: {
        selectedRating: {
            get: function() {
                return this.$store.state.selectedRating;
            },
            set: function(rating) {
                this.$store.commit("updateRating", rating);
            }
        }
    },
    methods: {
        ratingClicked: function(index) {
            this.selectedRating = index;
            this.avocados.forEach((e, i) => {
                index >= i ? this.avocados[i].clicked = true : this.avocados[i].clicked = false
            })
        },
        generateAvocados: function(amount) {
            for (let i = 0; i < amount; i++) {
                this.avocados.push({"clicked": false})
            }
        }
    },
    beforeMount: function() {
        this.generateAvocados(this.numberOfAvocados);
    }

}
</script>

<style scoped>
.avocado {
    width: 35px;
    padding: 3px;
}
.avocadoRating:hover{
    opacity: 1 !important;
}
.avocadoRating {
    opacity: .5 !important;
}
.avocadoRatingClicked::before {
    opacity: .85;
}

</style>
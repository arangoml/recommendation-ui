<template>
  <div class="filterPanel" >
    <Accordion v-if="genres.length > 0" class="filterAccordion" >
        <AccordionTab header="Genres">
            <div class="checkboxes-wrapper">
            <div class="checkboxes p-d-flex p-flex-wrap p-jc-start">
                <div class="inner-checkboxes" v-for="genre, index of genres" v-bind:key="index" >
                    <div class="p-field-checkbox p-mr-2 p-mb-2">
                        <div>
                        <Checkbox :id="index" :value="genre[0]" v-model="selectedGenres" />

                        <label :for="index" > {{genre[0]}} </label>                   
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </AccordionTab>
        <AccordionTab header="Rating">
            <div class="ratingClass">

            <!-- <Rating  v-model="selectedRating" :cancel=false :stars="10"/> -->
            <custom-ratings :numberOfAvocados="10"/>
            Movies with at least {{selectedRating + 1}} avocados
            </div>
        </AccordionTab>
        <AccordionTab header="Languages">
            <div>

            <!-- <div v-for="language, index in languages" v-bind:key="index"> -->
                <span v-for="language, index in languages" v-bind:key="index">

            <input type="checkbox" v-model="selectedLanguages" :value="language">
            <label for="checkbox">{{ language }}</label>
                <!-- </div> -->
            </span>

            </div>
            <!-- <div class="checkboxes-wrapper">
            <div class="checkboxes p-d-flex p-flex-wrap p-jc-start">
                <div class="inner-checkboxes" v-for="language, index of languages" v-bind:key="index">
                    <div class="p-field-checkbox p-mr-2 p-mb-2">
                        <Checkbox :id="index" :value="language" v-model="selectedLanguages" />
                        <label :for="index" > {{language}} </label>                   
                    </div>
                </div>
            </div>
            </div> -->
        </AccordionTab>
    </Accordion>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import customRatings from './customRatings.vue'

export default {
    data() {
        return {
            genreArray: [],
            stars:1,
            langs: [],
            selectedLangs: []
        }
    },
    components: {
        customRatings
    },
    computed: {
        ...mapState({
            genres: state => state.sortedGenres ? state.sortedGenres : [],
            languages: state => state.languages ? state.languages : []
        }),
        selectedGenres: {
            get: function() {
                return this.$store.state.selectedGenres;
            },
            set: function(gs) {
                this.$store.commit("updateGenres", gs);
            }
        },
        selectedRating: {
            get: function() {
                return this.$store.state.selectedRating;
            },
            set: function(rating) {
                this.$store.commit("updateRating", rating);
            }
        },
        selectedLanguages: {
            get: function() {
                return this.$store.state.selectedLanguages;
            },
            set: function(lang) {
                this.$store.dispatch("updateSelectedLanguagesAction", lang);
            }
        },
    },
    methods: {
        ...mapActions({
            updateSelectedLanguagesAction: 'updateSelectedLanguagesAction'
        })
    },
}
</script>

<style lang="scss">

</style>
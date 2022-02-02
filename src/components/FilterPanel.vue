<template>
  <div>
    <Accordion v-if="genres.length > 0">
        <AccordionTab header="Genres">
            <div class="checkboxes-wrapper">
            <div class="checkboxes p-d-flex p-flex-wrap p-jc-start">
                <div class="inner-checkboxes" v-for="genre, index of genres" v-bind:key="index" >
                    <div class="p-field-checkbox p-mr-2 p-mb-2">
                        <div>
                        <Checkbox :id="index" :value="genre[0]" v-model="selectedGenres" />

                        <label :for="index" > {{genre[0]}}({{genre[1]}}) </label>                   
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </AccordionTab>
        <AccordionTab header="Rating">
            <Rating v-model="selectedRating" :cancel=false :stars="10"/>
            Movies with at least {{stars}} stars
        </AccordionTab>
        <AccordionTab header="Languages">
            <div class="checkboxes-wrapper">
            <div class="checkboxes p-d-flex p-flex-wrap p-jc-start">
                <div class="inner-checkboxes" v-for="language of languages" v-bind:key="language">
                    <div class="p-field-checkbox p-mr-2 p-mb-2">
                        <Checkbox :id=language name="Languages" :value=language v-model="selectedLanguages" />
                        <label :for=language > {{language}} </label>                   
                    </div>
                </div>
            </div>
            </div>
        </AccordionTab>
    </Accordion>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            genreArray: [],
            selectedLanguages: [],
            stars:1,
            languages: [
                "Nederlands",
                "қазақ",
                "Srpski",
                "Somali",
                "العربية",
                "Norsk",
                "Český",
                "Wolof",
                "Esperanto",
                "Français",
                "বাংলা",
                "తెలుగు",
                "普通话",
                "Português",
                "ελληνικά",
                "தமிழ்",
                "Italiano",
                "Hrvatski",
                "Latviešu",
                "Bahasa melayu",
                "Català",
                "Polski",
                "shqip",
                "svenska",
                "Український",
                "Español",
                "Pусский",
                "广州话 / 廣州話",
                "עִבְרִית",
                "English",
                "Magyar",
                "Gaeilge",
                "euskera",
                "Türkçe",
                "Deutsch",
                "Slovenčina",
                "Română",
                "Dansk",
                "Cymraeg",
                "Bahasa indonesia",
                "беларуская мова",
                "Íslenska",
                "ภาษาไทย",
                "فارسی",
                "български език",
                "한국어/조선말",
                "No Language",
                "日本語",
                "Afrikaans",
                "اردو",
                "Tiếng Việt",
                "Azərbaycan",
                "Latin",
                "Malti",
                "isiZulu",
                "suomi",
                "हिन्दी",
                "Eesti",
                "Kiswahili",
                "پښتو",
                "Bosanski",
                "ქართული",
                "ਪੰਜਾਬੀ",
                "Bamanankan",
                "Galego"
                ],
        }
    },
    computed: {
        ...mapState({
            genres: state => state.sortedGenres ? state.sortedGenres : [],
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
                console.log(rating)
                this.$store.commit("updateRating", rating);
            }
        }
    },
    methods: {
    }
}
</script>

<style scoped>
</style>
<template>
<div>
    <div class="card">
        <Carousel v-for="genre, index in computedGenres" :name="genre[0]" v-bind:key="index + selectedLanguages.length" :value="filteredRecommendations(genre[0])" :numVisible="4" :numScroll="filteredRecommendations < 4 ? filteredRecommendations().length : 4" :page=0 :responsiveOptions="responsiveOptions" >
            <template #header>
                <h5>{{genre[0]}}({{filteredRecommendations(genre[0]).length}})</h5>
            </template>
            <template #item="slotProps">
                <div class="movie-item" :name="slotProps.data.movie.title + genre[0]">
                <transition name="flip">
                    <div v-show="!slotProps.data.flipped" class="movie-item-content" :class="!slotProps.data.flipped ? 'delete-card' : '' ">
                        <div class="movie-details">
                        <div class="p-mb-3">
                            
                            <!-- <img v-show="slotProps.data.movie.posterPath != null" :src="'https://image.tmdb.org/t/p/w500'+ slotProps.data.movie.posterPath" :alt="slotProps.data.name" class="movie-image" /> -->
                            <img :src="slotProps.data.movie.posterPath == null ? placeholderImage : slotProps.data.movie.posterPath" :alt="slotProps.data.name" class="movie-image" />
                            
                        </div>
                            <div class="car-buttons p-mt-5">
                                <Button icon="pi pi-sync" class="p-button p-button-rounded p-mr-2" @click="toggleCard(slotProps.data)"/>

                                <Button icon="pi pi-star-fill" class="p-button-rounded p-mr-2 avocadoButton" @click="explainerAction(slotProps.data.movie.movieId)"> <img class="avocadoButtonImage" src="../assets/graphIcon.svg" alt="" /> </Button>
                            </div>
                        </div>
                            <h4 class="p-mb-1">{{slotProps.data.movie.title}}</h4>
                            <h6 class="p-mt-0 p-mb-3 subtext">Average User Rating: {{slotProps.data.movie.voteAverage}}</h6>
                            <h6 class="p-mt-0 p-mb-3 subtext">Recommendation Score: {{slotProps.data.score}}</h6>
                      
                    </div>
                </transition>
                <transition name="flip">
                    <div v-show="slotProps.data.flipped" class="movie-item-content" :class="!slotProps.data.flipped ? 'delete-card' : '' ">
                        <div class="car-buttons p-mt-5">
                        <Button icon="pi pi-sync" class="p-button p-button-rounded p-mr-2" @click="toggleCard(slotProps.data)"/>
                        <Button icon="pi pi-star-fill" class="p-button-rounded p-mr-2 avocadoButton" @click="explainerAction(slotProps.data.movie.movieId)"> <img class="avocadoButtonImage" src="../assets/graphIcon.svg" alt="" /> </Button>
                        <p>{{slotProps.data.movie.overview}}</p>
                        <p>Genres: {{slotProps.data.movie.genres}}</p>
                        <p>Language: {{slotProps.data.movie.originalLanguage}}</p>
                        </div>

                        <div class="p-mb-3">
                        </div>
                        <div>
                        </div>
                    </div>
                </transition>
                </div>
            </template>
        </Carousel>
    </div>
</div>
</template>    
<script>
// import CarouselCardFront from "../components/CarouselCardFront.vue"
import { mapState, mapActions } from 'vuex';
import placeholderImage from '../assets/adblogo.png';

export default {
  name: 'CarouselView',
  components: {
    //   CarouselCardFront
      },
  data() {
    return {
        responsiveOptions: [
          {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
          },
          {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
          },
          {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
          }
        ],
        movies: [],
        placeholderImage: placeholderImage,
        filteredmovies: []
        
    }
  },
  computed: {
      ...mapState({
        recommendations: state => state.recommendations,
        genres: state => state.sortedGenres,
        selectedGenres: state => state.selectedGenres,
        selectedLanguages: state => state.selectedLanguages,
        computedGenres: function(state) {
          let computedSortedGenres = []
          state.sortedGenres.forEach((genre) => {            
            state.selectedGenres.length > 0 ? (state.selectedGenres.find(g => g == genre[0] ? computedSortedGenres.push(genre) : false)) : false
          })
          return computedSortedGenres.length == 0 ? state.sortedGenres : computedSortedGenres
        },
        selectedRating: state => state.selectedRating,
        openExplainer: state => state.openExplainer,
        currentQuery: state => state.currentQuery
      }),
    filteredRecommendations: function() {
      return function(genre){
        this.filteredmovies = [];
      let movies =[];
      let filteredRatedMovies = [];
      this.recommendations.forEach((e) => {
        e.movie.genres.find((el) => {
          el.toString() == genre.toString() ? movies.push(e) : ''
        })
        });

        movies.forEach((e) => {
          e.movie.voteAverage >= this.selectedRating + 1 && (this.selectedLanguages.length > 0 ? this.selectedLanguages.find(l => l == e.movie.originalLanguage): true) ? filteredRatedMovies.push(e) : ''
        })
        this.filteredmovies = filteredRatedMovies
      return filteredRatedMovies
          }
    },
  },
  props: {
    genre: Array
  },
  methods: {
    ...mapActions({
    recommendMoviesAction: 'recommendMoviesAction',
    explainerAction: 'explainerAction'
    }),
    toggleCard: function(movie) {
      movie.flipped = !movie.flipped;
    },
    toggleExplainer: function() {
      this.$store.commit("toggleExplainer")
    }
      
  },
  mounted(){
      this.recommendMoviesAction({query: 'recommendMoviesCollaborativeFilteringAQL', user: 0, index: 0});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .movie-item-content {
        border: 1px solid var(--surface-d);
        border-radius: 3px;
        margin: .2rem;
        text-align: center;
        padding: 1rem 0;
        overflow: scroll;
        height: 24em;
    }
    .movie-image {
        width: 4vw;
        min-height: 5em;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
    }
  
  .flip-enter-active {
    transition: all 0.4s ease;
  }
  
  .flip-leave-active {
    display: none;
  }
  
  .flip-enter-from, .flip-leave-to {
    transform: rotateY(180deg);
    opacity: 0;
  
  }
  .avocadoButtonImage {
    width: 2vw;
  }
.avocadoButton {
  background-color: rgba(0, 128, 0, 0);
}
.subtext {
  font-size: .8em;
}

</style>
<template>
<div>
    <div class="card">
        <Carousel v-for="genre in computedGenres" :name="genre[0]" v-bind:key="genre[0] + genre[1]" :value="filteredRecommendations(genre[0])" :numVisible="4" :numScroll="2" :page=0 :responsiveOptions="responsiveOptions" >
            <template #header>
                <h5>{{genre[0]}}({{genre[1]}})</h5>
            </template>
            <template #item="slotProps">
                <div v-show="slotProps.data.movie.voteAverage >= selectedRating" class="movie-item" :name="slotProps.data.movie.title + genre[0]">
                <transition name="flip">
                    <div v-show="!slotProps.data.flipped" class="movie-item-content" :class="!slotProps.data.flipped ? 'delete-card' : '' ">
                        <div class="movie-details">
                        <div class="p-mb-3">
                            
                            <img v-show="slotProps.data.movie.posterPath != null" :src="'https://image.tmdb.org/t/p/w500'+ slotProps.data.movie.posterPath" :alt="slotProps.data.name" class="movie-image" />
                            <img v-show="slotProps.data.movie.posterPath == null" :src="placeholderImage" :alt="slotProps.data.name" class="movie-image" />
                        </div>
                            <div class="car-buttons p-mt-5">
                                <Button icon="pi pi-sync" class="p-button p-button-rounded p-mr-2" @click="toggleCard(slotProps.data)"/>

                                <Button icon="pi pi-star-fill" class="p-button-success p-button-rounded p-mr-2" />
                            </div>
                        </div>
                            <h4 class="p-mb-1">{{slotProps.data.movie.title}}</h4>
                            <h6 class="p-mt-0 p-mb-3">Average User Rating: {{slotProps.data.movie.voteAverage}}</h6>
                            <h6 class="p-mt-0 p-mb-3">Recommendation Score: {{slotProps.data.score}}</h6>

                      
                    </div>
                </transition>
                <transition name="flip">
                    <div v-show="slotProps.data.flipped" class="movie-item-content" :class="!slotProps.data.flipped ? 'delete-card' : '' ">
                        <div class="car-buttons p-mt-5">
                        <Button icon="pi pi-sync" class="p-button p-button-rounded p-mr-2" @click="toggleCard(slotProps.data)"/>
                        <p>{{slotProps.data.movie.overview}}</p>
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
        placeholderImage: placeholderImage
        
    }
  },
  computed: {
      ...mapState({
        recommendations: state => state.recommendations,
        genres: state => state.sortedGenres,
        selectedGenres: state => state.selectedGenres,
        computedGenres: function(state) {
          let computedSortedGenres = []
          state.sortedGenres.forEach((genre) => {            
            state.selectedGenres.length > 0 ? (state.selectedGenres.find(g => g == genre[0] ? computedSortedGenres.push(genre) : false)) : false
          })
          return computedSortedGenres.length == 0 ? state.sortedGenres : computedSortedGenres
        },
        selectedRating: state => state.selectedRating
      }),
  },
  props: {
    genre: Array
  },
  methods: {
    filteredRecommendations: function(genre) {
      let movies =[];
      this.recommendations.forEach((e) => {
        e.movie.genres.find((el) => {
          el.toString() == genre.toString() ? movies.push(e) : ''
        })
        });
      return movies; 
    },
    toggleCard: function(movie) {
      movie.flipped = !movie.flipped;
    },
      ...mapActions({
      recommendMoviesContentBasedML: 'recommendMoviesContentBasedML'
      })
      
  },
  created: function() {
      this.recommendMoviesContentBasedML();
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
</style>
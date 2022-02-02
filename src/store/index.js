// import { createApp } from 'vue'
import axios from 'axios'
import { createStore } from 'vuex'

// Create a new store instance.

const store = createStore({
  state () {
    return {
      count: 0,
      actorGraph: [{"query": "AQL Query for the current recommendation"}],
      recommendations: [{movie: 79132, title: "Inception", ratingSum : 158.5}],
      currentQuery: 0,
      queryInfo: [
        {
          "name": "Analytic Collaborative Filtering",
          "shortDescription": `A brief line about the recommendation method. 
An interesting fact that makes you want to cli...`,
          "description": `
          An in-depth description of analytic collaborative filtering. 

          How useful it is and why you would want to use it. 
          
          Also, some points for and against it. 
          
          Perhaps an image describing it as well.
          `,
          "queryName": "recommendMoviesCollaborativeFilteringAQL"
        },
        {
          "name": "2Analytic Collaborative Filtering",
          "shortDescription": `2A brief line about the recommendation method. 
An interesting fact that makes you want to cli...`,
          "description": `2
          An in-depth description of analytic collaborative filtering. 

          How useful it is and why you would want to use it. 
          
          Also, some points for and against it. 
          
          Perhaps an image describing it as well.
          `,
          "queryName": "recommendMoviesContentBasedML"
        },
        {
          "name": "3Analytic Collaborative Filtering",
          "shortDescription": `3A brief line about the recommendation method. 
An interesting fact that makes you want to cli...`,
          "description": `3
          An in-depth description of analytic collaborative filtering. 

          How useful it is and why you would want to use it. 
          
          Also, some points for and against it. 
          
          Perhaps an image describing it as well.
          `,
          "queryName": "recommendMoviesEmbeddingML"
        }
      ],
      topGenres: {},
      sortedGenres: [],
      selectedGenres: [],
      showLeftPanel: true,
      loadingData: false,
      user: 1,
      selectedRating: 0
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    }
  },
  actions : {
    recommendMoviesCollaborativeFilteringAQL({commit, state}) {
      commit('queryInfo', 0)
      axios({
        url: 'http://localhost:8529/_db/movie-demo/ml-demo',
        method: 'post',
        data: {
          query: `
          query {
            recommendMoviesCollaborativeFilteringAQL(userId: "User/${state.user}", similarUserLimit: ${25}, movieRecommendationLimit: ${100}) {
              movie {
                title
                posterPath
                overview
                genres
                voteAverage
              }
              score
            }
          }
          `
        }
      }).then((result) => {
        commit('loading', true);
        commit('userRecommendationUpdate', result.data.data.recommendMoviesCollaborativeFilteringAQL);
        commit('updateTopGenres', result.data.data.recommendMoviesCollaborativeFilteringAQL);
        // context.commit('updateGenres', [])
      })
      .then(() => {
        commit('loading', false);
      })
    },
    recommendMoviesContentBasedML({commit, state}, user) {
      
      commit('queryInfo', 1);
      axios({
        url: 'http://localhost:8529/_db/movie-demo/ml-demo',
        method: 'post',
        data: {
          query: `
          query {
            recommendMoviesContentBasedML(userId: "User/${state.user}", topRatedMovieLimit: 100, movieRecommendationLimit: 100) {
              movie {
                title
                posterPath
                overview
                genres
                voteAverage
              }
              score
            }
          }
          `
        }
      }).then((result) => {
        commit('loading', true);
        commit('userRecommendationUpdate', result.data.data.recommendMoviesContentBasedML, user ? user : '');
        commit('updateTopGenres', result.data.data.recommendMoviesContentBasedML);
      }).then(() => {
        commit('loading', false);
      })
    },
    recommendMoviesEmbeddingML({commit, state}, user) {
      commit('queryInfo', 2);
      axios({
        url: 'http://localhost:8529/_db/movie-demo/ml-demo',
        method: 'post',
        data: {
          query: `
          query {
            recommendMoviesEmbeddingML(userId: "User/${state.user}", topRatedMovieLimit: 100, movieRecommendationLimit: 100) {
              movie {
                title
                posterPath
                overview
                genres
                voteAverage
              }
              score
            }
          }
          `
        }
      }).then((result) => {
        commit('loading', true);
        commit('userRecommendationUpdate', result.data.data.recommendMoviesEmbeddingML, user ? user : '');
        commit('updateTopGenres', result.data.data.recommendMoviesEmbeddingML);
      }).then(() => {
        commit('loading', false);
      })
    },
    actorQuery(context) {
      axios({
        url: 'http://localhost:8529/_db/movie-demo/ml-demo',
        method: 'post',
        data: {
          query: `
          query {
            actorGraph(id: "Person/2911f9e2c86647e2fad007009b474dd8") {
              query,
              vertices{
                ... on Movie {
                movieID: id
                title
              }
              ... on Person {
                personID: id
                name
              }
                
              }
              edges {
                id
                from
                to
                rev
              }
              path {
              vertices{
                ... on Movie {
                movieID: id
                title
              }
              ... on Person {
                personID: id
                name
              }      
              }
            }
          }
            allMovies (limit: 2) {
              id 
              title
            }
          }
          `
        }
      }).then((result) => {
        context.commit('actorGraphUpdate', result)
      })
    },
    updateUser(context, user) {
      context.commit('loading', true);
      setTimeout(() => {

        context.commit('changeUser', user)
        context.state.queryInfo ? context.dispatch((context.state.queryInfo[context.state.currentQuery].queryName).toString(), user) : ''
      }, 1000)
      // context.commit('loading', false);
    },
  },
  mutations: {
    increment (state) {
      state.count++
    },
    loading (state, load) {
      state.loadingData = load;
    },
    updateGenres (state, genres) {
      state.selectedGenres = genres;
    },
    updateRating (state, rating) {
      state.selectedRating = rating;
      console.log(state.selectedRating)
    },
    toggleLeftPanel (state){
      state.showLeftPanel = !state.showLeftPanel
    },
    actorGraphUpdate (state, queryResult) {
      state.actorGraph =  queryResult.data.data.actorGraph
    },
    userRecommendationUpdate (state, queryResult) {
      state.selectedGenres = []
      state.sortedGenres = []
      // state.recommendations = [{}]
      state.recommendations =  queryResult
    },
    updateTopGenres(state, queryResult) {
      const genreCount = {}
      let sorted = []
      queryResult.forEach(element => {
        element.movie.genres.forEach(g => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        })
        sorted = Object.keys(genreCount)
                        .sort(function(a,b) {
                          return genreCount[b] - genreCount[a]
                        });                          
                        });
        

        state.sortedGenres = [];
        sorted.forEach( s => {
          state.sortedGenres.push([s, genreCount[s]]);
          }
        )
    },
    queryInfo(state, currentQuery) {
      state.currentQuery = currentQuery;
      
    },
    changeUser(state, user) {
      state.user = user;
    }
  }
});

export default store;
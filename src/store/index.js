// import { createApp } from 'vue'
import axios from 'axios'
import { createStore } from 'vuex'

// Create a new store instance.

const store = createStore({
  state () {
    return {
      APIURL: "http://localhost:8080",
      APIUSERNAME: 'recommend',
      APIPASSWORD: 'recommend',
      APIRESPONSE: 0,
      count: 0,
      recommendations: [{movie: 79132, title: "Inception", ratingSum : 158.5}],
      currentQuery: 0,
      queryInfo: [
        {
          "name": "",
          "shortDescription": ``,
          "description": ``,
          "aqlQuery":"",
          "queryName": ""
        },
      ],
      topGenres: {},
      sortedGenres: [],
      selectedGenres: [],
      selectedLanguages: [],
      showLeftPanel: true,
      loadingData: false,
      user: 1,
      selectedRating: 0,
      languages: [],
      openExplainer: false,
      explainerMovie: 'Movie/False',
      explainerResult: []
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    }
  },
  actions : {
    recommendMoviesAction({commit, state}, data) {
      commit('loading', true);
      commit('queryInfo', data.index);
      axios({
        url: `${state.APIURL}`,
        auth: {
          username: state.APIUSERNAME,
          password: state.APIPASSWORD
        },
        method: 'post',
        data: {
          query: `
          query {
            ${data.query}(userId: "User/${state.user}", expansionLimit: 100, movieRecommendationLimit: 100) {
              movie {
                title
                posterPath
                overview
                genres
                voteAverage
                originalLanguage
                movieId: id
                tmdbId
              }
              score
            }
          }
          `
        }
      }).then((result) => {
        commit('userRecommendationUpdate', result.data.data[data.query], data.user ? data.user : '');
      })
      .then(() => {
        commit('updateTopGenres');
      })
      .then(() => {
        commit('updateAvailableLanguages');
        commit('getPosters');
      })
      .then(() => {
            commit('loading', false);        
      }).catch(e => {
        state.APIRESPONSE = e.response.status
      })
    },
    updateUser(context, user) {
      context.commit('loading', true);        
        context.commit('changeUser', user)
        context.state.queryInfo ? context.dispatch('recommendMoviesAction', {query: context.state.queryInfo[context.state.currentQuery].recommend.toString(), user: user, index: context.state.currentQuery}) : ''
        context.commit('loading', false);        
    },
    updateSelectedLanguagesAction(context, langs) {
      context.commit('updateSelectedLanguages', langs)
    },
    explainerAction({commit, state}, movieId) {
      commit('loading', true)

      state.openExplainer == true ? commit("toggleExplainer") : (
        commit("explainerQueryMutation", movieId),
          // commit("updateExplainerResult",state.result.data.data['explainRecommendMoviesEmbeddingML']),
        commit("toggleExplainer")
        // commit("updateExplainerResult", result.data.data[(state.queryInfo[state.currentQuery].queryName).toString()])
        )
          commit('loading', false);
    },
    async setAPIURL({commit, dispatch,state}, APIDATA) {
      await commit('setCredentials', APIDATA);
      await commit('updateAPIURL', APIDATA.API_URL);
      axios({
        url: `${state.APIURL}`,
        auth: {
          username: state.APIUSERNAME,
          password: state.APIPASSWORD
        },
        method: 'post',
        data: {
          query: `
          query {
            allModels {
              name
              description
              query
              components
              notebook
              recommend
              explain
              label
              resources {
                url
                description
                title
                image
              }
            }
          }
          `}
    }).then(async (result) => {
      state.queryInfo = result.data.data.allModels
      state.APIRESPONSE = result.status;
    })
    .then(async () => {
      
      await dispatch('recommendMoviesAction', {query: state.queryInfo[0].recommend.toString(), user: 0, index: 0})
      commit('loading', false)
    })
    .catch(e => {
      commit('loading', false)
      state.APIRESPONSE = e.response.status
    })
      
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    loading (state, load) {
      if (load == false) {
        setTimeout(() => {
        state.loadingData = load;
      }, 500)
    } else {
      state.loadingData = load;
    }
    },
    updateGenres (state, genres) {
      state.selectedGenres = genres;
    },
    updateSelectedLanguages (state, langs) {
      state.selectedLanguages = langs.length > 0 ? langs : [];
    },
    updateAvailableLanguages (state) {
      let langs = new Set();
      state.recommendations.forEach(l => {
        langs.add(l.movie.originalLanguage)
      })     
      state.languages = [...langs]
    },
    updateRating (state, rating) {
      state.selectedRating = rating;
    },
    toggleLeftPanel (state){
      state.showLeftPanel = !state.showLeftPanel
    },
    userRecommendationUpdate (state, queryResult) {
      state.selectedGenres = []
      state.sortedGenres = []
      state.selectedLanguages =[]
      // state.recommendations = [{}]
      state.recommendations =  queryResult
    },
    updateTopGenres(state) {
      const genreCount = {}
      let sorted = []
      state.recommendations.forEach(element => {
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
      state.selectedRating = 0;
    },
    updateExplainerResult(state, result) {
      state.explainerResult = result
    },
    explainerQueryMutation(state, movieId) {
      state.explainerMovie = movieId;
      let explainMethod = state.queryInfo[state.currentQuery].explain.toString()
        axios({
          url: `${state.APIURL}`,
                  auth: {
          username: state.APIUSERNAME,
          password: state.APIPASSWORD
        },
          method: 'post',
          data: {
            query: `
            query {
              ${explainMethod} (pathLimit: 7, movieId: "${movieId}", userId: "User/${state.user}") {
                vertices {
                  ...on Movie {
                    movieId: id
                    title
                    overview
                    genres
                    posterPath
                  }
                  ...on User {
                    name
                    userId: id                    
                  }
                }
                edges {
                  id
                  source: from
                  target: to
                  distance
                }
              }
            }
            `
          }
        }).then((result) => {
          state.explainerResult = result.data.data[explainMethod]
        }).catch(e => {
          state.APIRESPONSE = e.response.status
        })
    },
    toggleExplainer(state) {
      state.openExplainer = !state.openExplainer;
    },
    updateAPIURL(state, url) {
      state.APIURL = url;
    },
    getPosters(state) {
      state.recommendations.forEach((m, i) => {
        axios({
        url: `https://api.themoviedb.org/3/movie/${m.movie.tmdbId}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US`,
        method: 'get'
        })
        .then((result) => {
          state.recommendations[i].movie.posterPath = "https://image.tmdb.org/t/p/w500/" + result.data.poster_path
        })
      })
  },
  async updateRecommendationDescriptions(state) {
    axios({
      url: `${state.APIURL}`,
      auth: {
        username: state.APIUSERNAME,
        password: state.APIPASSWORD
      },
      method: 'post',
      data: {
        query: `
        query {
          allModels {
            name
            description
            query
            components
            notebook
            recommend
            explain
            label
            resources {
              url
              description
              title
              image
            }
          }
        }
        `}
      })
      .then((result) => {
        state.queryInfo = result.data.data.allModels
      })
  },
  async setCredentials(state, APIDATA) {
    state.APIUSERNAME = APIDATA.API_USERNAME;
    state.APIPASSWORD = APIDATA.API_PASSWORD;
  }
}
});

export default store;
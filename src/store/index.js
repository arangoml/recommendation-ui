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
          "name": "AQL Collaborative Filtering",
          "shortDescription": `Recommendation using collaborative filtering implemented in AQL....`,
          "description": `
          Recommendation using collaborative filtering implemented in AQL.  
          The algorithm computes recommendations dynamically given a User ID (user-a).  
          
          The query traverses from  user-a through rating edges to movies and then back to the 
          other users uses and uses Cosine Simularity to determine the N most similar users (similar-group) to user-a.  
          
          Then the query traverses from the similar-group to through rate edges to movies to identify to identify the 
          most highly rated movies of the similarity-group that have not been rated by user-a and returns this list as the recommendation.
          `,
          "aqlQuery":"<p>  WITH Movie, User, rates  LET similarUsers =  (FOR movie, edge IN 1 OUTBOUND @userId rates // eg. userid = Users/1 GRAPH 'movie-knowledge-graph'  LET userA_ratings = edge.rating //TO_NUMBER(edge.ratings)  FOR userB, edge2 IN 1..1 INBOUND movie rates  FILTER userB._id != @userId  LET userB_ratings = edge2.rating //TO_NUMBER(edge2.ratings)  COLLECT userids=userB._id INTO g KEEP userB_ratings, userA_ratings  LET userA_len = SQRT(SUM (FOR r IN g[*].userA_ratings RETURN r*r))  LET userB_len = SQRT(SUM (FOR r IN g[*].userB_ratings RETURN r*r))  LET dot_product = SUM (FOR n IN 0..(LENGTH(g[*].userA_ratings) - 1) RETURN g[n].userA_ratings * g[n].userB_ratings)  LET cos_sim = dot_product/ (userA_len * userB_len)  SORT cos_sim DESC LIMIT @similarUserLimit  RETURN {userBs: userids,  cosine_similarity: cos_sim}  )  LET userA_RatedMovies = (FOR movie, edge IN 1..1 OUTBOUND @userId rates RETURN movie._key)  FOR userB in similarUsers  FOR movie ,ratesEdge IN 1..1 OUTBOUND userB.userBs rates   FILTER movie._key NOT IN userA_RatedMovies  COLLECT userA_UnratedMovie = movie  AGGREGATE ratingSum = SUM(ratesEdge.rating)   SORT ratingSum DESC  LIMIT ${movieRecommendationLimit}  RETURN {movie: userA_UnratedMovie, score : ratingSum}</p>",
          "queryName": "recommendMoviesCollaborativeFilteringAQL"
        },
        {
          "name": "Content Based ML Recommendations",
          "shortDescription": `This is an implementation of content-based recommendation.  The model uses TFIDF to compute similarity between....`,
          "description": `
          This is an implementation of content-based recommendation.  The model uses TFIDF to compute similarity between movies.

          An AQL query concatenates the  movie title, tagline, and overview from each movie from the Movie Knowledge Graph for machine learning.  The similarity between each movie is computed using TFIDF and FAISS to compute the top movie similarities.

          The movie similarities are communicated as inferences to the Movie Knowledge Graph as similar movie edges with a similarity score.  An AQL query then finds the most highly rated movies by the given user (user-a) and then uses the movie similarity inference to compute the set of movies most like the highest rated movies from user-a.
          `,
          "aqlQuery":`<p>/*<br>
          This query uses the embedding inference computed using ML and transferred to ArangoDB in similarMovie_Embedding_Inference<br>
          The query works as follows:<br>
          Given a user, what movies are similar to the user's highest rated (topRatedLimit) movies and return the most similar movies the user has not rated.<br>
          */</p>
          
          <p>LET userRatedMovies = (FOR ratingEdge IN rates FILTER ratingEdge._from == @userId SORT ratingEdge.rating DESC RETURN PARSE_IDENTIFIER(ratingEdge._to).key)<br>
           FOR ratingEdge IN rates <br>
           FILTER ratingEdge._from == @userId<br>
           SORT ratingEdge.rating DESC <br>
           LIMIT @topRatedMovieLimit <br>
           FOR similarMovieEdge IN similarMovie_Embedding_Inference<br>
           FILTER similarMovieEdge._from == ratingEdge._to<br>
           LET similarMovie = similarMovieEdge._to<br>
           FILTER similarMovie NOT IN userRatedMovies //Don't recommend movies already rated<br>
           //compound score is user rating factor / distance - talk to data scientist on how to do this in amore scientific way<br>
           LET compoundScore = (ratingEdge.rating/5.0)/similarMovieEdge.distance<br>
           //Aggregate ratings for duplicate similar movies<br>
           COLLECT recommendedMovie = similarMovie AGGREGATE aggregateScore = MAX(compoundScore)<br>
           SORT aggregateScore DESC<br>
           FILTER DOCUMENT(recommendedMovie)!=null//Temp Work-around while determine cause of nulls<br>
           LIMIT @movieRecommendationLimit<br>
           RETURN {movie : DOCUMENT(recommendedMovie) , score : aggregateScore}</p>`,
          "queryName": "recommendMoviesContentBasedML"
        },
        {
          "name": "ML Embeddings Recommendation",
          "shortDescription": `This is an implementation using matrix factorization. The model uses Matrix Factorization to compute similarity...`,
          "description": `
          This is an implementation using matrix factorization. The model uses Matrix Factorization to compute similarity between movies and similarity between users.
          
          An AQL query retrieves user ratings on movies from the Movie Knowledge Graph for machine learning.The similarity between each movie is computed using Matrix Factorization and FAISS to compute the top movie similarities.  The movie similarities are communicated as inferences to the Movie Knowledge Graph as similar movie edges with a similarity score.

          An AQL query then finds the most highly rated movies by the given user (user-a) and then uses the movie similarity inference to compute the set of movies most like the highest rated movies from user-a.
          `,
          "aqlQuery":"<p>  WITH Movie, User, rates  LET similarUsers =  (FOR movie, edge IN 1 OUTBOUND @userId rates // eg. userid = Users/1 GRAPH 'movie-knowledge-graph'  LET userA_ratings = edge.rating //TO_NUMBER(edge.ratings)  FOR userB, edge2 IN 1..1 INBOUND movie rates  FILTER userB._id != @userId  LET userB_ratings = edge2.rating //TO_NUMBER(edge2.ratings)  COLLECT userids=userB._id INTO g KEEP userB_ratings, userA_ratings  LET userA_len = SQRT(SUM (FOR r IN g[*].userA_ratings RETURN r*r))  LET userB_len = SQRT(SUM (FOR r IN g[*].userB_ratings RETURN r*r))  LET dot_product = SUM (FOR n IN 0..(LENGTH(g[*].userA_ratings) - 1) RETURN g[n].userA_ratings * g[n].userB_ratings)  LET cos_sim = dot_product/ (userA_len * userB_len)  SORT cos_sim DESC LIMIT @similarUserLimit  RETURN {userBs: userids,  cosine_similarity: cos_sim}  )  LET userA_RatedMovies = (FOR movie, edge IN 1..1 OUTBOUND @userId rates RETURN movie._key)  FOR userB in similarUsers  FOR movie ,ratesEdge IN 1..1 OUTBOUND userB.userBs rates   FILTER movie._key NOT IN userA_RatedMovies  COLLECT userA_UnratedMovie = movie  AGGREGATE ratingSum = SUM(ratesEdge.rating)   SORT ratingSum DESC  LIMIT ${movieRecommendationLimit}  RETURN {movie: userA_UnratedMovie, score : ratingSum}</p>",
          "queryName": "recommendMoviesEmbeddingML"
        }
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
      explainerResult: []
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    }
  },
  actions : {
    recommendMoviesCollaborativeFilteringAQL({commit, state}) {
      commit('loading', true);
      commit('queryInfo', 0)
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
            recommendMoviesCollaborativeFilteringAQL(userId: "User/${state.user}", similarUserLimit: ${25}, movieRecommendationLimit: ${100}) {
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
        commit('userRecommendationUpdate', result.data.data.recommendMoviesCollaborativeFilteringAQL);
        // context.commit('updateGenres', [])
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
    recommendMoviesContentBasedML({commit, state}, user) {
      commit('loading', true);
      
      commit('queryInfo', 1);
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
            recommendMoviesContentBasedML(userId: "User/${state.user}", topRatedMovieLimit: 100, movieRecommendationLimit: 100) {
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
        commit('userRecommendationUpdate', result.data.data.recommendMoviesContentBasedML, user ? user : '');        
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
    recommendMoviesEmbeddingML({commit, state}, user) {
      commit('loading', true);
      commit('queryInfo', 2);
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
            recommendMoviesEmbeddingML(userId: "User/${state.user}", topRatedMovieLimit: 100, movieRecommendationLimit: 100) {
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
        commit('userRecommendationUpdate', result.data.data.recommendMoviesEmbeddingML, user ? user : '');

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
        context.state.queryInfo ? context.dispatch((context.state.queryInfo[context.state.currentQuery].queryName).toString(), user) : ''
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
      await commit('setCredentials', APIDATA)
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
            allMovies (limit: 1) {
              id
            }
          }
          `
      }
    }).then((result) => {
      state.APIRESPONSE = result.status;
      state.APIRESPONSE == 200 ? commit('updateRecommendationDescriptions') : commit('loading', false)
      state.APIRESPONSE == 200 ? dispatch('recommendMoviesContentBasedML') : commit('loading', false)

    })
    .then(() => {
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
      let explainMethod = "explain" + ((state.queryInfo[state.currentQuery].queryName).toString()[0].toUpperCase()+(state.queryInfo[state.currentQuery].queryName).toString().slice(1))
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
              ${explainMethod} (pathLimit: 12, movieId: "${movieId}", userId: "User/${state.user}") {
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
          }
        }
        `}
      })
      .then((result) => {
        state.queryInfo.forEach((x, i) => {
          
          result.data.data.allModels.forEach((m) => {
            m.name == x.queryName ? (
              state.queryInfo[i].description = m.description, 
              state.queryInfo[i].aqlQuery = m.query, 
              state.queryInfo[i].components = m.components,
              state.queryInfo[i].notebook = m.notebook
              ) : ''
          })
        })
      })
  },
  async setCredentials(state, APIDATA) {
    state.APIUSERNAME = APIDATA.API_USERNAME;
    state.APIPASSWORD = APIDATA.API_PASSWORD;
  }
}
});

export default store;
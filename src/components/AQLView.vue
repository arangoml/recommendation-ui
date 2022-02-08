<template>
  <div class="p-jc-left">
    <h2>AQL</h2> 
  <div class="p-jc-left">
    <p>Expand to see full query </p>
    <transition name="fade-from-top">
    <div class="p-grid p-jc-center aql-code" v-show="expanded">
      <pre>
        <code>
        {{
          aql
        }}
        </code>
                <code>
        {{
          aql
        }}
        </code>
      </pre>
      
      <div class="aql-details p-row-1">
      <p>Here are all of the queries we are using.</p>
      <p>As you expand them the panel to the right will explain more about the relevant Machine Learning concepts.</p>
      </div>
    </div>
  </transition>
  </div>
  </div>
</template>

<script>

export default {
  name: "aql",
  data() {
    return {
      aql: `        
WITH Movie, User, rates
LET similarUsers =
  (FOR movie, edge IN 1 
  OUTBOUND @userId  rates  
  // eg. userid = Users/1 
  GRAPH 'movie-knowledge-graph'
      LET userA_ratings = edge.rating
      FOR userB, edge2 IN 1..1 
      INBOUND movie rates
          FILTER userB._id != @userId
          LET userB_ratings = edge2.rating 
          COLLECT userids=userB._id INTO g KEEP userB_ratings, userA_ratings
          LET userA_len = SQRT(SUM (FOR r IN g[*].userA_ratings RETURN r*r))
          LET userB_len = SQRT(SUM (FOR r IN g[*].userB_ratings RETURN r*r))
          LET dot_product = SUM (
            FOR n IN 0..(
              LENGTH(g[*].userA_ratings) - 1) 
              RETURN g[n].userA_ratings * g[n].userB_ratings)
          LET cos_sim = dot_product/ (userA_len * userB_len)
          SORT cos_sim DESC LIMIT @similarUserLimit
          RETURN {userBs: userids,
                cosine_similarity: cos_sim}
  )

LET userA_RatedMovies = (FOR movie, edge IN 1..1 
OUTBOUND @userId rates 
RETURN movie._key)

FOR userB in similarUsers
  FOR movie ,ratesEdge IN 1..1 OUTBOUND userB.userBs rates 
      FILTER movie._key NOT IN userA_RatedMovies
      COLLECT userA_UnratedMovie = movie
      AGGREGATE ratingSum = SUM(ratesEdge.rating)  
      SORT ratingSum DESC
      LIMIT @movieRecomendationLimit
      RETURN  {movie: userA_UnratedMovie, score : ratingSum} 
          `
    }
  },
  methods: {
  },
  created: function() {
  },
  props: {
    expanded: {
        type: Boolean,
        default: false
    }
  }
}
</script>

<style scoped>
pre {
      white-space: pre-wrap; /* CSS3 */
}
</style>
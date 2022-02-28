<template>
  <div v-show="openExplainer" id="parent-grid" class="explainer p-grid">
      <div class="p-col-12">
        <Button class="closeButton" @click="toggleExplainer()">CLOSE</Button>
        <Button class="getDataButton" @click="setupVisualization()">Load The Graph</Button>
        </div>
      <div id="explainerQuery">{{ clickedNode }}</div>
      <div id="cy"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import cytoscape from 'cytoscape';
// import { nextTick } from 'vue';


export default {
  name: "explainer",
    data(){
      return {
        initial: 0,
        cy: {},
        clickedNode: {},
        graphNodes:[],
        graphEdges:[],
        layout: {
          name: 'cose',
          edgeElasticity: function( edge ){ edge ? '' : ''; return 128; },
          componentSpacing: 80,
          },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#88a049',
              'label': 'data(label)',
              'font-size': '5',
              'width': '7',
              'height': '7',
              'color': '#faf8f0'
              
            }
            },
            {
            selector: '.userVertex', // but this does,
            style: {
              // 'label': 'data(label)',
              'background-color': 'blue'
              }
            },
            {

            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              'line-color': '#5e3108',
              'target-arrow-color': '#464646',
              'target-arrow-shape': 'triangle',
              'arrow-scale': '.5',
              'width': '1',
              'label': 'Distance: 2.0',
              'font-size': '2',
              'text-rotation': 'autorotate',
              'color': '#faf8f0',
            }
              }
          ]

    }
    },
    computed: {
    ...mapState({
        openExplainer: state => state.openExplainer,
        explainerResult: state => state.explainerResult
    }),
    },
    methods: {
        ...mapActions({
        toggleExplainer: 'explainerAction'
        }),
        async setupVisualization() {
          this.cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
            layout: this.layout,
            style: this.style
          })

            await this.explainerResult.forEach((path) => {
              let vObj = {data:{}}
              let eObj = {data:{}}
        path.vertices.forEach((vert) => {
          vert.id = vert.movieId ? vert.movieId : vert.userId
          vert.movieId ? '' : vObj.classes = 'userVertex'
          // vert.classes = (vert.movieId ? '' : 'userVertex')
          // vert.movieId ? '' : vert.classes
          vert.label = vert.id
          Object.assign(vObj['data'],vert)
          this.graphNodes.push(vObj)
          vObj = {data:{}}
        })
        path.edges.forEach((edge) => {
          edge.label = ("_from:" + edge.source + " _to:" + edge.target).toString()
          Object.assign(eObj['data'],edge)
          this.graphEdges.push(eObj)
          eObj = {data:{}}
        })
      })
          this.graphNodes != undefined ? (
            this.cy.json({
              elements: {
                nodes: this.graphNodes,
              edges: this.graphEdges
            }
          })) : ''
          this.cy.layout(this.layout).run();
      this.cy.bind('click', 'node', function(evt) {
        console.log(evt)
        console.log(this.cy.json)
        
      })
      }
    },
    async updated() {
      this.initial == 0 ? await this.setupVisualization() : ''
      this.initial = 1;
      },
    async mounted() {
      await this.setupVisualization();
    },
    


}
</script>

<style scoped>
.explainer {
    width: 80vw;
    height: 80vh;
    z-index: 2;
    position: absolute;
    top: 10vh;
    left: 10vw;
    background-color: gray;
    animation: showExplainer .25s;
}
@keyframes showExplainer {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.closeButton {
    top: 0;
    left: 40vw;
}
.getDataButton {
    top: 0;
}
#cy {
  display: grid;
  border: 2px blue solid;
  height: 90%;
  width: 80%;
  text-align: left;
  margin: auto;
  display: block;
  margin-right: 1vw;

}

</style>
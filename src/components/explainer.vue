<template>
<div>
  <div v-show="openExplainer" id="parent-grid" :class="openExplainer ? '' : 'closedExplainer'" class="explainer p-grid">
      <div class="p-col-12">
        <Button class="closeButton" @click="toggleExplainer()">CLOSE</Button>
        <Button class="getDataButton" @click="setupVisualization()">Load The Graph</Button>
        </div>
      <div class="p-col-2" id="explainerQuery">
        <h2>Selected {{ clickedNode.data ? "Node" : "Edge" }}</h2>
        <p class="selectedInfo" v-for="item, i in (clickedNode.data ? clickedNode.data : clickedEdge.data)" v-bind:key="i">
          {{ item }}
        </p>
        
        </div>
      <div class="p-col-8" id="cy"></div>
        
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import cytoscape from 'cytoscape';
import { nextTick } from '@vue/runtime-core';
// import { nextTick } from 'vue';


export default {
  name: "explainer",
    data(){
      return {
        initial: 0,
        cy: {},
        clickedNode: {},
        clickedEdge: {},
        connectedEdges: {},
        connectedNodes: {},
        displayConnectedNodes: [],
        highlightedEdge: {},
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
              'font-size': '3',
              'width': '7',
              'height': '7',
              'color': '#faf8f0'
              
            }
            },
            {
            selector: '.userVertex', // but this does,
            style: {
              // 'label': 'data(label)',
              'background-color': '#cc8e39'
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
    watch: {
      'explainerResult'() {
        this.setupVisualization();
      }
    },
    methods: {
        ...mapActions({
        toggleExplainer: 'explainerAction'
        }),
        async setupVisualization() {
          this.cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
            wheelSensitivity: 0.25,
            layout: this.layout,
            style: this.style
          })

            await this.explainerResult.forEach((path, pi) => {
              let vObj = {data:{}}
              let eObj = {data:{}}
          path.vertices.forEach((vert) => {
            if(vert != null) {

              vert.id = vert.movieId ? vert.movieId : vert.userId
            vert.movieId ? '' : vObj.classes = 'userVertex'
            vert.label = vert.title ? vert.title : vert.id
            
            Object.assign(vObj['data'],vert)
            this.graphNodes.push(vObj)
            vObj = {data:{}}
            vObj.path = pi;
          }
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

          this.cy.bind('click', 'node', (evt) => {
            this.highlightedEdge[0] ? this.highlightedEdge.animate({
              style: this.style.find(x => x.selector == 'edge').style
            }) : ''

            
            this.connectedEdges[1] ? this.connectedEdges.animate({
              style: this.style.find(x => x.selector == 'edge').style
            }) : ''
            this.clickedEdge = {};
            this.clickedNode = this.graphNodes.find(x => x.data.id == evt.target.id());

            this.connectedEdges = evt.target.connectedEdges();
            this.connectedEdges.animate({
              style: {lineColor: '#86943f'}
            })            
          })
          this.cy.bind('click', 'edge', (evt) => {
            this.highlightedEdge[0] ? this.highlightedEdge.animate({
              style: this.style.find(x => x.selector == 'edge').style
            }) : ''
            this.connectedEdges[1] ? this.connectedEdges.animate({
              style: this.style.find(x => x.selector == 'edge').style
            }) : ''            
            this.clickedNode = {};
            this.clickedEdge = this.graphEdges.find(x => x.data.id == evt.target.id())
            evt.target.animate({
              style: {"line-color": "#86943f"}
            })
            this.highlightedEdge = evt.target;
            this.connectedNodes = evt.target.connectedNodes();
            
          })
          this.cy.on('click', function(event){
            // target holds a reference to the originator
            // of the event (core or element)
            var evtTarget = event.target;

            if( evtTarget === this.cy ){
              console.log('tap on background');
              this.resetSelectionStyling();
            }
          });
            await nextTick(() => {
              this.cy.layout(this.layout).run();
            })
      },
      resetSelectionStyling() {
        this.highlightedEdge[0] ? this.highlightedEdge.animate({
            style: this.style.find(x => x.selector == 'edge').style
          }) : ''

          
        this.connectedEdges[1] ? this.connectedEdges.animate({
            style: this.style.find(x => x.selector == 'edge').style
          }) : ''

        this.clickedEdge = {};
        this.clickedNode = {};
      }
    },
}
</script>

<style lang="scss" scoped>
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
.closedExplainer {
  animation: showExplainer .2s;
  animation-direction: reverse;
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
  border: 2px var(--arangodb-button-color-primary-a) solid;
  height: 90%;
  width: 80%;
  text-align: left;
  margin: auto;
  display: block;
  margin-right: 1vw;

}
#explainerQuery {
  border: 2px var(--arangodb-button-color-primary-a) solid;
  height: 90%;
  margin: auto;
  display: block;
  // width: 80%;  
}

.selectedInfo {
  overflow-wrap: break-word;
}

</style>
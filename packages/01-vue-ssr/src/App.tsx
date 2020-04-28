import {Component} from "vue-tsx-support";
import { VNode } from 'vue';

export default class App extends Component<any>{
  redner():VNode{
      return (
          <div id='#app'>
              <router-view/>
          </div>
      )
  }
}
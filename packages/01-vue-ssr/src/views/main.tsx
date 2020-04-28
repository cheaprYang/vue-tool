import {Component} from "vue-tsx-support";
import { VNode } from 'vue';

export default class Main extends Component<any>{
    redner():VNode{
        return (
            <div >
                Main
            </div>
        )
    }
}
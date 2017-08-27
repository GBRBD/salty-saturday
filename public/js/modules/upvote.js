import axios from 'axios';
import {$} from './bling'


function ajaxUpvote(e) {
    e.preventDefault();

    axios
    .post(this.action)
    .catch(console.error);
}

export default ajaxUpvote;
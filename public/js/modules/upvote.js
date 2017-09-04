import axios from 'axios';
import { $ } from './bling'

const counter = $('#upvote-number')

$('#upvote').on('click', () => {
    const id = window.location.href.split("/").pop()
    axios.post(`/api/stories/${id}/upvote`)
    .then((response) => {
        counter.textContent = response.data.upvotes.length
    })
    .catch(function (error) {
        console.log(error)
    })
})

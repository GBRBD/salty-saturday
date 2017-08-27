/**
 * Comment section root js
 */

import Vue from 'vue';

import comment from './components/wrapper.vue'

const app = new Vue({
    el: '#comment-root',
    components: { comment }
});

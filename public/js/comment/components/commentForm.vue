<template lang="pug">
	form(v-on:submit.prevent="onSubmit")
		textarea(
			placeholder="Say something ..."
			v-model.trim="comment"
			@keyup="setNumberOfCharacters")
		input(
			type="submit" 
			value="Set sail for adventure!")
		p Characters left: {{ charactersLeft }}
</template>

<script>
// TODO: handling whitespaces

import axios from 'axios'

export default {
	props: ['story'],
	data () {
		return {
			numberOfCharacters: 0,
			comment: ''
		}
	},
	computed: {
		charactersLeft: function () {
			return 500 - this.numberOfCharacters
		}
	},
	methods: {
		setNumberOfCharacters: function (event) {
			this.numberOfCharacters = event.currentTarget.value.length
		},
		onSubmit: function () {
			
			if (this.comment.length == 0) return;

			const self = this;

			axios.post(`/api/stories/${this.story}/addcomment`, {
				text: this.comment
			})
			.catch(function (error) {
				console.log(error);
			});
			
			this.comment = '';
			this.numberOfCharacters = 500;

		},
	}
}
</script>

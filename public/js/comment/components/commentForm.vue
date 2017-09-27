<template lang="pug">
	.comment-form
		img(v-bind:src="photo")
		form.form(v-on:submit.prevent="onSubmit")
			.form__elem
				textarea(
					placeholder="Say something ..."
					v-model.trim="comment"
					@keyup="setNumberOfCharacters")
			button(type="submit" class="button green-button")
				i.fa.fa-send
			p Characters left: {{ charactersLeft }}
</template>

<script>
// TODO: handling whitespaces

import axios from 'axios'

export default {
	props: ['story'],
	data () {
		return {
			photo: '',
			numberOfCharacters: 0,
			comment: ''
		}
	},
	created () {
		this.photo = '/uploads/' + $('#comment-root').attr('data-user')
		console.log(this.photo)
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

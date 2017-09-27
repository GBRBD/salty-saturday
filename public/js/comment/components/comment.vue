<template lang="pug">
	.comment__inner
		img(v-bind:src="photo")
		.comment__inner__content
			a(v-bind:href="slug") {{ data.user.username }}
			span i &#9679; {{ time }}
			p {{ data.text }}
		
</template>

<script>

import moment from 'moment'

export default {
	props: ['data'],
	data () {
		return {
			photo: '',
			slug: '',
			time: '',
		}
	},
	created () {
		this.photo = '/uploads/' + this.data.user.photo || 'salt.jpeg'
		this.slug = '/u/' + this.data.user.slug
		this.time = moment(this.data.created).fromNow()
	},
	method: {
	}
}

</script>

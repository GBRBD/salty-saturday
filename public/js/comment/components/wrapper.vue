<template lang="pug">
	.comment-feed-root
		commentForm(v-bind:story="id")
		.comments(v-for="comment in comments")
			comment(v-bind:data="comment")
</template>

<script>

import axios from 'axios'
import moment from 'moment'

import commentForm from './commentForm.vue'
import comment from './comment.vue'

export default {
	data () {
		return {
			id: '',
			comments: [],
			lastUpdate: '',
			pollTime: 50000
		}
	},
	components: {
		commentForm,
		comment
	},
	created: function () {
		this.id = window.location.href.split("/").pop()
		this.initComments()
		this.poll()
		this.heartbeat()
	},
	methods: {
		setLastUpdate: function () {
			this.lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
		},
		initComments: function () {
			
			const self = this;

			this.setLastUpdate()

			axios.get(`/api/stories/${this.id}/getcomments/`)
			.then(function (response) {
				self.comments = response.data.comments
			})
			.catch(function (error) {
				console.log(error)
			})

		},
		heartbeat: function () {
			// TODO: check if heartbeat is required
			setInterval(() => {
				axios.post(`/api/stories/polling/${this.story}/heartbeat`, {})
				.catch(function (error) {
					console.log(error)
				})
			}, this.pollTime - 1000)
		},
		poll: function () {
			const self = this;
			const axiosPoll = axios.create({
				timeout: self.pollTime
			})
			axiosPoll.get(`/api/stories/polling/${this.id}`)
			.then(function(response) {
				if (response.data.comment._id) { // if we have a new message
					self.comments.unshift(response.data.comment)
				}
				self.poll()
			})
		}
	}
}
</script>

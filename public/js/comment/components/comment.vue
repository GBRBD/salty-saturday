<template lang="pug">
	.foo
		p {{ data.text }}
		
</template>

<script>

import moment from 'moment'

export default {
	props: ['data'],
	data () {
		return {}
	},
	method: {
	}
}

</script>

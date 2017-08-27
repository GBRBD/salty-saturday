<template lang="pug">
  .comment-section-wrapper
    form(v-on:submit.prevent="onSubmit")
      textarea(
        placeholder="Say something ..."
        v-model.trim="comment"
        @keyup="setNumberOfCharacters")
      input(
        type="submit" 
        value="Set sail for adventure!" 
        v-bind:disabled="submitShow")
      p Characters left: {{ charactersLeft }}
</template>

<script>
// TODO: handling whitespaces

export default {
  data () {
    return {
      numberOfCharacters: 0,
      comment: ''
    }
  },
  computed: {
    charactersLeft: function () {
      return 500 - this.numberOfCharacters
    },
    submitShow: function () {
      return this.numberOfCharacters < 3
    }
  },
  methods: {
    setNumberOfCharacters: function (event) {
      this.numberOfCharacters = event.currentTarget.value.length
    },
    onSubmit: function () {
      
      this.comment = '';
    }
  }
}
</script>

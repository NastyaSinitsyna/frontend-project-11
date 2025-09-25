import axios from 'axios'
import parse from './parse.js'

export default (feedUrl, state) => {
  return axios.get('https://allorigins.hexlet.app/get', {
    params: {
      disableCache: true,
      url: feedUrl,
    },
  })
    .then((response) => {
      // console.log('Axios response:', response)
      const doc = parse(response.data.contents, 'application/xml')
      if (doc.querySelector('parsererror')) {
        throw new Error('Invalid RSS format')
      }
      const posts = [...doc.querySelectorAll('item')].map(post => ({
        title: post.querySelector('title').textContent,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
        feedId: (state.feeds.find(feed => feed.feedUrl === feedUrl)).feedId,
        postId: post.querySelector('link').textContent.replace(/\W+/g, '_'),
      }))
      state.posts.push(...posts)
      console.log(state)
      return posts
    })
}

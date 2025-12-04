import axios from 'axios'
import parse from './parse.js'
import _ from 'lodash'

const getPosts = (feedUrl, state) => {
  return axios.get('https://allorigins.hexlet.app/get', {
    params: {
      disableCache: true,
      url: feedUrl,
    },
  })
    .then((response) => {
      state.process = 'success'
      const { feedData, postsData } = parse(response.data.contents, 'text/xml')
      const currentFeed = {
        ...feedData,
        feedUrl: feedUrl,
        feedId: _.uniqueId(),
      }
      if (!state.feeds.find(stateFeed => stateFeed.feedUrl === currentFeed.feedUrl)) {
        state.feeds.push(currentFeed)
      }

      const posts = postsData.map(post => ({
        ...post,
        feedId: currentFeed.feedId,
      }))
      posts.forEach((post) => {
        if (!state.posts.find(statePost => statePost.postId === post.postId)) {
          state.posts.push(post)
        }
      })
      return state
    })
}

export default getPosts

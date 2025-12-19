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
      const { feedData, postsData } = parse(response.data.contents, 'text/xml')
      const currentFeed = {
        ...feedData,
        feedUrl: feedUrl,
        feedId: _.uniqueId(),
      }
      const hasFeed = state.feeds.some(stateFeed => stateFeed.feedUrl === currentFeed.feedUrl)
      if (!hasFeed) {
        state.feeds.push(currentFeed)
      }

      const posts = postsData.map(post => ({
        ...post,
        postId: post.link.replace(/\W+/g, '_'),
        feedId: currentFeed.feedId,
      }))
      posts.forEach((post) => {
        const hasPost = state.posts.some(statePost => statePost.postId === post.postId)
        if (!hasPost) {
          state.posts.push(post)
        }
      })
      state.requestStatus = 'idle'
      return state
    })
    .catch((error) => {
      state.requestStatus = 'failed'
      throw error
    })
}

export default getPosts

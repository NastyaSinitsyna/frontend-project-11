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
      const loadedFeeds = []
      if (!hasFeed) {
        loadedFeeds.push(currentFeed)
      }

      const posts = postsData.map(post => ({
        ...post,
        postId: post.link,
        feedId: currentFeed.feedId,
      }))
      const loadedPosts = []
      posts.forEach((post) => {
        const hasPost = state.posts.some(statePost => statePost.postId === post.postId)
        if (!hasPost) {
          loadedPosts.push(post)
        }
      })
      if (loadedFeeds.length !== 0) {
        state.feeds.push(...loadedFeeds)
      }
      if (loadedPosts.length !== 0) {
        state.posts.push(...loadedPosts)
      }
      state.request = { ...state.request, status: 'idle' }
      return state
    })
}

export default getPosts

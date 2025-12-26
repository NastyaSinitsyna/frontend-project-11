import axios from 'axios'
import parse from './parse.js'
import _ from 'lodash'

export const refreshTimeOut = 5000

export const getPosts = (feedUrl, state) => {
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

      const posts = postsData.map(post => ({
        ...post,
        postId: post.link,
        feedId: currentFeed.feedId,
      }))
      state.feeds.push(currentFeed)
      state.posts.push(posts)
      state.request = { ...state.request, status: 'idle' }
      return state
    })
}

export const updatePosts = (state) => {
  const feedsPromises = state.feeds.map((feed) => {
    const feedUrl = feed.feedUrl
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
        return state
      })
  })
  Promise.all(feedsPromises).finally(() => setTimeout(() => updatePosts(state), refreshTimeOut))
}

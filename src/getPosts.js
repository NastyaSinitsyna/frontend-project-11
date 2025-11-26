import axios from 'axios'
import parse from './parse.js'
import _ from 'lodash'

const getUrlContents = (feedUrl) => {
  return axios.get('https://allorigins.hexlet.app/get', {
    params: {
      disableCache: true,
      url: feedUrl,
    },
  })
    .then(response => parse(response.data.contents, 'text/xml'))
}

const getPosts = (feedUrl, state) => getUrlContents(feedUrl)
  .then((contents) => {
    const currentFeed = {
      feedUrl: feedUrl,
      feedId: _.uniqueId(),
      title: contents.querySelector('channel > title').textContent,
      description: contents.querySelector('channel > description').textContent,
    }
    if (!state.feeds.find(stateFeed => stateFeed.feedUrl === currentFeed.feedUrl)) {
      state.feeds.push(currentFeed)
    }

    const posts = [...contents.querySelectorAll('item')].map(post => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
      feedId: currentFeed.feedId,
      postId: post.querySelector('link').textContent.replace(/\W+/g, '_'),
    }))
    posts.forEach((post) => {
      if (!state.posts.find(statePost => statePost.postId === post.postId)) {
        state.posts.push(post)
      }
    })
    console.log(state)
    return state
  })

export default getPosts

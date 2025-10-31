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
    .then((response) => {
      // console.log('Axios response:', response)
      const contents = parse(response.data.contents, 'application/xml')
      if (contents.querySelector('parsererror')) {
        console.log('Invalid RSS format')
      }
      return contents
    })
}

const getPosts = (feedUrl, state) => getUrlContents(feedUrl)
  .then((contents) => {
    const currentFeed = {
      feedUrl: feedUrl,
      feedId: _.uniqueId(),
      title: contents.querySelector('channel > title').textContent,
    }
    state.feeds.push(currentFeed)

    const posts = [...contents.querySelectorAll('item')].map(post => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
      feedId: currentFeed.feedId,
      postId: post.querySelector('link').textContent.replace(/\W+/g, '_'),
    }))
    // console.log(posts)
    posts.forEach((post) => {
      if (!state.posts.find(statePost => statePost.description === post.description)) {
        state.posts.push(post)
      }
    })
    // console.log(state)
    return state
  })

export default getPosts

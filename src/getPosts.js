import axios from 'axios'
import parse from './parse.js'

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
        throw new Error('Invalid RSS format')
      }
      return contents
    })
}

const getPosts = (feedUrl, state) => getUrlContents(feedUrl)
  .then((contents) => {
    const currentFeed = state.feeds.find(feed => feed.feedUrl === feedUrl)
    currentFeed.title = contents.querySelector('channel > title')

    const posts = [...contents.querySelectorAll('item')].map(post => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
      feedId: currentFeed.feedId,
      postId: post.querySelector('link').textContent.replace(/\W+/g, '_'),
    }))
    state.posts.push(...posts)
    // console.log(state)
    return state
  })

export default getPosts

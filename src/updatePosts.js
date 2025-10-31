import getPosts from './getPosts.js'

const updatePosts = (feeds, state) => {
  const feedsPromises = feeds.map(feed => getPosts(feed.feedUrl, state))
  Promise.all(feedsPromises).finally(() => setTimeout(() => updatePosts(feeds, state), 5000))
}

export default updatePosts

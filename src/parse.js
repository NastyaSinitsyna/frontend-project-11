export default (responseContent, format) => {
  const parser = new DOMParser()
  const contents = parser.parseFromString(responseContent, format)
  if (contents.querySelector('parsererror')) {
    const err = new Error('invalid RSS format')
    err.type = 'rss'
    err.name = 'RssError'
    throw err
  }
  const feedData = {
    title: contents.querySelector('channel > title').textContent,
    description: contents.querySelector('channel > description').textContent,
  }
  const postsData = [...contents.querySelectorAll('item')].map(post => ({
    title: post.querySelector('title').textContent,
    link: post.querySelector('link').textContent,
    description: post.querySelector('description').textContent,
    postId: post.querySelector('link').textContent.replace(/\W+/g, '_'),
  }))
  return { feedData, postsData }
}

export default (responseContent, format) => {
  const parser = new DOMParser()
  const contents = parser.parseFromString(responseContent, format)
  if (contents.querySelector('parsererror')) {
    const err = new Error('invalid RSS format')
    err.type = 'rss'
    err.name = 'RssError'
    throw err
  }
  return contents
}

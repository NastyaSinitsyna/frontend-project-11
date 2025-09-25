import * as yup from 'yup'
import _ from 'lodash'

export default (url, state) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(state.feeds.map(feed => feed.feedUrl))

  return schema.validate(url)
    .then((validatedUrl) => {
      state.feeds.push({
        feedUrl: validatedUrl,
        feedId: _.uniqueId(),
      })
      return validatedUrl
    })
}

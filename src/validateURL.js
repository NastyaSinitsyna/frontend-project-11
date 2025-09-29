import * as yup from 'yup'

export default (url, state) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(state.feeds.map(feed => feed.feedUrl))

  return schema.validate(url)
    .then(validatedUrl => validatedUrl)
}

import * as yup from 'yup'

const getValidSchema = () => yup.string().required().url()

export default (url, state) => {
  const schema = getValidSchema()

  return schema
    .notOneOf(state.feeds.map(feed => feed.feedUrl))
    .validate(url)
}

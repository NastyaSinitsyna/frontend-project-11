import * as yup from 'yup'

export default (url, state) => {
  const schema = yup.string().required().url().notOneOf(state.feeds)
  return schema.validate(url)
    .then(result => state.feeds.push(result))
}
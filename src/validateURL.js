import * as yup from 'yup'

export default (url, state) => {
  const schema = yup.string().required().url().notOneOf(state.feeds)
  return schema.validate(url)
    .then((validatedUrl) => {
      state.feeds.push(validatedUrl)
      return validatedUrl
    })
}

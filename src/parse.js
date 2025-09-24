export default (responseContent, format) => {
  const parser = new DOMParser()
  return parser.parseFromString(responseContent, format)
}

export default () => ({
  mixed: {
    notOneOf: () => ({ key: 'errors.duplicate' }),
  },
  string: {
    url: () => ({ key: 'errors.invalidUrl' }),
  },
})

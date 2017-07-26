import { WordChoiceRoute, MCQTestRoute } from './routes'

export default (store) => ({
  path        : 'self-report',
  indexRoute  : WordChoiceRoute(store),
  childRoutes : [
    WordChoiceRoute(store),
    MCQTestRoute(store)
  ]
})

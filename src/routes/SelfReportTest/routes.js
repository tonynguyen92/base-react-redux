import { injectReducer } from '../../store/reducers'

export const WordChoiceRoute = (store) => ({
  path : 'word-choice',
  childRoutes : [

  ],
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const WordChoiceView = require('./containers/WordChoiceViewContainer').default
      const reducer = require('./modules/word_choice').default

      /*  Add the reducer to the store  */
      injectReducer(store, { key: 'wordChoice', reducer })

      /*  Return getComponent   */
      cb(null, WordChoiceView)

    /* Webpack named bundle   */
    }, 'word-choice')
  }
})

export const MCQTestRoute = (store) => ({
  path : 'mcq-test',
  childRoutes : [

  ],
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const MCQTestView = require('./containers/MCQTestViewContainer').default
      const reducer = require('./modules/mcq_test').default

      /*  Add the reducer to the store  */
      injectReducer(store, { key: 'mcqTest', reducer })

      /*  Return getComponent   */
      cb(null, MCQTestView)

    /* Webpack named bundle   */
    }, 'mcq-test')
  }
})

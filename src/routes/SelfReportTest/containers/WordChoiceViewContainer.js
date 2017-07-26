import { connectWithLifecycle } from 'react-lifecycle-component'

import WordChoiceView from '../components/WordChoiceView'
import { toggleSelectWord, goNextPage, startTest } from '../modules/word_choice'

const mapDispatchToProps = {
  toggleSelectWord,
  goNextPage,
  componentDidMount: startTest
}

const mapStateToProps = (state) => {
  return state.wordChoice
}

export default connectWithLifecycle(
  mapStateToProps, mapDispatchToProps
)(WordChoiceView)

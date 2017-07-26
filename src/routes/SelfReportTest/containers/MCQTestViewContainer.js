import { connectWithLifecycle } from 'react-lifecycle-component'

import MCQTestView from '../components/MCQTestView'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  return state.mcqTest
}

export default connectWithLifecycle(
  mapStateToProps, mapDispatchToProps
)(MCQTestView)

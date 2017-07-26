import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { Link } from 'react-router'

import {
  WORD_CHOICE_TOTAL_PAGES
} from 'constants'

import ChoiceGrid from '../../../components/ChoiceGrid'

// View group for Not Started state
const NotStartedView = ({
  isLoading,
  goNextPage
}) => (
  <div>
    {!isLoading &&
    <button
      type='button'
      className='btn btn-primary'
      onClick={() => goNextPage()}
    >Start Test</button>
    }

    {isLoading &&
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spinner spinnerName='double-bounce' />
      </div>
      <p>Loading test...</p>
    </div>
    }
  </div>
)

NotStartedView.propTypes = {
  isLoading   : PropTypes.bool,
  goNextPage  : PropTypes.func
}

// View group for In Progress state
const InProgressView = ({
  isLoading,
  testId,
  words,
  selectedWords,
  totalTime,
  remainingTime,
  currentPage,
  totalPages,
  toggleSelectWord,
  goNextPage
}) => (
  <div>
    {isLoading &&
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spinner spinnerName='double-bounce' />
      </div>
      <p>Loading words...</p>
    </div>
    }

    {!isLoading &&
    <div>
      <p>Test ID: {testId}</p>
      <p>Check the box for each word you know at least one definition for</p>
      <p>Time remaining: {remainingTime} seconds</p>

      <ChoiceGrid
        gridSize={3}
        values={words}
        selectedValues={selectedWords}
        onCellClick={word => toggleSelectWord(word)}
      />
      <p>Page {currentPage} / {totalPages}</p>
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => goNextPage()}
      >Next</button>
    </div>
    }
  </div>
)

InProgressView.propTypes = {
  isLoading         : PropTypes.bool,
  testId            : PropTypes.string,
  words             : PropTypes.arrayOf(PropTypes.string),
  selectedWords     : PropTypes.arrayOf(PropTypes.string),
  currentPage       : PropTypes.number,
  totalPages        : PropTypes.number,
  totalTime         : PropTypes.number,
  remainingTime     : PropTypes.number,
  toggleSelectWord  : PropTypes.func,
  goNextPage        : PropTypes.func
}

// View group for Complete state
const CompleteView = ({
  testId
}) => (
  <div>
    <Link
      to='/self-report/mcq-test'
      className='btn btn-primary'
    >Start MCQ Test</Link>
  </div>
)

CompleteView.propTypes = {
  testId            : PropTypes.string
}

// MAIN VIEW
export const WordChoiceView = ({
  isLoading,
  isFailed,
  testId,
  errorMessage,
  words,
  selectedWords,
  currentPage,
  totalPages,
  totalTime,
  remainingTime,
  toggleSelectWord,
  goNextPage
}) => {
  const testNotStarted = currentPage === 0
  const testInProgress = currentPage > 0 && currentPage <= WORD_CHOICE_TOTAL_PAGES
  const testComplete = currentPage > WORD_CHOICE_TOTAL_PAGES

  return (
    <div>
      {isFailed &&
      <div>
        <div className='alert alert-danger' role='alert'>
          <strong>Error!</strong> {errorMessage}
        </div>
      </div>
      }

      {testNotStarted &&
      <NotStartedView
        isLoading={isLoading}
        goNextPage={goNextPage}
      />}

      {testInProgress &&
      <InProgressView
        isLoading={isLoading}
        testId={testId}
        words={words}
        selectedWords={selectedWords}
        totalTime={totalTime}
        remainingTime={remainingTime}
        currentPage={currentPage}
        totalPages={totalPages}
        toggleSelectWord={toggleSelectWord}
        goNextPage={goNextPage}
      />}

      {testComplete &&
      <CompleteView
        testId={testId}
      />
      }
    </div>
  )
}

WordChoiceView.propTypes = {
  isLoading         : PropTypes.bool,
  isFailed          : PropTypes.bool,
  testId            : PropTypes.string,
  errorMessage      : PropTypes.string,
  words             : PropTypes.arrayOf(PropTypes.string),
  selectedWords     : PropTypes.arrayOf(PropTypes.string),
  currentPage       : PropTypes.number,
  totalPages        : PropTypes.number,
  totalTime         : PropTypes.number,
  remainingTime     : PropTypes.number,
  toggleSelectWord  : PropTypes.func,
  goNextPage        : PropTypes.func
}

WordChoiceView.defaultProps = {
  isLoading         : true,
  selectedWords     : []
}

export default WordChoiceView

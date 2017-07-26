import update from 'immutability-helper'
import fetch from 'isomorphic-fetch'

import { fetchStatusHandler } from 'utils'

// ------------------------------------
// Constants
// ------------------------------------
export const WORD_CHOICE_SELECT = 'WORD_CHOICE_SELECT'
export const WORD_CHOICE_DESELECT = 'WORD_CHOICE_DESELECT'

export const WORD_CHOICE_TEST_STARTED = 'WORD_CHOICE_TEST_STARTED'
export const WORD_CHOICE_PAGE_LOADING = 'WORD_CHOICE_PAGE_LOADING'
export const WORD_CHOICE_PAGE_LOADED = 'WORD_CHOICE_PAGE_LOADED'
export const WORD_CHOICE_PAGE_LOAD_FAILED = 'WORD_CHOICE_PAGE_LOAD_FAILED'
export const WORD_CHOICE_TICK = 'WORD_CHOICE_TICK'

// ------------------------------------
// Actions
// ------------------------------------
let timer

export function selectWord (word) {
  return {
    type  : WORD_CHOICE_SELECT,
    word  : word
  }
}

export function deselectWord (word) {
  return {
    type  : WORD_CHOICE_DESELECT,
    word  : word
  }
}

export function toggleSelectWord (word) {
  return (dispatch, getState) => {
    const moduleState = getState().wordChoice

    if (moduleState.selectedWords.indexOf(word) >= 0) {
      dispatch(deselectWord(word))
    } else {
      dispatch(selectWord(word))
    }
  }
}

function pageLoading () {
  return {
    type: WORD_CHOICE_PAGE_LOADING
  }
}

function receiveTestInfo (json) {
  return {
    type : WORD_CHOICE_TEST_STARTED,
    ...json
  }
}

function receiveNextWords (json) {
  return {
    type  : WORD_CHOICE_PAGE_LOADED,
    ...json
  }
}

function receiveError (err) {
  return {
    type          : WORD_CHOICE_PAGE_LOAD_FAILED,
    errorMessage  : err.message
  }
}

function tick () {
  return {
    type : WORD_CHOICE_TICK
  }
}

export function startTest () {
  return (dispatch, getState) => {
    dispatch(pageLoading())

    fetch('/api/test', {
      method: 'POST'
    }).then(fetchStatusHandler)
      .then(res => res.json())
      .then(json => dispatch(receiveTestInfo(json)))
      .catch(err => dispatch(receiveError(err)))
  }
}

export function goNextPage () {
  return (dispatch, getState) => {
    const moduleState = getState().wordChoice

    clearInterval(timer)
    dispatch(pageLoading())

    fetch('/api/test/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testId: moduleState.testId,
        selectedWords: moduleState.selectedWords
      })
    }).then(fetchStatusHandler)
      .then(res => res.json())
      .then(json => {
        dispatch(receiveNextWords(json))

        timer = setInterval(() => {
          if (getState().wordChoice.remainingTime > 0) {
            dispatch(tick())
          } else {
            clearInterval(timer)
            dispatch(goNextPage())
          }
        }, 1000)
      })
      .catch(err => dispatch(receiveError(err)))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [WORD_CHOICE_SELECT] : (state, action) => {
    if (state.selectedWords.indexOf(action.word) === -1) {
      state = update(state, {
        selectedWords: { $push: [action.word] }
      })
    }
    return state
  },
  [WORD_CHOICE_DESELECT] : (state, action) => {
    if (state.selectedWords.indexOf(action.word) >= 0) {
      const index = state.selectedWords.findIndex(w => w === action.word)
      state = update(state, {
        selectedWords : { $splice: [[index, 1]] }
      })
    }
    return state
  },
  [WORD_CHOICE_TEST_STARTED] : (state, action) => {
    state = update(state, {
      testId    : { $set: action.testId },
      isLoading : { $set: false }
    })
    return state
  },
  [WORD_CHOICE_PAGE_LOADING] : (state, action) => {
    state = update(state, {
      isLoading     : { $set: true },
      isFailed      : { $set: false },
      errorMessage  : { $set: '' }
    })
    return state
  },
  [WORD_CHOICE_PAGE_LOADED] : (state, action) => {
    state = update(state, {
      isLoading     : { $set: false },
      isFailed      : { $set: false },
      errorMessage  : { $set: '' },
      words         : { $set: action.words },
      selectedWords : { $set: [] },
      currentPage   : { $set: action.currentPage },
      totalPages    : { $set: action.totalPages },
      totalTime     : { $set: action.totalTime },
      remainingTime : { $set: action.totalTime }
    })
    return state
  },
  [WORD_CHOICE_PAGE_LOAD_FAILED] : (state, action) => {
    state = update(state, {
      isLoading     : { $set: false },
      isFailed      : { $set: true },
      errorMessage  : { $set: action.errorMessage }
    })
    return state
  },
  [WORD_CHOICE_TICK] : (state, action) => {
    state = update(state, {
      remainingTime : { $set: state.remainingTime - 1 }
    })
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading       : false,
  isFailed        : false,
  testId          : null,
  errorMessage    : '',
  words           : [],   // words displayed in current page
  selectedWords   : [],   // words selected by user
  currentPage     : 0,
  totalPages      : 10,
  totalTime       : 30,
  remainingTime   : 30
}

export default function wordChoiceReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

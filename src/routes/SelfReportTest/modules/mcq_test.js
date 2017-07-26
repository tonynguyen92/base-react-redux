// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading       : false,
  isFailed        : false,
  testId          : null,
  errorMessage    : '',
  context         : '',
  choices         : [],
  currentPage     : 0,
  totalPages      : 10,
  totalTime       : 30,
  remainingTime   : 30
}

export default function mcqTestReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

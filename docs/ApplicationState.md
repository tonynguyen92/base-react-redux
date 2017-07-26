# Application State

This is an example for the shape of application state.

```
{
  testId: 'abc123',
  wordChoice: {
    isLoading: true,
    words: ['one', 'two', 'three'],
    selectedWords: ['one'],
    currentPage: 1,
    totalPages: 10,
    totalTime: 30,
    remainingTime: 10
  },
  mcqTest: {
    isLoading: true,
    context: '...',
    choices: ['a', 'b', 'c', 'd'],
    currentChoice: 2,
    currentTest: 1,
    totalTests: 24,
    totalTime: 10,
    remainingTime: 8
  },
  testResult: {
    vocabularyAbility: 0.6,
    mcqCorrectAnswers: 18,
    conclusion: "<p>Great Job!</p>"
  }
}
```
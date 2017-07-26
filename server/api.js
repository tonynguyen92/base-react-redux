const express = require('express')
const fetch = require('isomorphic-fetch')

const { Test } = require('./models')
const {
  BUFFERED_TIME,
  WORD_CHOICE_RESTRICTED_TIME,
  WORD_CHOICE_TOTAL_PAGES,
  WORD_CHOICE_PER_PAGE
} = require('../src/constants')

const { calculateVocabAbility } = require('./calculations')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' })
})

router.post('/test', (req, res) => {
  Test.create({
    currentPage : 0,
    totalPages  : WORD_CHOICE_TOTAL_PAGES,
    generatedAt : Date.now()
  },
  (err, test) => {
    if (err) {
      console.log(`Error: ${err}`)
      res.status(500).send({ message: 'Internal Server Error' })
    } else {
      res.json({ testId: test._id })
    }
  })
})

router.post('/test/words', (req, res) => {
  const { testId, selectedWords } = req.body

  Test.findOne({ _id: testId })
    .exec()
    .then(test => {
      const now = Date.now()
      const timeValid = test.generatedAt.getTime() +
        (WORD_CHOICE_RESTRICTED_TIME + BUFFERED_TIME) * 1000 > now

      if (test.currentPage > 0) {
        if (!timeValid) {
          res.status(400).send({
            message: 'Submitted after restricted time. Try again!'
          })
          return
        } else if (test.currentPage > WORD_CHOICE_TOTAL_PAGES) {
          res.status(400).send({
            message: 'All pages submitted.'
          })
          return
        }
      }

      return fetch(
        `https://inspi-gre-api.herokuapp.com/v1/words?` +
        `limit=${WORD_CHOICE_PER_PAGE}&` +
        `skip=${test.currentPage * WORD_CHOICE_PER_PAGE}&` +
        `conditions=%7B%22wordLists%22%3A%7B%22%24in%22%3A%5B%22GRE_PRODUCT%22%5D%7D%7D`
      )
        .then(res => res.json())
        .then(words => {
          test.displayedWords = words.concat(test.displayedWords || [])
          test.selectedWords = selectedWords.concat(test.selectedWords || [])
          test.currentPage++
          test.generatedAt = Date.now()
          if (test.currentPage > WORD_CHOICE_TOTAL_PAGES) {
            test.vocabAbility = calculateVocabAbility(test)
          }

          return test.save().then(() => {
            res.json({
              testId        : test._id,
              words         : words.map(w => w.text),
              currentPage   : test.currentPage,
              totalPages    : WORD_CHOICE_TOTAL_PAGES,
              totalTime     : WORD_CHOICE_RESTRICTED_TIME,
              completed     : test.currentPage >= WORD_CHOICE_TOTAL_PAGES,
              vocabAbility  : test.vocabAbility
            })
          })
        })
    })
    .catch(err => {
      console.log(`Error: ${err}`)
      res.status(500).send({ message: 'Internal Server Error' })
    })
})

router.post('/test/mcq', (req, res) => {
  const { testId } = req.params

  res.json({
    testId: testId
  })
})

module.exports = router

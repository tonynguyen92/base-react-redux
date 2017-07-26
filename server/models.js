const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Test = new Schema({
  displayedWords  : [],
  selectedWords   : [String],
  currentPage     : Number,
  totalPages      : Number,
  vocabAbility    : Number,
  generatedAt     : { type: Date, default: Date.now }
})

const MCQTest = new Schema({
  test        : { type: ObjectId, index: true },
  word        : Object,
  context     : Object,
  choices     : [String],
  userChoice  : String,
  correct     : { type: Boolean, index: true },
  generatedAt : { type: Date, default: Date.now }
})

module.exports = {
  Test    : mongoose.model('Test', Test),
  MCQTest : mongoose.model('MCQTest', MCQTest)
}

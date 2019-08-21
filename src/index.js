let choices = require('../data/choices')
let exclude = require('../data/exclude')
let unique  = require('../data/unique')
let pairs   = require('./pairs')
let shuffle = require('./shuffle')
let filter  = require('./filter')
let events  = require('add-event-listener')
let classes = require('dom-classes')
let now     = require('date-now')
let hash    = require('string-hash')

// NOTE: Don't touch these! Instead build the project like:
// QUESTION_ID=10 npm run build
const QUESTION_ID   = process.env.QUESTION_ID
const QUESTION_NAME = process.env.QUESTION_NAME
const CHOICES_KEY   = process.env.CHOICES_KEY
const IS_QUALTRICS  = window.Qualtrics !== void 0

if (IS_QUALTRICS) {
  let raw = Qualtrics.SurveyEngine.getEmbeddedData(CHOICES_KEY)

  // Ask all questions if no choices were made
  if (raw) {
    choices = raw.split(/\s*\,\s*/)
  }
}

// Exclude all choices in the `exclude` list
choices = choices.filter(function(choice) {
  return exclude.indexOf(choice) < 0
})

// Randomize items, both in the list of choices and the list of pairs
let randomized = filter(shuffle(pairs(shuffle(choices))), unique)
let total      = randomized.length

// DOM selection
// https://developer.mozilla.org/en-US/docs/Web/API/document.querySelector
let $terms     = document.querySelector('#mb-terms')
let $toolbar   = document.querySelector('#mb-toolbar')
let $start     = document.querySelector('#mb-btn-start')
let $related   = document.querySelector('#mb-btn-related')
let $unrelated = document.querySelector('#mb-btn-unrelated')
let $continue  = document.querySelector('#NextButton')
let $progress  = document.querySelector('#progress')

// Note: getElementById is essential here, the ~ throws off
// document.querySelector!
let $field = document.getElementById(`QR~QID${ QUESTION_ID }`)

// Keep track of time, the question, and answers
let TIMESTART
let FOCUS   = false
let ANSWERS = ''

function advance() {
  FOCUS = randomized.pop()

  // If the survey has ended, return the finishing process.
  if (!FOCUS) {
    return finish()
  }

  let [ one, two ] = FOCUS

  // Display the new terms in the user interface
  $terms.innerHTML = `Is <b>${ one }</b> related to <b>${ two }</b> ?`

  // Since we've moved on to the next question, Reset the timer
  TIMESTART = now()

  // update progress
  $progress.style.width = `${ ((total - randomized.length) / total) * 100 }%`
}

function finish() {
  classes.add($toolbar, 'mb-hidden')
  $terms.innerHTML = `Task complete, please continue`
  classes.remove($continue, 'mb-hidden')
}

function getDuration() {
  return now() - TIMESTART
}

function capture(isRelated) {
  let duration = getDuration()
  let entry    = [ hash(FOCUS[0]), hash(FOCUS[1]), duration, isRelated ]

  ANSWERS += `${ entry };`

  if (IS_QUALTRICS) {
    Qualtrics.SurveyEngine.setEmbeddedData(QUESTION_NAME, ANSWERS)
  }

  if ($field) {
    $field.value = ANSWERS
  } else {
    console.warn("No field found, entry would have been:")
    console.warn(entry.join(', '))
  }
}

function enoughTimeHasPassed() {
  // How many milliseconds should pass before the user can click again?
  let waitMilliseconds = 250

  return getDuration() > waitMilliseconds
}

events.addEventListener($start, 'click', function(e) {
  e.preventDefault()

  classes.add($start, 'mb-hidden')
  classes.remove($toolbar, 'mb-hidden')

  advance()
})

events.addEventListener($unrelated, 'click', function() {
  if (enoughTimeHasPassed()) {
    capture(false)
    advance()
    this.blur()
  }
})

events.addEventListener($related, 'click', function() {
  if (enoughTimeHasPassed()) {
    capture(true)
    advance()
    this.blur()
  }
})


// Hide continue button until we finish
if ($continue) {
  classes.add($continue, 'mb-hidden')
}

// Hide the field
if ($field) {
  // Set the opaqueness of the field to 0
  $field.style.opacity = 0;
  // Make the field impossible to tab into
  $field.tabIndex = -1;
  // Make the field invisible to accessibility tools
  $field.setAttribute('aria-hidden', true);
  // Finally, disable it so that Qualtrics does not autofocus the
  // textfield (we think, anyway)
  $field.setAttribute('disabled', true);
}

// Last: at this point everything should have loaded,
// so lets change the user message from something like
// 'Loading' to 'Start'
$terms.innerHTML = 'Press start to begin'.bold()

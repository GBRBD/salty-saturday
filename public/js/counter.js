import { $ } from './modules/bling'
import moment from 'moment'

// 6 is Saturday
const today = moment().isoWeekday()
const day = $('#days-text')
const left = $('#left-text')

// If we have the HTML element 
if (day) {
    const diff = 6 - today
    if (today == 7) {
        day.textContent = "6"
    } else if (today != 6) {
        day.textContent = diff
    }
    if (diff != 1) {
        left.textContent = "days left"
    } else {
        left.textContent = "day left"
    }
}

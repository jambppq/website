/* ==========================================================================
   views/greeting.js — "Good evening, Ada" + streak / countdown line
   ========================================================================== */

import { $, plural, dayNumber } from '../utils.js';
import { store } from '../state.js';
import { currentStreak, questionsOn } from '../metrics.js';

function greetingForHour(hour) {
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 22) return 'Good evening';
  return 'Good night';
}

export function renderGreeting() {
  const { name, examDate } = store.data;
  $('hiGreet').textContent = greetingForHour(new Date().getHours());
  $('name').textContent = name || 'Candidate';

  const streak = currentStreak();
  const parts = [streak ? `${streak}-day streak` : 'Start a new streak today'];

  if (examDate) {
    const daysLeft = dayNumber(new Date(examDate + 'T00:00:00')) - dayNumber(new Date());
    if (daysLeft > 0) parts.push(`${plural(daysLeft, 'day')} to UTME`);
    else if (daysLeft === 0) parts.push('UTME is today. Good luck!');
  }

  const opener = questionsOn(0) ? 'Nice work today. ' : 'Every question you practise counts. ';
  $('lineText').textContent = `${opener}${parts.join(' · ')}.`;
  $('setDate').hidden = !!examDate;   // only show "Set your UTME details" when no date yet
}

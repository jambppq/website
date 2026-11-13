/* ==========================================================================
   views/stats.js — the four numbers under the hero
   ========================================================================== */

import { $, plural, startOfDay, daysAgo, percent, sum } from '../utils.js';
import { store } from '../state.js';
import { bestStreak, currentStreak, questionsOn } from '../metrics.js';

export function renderStats() {
  const weekStart = startOfDay(daysAgo(6)).getTime();                // today + previous 6 days
  const week = store.data.results.filter(r => r.t >= weekStart);

  const today = questionsOn(0);
  const yesterday = questionsOn(1);
  const weekQuestions = sum(week, 'n');
  const accuracy = percent(sum(week, 'c'), weekQuestions);
  const best = bestStreak();
  const diff = today - yesterday;

  $('sToday').textContent = today.toLocaleString();
  $('sWeek').textContent = weekQuestions.toLocaleString();
  $('sAcc').textContent = `${accuracy}%`;
  $('sStreak').textContent = currentStreak();

  $('sTodayHint').textContent =
    !today ? 'No practice yet'
    : !yesterday ? 'First session today'
    : diff > 0 ? `↑ ${diff} vs yesterday`
    : diff < 0 ? `↓ ${Math.abs(diff)} vs yesterday`
    : 'Same as yesterday';

  $('sWeekHint').textContent = weekQuestions ? `Avg ${Math.round(weekQuestions / 7)} per day` : 'Practise to see your average';

  $('sAccHint').textContent =
    !weekQuestions ? 'This week'
    : accuracy >= 70 ? 'Solid, keep going'
    : accuracy >= 50 ? 'Room to improve'
    : 'Focus on weak subjects';

  $('sStreakHint').textContent = best ? `Best: ${plural(best, 'day')}` : 'Start today';
}

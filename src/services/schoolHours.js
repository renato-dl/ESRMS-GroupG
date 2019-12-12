import {config} from '../config';
import moment from 'moment';

export function getHour() {
  const currentTime = moment.utc();
  const schoolStart = moment.utc(config.school.school_start, 'H:mm');
  const firstHourEnd = schoolStart.clone().add(1, 'hours');
  const secondHourEnd = firstHourEnd.clone().add(1, 'hours');
  if (currentTime.isBetween(schoolStart, firstHourEnd)) {
    return 1;
  } else if (currentTime.isBetween(firstHourEnd, secondHourEnd)) {
    return 2;
  } else {
    return 0;
  }
}
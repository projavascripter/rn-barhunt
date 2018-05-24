import moment from 'moment';

// return the number of days towards a future day
// futureDay format: "03/8/18 7:00 PM"
function calXDayToDate(futureDay) {
  let nowMoment = moment();
  let futureTimeString = futureDay;
  let futureTimeMoment = moment(futureTimeString);
  let diffInDays = futureTimeMoment.diff(nowMoment, 'days');
  return diffInDays;
}

// return the number of hours towards a future time
// futureDay format: "03/8/18 7:00 PM"
function calXHoursToDate(futureDay) {
  let nowMoment = moment();
  let futureTimeMoment = moment(futureDay);
  diffInHours = futureTimeMoment.diff(nowMoment, "hours");
  return diffInHours;
}

function ordinalSuffixOf(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function getOpaqueColorWithChallengeType(type) {
  let bgColor;
  if (type == "tournament") {
    //yellow
    bgColor = "#FFC60033";
  } else if (type == "completion") {
    // blue
    bgColor = "#6AAEAA33";
  } else {
    // orange
    bgColor = "#E8772233";
  }

  return bgColor;
}

function getColorWithChallengeType(type) {
  let bgColor;
  if (type == "tournament") {
    //yellow
    bgColor = "#FFC600";
  } else if (type == "completion") {
    // blue
    bgColor = "#6AAEAA";
  } else {
    // orange
    bgColor = "#E87722";
  }

  return bgColor;
}

export default { calXDayToDate, calXHoursToDate, ordinalSuffixOf, ordinalSuffixOf, getColorWithChallengeType };
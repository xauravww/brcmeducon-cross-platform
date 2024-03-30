const { eachDayOfInterval, startOfMonth, endOfMonth } = require('date-fns');

 function getAllDatesOfMonth(year, month) {
  // Create start and end dates for the month
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  // Get all the dates of the month
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  // Format the dates as 'YYYY-MM-DD'
  const formattedDates = dates.map(date => date.toISOString().slice(0, 10));

  return formattedDates;
}

function getAllDatesOfYear(year) {
  let allDates = [];

  // Iterate through each month of the year
  for (let month = 0; month < 12; month++) {
    // Create start and end dates for the month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    // Get all the dates of the month
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    // Format the dates as 'YYYY-MM-DD'
    const formattedDates = dates.map(date => date.toISOString().slice(0, 10));

    // Concatenate the formatted dates to the allDates array
    allDates = allDates.concat(formattedDates);
  }

  return allDates;
}

function getIndianDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1)?.padStart(2, '0');
  const day = String(today.getDate())?.padStart(2, '0');

  const indianDate = `${year}-${month}-${day}`;
  return indianDate;
}

module.exports = {getAllDatesOfMonth,getAllDatesOfYear,getIndianDate}
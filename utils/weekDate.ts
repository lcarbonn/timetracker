export const getWeekNumber = (date: Date): number => {
    // Copying date so the original date won't be modified
    const tempDate = new Date(date.valueOf());

    // ISO week date weeks start on Monday, so correct the day number
    const dayNum = (date.getDay() + 6) % 7;

    // Set the target to the nearest Thursday (current date + 4 - current day number)
    tempDate.setDate(tempDate.getDate() - dayNum + 3);

    // ISO 8601 week number of the year for this date
    const firstThursday = tempDate.valueOf();

    // Set the target to the first day of the year
    // First set the target to January 1st
    tempDate.setMonth(0, 1);

    // If this is not a Thursday, set the target to the next Thursday
    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
    }

    // The weeknumber is the number of weeks between the first Thursday of the year
    // and the Thursday in the target week
    return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
}

export const getMinDate = (now?:Date) :Date|null => {
    // Sunday - Saturday : 0 - 6
    if(!now) return null
    const day = now.getDay() -1
    const firstDay = new Date()
    firstDay.setTime((now.getTime() - (24*60*60*1000 * day)))
    // console.log("first day: " + day + ", " +firstDay.toLocaleString())
    return firstDay
}

export const getMaxDate = (now?:Date) :Date|null => {
    // Sunday - Saturday : 0 - 6
    if(!now) return null
    const day = (7 - now.getDay())
    const lastDay = new Date()
    lastDay.setTime((now.getTime() + (24*60*60*1000 * day)))
    // console.log("last day: " + day + ", " +lastDay.toLocaleString())
    return lastDay
}

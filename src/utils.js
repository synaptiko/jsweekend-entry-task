export function compareDatesSafe(date1, date2) {
  if (date1 == null && date2 == null) {
    return 0;
  }
  else if (date1 == null) {
    return -1;
  }
  else if (date2 == null) {
    return 1;
  }
  else {
    return (date1.getTime() - date2.getTime())
  }
}
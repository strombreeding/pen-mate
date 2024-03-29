export const parseTime = (input: string): string => {
  console.log(input);
  const secondsInMinute: number = 60;
  const secondsInHour: number = 60 * secondsInMinute;
  const secondsInDay: number = 24 * secondsInHour;
  const secondsInWeek: number = 7 * secondsInDay;
  const secondsInMonth: number = 30 * secondsInDay; // 달의 일 수를 고려하지 않음
  const secondsInYear: number = 365 * secondsInDay; // 1년은 365일로 가정
  const ms = 1000;
  const regex: RegExp = /^(\d+)([hwdmys])$/; // 숫자와 문자(h, w, d, m, y)를 분리하기 위한 정규식

  const matches: RegExpMatchArray | null = input.match(regex);

  if (!matches) {
    throw new Error('Invalid input format');
  }

  const value: number = parseInt(matches[1], 10);
  const unit: string = matches[2];

  switch (unit) {
    case 's':
      return (value * ms).toString() + 'ms';
    case 'h':
      return (value * secondsInHour * ms).toString() + 'ms';
    case 'd':
      return (value * secondsInDay * ms).toString() + 'ms';
    case 'w':
      return (value * secondsInWeek * ms).toString() + 'ms';
    case 'm':
      return (value * secondsInMonth * ms).toString() + 'ms';
    case 'y':
      return (value * secondsInYear * ms).toString() + 'ms';
    default:
      throw new Error('Invalid time unit');
  }
};

/**
 * Pads a number with a character up to a certain length.
 */
function padNumber(number: number, maxLength: number, character: string) {
  return number.toString().padStart(maxLength, character);
}

/**
 * Rounds a `number` to any number of `precision` DP's.
 */
function precisionRound(number: number, precision: number): number {
  const multiplier = Math.pow(10, precision);

  return Math.round(number * multiplier) / multiplier;
}

export {
  precisionRound,
  padNumber,
};

/**
 * Pads a number with a character up to a certain length.
 */
function padNumber(number: number, maxLength: number, character: string) {
  return number.toString().padStart(maxLength, character);
}

export {
  padNumber,
};

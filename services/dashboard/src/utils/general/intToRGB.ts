export function intToRGB(i: number) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

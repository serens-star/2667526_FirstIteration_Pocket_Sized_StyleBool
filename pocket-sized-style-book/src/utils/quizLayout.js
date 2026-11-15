
export function splitOptions(options) {
  const mid = Math.ceil(options.length / 2);
  const tag = (o, i) => ({ label: o[0], code: o[1], index: i });
  const all = options.map(tag);
  return { left: all.slice(0, mid), right: all.slice(mid) };
}

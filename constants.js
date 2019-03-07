const constants = {
  PAGE_MARKER: /^\s*#\s*{{\s*Page\s*}}\s*$/i,
  LINE_MARKER: /[^\s]/,
  H1_MARKER: /^\s*#\s+(?=[^s])/,
  H1_TYPE: 'h1',
  DEFAULT_LINE_TYPE: 'p'
};
module.exports = constants;

const C = require('../constants');
const script2json = class {
  /**
   * Read plaintext pseudo-Markdown Mad Liberation script scriptFile, print
   * JSON of the script usable by mljsapi.
   */
  static parseFile(scriptFile) {}

  static parseLine(line) {
    let parsedLine = {};
    const segments = [];
    // figure out the type
    if (C.H1_MARKER.test(line)) {
      parsedLine.type = C.H1_TYPE;
    }
    // add the segments
    segments.push({
      type: 'text',
      text: line.replace(C.H1_MARKER, '')
    });
    parsedLine.segments = segments;

    return parsedLine;
  }

  /**
   * Read String script (a Mad Liberation pseudo-Markdown script), return an
   * object representing the script that, when printed as JSON, will be usable
   * by mljsapi.
   */
  static parse(scriptText) {
    const script = {};
    script.pages = [];
    const lines = scriptText.split(/\n|\r\n/);
    let thisPage;
    let theseLines;
    let parsedLine;
    lines.forEach(line => {
      if (C.PAGE_MARKER.test(line)) {
        if (thisPage) {
          thisPage.lines = theseLines;
          script.pages.push(thisPage);
          thisPage = false;
        }
        thisPage = {};
        theseLines = [];
      } else if (C.LINE_MARKER.test(line)) {
        parsedLine = this.parseLine(line);
        if (parsedLine) {
          theseLines.push(parsedLine);
        }
      }
    });
    if (thisPage) {
      thisPage.lines = theseLines;
      script.pages.push(thisPage);
    }
    return script;
  }
};
module.exports = script2json;

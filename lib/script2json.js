const C = require('../constants');
const script2json = class {
  /**
   * Read plaintext pseudo-Markdown Mad Liberation script scriptFile, print
   * JSON of the script usable by mljsapi.
   */
  static parseFile(scriptFile) {}

  static parseLine(line) {
    function* segmentGenerator(str) {
      const nonLibRegex = /^.+(?={{)/;
      const libRegex = /^{{.*?}}/;
      const libAnywhwere = /{{.*}}/;
      const libSplitRegex = /[/][/]/;
      let segText, seg;
      while (str.length > 0) {
        if (!libAnywhwere.test(str)) {
          return { type: 'text', text: str };
        }
        if (nonLibRegex.test(str)) {
          segText = str.match(nonLibRegex)[0];
          str = str.replace(nonLibRegex, '');
          seg = { type: 'text', text: segText };
        } else if (libRegex.test(str)) {
          segText = str
            .match(libRegex)[0]
            .replace(/{{/, '')
            .replace(/}}/, '');
          str = str.replace(libRegex, '');
          let lib = segText.split(libSplitRegex);
          seg = {
            type: 'lib',
            prompt: lib[0].trim(),
            example: lib[1].trim(),
            sentence: lib[2].trim(),
            default: lib[3].trim()
          };
        }
        if (str.length == 0) return seg;
        yield seg;
      }
    }

    let parsedLine = {};

    // figure out the type
    if (C.H1_MARKER.test(line)) {
      parsedLine.type = C.H1_TYPE;
      line = line.replace(C.H1_MARKER, '');
    } else {
      parsedLine.type = C.DEFAULT_LINE_TYPE;
    }

    // add the segments
    const segGen = segmentGenerator(line);
    const segments = [];
    let segment = { done: false };
    let done = false;
    while (!segment.done) {
      segment = segGen.next();
      segments.push(segment.value);
    }
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

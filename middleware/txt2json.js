const script2json = require('../lib/script2json');
const txt2json = [
  (req, res, next) => {
    console.log(
      req.body &&
        req.body.text &&
        req.body.text == '# {{Page}}\n\n# The simplest possible script'
    );
    return res.send(script2json.parse(req.body.text));
  }
];
module.exports = txt2json;

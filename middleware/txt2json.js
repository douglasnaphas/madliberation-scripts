const script2json = require('../lib/script2json');
const txt2json = [
  (req, res, next) => {
    console.log(req.body);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(script2json.parse('# {{Page}}\n\n# The simplest possible script'));
  }
];
module.exports = txt2json;

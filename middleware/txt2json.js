const script2json = require('../lib/script2json');
const txt2json = [
  (req, res, next) => {
    if (!(req.body && req.body.text)) {
      return res.status(400).send({
        error:
          'POST body should be application/json,' +
          ' should have a text property, and should start with a # {{Page}}\n marker',
        exampleOKBody: {
          text: '# {{Page}}\n\n# The simplest possible script'
        }
      });
    }
    return next();
  },
  (req, res, next) => {
    return res.send(script2json.parse(req.body.text));
  }
];
module.exports = txt2json;

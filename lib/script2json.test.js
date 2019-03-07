describe('lib/script2json', () => {
  const script2json = require('./script2json');
  const testParse = ({ input, expected }) => {
    expect(script2json.parse(input)).toEqual(expected);
  };
  test('...', () => {
    const input = '# {{Page}}\n\n# The simplest possible script';
    const expected = {
      pages: [
        {
          lines: [
            {
              type: 'h1',
              segments: [
                {
                  type: 'text',
                  text: 'The simplest possible script'
                }
              ]
            }
          ]
        }
      ]
    };
    testParse({ input: input, expected: expected });
  });
});

const script2json = require('./script2json');
describe('lib/script2json.parse', () => {
  const testParse = ({ input, expected }) => {
    expect(script2json.parse(input)).toEqual(expected);
  };
  test('page, h1, no libs', () => {
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
  test.skip('page, h1, lib', () => {
    const input =
      '# {{Page}}\n\n# The simplest possible script, but with {{ a problem // a headache // I have _ // a bear in pursuit }}.';
    const expected = {
      pages: [
        {
          lines: [
            {
              type: 'h1',
              segments: [
                {
                  type: 'text',
                  text: 'The simplest possible script, but with '
                },
                {
                  type: 'lib',
                  prompt: 'a problem',
                  example: 'a headache',
                  sentence: 'I have _',
                  default: 'a bear in pursuit'
                },
                {
                  type: 'text',
                  text: '.'
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
describe('lib/script2json.parseLine', () => {
  test('# The simplest possible script', () => {
    expect(script2json.parseLine('# The simplest possible script')).toEqual({
      type: 'h1',
      segments: [
        {
          type: 'text',
          text: 'The simplest possible script'
        }
      ]
    });
  });
  test('The simplest possible script', () => {
    expect(script2json.parseLine('The simplest possible script')).toEqual({
      type: 'p',
      segments: [
        {
          type: 'text',
          text: 'The simplest possible script'
        }
      ]
    });
  });
  test.skip('text line with a lib', () => {
    expect(
      script2json.parseLine(
        'text line with {{ a strange thing // a lib prompt // I see _ // a fumpton}}'
      )
    ).toEqual({
      type: 'p',
      segments: [
        {
          type: 'text',
          text: 'The simplest possible script'
        },
        {
          type: 'lib',
          prompt: 'a strange thing',
          example: 'a lib prompt',
          sentence: 'I see _',
          default: 'a fumpton'
        }
      ]
    });
  });
  test('a {{ b}}', () => {
    // expect(script2json.parseLine('a {{ b}}').toEqual({type: 'p', }));
  });
});

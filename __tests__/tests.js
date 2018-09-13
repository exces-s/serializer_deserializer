import { serialize, deSerialize } from '../src';


describe('Serialize tests:', () => {
  test('NUMBER: 1', () => {
    const res = serialize(1);
    expect(res).toBe('0000000100000000000000000000000000000001');
  });

  test('NUMBER: 2', () => {
    const res = serialize(2);
    expect(res).toBe('0000000100000000000000000000000000000010');
  });

  test('NUMBER: -314', () => {
    const res = serialize(-314);
    expect(res).toBe('0000000111111111111111111111111011000110');
  });

  test('NUMBER MAX: 2147483647', () => {
    const res = serialize(2147483647);
    expect(res).toBe('0000000101111111111111111111111111111111');
  });

  test('TRUE', () => {
    const res = serialize(true);
    expect(res).toBe('00000010');
  });

  test('FALSE', () => {
    const res = serialize(false);
    expect(res).toBe('00000011');
  });

  test('STRING: q', () => {
    const res = serialize('q');
    expect(res).toBe('0000010000000000000000000000000100000000001110001');
  });

  test('STRING: йй', () => {
    const res = serialize('йй');
    expect(res).toBe('000001000000000000000000000000100000001000011100100000010000111001');
  });

  test('ARRAY: []', () => {
    const res = serialize([]);
    expect(res).toBe('00000101000000000000000000000000');
  });

  test('ARRAY: [1]', () => {
    const res = serialize([1]);
    expect(res).toBe('000001010000000000000000000000010000000100000000000000000000000000000001');
  });

  test('ARRAY: [1, q]', () => {
    const res = serialize([1, 'q']);
    expect(res).toBe('0000010100000000000000000000001000000001000000000000000000000000000000010000010000000000000000000000000100000000001110001');
  });

  test('ARRAY: [1, q, true]', () => {
    const res = serialize([1, 'q', true]);
    expect(res).toBe('000001010000000000000000000000110000000100000000000000000000000000000001000001000000000000000000000000010000000000111000100000010');
  });

  test('NUMBER: 0', () => {
    const res = serialize(0);
    expect(res).toBe('0000000100000000000000000000000000000000');
  });

  test('ARRAY: [1, q, true, []]', () => {
    const res = serialize([1, 'q', true, []]);
    expect(res).toBe('00000101000000000000000000000100000000010000000000000000000000000000000100000100000000000000000000000001000000000011100010000001000000101000000000000000000000000');
  });

  test('STRING: ""', () => {
    const res = serialize('');
    expect(res).toBe('00000100000000000000000000000000');
  });
});

describe('Deserialize tests:', () => {
  test('NUMBER: 1', () => {
    const res = deSerialize('0000000100000000000000000000000000000001');
    expect(res).toBe(1);
  });

  test('NUMBER: -314', () => {
    const res = deSerialize('0000000111111111111111111111111011000110');
    expect(res).toBe(-314);
  });

  test('TRUE', () => {
    const res = deSerialize('00000010');
    expect(res).toBe(true);
  });

  test('FALSE', () => {
    const res = deSerialize('00000011');
    expect(res).toBe(false);
  });

  test('STRING: q', () => {
    const res = deSerialize('0000010000000000000000000000000100000000001110001');
    expect(res).toBe('q');
  });

  test('STRING: йй', () => {
    const res = deSerialize('000001000000000000000000000000100000001000011100100000010000111001');
    expect(res).toBe('йй');
  });

  test('STRING: ""', () => {
    const res = deSerialize('00000100000000000000000000000000');
    expect(res).toBe('');
  });

  test('ARRAY: []', () => {
    const res = deSerialize('00000101000000000000000000000000');
    expect(res.length).toBe(0);
  });

  test('ARRAY: [1]', () => {
    const res = deSerialize('000001010000000000000000000000010000000100000000000000000000000000000001');
    expect(res.length).toBe(1);
    expect(res[0]).toBe(1);
  });

  test('ARRAY: [1, q]', () => {
    const res = deSerialize('0000010100000000000000000000001000000001000000000000000000000000000000010000010000000000000000000000000100000000001110001');
    expect(res.length).toBe(2);
    expect(res[0]).toBe(1);
    expect(res[1]).toBe('q');
  });

  test('ARRAY: [1, q, true]', () => {
    const res = deSerialize('000001010000000000000000000000110000000100000000000000000000000000000001000001000000000000000000000000010000000000111000100000010');
    expect(res.length).toBe(3);
    expect(res[0]).toBe(1);
    expect(res[1]).toBe('q');
    expect(res[2]).toBe(true);
  });

  test('ARRAY: [1, q, true, []]', () => {
    const res = deSerialize('00000101000000000000000000000100000000010000000000000000000000000000000100000100000000000000000000000001000000000011100010000001000000101000000000000000000000000');
    expect(res.length).toBe(4);
    expect(res[0]).toBe(1);
    expect(res[1]).toBe('q');
    expect(res[2]).toBe(true);
    expect(res[3] instanceof Array).toBe(true);
  });

  test('ARRAY: [1, q, true, [1]]', () => {
    const res = deSerialize('000001010000000000000000000001000000000100000000000000000000000000000001000001000000000000000000000000010000000000111000100000010000001010000000000000000000000010000000100000000000000000000000000000001');
    expect(res.length).toBe(4);
    expect(res[0]).toBe(1);
    expect(res[1]).toBe('q');
    expect(res[2]).toBe(true);
    expect(res[3] instanceof Array).toBe(true);
    expect((res[3])[0]).toBe(1);
  });
});

describe('Deserialize tests:', () => {
  test('SE->DESE: 1', () => {
    const data = serialize([1, 'q', true, [1]]);
    const res = deSerialize(data);
    expect(res.length).toBe(4);
    expect(res[0]).toBe(1);
    expect(res[1]).toBe('q');
    expect(res[2]).toBe(true);
    expect(res[3] instanceof Array).toBe(true);
    expect((res[3])[0]).toBe(1);
  });
});

describe('Wrong data:', () => {
  test('wrong serialize data', () => {
    const res = serialize({});
    expect(res).toBe('not serializable data');
  });

  test('wrong deserialize data', () => {
    const res = deSerialize('11');
    expect(res).toBe('not deserializable data');
  });
});

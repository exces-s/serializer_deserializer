export const typesId = {
  number: '00000001',
  boolean: {
    true: '00000010',
    false: '00000011',
  },
  string: '00000100',
  array: '00000101',
};

const completeBinNumToBitLength = (bitLength, binNumber) => {
  const binNumInString = String(binNumber);
  const addLength = bitLength - binNumInString.length;

  const addLeftZeros = (zerosCount, acc) => {
    if (zerosCount === 0) {
      return acc;
    }
    const newAcc = `0${acc}`;
    return addLeftZeros(zerosCount - 1, newAcc);
  };

  return addLeftZeros(addLength, binNumInString);
};


const serializeNum = (num) => {
  if (num >= 0) {
    return `${typesId.number}${completeBinNumToBitLength(32, num.toString(2))}`;
  }
  return `${typesId.number}${(num >>> 0).toString(2)}`;
};

const serializeBool = (bool) => {
  if (bool) {
    return `${typesId.boolean.true}`;
  }
  return `${typesId.boolean.false}`;
};

const serializeStr = (str) => {
  const length24bit = completeBinNumToBitLength(24, str.length.toString(2));
  const binStr = str.split('')
    .reduce((acc, char) => {
      const binChar = char.charCodeAt().toString(2);
      return [...acc, completeBinNumToBitLength(17, binChar)];
    }, [])
    .join('');

  return `${typesId.string}${length24bit}${binStr}`;
};
const serializeArr = (arr, serializeFn) => {
  const length24bit = completeBinNumToBitLength(24, arr.length.toString(2));
  const serializedArrItems = arr.map(serializeFn).join('');
  return `${typesId.array}${length24bit}${serializedArrItems}`;
};


const serialize = (data) => {
  if (typeof data === 'number') {
    return serializeNum(data);
  }
  if (typeof data === 'boolean') {
    return serializeBool(data);
  }
  if (typeof data === 'string') {
    return serializeStr(data);
  }
  if (data instanceof Array) {
    return serializeArr(data, serialize);
  }
  return 'not serializable data';
};


export default serialize;

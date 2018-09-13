import { typesId } from './serialize';

const negativeBinNumToDec = (negativeBinNum) => {
  let result = parseInt(negativeBinNum, 2);
  result <<= 32 - 10; // 32 digit capacity - radix(decimal)
  result >>= 32 - 10;
  return result;
};

const getBinArrLength = (arrItemsCount, binData) => {
  const iter = (count, binArrLengthAcc, data) => {
    if (count === arrItemsCount) {
      return binArrLengthAcc;
    }
    const newCount = count + 1;
    const newBinArrLengthAcc = binArrLengthAcc + getFirstBinItemLength(data);
    const newData = data.slice(newBinArrLengthAcc);
    return iter(newCount, newBinArrLengthAcc, newData);
  };
  return iter(0, 0, binData);
};

const getFirstBinItemLength = (binData) => {
  const binId = binData.slice(0, 8);
  const restData = binData.slice(8);

  if (binId === (typesId.boolean.true || typesId.boolean.false)) {
    return binId.length;
  }
  if (binId === typesId.number) {
    const bitNumLength = 32;
    return binId.length + bitNumLength;
  }
  if (binId === typesId.string) {
    const bitCharLength = 17;
    const charsBinCount = restData.slice(0, 24);
    const charsDecCount = parseInt(charsBinCount, 2);
    return binId.length + charsBinCount.length + (charsDecCount * bitCharLength);
  }
  if (binId === typesId.array) {
    const binItemsCount = restData.slice(0, 24);
    const decItemsCount = parseInt(binItemsCount, 2);
    const firstItemStartIndex = 32;
    const arrLength = getBinArrLength(decItemsCount, binData.slice(firstItemStartIndex));
    return binId.length + binItemsCount.length + arrLength;
  }
  return undefined;
};


const deSerializeNum = (binData) => {
  if (binData[0] === 0) {
    return parseInt(binData, 10);
  }
  return negativeBinNumToDec(binData);
};

const deSerializeStr = (binData) => {
  const charsBinCount = binData.slice(8, 32);
  const charsDecCount = parseInt(charsBinCount, 2);
  const binStr = binData.slice(32);
  const binCharLength = binStr.length / charsDecCount;

  const iter = (startIndex, acc) => {
    if (startIndex >= binStr.length - 1) {
      return acc;
    }
    const endIndex = binCharLength + startIndex;
    const newAcc = [...acc, binStr.slice(startIndex, endIndex)];
    const newStartIndex = startIndex + binCharLength;
    return iter(newStartIndex, newAcc);
  };

  return iter(0, [])
    .map(binCharCode => parseInt(binCharCode, 2))
    .map(charCode => String.fromCharCode(charCode))
    .join('');
};

const deSerializeArr = (binData, deSerializeFn) => {
  const binEntity = binData.slice(8);
  const binArrItemsCount = binEntity.slice(0, 24);
  const decArrItemsCount = parseInt(binArrItemsCount, 2);
  if (decArrItemsCount === 0) {
    return [];
  }
  const binArr = binEntity.slice(24);

  const iter = (data, acc) => {
    if (acc.length === decArrItemsCount) {
      return acc;
    }
    const firstItemLength = getFirstBinItemLength(data);
    const newAcc = [...acc, data.slice(0, firstItemLength)];
    const newData = data.slice(firstItemLength);
    return iter(newData, newAcc);
  };

  const arr = iter(binArr, [])
    .map(item => deSerializeFn(item));
  return arr;
};

const deSerialize = (binData) => {
  const binId = binData.slice(0, 8);
  const binEntity = binData.slice(8);

  if (binId === typesId.number) {
    return deSerializeNum(binEntity);
  }
  if (binId === typesId.boolean.true) {
    return true;
  }
  if (binId === typesId.boolean.false) {
    return false;
  }
  if (binId === typesId.string) {
    return deSerializeStr(binData);
  }
  if (binId === typesId.array) {
    return deSerializeArr(binData, deSerialize);
  }
  return 'not deserializable data';
};


export default deSerialize;

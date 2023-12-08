const compressVideo = (data, newSize) => {
  const resizedBuffer = data.buffer.slice(0, newSize);
  data.size = newSize;
  data.buffer = resizedBuffer;

  return data;
};

module.exports = compressVideo;

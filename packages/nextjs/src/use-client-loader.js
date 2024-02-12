// Need this in CJS and as it's own file to copy
// during build because Webpack expects it to be a file
module.exports = function (source) {
  return `"use client";\n` + source;
};

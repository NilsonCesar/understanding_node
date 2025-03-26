const fs = require("node:fs/promises");

(async () => {
  console.time("writeMany");
  const fileHandler = await fs.open("test.txt", "w");
  const stream = fileHandler.createWriteStream();

  // const buffer0 = Buffer.alloc(16383, "a");
  // const buffer1 = Buffer.alloc(1, "a");
  // console.log(stream.write(buffer0));
  // console.log(stream.write(buffer1));
  // console.log(stream.write(buffer1));
  // console.log(stream.writableHighWaterMark)

  // stream.on("drain", () => {
  //   console.log("drain");
  // });

  const writeMany = (i) => {
    while (i < 1e6) {
      const buffer = Buffer.from(` ${i} `, "utf-8");
      let writable = stream.write(buffer);
      if (i === 1e6 - 1) stream.end();
      i++;
      if (!writable) return i;
    }
  };

  let i = writeMany(0);

  stream.on("drain", () => {
    i = writeMany(i);
  });

  stream.on('close', () => {
    console.log('closed');
  });

  stream.on("finish", () => {
    console.log('finished');
    console.timeEnd("writeMany");
    fileHandler.close();
  });
})();


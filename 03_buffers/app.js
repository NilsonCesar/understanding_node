const { Buffer, constants } = require("buffer");

const memoryContainer = Buffer.alloc(4);

memoryContainer.writeInt8(-34, 0);
memoryContainer[1] = 222;

console.log(memoryContainer)
console.log(memoryContainer.readInt8(0))
console.log(memoryContainer[1])

const buffer = Buffer.from("486921", "hex");
console.log(buffer.toString("utf-8"));

console.log(constants.MAX_LENGTH);

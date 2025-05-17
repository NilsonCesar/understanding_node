let obj = { name: "bob" };
let num = 79;

function modify(o, n) {
  o.name = "Dylan";
  n = 1000;
}

console.log(obj.name);
console.log(num);
modify(obj, num);
console.log(obj.name);
console.log(num);

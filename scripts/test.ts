const anExampleVariable = "1234567890qwertyuiopasdfghjklzxc"
const fixedIdCode = Buffer.alloc(32, anExampleVariable); // Change size as required
console.log(fixedIdCode);
const data = fixedIdCode.toString('utf-8');
console.log(data); // Output: Hello, World!
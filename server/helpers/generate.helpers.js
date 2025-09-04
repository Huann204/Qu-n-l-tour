module.exports.generateRandomNumber = (length) => {
  const characters = "0123456789";
  let result = "";
  for(let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Phương thức charAt() 
 *  - để lấy ra ký tự tại một vị trí (index) trong chuỗi.
 *  EX:
 *  let text = "Hello";
    let c = text.charAt(1);
    console.log(c); // e
* 
 */
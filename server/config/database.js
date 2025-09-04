const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await  mongoose.connect(process.env.DATABASE);
    console.log("Kết nối DB thành công!");
  } catch (error) {
    console.log("Kết nối DB thất bại!");
    console.log(error); 
  }
 
}
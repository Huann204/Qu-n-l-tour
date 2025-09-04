module.exports.home = async (req, res) => {

  res.render('admin/pages/test.pug', { 
    title: 'Hey', 
    message: 'Hello! Home there!',
  })
}
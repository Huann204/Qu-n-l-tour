module.exports.imagePost = async (req, res) => {
  res.json({
    location: req.file.path
  })
}

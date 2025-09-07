const router = require('express').Router();
const multer  = require('multer');


const categoryController = require("../../controllers/admin/category.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });
router.get('/list', categoryController.list);

router.get('/create', categoryController.create);

router.post(
  '/create', 
  upload.single('avatar'),
  categoryController.createPost
);

router.get("/edit/:id", categoryController.edit);

router.patch(
  '/edit/:id', 
  upload.single('avatar'),
  categoryController.editPatch
);

module.exports = router;
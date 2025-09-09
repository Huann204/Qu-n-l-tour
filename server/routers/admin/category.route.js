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

<<<<<<< HEAD
router.get("/edit/:id", categoryController.edit);

router.patch(
  '/edit/:id', 
  upload.single('avatar'),
  categoryController.editPatch
);

router.patch(
  '/delete/:id', 
  categoryController.deletePatch
);

=======
>>>>>>> b69aa09e4e5cd0eaf4ccd4486ab736e74dbbcb73
module.exports = router;
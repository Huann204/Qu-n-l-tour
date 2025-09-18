const router = require('express').Router();
const multer  = require('multer');

const categoryBlogController = require("../../controllers/admin/category-blog.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', categoryBlogController.list);

router.get('/create', categoryBlogController.create);

router.post('/create', 
  upload.single('avatar'),
  categoryBlogController.createPost);

router.get("/edit/:id", categoryBlogController.edit);

router.patch(
  '/edit/:id', 
  upload.single('avatar'),
  categoryBlogController.editPatch
);

router.patch(
  '/delete/:id', 
  categoryBlogController.deletePatch
);

router.patch(`/change-multi`, categoryBlogController.changeMultiPatch);


module.exports = router;

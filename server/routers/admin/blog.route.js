const router = require('express').Router();
const multer  = require('multer');


const blogController = require("../../controllers/admin/blog.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', blogController.list);

router.get('/create', blogController.create);

router.post('/create', 
  upload.single('avatar'),
  blogController.createPost);

router.get("/edit/:id", blogController.edit);

router.patch(
  '/edit/:id', 
  upload.single('avatar'),
  blogController.editPatch
);

router.patch(
  '/delete/:id', 
  blogController.deletePatch
);

router.patch(`/change-multi`, blogController.changeMultiPatch);

router.get('/trash', blogController.trash);

router.patch('/undo/:id', blogController.undoPatch);

router.patch('/delete-destroy/:id', blogController.deleteDestroyPatch);

router.patch('/trash/change-multi', blogController.trashChangeMultiPatch);

module.exports = router;

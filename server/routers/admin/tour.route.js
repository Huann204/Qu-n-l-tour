const router = require('express').Router();
const multer  = require('multer');

const tourController = require("../../controllers/admin/tour.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const tourValidate = require("../../validates/admin/tour.validate");

const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', tourController.list)

router.get('/create', tourController.create)

router.post('/create',
   upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  tourValidate.createPost,
  tourController.createPost
);

router.get('/edit/:id', tourController.edit);

router.patch(
  '/edit/:id', 
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),  
  tourValidate.createPost,
  tourController.editPatch
);

router.patch(
  '/delete/:id', 
  tourController.deletePatch
);

router.patch('/change-multi', tourController.tourChangeMultiPatch);

router.get('/trash', tourController.trash);

router.patch('/undo/:id', tourController.undoPatch);

router.patch('/delete-destroy/:id', tourController.deleteDestroyPatch);

router.patch('/trash/change-multi', tourController.trashChangeMultiPatch);


module.exports = router

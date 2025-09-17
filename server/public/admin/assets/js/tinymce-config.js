// TinyMCE
function initTinyMCE(id) {
  tinymce.init({
    selector: id || '[textarea-mce]',
    plugins: 'charmap codesample emoticons help image link lists advlist media preview searchreplace table wordcount',
    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap | codesample | emoticons | image | link | numlist bullist | media | preview | searchreplace | help',
    images_upload_url: `/${pathAdmin}/upload/image`
  });
}

initTinyMCE();
// End TinyMCE
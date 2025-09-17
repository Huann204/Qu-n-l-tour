const Category = require("../models/category.model");

const buildCategoryTree = (categories, parentId = "") => {
  const tree = [];

  categories.forEach(item => {
    if(item.parent == parentId) {
      const children = buildCategoryTree(categories, item.id);

      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children
      })
    }
  });

  return tree;
}

module.exports.buildCategoryTree = buildCategoryTree;

// Lấy tất cả id của danh mục cha + con
module.exports.getAllSubcategoryIds = async (parentId) => {
  const result = [parentId];

  const findChildren = async (currentId) => {

    const children = await Category
      .find({
        parent: currentId,
        deleted: false,
        status: "active"
      });


      for (const child of children) {
          result.push(child.id);
          await findChildren(child.id)
      }
  };


  await findChildren(parentId);

  return result;
}

// Hết lấy tất cả id của danh mục cha + con

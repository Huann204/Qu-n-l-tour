const buildCategoryTree = (categories, parentId = "") => {
  const tree = [];

  categories.forEach(item => {
    if(item.parent == parentId) {
      const children = buildCategoryTree(categories, item.id);

      tree.push({
        id: item.id,
        name: item.name,
        children: children
      })
    }
  });

  return tree;
}

module.exports.buildCategoryTree = buildCategoryTree;

// [
//   {
//     id: "",
//     name: "Tour trong nước",
//     Children: [
//       {
//         id: "",
//         name: "Tour miền bắc",
//         Children: []
//       },
//       {
//         id: "",
//         name: "Tour miền Trung",
//         Children: []
//       },
//     ]
//   },
//   {
//     id: "",
//     name: "Tour nước ngoài",
//     Children: [
//       {
//         id: "",
//         name: "Tour châu Âu",
//         Children: []
//       },
//       {
//         id: "",
//         name: "Tour Châu Á",
//         Children: []
//       },
//     ]
//   },
// ]
const forEachTree = (tree, fixFunc, children = 'children', changeChildren = '') => {
  const result = [];
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i][children] && tree[i][children].length > 0) {
      const temp = fixFunc(tree[i]);
      if (temp) {
        const itemTemp = { ...temp };
        itemTemp[changeChildren || children] = forEachTree(
          tree[i][children],
          fixFunc,
          children,
        );
        result.push(itemTemp);
      }
    } else {
      const temp = fixFunc(tree[i]);
      if (temp) {
        result.push(temp);
      }
    }
  }
  return result;
};

export default forEachTree;

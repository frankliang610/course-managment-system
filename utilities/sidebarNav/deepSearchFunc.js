export const deepSearchFactory = (fn, value, key) => {
  return function deepSearch(data) {
    const headNode = data.slice(0, 1)[0];
    const restNodes = data.slice(1);

    if (headNode) {
      if (fn(headNode, value)) {
        return headNode;
      }

      if (headNode[key]) {
        const res = deepSearch(headNode[key]);

        if (res) {
          return res;
        }
      }
    }

    if (restNodes.length) {
      const res = deepSearch(restNodes);

      if (res) {
        return res;
      }
    }

    return null;
  };
};

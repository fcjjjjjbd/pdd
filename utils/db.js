// 数据库操作工具

// 获取数据库引用
export const db = uniCloud.database();

// 获取云对象引用
export const goodsBackend = uniCloud.importObject("goods-backend");

// 通用查询方法
export const query = async (collection, where = {}, options = {}) => {
  try {
    const { data } = await db.collection(collection).where(where).get();
    return { success: true, data };
  } catch (error) {
    console.error(`查询${collection}失败:`, error);
    return { success: false, error };
  }
};

// 通用添加方法
export const add = async (collection, data) => {
  try {
    const res = await db.collection(collection).add(data);
    return { success: true, id: res.id };
  } catch (error) {
    console.error(`添加到${collection}失败:`, error);
    return { success: false, error };
  }
};

// 通用更新方法
export const update = async (collection, id, data) => {
  try {
    await db.collection(collection).doc(id).update(data);
    return { success: true };
  } catch (error) {
    console.error(`更新${collection}失败:`, error);
    return { success: false, error };
  }
};

// 通用删除方法
export const remove = async (collection, id) => {
  try {
    await db.collection(collection).doc(id).remove();
    return { success: true };
  } catch (error) {
    console.error(`删除${collection}失败:`, error);
    return { success: false, error };
  }
};
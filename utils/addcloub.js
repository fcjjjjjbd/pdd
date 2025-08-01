// 云存储操作工具

/**
 * 云存储操作工具类
 * 提供图片上传、删除等功能
 */
const addcloubobj = {
  /**
   * 上传图片到云存储
   * @param {Array} tempFilePaths 临时文件路径数组
   * @returns {Promise} 上传结果，包含文件URL等信息
   */
  addimg: function(tempFilePaths) {
    return new Promise((resolve, reject) => {
      const uploadTasks = tempFilePaths.map(filePath => {
        return uniCloud.uploadFile({
          filePath,
          cloudPath: `images/${Date.now()}-${Math.floor(Math.random() * 1000)}${filePath.match(/\.[^.\\/:*?"<>|]+$/)[0]}`,
        });
      });
      
      Promise.all(uploadTasks)
        .then(results => {
          const fileList = results.map(res => ({
            url: res.fileID,
            name: res.fileID.substring(res.fileID.lastIndexOf('/') + 1)
          }));
          resolve(fileList);
        })
        .catch(err => {
          console.error('上传图片失败:', err);
          reject(err);
        });
    });
  },
  
  /**
   * 从云存储删除图片
   * @param {Array} fileList 文件URL数组
   * @returns {Promise} 删除结果
   */
  removeimg: function(fileList) {
    if (!fileList || fileList.length === 0) {
      return Promise.resolve();
    }
    
    return uniCloud.deleteFile({
      fileList: fileList
    })
    .then(res => {
      console.log('删除成功', res);
      return res;
    })
    .catch(err => {
      console.error('删除失败:', err);
      throw err;
    });
  }
};

export default addcloubobj;
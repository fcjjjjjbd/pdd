 {
    persist: {
      key: "navlist-store", // 自定义存储的键名
      storage: {
        getItem: (key) => {
          return uni.getStorageSync(key);
        },
        setItem: (key, value) => {
          uni.setStorageSync(key, value);
        },
      },
      paths: ["leftList", "rightList"], // 只持久化指定的状态
    },
  }
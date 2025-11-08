// 合并地址字符串
export function addressff(string1, string2) {
  return `${string1}${string2}`;
}
export function hideLoading() {
  uni.hideLoading();
}
export function showLoading(options = "") {
  if (typeof options === "string") options = {
    title: options
  };
  const {
    title = "", mask = false
  } = options;
  return uni.showLoading({
    title,
    mask,
    ...options,
  });
}
//路由跳转方法
export const routerTo = (url, type = "navigate") => {
  if (type === "navigate") {
    uni.navigateTo({
      url,
    });
  } else if (type === "redirect") {
    uni.redirectTo({
      url,
    });
  } else if (type === "reLaunch") {
    uni.reLaunch({
      url,
    });
  } else {
    return "错误信息";
  }
};
export function showToast({
  title = "",
  icon = "none",
  mask = false,
  duration = 1500,
} = {}) {
  uni.showToast({
    title: String(title),
    icon,
    mask,
  });
}

//判断是否管理员
export function isAdminRole() {
  return uniCloud.getCurrentUserInfo().role.includes("admin") ? true : false;
}
//审核状态组
export const stateLists = [{
    value: "0",
    text: "审核中",
    color: "#E43D33",
    bgColor: "#FDEDD9",
  },
  {
    value: "1",
    text: "审核通过",
    color: "#18BC37",
    bgColor: "#D1F2D7",
  },
  {
    value: "2",
    text: "审核不通过",
    color: "#E43D33",
    bgColor: "#E43D33",
  },
];
//传值返回，状态审核对象
export function stateFormat(value) {
  return stateLists.find((item) => item.value == value);
}
export function showModal(options = {}) {
  const {
    title = "提示",
      content = "",
      confirmText = "确认",
      cancelText = "取消",
      showCancel = true,
  } = options;

  return new Promise((resolve, reject) => {
    uni.showModal({
      title,
      content,
      confirmText,
      cancelText,
      showCancel,
      success: (res) => {
        resolve(res.confirm);
      },
      fail: (err) => {
        reject(err);
      },
      ...options,
    });
  });
}
// 压缩图片上传
export async function convertImageToWebP(blobUrl, scale = 0.6) {
  return new Promise((resolve, reject) => {
    // 创建一个Image对象
    const img = new Image();
    img.crossOrigin = "anonymous"; // 处理跨域问题

    img.onload = () => {
      // 创建一个canvas元素
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 设置canvas的宽度和高度为图像尺寸乘以缩放比例
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // 将图像绘制到canvas上，并应用缩放比例
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 将canvas内容转换为WebP格式的Blob
      canvas.toBlob((webpBlob) => {
        if (webpBlob) {
          // 创建一个新的Blob URL
          const webpBlobUrl = URL.createObjectURL(webpBlob);
          resolve(webpBlobUrl);
        } else {
          reject(new Error("Failed to convert image to WebP format."));
        }
      }, "image/webp");
    };

    img.onerror = (error) => {
      reject(new Error("Failed to load image from blob URL."));
    };

    // 设置Image对象的src为传入的blob URL
    img.src = blobUrl;
  });
}
// 价格把分换成元
export function priceFormat(num) {
  return num / 100;
}

//日期格式化
export function formatDate(timestamp, format = "yyyy-MM-dd hh:mm:ss") {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return format
    .replace("yyyy", year)
    .replace("MM", month)
    .replace("dd", day)
    .replace("hh", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

//超出指定字符显示省略号
export function truncateString(str, num) {
  if (str.length > num) {
    return str.substring(0, num);
  } else {
    return str;
  }
}
// 参数金额把元转化分
export function convertYuanToFen(amount) {
  return parseFloat((amount / 100).toFixed(2));
}
//性别格式化
export function formatGender(value) {
  const genderMap = {
    0: "保密",
    1: "男",
    2: "女",
  };
  return genderMap[value] || "保密";
}

// 防止写代码混乱
export function removeHtmlTags(text) {
  return text.replace(/<[^>]*>/g, "");
}
//向外导出省份
export function getProvince() {
  return new Promise((resolve, reject) => {
    let historyProvince = uni.getStorageSync("historyProvince");
    if (historyProvince) {
      if (Date.now() - historyProvince.time > 1000 * 60 * 60) {
        getIp()
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        resolve(historyProvince.province);
      }
    } else {
      getIp()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

//获取所在省市
function getIp() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://restapi.amap.com/v3/ip?key=4a43fb1fc001e386a52215b6feea63f4",
      success: (res) => {
        let str = "";
        typeof res.data.province == "string"
          ? (str = res.data.province)
          : (str = "火星");
        resolve(str);
        let obj = {
          province: str,
          time: Date.now(),
        };
        uni.setStorageSync("historyProvince", obj);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

// ordernum我订add单个数(防无限新增),sfselfinfo师傅接单自己信息,editobj批发商品详情对象
import { defineStore } from "pinia";

export const usedsmaxStore = defineStore(
  "dsmax",
  () => {
    const ordernum = ref(0);
    const sfselfinfo = ref(null);
    const editobj = ref(null);
    // 修改批发商品详情对象
    const changeditobj = async (e) => {
      editobj.value = e;
    };
    const changenum = async (e) => {
      ordernum.value = e;
    };
    const sfselfinfoff = async (e) => {
      sfselfinfo.value = e;
    };
    return {
      editobj,
      changeditobj,
      ordernum,
      changenum,
      sfselfinfo,
      sfselfinfoff,
    };
  },
  {
    persist: {
      key: "dsmax-store",
      storage: {
        getItem: (key) => {
          return uni.getStorageSync(key);
        },
        setItem: (key, value) => {
          uni.setStorageSync(key, value);
        },
      },
      paths: ["ordernum", "sfselfinfo", "editobj"],
    },
  }
);

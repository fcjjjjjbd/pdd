// 首页分类数据
import { defineStore } from "pinia";
import { ref } from "vue";

const db = uniCloud.database();
const dsyunobj = uniCloud.importObject("goods-backend");

export const useNavlistStore = defineStore("navlist", () => {
  const leftList = ref([]);
  const rightList = ref([]);

  const getLeftList = async () => {
    if (leftList.value.length === 0) {
      const { errCode, data } = await dsyunobj.searchfenlei();
      if (errCode === 0 && data.length > 0) {       
        leftList.value = data;
      }
    }
    return leftList.value;
  };

  const getRightList = async () => {
    if (rightList.value.length === 0) {
      const { errCode, data } = await dsyunobj.searchfenleilist();
      if (errCode === 0) {
        rightList.value = data;
      }
    }
    return rightList.value;
  };

  return {
    leftList,
    rightList,
    getLeftList,
    getRightList,
  };
});
import {
  routerTo,
  isAdminRole,
  showModal,
  showLoading,
  showToast,
} from "@/utils/common.js";

export function usePay() {
  const payRef = ref(null);
  const paySuccess = (e) => {
    console.log('success', e);
    if (e.user_order_success) {
      showToast('支付成功');
      //    let status = unref(deliveryType) == 0 ? 2 : 1;
      routerTo('/pages/my/orderList?status=' + status, 'redirectTo');
    } else {
      showToast('支付异常，请联系管理员');
    }
  };
  const payCancel = async (e) => {
    console.log('cancel', e);
    if (await showModal({
        title: '已取消支付',
        content: '跳转至我的订单可以继续完成支付',
        showCancel: false
      })) {
      routerTo('/pages/my/orderList?status=0', 'redirectTo');
    }
  };
  const payFail = (e) => {
    console.log('fail', e);
  };

  const payCreate = () => {
    cartStore.clearCart();
  };

  return {
    payRef,
    paySuccess,
    payCancel,
    payFail,
    payCreate
  };
}
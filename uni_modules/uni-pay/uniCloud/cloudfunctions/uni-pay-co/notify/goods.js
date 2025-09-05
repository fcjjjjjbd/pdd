// 师傅广告费回调
const db = uniCloud.database(); // 连接云对象整体
module.exports = async (obj) => {
  let user_order_success = true;
  let {
    data = {}
  } = obj;
  let {
    order_no,
    out_trade_no,
    total_fee
  } = data; // uni-pay-orders 表内的数据均可获取到
  await db.collection("pay-order").where({
    order_no
  }).update({
    status: 1
  })

  return user_order_success;
};
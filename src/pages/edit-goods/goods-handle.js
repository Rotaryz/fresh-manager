export function RBaseData(data) {
  const sku = data.goods_skus && data.goods_skus[0] || {}
  return {
    isFinish: data.complete_status,
    goodsName: data.name, // 商品名称
    describe: data.describe, // 商品描述
    goodsTypeId: data.goods_material_category_id, // 商品类目
    basicUnit: sku.base_unit, // 基础单位
    coverImageList: data.goods_banner_images || [], // 封面图
    videoList: data.goods_videos || [], // 视频
    detailImageList: data.goods_detail_images || [], // 详情图片
  }
}

export function FBaseData(data) {
  return {
    "goods_material_category_id": data.goodsTypeId,
    "name": data.goodsName,
    "describe": data.describe,
    // "is_presale": 0,
    "goods_main_images": data.coverImageList[0] && [data.coverImageList[0]] || [],
    "goods_banner_images": data.coverImageList,
    "goods_videos": data.videoList,
    "goods_detail_images": data.detailImageList,
    "goods_skus": [
      {
        // "goods_material_name": "",
        "base_unit": data.basicUnit,
        // "sale_unit": "袋",
        // "purchase_unit": "袋",
        // "base_sale_rate": "1.00",
        // "base_purchase_rate": "1.00",
        // "goods_sku_encoding": "LSL000050",
        // "presale_usable_stock": 200,
        // "warehouse_usable_stock": 0,
        // "supplier_id": 3,
        // "damage_rate": "0.00",
        // "purchase_price": "13.80",
        // "is_weight": 0
      }
    ],
    "save_type" : "base"
  }
}

export function RSellData(data) {
  return {
    // isFinish: data.complete_status,
    // goodsName: data.name, // 商品名称
    // describe: data.describe, // 商品描述
    // goodsTypeId: data.goods_material_category_id, // 商品类目
    // basicUnit: sku.base_unit, // 基础单位
    // coverImageList: data.goods_banner_images || [], // 封面图
    // videoList: data.goods_videos || [], // 视频
    // detailImageList: data.goods_detail_images || [], // 详情图片
    aliasName: '', // 商品别名
    supply: '', // 供应商
    purchaseUnit: '', // 采购单位
    purchaseSize: '', // 采购规格
    purchasePrice: '', // 采购单价
    purchaseCycle: '', // 采购周期
    purchaseCollective: false, // 集中采购
    preSell: false, // 销售类型
    goodsCategory: '', // 商品分类
    goodsCode: '', // 商品编码
    sellUnit: '', // 销售单位
    sellSize: '', // 销售规格
    sellPrice: '', // 销售单价
    underlinePrice: '', // 划线价
    stock: '', // 库存
    originSales: '', // 初始销量
    commissionType: false, // 团长佣金类型
    commission: '', // 佣金
  }
}

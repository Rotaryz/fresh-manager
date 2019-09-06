export function RBaseData(data) {
  const sku = data.goods_skus && data.goods_skus[0] || {}
  return {
    isFinish: !!data.all_complete_status,
    goodsName: data.name, // 商品名称
    describe: data.describe, // 商品描述
    goodsTypeId: data.goods_material_category_id, // 商品类目
    basicUnit: sku.base_unit, // 基础单位
    coverImageList: data.goods_banner_images || [], // 封面图
    videoList: data.goods_videos || [], // 视频
    detailImageList: data.goods_detail_images || [], // 详情图片
    goods_sku_id: sku.goods_sku_id,
  }
}

// 复制基础信息
export function RCopyBaseData(data) {
  return {
    goodsName: data.name, // 商品名称
    describe: data.describe, // 商品描述
    goodsTypeId: data.goods_material_category_id, // 商品类目
    basicUnit: data.base_unit, // 基础单位
    coverImageList: resolveImagesCopy(data.goods_banner_images) || [], // 封面图
    videoList: resolveVideosCopy(data.goods_videos) || [], // 视频
    detailImageList: resolveImagesCopy(data.goods_detail_images) || [], // 详情图片
  }
}

export function FBaseData(data) {
  return {
    "goods_material_category_id": data.goodsTypeId,
    "name": data.goodsName,
    "describe": data.describe,
    "goods_main_images": data.coverImageList[0] && [data.coverImageList[0]] || [],
    "goods_banner_images": data.coverImageList,
    "goods_videos": formatVideos(data.videoList),
    "goods_detail_images": data.detailImageList,
    "goods_skus": [
      {
        "base_unit": data.basicUnit,
        "goods_sku_id": data.goods_sku_id
      }
    ],
    "save_type" : "base"
  }
}

export function RSellData(data) {
  const sku = data.goods_skus && data.goods_skus[0] || {}
  // 商品类型(0=未知;1=普通商品;2=集采商品)
  const TPL_GOODS_TYPE = {
    1: false,
    2: true
  }
  return {
    isFinish: !!data.all_complete_status,
    goods_sku_id: sku.goods_sku_id,
    supplier_name: sku.supplier_name,
    aliasName: sku.goods_material_name, // 商品别名
    supply: sku.supplier_id, // 供应商
    purchaseUnit: sku.purchase_unit, // 采购单位
    purchaseSize: sku.base_purchase_rate, // 采购规格
    purchasePrice: sku.purchase_price, // 采购单价
    purchaseCycle: data.purchase_cycle, // 采购周期
    purchaseCollective: !!TPL_GOODS_TYPE[data.goods_type], // 集中采购
    preSell: !!data.is_presale, // 销售类型
    goodsCategory: data.goods_category_id, // 商品分类
    goodsCode: sku.goods_sku_encoding, // 商品编码
    sellUnit: sku.sale_unit, // 销售单位
    sellSize: sku.base_sale_rate, // 销售规格
    sellPrice: sku.trade_price, // 销售单价
    underlinePrice: sku.original_price, // 划线价
    stock: sku.presale_usable_stock, // 库存
    originSales: data.init_sale_count, // 初始销量
    commissionType: /^[0-9]/.test(data.commission_rate), // 团长佣金类型
    commission: data.commission_rate, // 佣金
  }
}

export function FSellData(data) {
  return {
    "save_type":"sale",
    "goods_material_name":data.aliasName,
    "purchase_cycle":data.purchaseCycle,
    "is_presale":data.preSell && 1 || 0,
    "goods_type":data.purchaseCollective && 2 || 1,
    "goods_category_id":data.goodsCategory,
    "init_sale_count":data.originSales,
    "commission_rate":data.commissionType ? data.commission : '',
    "goods_skus":[
      {
        "goods_sku_id":data.goods_sku_id,
        "supplier_id":data.supply,
        // "supplier_name":"自采供应商",
        "purchase_unit":data.purchaseUnit,
        "base_purchase_rate": data.purchaseSize,
        "purchase_price": data.purchasePrice,
        "goods_sku_encoding":data.goodsCode,
        "sale_unit":data.sellUnit,
        "base_sale_rate":data.sellSize,
        "trade_price":data.sellPrice,
        "original_price":data.underlinePrice,
        "presale_usable_stock":data.stock
      }
    ]
  }
}

// 死变态
function formatVideos(arr = []) {
  return arr.map(item => {
    if (item.id !== 0) {
      item.file_id = item.id
      return {
        file_id: item.id
      }
    }
    return item
  })
}

// 复制视频文件解析
function resolveVideosCopy(arr = []) {
  return arr.map(item => {
    return {
      file_id: item.id,
      id: 0,
      full_url: item.full_url
    }
  })
}

// 复制图片
function resolveImagesCopy(arr = []) {
  return arr.map(item => {
    item.id = 0
    return item
  })
}

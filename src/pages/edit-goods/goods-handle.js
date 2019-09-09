import {REG_MONEY} from '@utils/common'
export function RBaseData(data, isCopy) {
  const sku = (data.goods_skus && data.goods_skus[0]) || {}
  const isFinish = isCopy ? false : !!data.all_complete_status
  return {
    isFinish,
    goodsName: data.name, // 商品名称
    describe: data.describe, // 商品描述
    goodsTypeId: data.goods_material_category_id, // 商品类目
    basicUnit: sku.base_unit, // 基础单位
    coverImageList: (isCopy ? resolveImagesCopy(data.goods_banner_images) : data.goods_banner_images) || [], // 封面图
    videoList: (isCopy ? resolveVideosCopy(data.goods_videos) : data.goods_videos) || [], // 视频
    detailImageList: (isCopy ? resolveImagesCopy(data.goods_detail_images) : data.goods_detail_images) || [], // 详情图片
    goods_sku_id: sku.goods_sku_id
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
    detailImageList: resolveImagesCopy(data.goods_detail_images) || [] // 详情图片
  }
}

export function FBaseData(data, isCopy) {
  return {
    goods_material_category_id: data.goodsTypeId,
    name: data.goodsName,
    describe: data.describe,
    goods_main_images: (data.coverImageList[0] && [data.coverImageList[0]]) || [],
    goods_banner_images: data.coverImageList,
    goods_videos: formatVideos(data.videoList),
    goods_detail_images: data.detailImageList,
    goods_skus: [
      {
        base_unit: data.basicUnit,
        goods_sku_id: isCopy? 0 : data.goods_sku_id
      }
    ],
    save_type: 'base'
  }
}

export function RSellData(data, isCopy) {
  const sku = (data.goods_skus && data.goods_skus[0]) || {}
  // 商品类型(0=未知;1=普通商品;2=集采商品)
  const TPL_GOODS_TYPE = {
    1: false,
    2: true
  }
  const isFinish = isCopy ? false : !!data.all_complete_status
  return {
    isFinish,
    goods_sku_id: sku.goods_sku_id,
    supplier_name: sku.supplier_name,
    aliasName: sku.goods_material_name, // 商品别名
    supply: sku.supplier_id, // 供应商
    purchaseUnit: sku.purchase_unit, // 采购单位
    purchaseSize: zero2Empty(sku.base_purchase_rate), // 采购规格
    purchasePrice: zero2Empty(sku.purchase_price), // 采购单价
    purchaseCycle: data.purchase_cycle, // 采购周期
    purchaseCollective: !!TPL_GOODS_TYPE[data.goods_type], // 集中采购
    preSell: !!data.is_presale, // 销售类型
    goodsCategory: data.goods_category_id, // 商品分类
    goodsCode: sku.goods_sku_encoding, // 商品编码
    sellUnit: sku.sale_unit, // 销售单位
    sellSize: zero2Empty(sku.base_sale_rate), // 销售规格
    sellPrice: zero2Empty(sku.trade_price), // 销售单价
    underlinePrice: zero2Empty(sku.original_price), // 划线价
    stock: zero2Empty(sku.presale_usable_stock) || 0, // 库存
    originSales: data.init_sale_count, // 初始销量
    commissionType: /^[0-9]/.test(data.commission_rate), // 团长佣金类型
    commission: data.commission_rate // 佣金
  }
}

export function FSellData(data) {
  return {
    save_type: 'sale',
    purchase_cycle: data.purchaseCycle,
    is_presale: (data.preSell && 1) || 0,
    goods_type: (data.purchaseCollective && 2) || 1,
    goods_category_id: data.goodsCategory,
    init_sale_count: data.originSales,
    commission_rate: data.commissionType ? data.commission : '',
    goods_skus: [
      {
        goods_material_name: data.aliasName,
        goods_sku_id: data.goods_sku_id,
        supplier_id: data.supply,
        purchase_unit: data.purchaseUnit,
        base_purchase_rate: data.purchaseSize,
        purchase_price: data.purchasePrice,
        goods_sku_encoding: data.goodsCode,
        sale_unit: data.sellUnit,
        base_sale_rate: data.sellSize,
        trade_price: data.sellPrice,
        original_price: data.underlinePrice,
        presale_usable_stock: data.stock
      }
    ]
  }
}

// 死变态
function formatVideos(arr = []) {
  return arr.map((item) => {
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
  return arr.map((item) => {
    return {
      file_id: item.id,
      id: 0,
      full_url: item.full_url
    }
  })
}

// 复制图片
function resolveImagesCopy(arr = []) {
  return arr.map((item) => {
    item.id = 0
    return item
  })
}

// 0 转空字符串
function zero2Empty(val) {
  return Number(val) || ''
}

// 0 到 100 整数
const Z2H_REG = /^(?:0|[1-9][0-9]?|100)$/

// 正整数
const INT_REG = /^(0|[1-9]\d*)$/

export const BASE_FORM_REG = {
  goodsName(key) {
    if (!key) {
      return '请输入商品名称'
    }
  },
  goodsTypeId(key) {
    if (!key) {
      return '请选择商品类目'
    }
  },
  basicUnit(key) {
    if (!key) {
      return '请选择基本单位'
    }
  },
  coverImageList(key) {
    if (!key.length) {
      return '请上传封面图'
    }
  },
  detailImageList(key) {
    if (!key.length) {
      return '请上传详情图片'
    }
  }
}

export const SALE_FORM_REG = {
  aliasName(key) {
    if (!key) {
      return '请输入商品别名'
    }
  },
  supply(key) {
    if (!key) {
      return '请选择供应商'
    }
  },
  purchaseUnit(key) {
    if (!key) {
      return '请选择采购单位'
    }
  },
  purchaseSize(key) {
    if (key <= 0) {
      return '请输入正确的采购规格'
    }
  },
  purchasePrice(key) {
    if (!REG_MONEY.test(key)) {
      return '请输入正确的采购单价(最多2位小数)'
    }
  },
  purchaseCycle(key) {
    if (key < 1 || !Z2H_REG.test(key)) {
      return '请输入正确采购周期（1-100整数）'
    }
  },
  goodsCategory(key) {
    if (!key) {
      return '请选择商品分类'
    }
  },
  goodsCode(key) {
    if (!key) {
      return '请输入商品编码'
    }
  },
  sellUnit(key) {
    if (!key) {
      return '请选择销售单位'
    }
  },
  sellSize(key) {
    if (key <= 0) {
      return '请输入正确的销售规格'
    }
  },
  sellPrice(key) {
    if (!REG_MONEY.test(key)) {
      return '请输入正确的销售单价(最多2位小数)'
    }
  },
  underlinePrice(key) {
    if (!REG_MONEY.test(key)) {
      return '请输入正确的划线价(最多2位小数)'
    }
  },
  stock(key) {
    if (!INT_REG.test(key)) {
      return '请输入正确的库存(正整数)'
    }
  },
  originSales(key) {
    if (!INT_REG.test(key)) {
      return '请输入正确的初始销量(正整数)'
    }
  },
  commission(key, flag) {
    if (flag) {
      return Z2H_REG.test(key) ? '' : '团长佣金请输入0-100的整数'
    }
  }
}

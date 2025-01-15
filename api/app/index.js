import request from '@/utils/request'

// 查询文章列表
export function listArticle(query) {
  return request({
    url: '/app/article/list',
    method: 'get',
    params: query
  })
}

// 查询文章详细
export function getArticle(id) {
  return request({
    url: '/app/article/app/' + id,
    method: 'get'
  })
}

// 点赞文章+1
export function zan(data) {
  return request({
    url: '/app/article/app/zan',
    method: 'put',
    data: data
  })
}

// 浏览文章+1
export function lookAddNumber(data) {
  return request({
    url: '/app/article/app/lookAddNumber',
    method: 'put',
    data: data
  })
}

// 查询资源列表
export function listResource(query) {
  return request({
    url: '/app/resource/list',
    method: 'get',
    params: query
  })
}

// 查询资源详细
export function getResource(id) {
  return request({
    url: '/app/resource/app/' + id,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 查询壁纸列表
export function listWallpaper(query) {
  return request({
    url: '/app/wallpaper/list',
    method: 'get',
    params: query
  })
}

// 查询兑换记录列表
export function listExchange(query) {
  return request({
    url: '/app/exchange/list',
    method: 'get',
    params: query
  })
}

export function listGoods(query) {
  return request({
    url: '/app/goods/list',
    method: 'get',
    params: query
  })
}

// 微信登录获取openid
export function autoLoginWx(code) {
  return request({
    url: '/app/public/autoLoginWx/' + code,
    method: 'get'
  })
}


// 新增文章
export function wxLogin(data) {
  return request({
    url: '/wxLogin',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/appGetInfo/' + userId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/system/config/configKey/' + configKey,
    method: 'get'
  })
}

// 新增积分记录
export function addAppIntegra(data) {
  return request({
    url: '/app/appIntegra/apps',
    method: 'post',
    data: data
  })
}

// 查询用户详细2
export function appGetUserById(userId) {
  return request({
    url: '/system/user/appGetUserById/' + userId,
    method: 'get'
  })
}

// 查询积分记录列表
export function listAppIntegra(query) {
  return request({
    url: '/app/appIntegra/list',
    method: 'get',
    params: query
  })
}

// 积分商品兑换
export function exchangeGoods(data) {
  return request({
    url: '/app/exchange/goods',
    method: 'post',
    data: data
  })
}

// 图片下载+1
export function imgDownLoad(data) {
  return request({
    url: '/app/wallpaper/app/downLoad',
    method: 'put',
    data: data
  })
}

// 资源下载+1
export function resourceDownLoad(data) {
  return request({
    url: '/app/resource/app/downLoad',
    method: 'put',
    data: data
  })
}

// 积分资源兑换
export function exchangeResource(data) {
  return request({
    url: '/app/appIntegra/resource',
    method: 'post',
    data: data
  })
}


// 去水印
export function delShuiYin(data) {
  return request({
    url: '/app/public/delSHuiYin',
    method: 'post',
    data: data
  })
}

// 新增安全域名配置
export function addNewDownloadUrl(url) {
  return request({
    url: '/app/public/addNewDownloadUrl/' + url,
	method: 'get'
  })
}

// 获取系统配置数据
export function getSysSet() {
  return request({
    url: '/app/public/getSysSet',
	method: 'get'
  })
}

// 今天是否可以新增积分记录
export function addIsAppIntegra(data) {
  return request({
    url: '/app/appIntegra/isApps',
    method: 'post',
    data: data
  })
}

// 查询短剧资源列表
export function listDuanju(query) {
  return request({
    url: '/app/duanju/list',
    method: 'get',
    params: query
  })
}

// 查询短剧资源数量
export function duanjuNumber(query) {
  return request({
    url: '/app/duanju/app/listNumber',
    method: 'get',
    params: query
  })
}

//抽奖校验次数生成概率
export function lottery(data) {
  return request({
    url: '/app/appIntegra/lottery',
    method: 'post',
    data: data
  })
}

//抽奖奖励发放
export function lotteryAdd(data) {
  return request({
    url: '/app/appIntegra/lotteryAdd',
    method: 'post',
    data: data
  })
}

// 查询抽奖礼品配置列表
export function listLottery(query) {
  return request({
    url: '/app/lottery/list',
    method: 'get',
    params: query
  })
}

// 查询抽奖记录列表
export function listLotteryLog(query) {
  return request({
    url: '/app/lotteryLog/list',
    method: 'get',
    params: query
  })
}

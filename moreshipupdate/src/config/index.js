export var Config = {
  shipRealUrl: '/rest/realtime/areaships.do',
  limit: 8000, //限制一次获取的目标条数（也同时作为上显的最大目标数）【经测试，为了性能和用户体验，1000个比较合理】
  timeout: 1000000, //消批时间(分钟)【待确认】
  bufferRatio: 0.25,
  updatetime: 3,
  CurrentMode: 1,
  defaultAjaxProxy:''
};

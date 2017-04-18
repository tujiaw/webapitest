'use strict';

// 接口列表
const cmds = {
  user: {
    group: '用户',
    showName: '查询用户资料',
    protoPack: 'InfoServer',
    protoName: 'ISGetUserInfoReq',
    params: [
      {order: 1, name: 'userId', modifier: 'repeated', type: 'uint64', defval: [], eg: [10000064], desc: '用户ID列表'},
      {order: 2, name: 'version', modifier: 'repeated', type: 'uint64', defval: [], eg: [0], desc: '用户版本列表'},
      {order: 3, name: 'reqDetail', modifier: 'required', type: 'bool', defval: false, eg: false, desc: '是否请求详细信息'},
      {order: 4, name: 'ownerId', modifier: 'optional', type: 'uint64', defval: 0, eg: 0, desc: '请求用户ID'},
      {order: 5, name: 'removeAvatar', modifier: 'optional', type: 'bool', defval: true,eg: true, desc: '移除头像数据'}
    ]
  },
  friend: {
    group: '用户',
    showName: '查询联系人',
    protoPack: 'InfoServer',
    protoName: 'ISGetRosterInfoReq',
    params: [
      {order: 1, name: 'userId', modifier: 'required', type: 'uint64', defval: 0, eg: 10000064, desc: '用户ID'},
      {order: 2, name: 'version', modifier: 'required', type: 'uint64', defval: 0, eg: 0, desc: '用户版本'}
    ]
  },
  presence: {
    group: '用户',
    showName: '查询在线状态',
    protoPack: 'SM',
    protoName: 'SMReqPresenceBatch',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'to', modifier: 'repeated', type: 'uint64', defval: [], eg: [10000064], desc: '用户ID列表'}
    ]
  },
  useravatar: {
    group: '用户',
    showName: '获取用户头像',
    protoPack: 'InfoServer',
    protoName: 'ISGetAvatarListReq',
    params: [
      {order: 1, name: 'userIdList', modifier: 'repeated', type: 'uint64', defval: [], eg: [10000064], desc: '用户ID列表'},
      {order: 2, name: 'avatarIdList', modifier: 'repeated', type: 'uint32', defval: [], eg: [0], desc: '头像ID列表'}
    ]
  },
  room: {
    group: '群',
    showName: '获取群列表',
    protoPack: 'InfoServer',
    protoName: 'ISReqRoomList',
    params: [
      {order: 1, name: 'userId', modifier: 'required', type: 'uint64', defval: 0, eg: 10010449,desc: '用户ID'},
      {order: 2, name: 'version', modifier: 'required', type: 'uint64', defval: 0, eg: 0,desc: '版本'}
    ]
  },
  joinroom: {
    group: '群',
    showName: '请求加入群',
    protoPack: 'SM',
    protoName: 'SMReqRoomJoin',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'room', modifier: 'required', type: 'uint64', defval: 0, eg: 10010449, desc: '群ID'},
      {order: 3, name: 'description', modifier: 'optional', type: 'string', defval: '', eg: '',desc: '入群申请描述'}
    ]
  },
  quitroom: {
    group: '群',
    showName: '请求退出群',
    protoPack: 'SM',
    protoName: 'SMReqRoomQuit',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'room', modifier: 'required', type: 'uint64', defval: 0, eg: 10010449, desc: '群ID'}
    ]
  },
  roomavatar: {
    group: '群',
    showName: '获取群头像',
    protoPack: 'InfoServer',
    protoName: 'ISGetRoomAvatarListReq',
    params: [
      {order: 1, name: 'roomIdList', modifier: 'repeated', type: 'uint64', defval: [], eg: [1000000049], desc: '群ID列表'},
      {order: 2, name: 'avatarIdList', modifier: 'repeated', type: 'uint32', defval: [], eg: [0], desc: '头像ID列表'}
    ]
  },
  search: {
    group: '搜索',
    showName: '搜索用户和群',
    protoPack: 'InfoServer',
    protoName: 'ISReqSearch',
    params: [
      {order: 1, name: 'userId', modifier: 'required', type: 'uint64', defval: 0, eg: 10000064, desc: '当前用户ID'},
      {order: 2, name: 'key', modifier: 'required', type: 'string', defval: '', eg: 'sumscope', desc: '关键字'},
      {order: 3, name: 'orgType', modifier: 'optional', type: 'string', defval: '', eg: '', desc: '机构类型'},
      {order: 4, name: 'province', modifier: 'optional', type: 'string', defval: '', eg: '', desc: '省份'},
      {order: 5, name: 'city', modifier: 'optional', type: 'string', defval: '', eg: '', desc: '城市'},
      {order: 6, name: 'limitUser', modifier: 'optional', type: 'uint32', defval: 0, eg: 100, desc: '限制用户数'},
      {order: 7, name: 'limitRoom', modifier: 'optional', type: 'uint32', defval: 0, eg: 40, desc: '限制群数'},
      {order: 8, name: 'onlyStranger', modifier: 'optional', type: 'bool', defval: false, eg: false, desc: '仅搜索陌生人'},
      {order: 9, name: 'onlyOnline', modifier: 'optional', type: 'bool', defval: false, eg: false, desc: '仅搜索在线用户'}
    ]
  },
  sendmsg: {
    group: '消息',
    showName: '发送消息',
    protoPack: 'SM',
    protoName: 'SMReqMessageSend',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'to', modifier: 'repeated', type: 'uint64', defval: [], eg: [10000064], desc: '要发送给对方的ID列表'},
      {order: 3, name: 'type', modifier: 'required', type: 'MSG_TYPE', defval: 1, eg: 1, desc: '消息类型'},
      {order: 4, name: 'body', modifier: 'required', type: 'bytes', defval: '', eg: '', desc: '消息内容,客户端自定义内容'},
      {order: 5, name: 'keyServer', modifier: 'optional', type: 'uint32', defval: 0, eg: 0, desc: '不赋值或者等于0就表示不加密'},
      {order: 6, name: 'keyId', modifier: 'optional', type: 'uint64', defval: 0, eg: 0, desc: '不赋值或者等于0就表示不加密'},
      {order: 7, name: 'res', modifier: 'optional', type: 'SMRes', defval: 0, eg: 0, desc: '发出消息的客户端'},
      {order: 8, name: 'ServerSent', modifier: 'optional', type: 'bool', defval: 0, eg: 0, desc: '服务器代发'}
    ]
  },
  unreadmsg: {
    group: '消息',
    showName: '查询未读消息',
    protoPack: 'SM',
    protoName: 'SMReqUnReadMsg',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'to', modifier: 'repeated', type: 'uint64', defval: [], eg: [10000064], desc: '用户ID列表'},
      {order: 3, name: 'timeStamp', modifier: 'required', type: 'uint64', defval: 0, eg: 0, desc: '请求此时间戳以后有未读消息的会话'},
      {order: 4, name: 'lastCount', modifier: 'required', type: 'uint32', defval: 0, eg: 0, desc: '返回最新消息的数量(0:不返回消息内容)'}
    ]
  },
  hismsg: {
    group: '消息',
    showName: '查询历史消息',
    protoPack: 'SM',
    protoName: 'SMReqHistoryMsg',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'to', modifier: 'required', type: 'uint64', defval: 0, eg: 10000064, desc: '用户ID'},
      {order: 3, name: 'timeStamp', modifier: 'optional', type: 'uint64', defval: 0, eg: 0, desc: '请求此时间戳以后的消息'},
      {order: 4, name: 'messageID', modifier: 'required', type: 'uint64', defval: 0, eg: 0, desc: '作为基准的消息id'},
      {order: 5, name: 'messageCount', modifier: 'optional', type: 'int32', defval: 0, eg: 0, desc: '请求基准的消息前后(或上述时间戳前后)几条'}
    ]
  },
  addfriend: {
    group: '好友',
    showName: '添加好友',
    protoPack: 'SM',
    protoName: 'SMReqFriendAdd',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'userId', modifier: 'required', type: 'uint64', defval: 0, eg: 0, desc: '用户ID'},
      {order: 3, name: 'groupId', modifier: 'required', type: 'uint32', defval: 0, eg: 0, desc: '用户组ID'},
      {order: 4, name: 'nickName', modifier: 'optional', type: 'string', defval: '', eg: 'guest', desc: '昵称'},
      {order: 5, name: 'description', modifier: 'optional', type: 'string', defval: '', eg: '', desc: '请求描述'},
      {order: 6, name: 'bServer', modifier: 'optional', type: 'bool', defval: false, eg: false, desc: '是否为服务端后台调用'}
    ]
  },
  delfriend: {
    group: '好友',
    showName: '删除好友',
    protoPack: 'SM',
    protoName: 'SMReqFriendRemove',
    params: [
      {order: 1, name: 'header', modifier: 'required', type: 'SMHeader', defval: {}, eg: {from:0, sourceNo:0, serialNo:0, errorCode:0}, desc: '头信息'},
      {order: 2, name: 'userId', modifier: 'required', type: 'uint64', defval: 0, eg: 0, desc: '用户ID'},
      {order: 3, name: 'groupId', modifier: 'required', type: 'uint32', defval: 0, eg: 0, desc: '用户组ID'},
      {order: 4, name: 'bServer', modifier: 'optional', type: 'bool', defval: false, eg: false, desc: '是否为服务端后台调用'}
    ]
  },
  friendblock: {
    group: '好友',
    showName: '查询好友免打扰关系',
    protoPack: 'InfoServer',
    protoName: 'ISGetFriendBlockReq',
    params: [
      {order: 1, name: 'userId', modifier: 'required', type: 'uint64', defval: 0, eg: 10010249, desc: '用户ID'},
      {order: 2, name: 'friendIdList', modifier: 'repeated', type: 'uint64', defval: [], eg: [10010447], desc: '好友ID列表'}
    ]
  },
  globalconfig: {
    group: '配置',
    showName: '获取全局配置',
    protoPack: 'InfoServer',
    protoName: 'ISGetGlobalConfigReq',
    params: [
      {order: 1, name: 'key', modifier: 'repeated', type: 'string', defval: [], eg: ['url'], desc: 'key'}
    ]
  },
  allglobalconfig: {
    group: '配置',
    showName: '获取所有全局配置',
    protoPack: 'InfoServer',
    protoName: 'ISGetAllGlobalConfigReq',
    params: []
  }
};

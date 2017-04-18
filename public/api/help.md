# QM WEB API 帮助文档

## SMHeader 公共头
```
// 所有结构的共同数据部分
message SMHeader { 
    required uint64  from      = 1; // 发起方的user id，服务端要校验
    optional uint64  sourceNo  = 2; // 发起方填入的序列号
    optional uint64  serialNo  = 3; // 服务器填入的序列号
    optional uint32  errorCode = 4; // 错误码
}
```

## bytes 类型
请求参数和应答结果都是必须是BASE64后的二进制数据

## MSG_TYPE 消息类型
```
enum MSG_TYPE {                  // 消息类型
    MSG_TYPE_CHAT             = 1; // 普通单人聊天
    MSG_TYPE_GROUP_NORMAL     = 2; // 群聊
    MSG_TYPE_GROUP_BROADCAST  = 3; // 群发
    MSG_TYPE_GROUP_SPEAKER    = 4; // Speaker群发
    MSG_TYPE_GROUP_CUSTOMERSERVICE = 5; // 客服群
    MSG_TYPE_BROADCAST      = 6; // 广播
    MSG_TYPE_SHAKE          = 7; // 抖动
}
```

## SMRes 客户端类型
```
enum SMRes {
    RES_PC       = 0;
    RES_ANDROID  = 1;
    RES_IOS      = 2;
    RES_WEB      = 3;
    RES_SERVER  = 4;
}
```
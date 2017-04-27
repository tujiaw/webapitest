;(function($) {
    'use strict';

    var EMessageBodyType = {
        MSG_Body_Type_TEXT: 0,                  // 文本 --> 以前版本版本用 (QQ发送过来的消息)
        MSG_Body_Type_Emoticon: 1,              // 系统表情 --> 如“:/face/17.png” ，在common\skin\sysface\face.xml 内name字段的值 --> 以前版本版本用 （废弃）
        MSG_Body_Type_PIC: 2,                   // 图片 --> PicSendInfo
        MSG_Body_Type_File: 3,                  // 文件 --> FileSendInfo
        MSG_Body_Type_Shake: 4,                 // 抖动 --> nothing  --> 以前版本版本用 （废弃）
        MSG_Body_Type_RoomCard: 5,              // 群名片 --> RoomCardInfo
        MSG_Body_Type_QB_QuoteMoney: 6,         // 资金报价 --> QuotationMoneyInfo
        MSG_Body_Type_QB_QuoteConditions: 7,    // 条件报价 --> （废弃）
        MSG_Body_Type_QB_QuoteBond: 8,          // 债券报价 --> QuotationBondInfo
        MSG_Body_Type_QB_Contactsdiscard: 9,    // 群发人员(后续开发者废弃不用，因之前有版本使用，暂兼容处理) （废弃）
        MSG_Body_Type_EnhancedTEXT: 10,         // 加强版文本 --> TxtContent
        MSG_Body_Type_EnhancedEmoticon: 11,     // 加强版系统表情 --> SysEmotionInfo
        MSG_Body_Type_EnhancedShake: 12,        // 加强版抖动 --> ShakeInfo
        MSG_Body_Type_FinancialNews: 13,        // 新闻资讯-财经头条 --> FinancialNewsInfo 
        MSG_Body_Type_OrganizationNotice: 14,   // 机构通知 --> OrganizationNoticeInfo  注：当先解析此消息类型时 MSG_Body_Type_EnhancedTEXT 内的 TxtType_Organization 消息不解析，否则此消息不解析 
        MSG_Body_Type_NEWBONDPUSH: 15,          // 新券推送 --> BondPushInfo （PNServer::TableMap.cpp::CTableMap::GetNoticeSerialMessage）
        MSG_Body_Type_BONDTXT: 16,              // 机构信息 --> BondTxtMsg （PNServer::TableMap.cpp::CTableMap::GetNoticeSerialMessage）
        MSG_Body_Type_News: 17,                 // 新闻/分享 等文章 --> NewsShareBriefInfo
        MSG_Body_Type_Bond: 18,                 // 债券 --> BondInfo
        MSG_Body_Type_SessionInfo: 19,          // 会话对象 --> SessionInfo （废弃）
        MSG_Body_Type_Link: 20,                 // 链接 --> LinkInfo  (废弃)
        MSG_Body_Type_Purchase: 21,             // 一级申购报价信息 --> PurchaseInfo
        MSG_Body_Type_ContactInfoSnap: 22,      // 群发助手 --> ContactInfoSnap
        MSG_Body_Type_ShareBond: 23,            // 债券分享 --> ShareBondInfo
        MSG_body_Type_RoomFile: 24,             // 群文件 --> RoomfileInfo
        MSG_Body_Type_MarginalGuidance: 25,     // 边际指导 --> MarginalGuidance （NoticeServer::noticeserver.cpp::Noticeserver::MarginalGuidanceCallBack）
        MSG_Body_Type_BondsDelay: 26,           // 债券推迟发行 --> BondsDelay （NoticeServer::noticeserver.cpp::Noticeserver::DelayListedCallBack）
        MSG_Body_Type_Quoted_Alert: 27,         // 报价提醒 --> QuotedAlertInfo （NoticeServer::noticeserver.cpp::Noticeserver::getQBUserInfoReq）
        MSG_Body_Type_QB_HelpCenterLink: 28,    // QB帮助信息链接 --> QBHelpCenterLink
        MSG_Body_Type_MWNotice: 29,             // 主承公告 （NoticeServer::noticeserver.cpp::Noticeserver::GetMWNoticeBody）
        MSG_Body_Type_BondDetailAlert: 30,      // QB债券事件提醒 --> QBBondDetailAlert
    }

    var MessageBodyListType = {
        MSG_Basic: 0,                           // 基本消息类型
        MSG_MassGroup: 1,                       // 群发助手消息类型  --> ContactInfoSnap
        MSG_Robot: 2,                           // 机器小传消息类型 --> RobotMessageInfo
        MSG_QQMsg: 3,                           // qq消息           --> ExtendQQMessage
        MSG_MassGroupNew: 4,                    // 群发助手消息类型  --> 成功 + 消息 + 失败 + 验证
    }

    var EmotionType = {
        Emotion_Self: 0,                        // 自定义表情 -- 暂时走的图片流程
        Emotion_Sysbasic: 1,                    // 系统表情开始
        Emotion_QQSys: 2,                       // QQ系统表情
        Emotion_Emoji: 3                        // Emoji
    }

    /**
     * 消息片段，如：消息中的一段文本或图片
     * @param {EMessageBodyType} type 
     * @param {Object} msg 
     * @param {String} basiccontent 
     */
    function messageBody(type, msg, basiccontent) {
        return {
            type:type || EMessageBodyType.MSG_Body_Type_EnhancedTEXT,
            msg: msg || {},
            basiccontent: basiccontent || ''
        }
    }

    /**
     * 文本消息
     * @param {String} content 
     * @param {Number} type 
     * @param {Number} color 
     * @param {Number} size 
     * @param {Number} fontstyle 
     */
    function txtContent(content, type, color, size, fontstyle) {
        return {
            content: content || '',
            type: type || 0,
            color: color || 0,
            size: size || 0,
            fontstyle: fontstyle || 0
        }
    }

    /**
     * 系统表情
     * @param {String} emotion 
     * @param {EmotionType} type 
     * @param {String} typeid 
     * @param {String} describe 
     */
    function sysEmotionInfo(emotion, type, typeid, describe) {
        return {
            emotion: emotion || '',
            type: type || EmotionType.Emotion_Sysbasic,
            typeid: typeid || '',
            describe: describe || ''
        }
    }

    /**
     * 图片消息（只支持链接）
     * @param {String} imageUrl 
     * @param {Number} width 
     * @param {Number} height 
     */
    function picSendInfo(imageUrl, width, height) {
        return {
            content: '',
            uuid: '',
            filePath: '',
            totalSize: 0,
            extName: '',
            keyServer: 0,
            keyId: 0,
            uuidThumbnail: '',
            widthThumbnail: width || 100,
            heightThumbnail: height || 100,
            origUrl: imageUrl || '',
            thumbnailUrl: imageUrl || '',
            extendType: 0,
            extendContent: ''
        }
    }

    /**
     * 构造消息
     * @param {MessageBodyListType} bodyListType
     * @param {String} extendContent
     * @param {Boolean} serverSent
     * @param {Number} notify
     * @param {Boolean} isQQMsg
     */
    $.QMMsgBuilder = function(bodyListType, extendContent, serverSent, notify, isQQMsg) {
        this.bodyList = [];
        this.bodyListType = bodyListType || MessageBodyListType.MSG_Basic;
        this.extendContent = extendContent || '';
        this.serverSent = serverSent || false;
        this.notify = notify || 0;
        this.isQQMsg = isQQMsg || false;

        this.pushMsg = function(messageBody) {
            this.bodyList.push(messageBody);
        }

        this.pushText = function(text) {
            var msg = txtContent(text);
            var body = messageBody(EMessageBodyType.MSG_Body_Type_EnhancedTEXT, msg);
            this.bodyList.push(body);
            return this;
        }

        this.pushSysEmotion = function(emotion) {
            var msg = sysEmotionInfo(emotion, EmotionType.Emotion_Sysbasic);
            var body = messageBody(EMessageBodyType.MSG_Body_Type_EnhancedEmoticon, msg);
            this.bodyList.push(body);
            return this;
        }

        this.pushImage = function(imageUrl, width, height) {
            var msg = picSendInfo(imageUrl, width, height);
            var body = messageBody(EMessageBodyType.MSG_Body_Type_PIC, msg);
            this.bodyList.push(body);
            return this;
        }

        this.getMsg = function() {
            return {
                bodyList: this.bodyList,
                bodyListType: this.bodyListType,
                ExtendContent: this.extendContent,
                ServerSent: this.serverSent,
                notify: this.notify,
                isQQMsg: this.isQQMsg
            }
        }
    }

    /**
     * 解析消息
     * @param {Object} msg
     */
    $.QMMsgParser = function(msg) {
        if (typeof msg === 'String') {
            msg = JSON.parse(msg);
        }
        this.bodyList = [];
        this.bodyListType = msg.bodyListType || MessageBodyListType.MSG_Basic;
        this.extendContent = msg.ExtendContent || '';
        this.serverSent = msg.ServerSent || false;
        this.notify = msg.notify || 0;
        this.isQQMsg = msg.isQQMsg || false;

        msg.bodyList.forEach(function(messageBody) {
            if (!messageBody.type || !messageBody.msg) {
                return;
            }

            console.log(messageBody.msg);
            this.bodyList.push(messageBody);
        })

        this.getMsg = function() {
            return {
                bodyList: this.bodyList,
                bodyListType: this.bodyListType,
                ExtendContent: this.extendContent,
                ServerSent: this.serverSent,
                notify: this.notify,
                isQQMsg: this.isQQMsg
            }
        }
    }
})(this);
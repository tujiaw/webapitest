'use strict';

function formatParamsContent(params) {
  let result = {};
  if (Array.isArray(params)) {
    params.forEach(function(param, index) {
      result[param.name] = param.eg;
    });
    result = JSON.stringify(result, undefined, 2);
  }
  return result;
}

var AUTH = '';
var main = {
  exec: function() {
    this.initSignin();
    this.initTree();
    this.initQueryButton();
    this.initChat();
    this.initToolTip();
    this.initEditRequest();
  },

  // 初始化登录窗口
  initSignin: function() {
    if ($.cookie('bit') === 'true') {
      $('#remember-me').attr('checked', 'checked');
      $('#input-username').val($.cookie('username'));
      $('#input-password').val($.cookie('password'));
    }

    $('#btn-signin').on('click', function() {
      const username = $('#input-username').val();
      const password = $('#input-password').val();
      if (username.length === 0 || password.length === 0) {
        alert('username or password can not empty!');
        return;
      }
      
      let loginParams = {};
      cmds.login.params.forEach(function(param) {
        loginParams[param.name] = param.eg;
      });
      loginParams.loginName = username;
      loginParams.password = md5(password);
      console.log('loginName:' + loginParams.loginName);
      console.log('password:' + loginParams.password);

      $.ajax({
        type: 'POST',
        url: '/api/qm/login',
        dataType: 'JSON',
        data: { data: JSON.stringify(loginParams) },
        success: function(res) {
          if (!res || !res.body) {
            alert('登录失败，应答内容出错！');
            return;
          }
          if (res.code === 0) {
            if (res.body.result === 0) {
              const authObj = {
                token: res.body.token === undefined ? '' : res.body.token,
                userid: res.body.userid === undefined ? 0 : res.body.userid
              }
              AUTH = JSON.stringify(authObj);
              console.log('auth:' + AUTH);

              if ($('#remember-me').is(':checked')) {
                $.cookie('username', username, { expires: 365 });
                $.cookie('password', password, { expires: 365 });
                $.cookie('bit', 'true', { expires: 365 });
              } else {
                $.removeCookie('username');
                $.removeCookie('password');
                $.removeCookie('bit');
              }
              $('#signin-page').hide();
              $('#main-page').show();
            } else {
              alert('登录失败:' + (res.error_desc || '未知错误') + '(' + res.result + ')');
            }
          } else {
            alert('登录失败：' + (res.error || '未知错误！'));
          }
        },
        error: function(error) {
          alert(error.statusText + '(' + error.status + ')');
        }
      });
      return false;
    })
  },

  // 初始化接口tree
  initTree: function() {
    const $tree = $('#tree');
    const getTree = function() {
      let tree = [];
      for (let cmd in cmds) {
        const groupName = cmds[cmd].group;
        const showName = cmds[cmd].showName;
        if (groupName && showName) {
          let pos = -1;
          for (let i = 0; i < tree.length; i++) {
            if (tree[i].text === groupName) {
              pos = i;
              break;
            }
          }

          if (pos >= 0) {
            tree[pos].nodes.push({ text: showName, cmd: cmd });
          } else {
            tree.push({ text: groupName, nodes: [{ text: showName, cmd: cmd }] });
          }
        }
      }
      return tree;
    };

    const BASE_URL = window.location.href + 'qm/';
    const nodeSelected = function(event, data) {
      if (data.parentId === undefined) {
        $tree.treeview('toggleNodeExpanded', [ data.nodeId, { silent: true }]);
        return;
      }
      $('#input-query-url').val('');
      $('#params-table').html('');
      $('#input-params-content').val('');
      $('#pre-result').html('');
      $('.btn-edit-request').hide();
      let cmd = data.cmd;
      if (cmds[cmd]) {
        // 进行深拷贝
        let obj = JSON.parse(JSON.stringify(cmds[cmd]));
        $('#input-query-url').val(BASE_URL + cmd);
        $('#input-params-content').val(formatParamsContent(obj.params));

        let paramsList = obj.params.slice();
        paramsList = paramsList.map(function(param) {
          param.defval = JSON.stringify(param.defval);
          param.eg = JSON.stringify(param.eg);
          return param;
        })
        const html = ejs.render($('#template-params-table').html(), { paramsList: paramsList });
        $('#params-table').html(html);

        if (cmd === 'sendmsg') {
          $('.btn-edit-request').show();
        }
      }
    };

    $tree.treeview({ 
      data: getTree(),
      onNodeSelected: nodeSelected
    });
    $tree.treeview('toggleNodeSelected', [ 1, { silent: false }]);
  },

  // 初始化发送按钮
  initQueryButton: function() {
    const COPYNAME = 'Copy';
    const COPYLABEL = '<label for="" class="copy">' + COPYNAME + '</label>';
    
    const onQueryButtonClick = function() {
      const url = $('#input-query-url').val();
      const params = $('#input-params-content').val();
      console.log('url:' + url);
      console.log('params:' + params);
      if (!(url.length && params.length)) {
        return;
      }
      $.ajax({
        type: 'POST',
        url: url,
        dataType: 'JSON',
        data: { token: AUTH, data: params },
        success: function(res) {
          $('#pre-result').html(COPYLABEL + util.syntaxHighlight(res));
        },
        error: function(error) {
          $('#pre-result').html(error.statusText + '(' + error.status + ')');
        }
      });
    }

    const onCopy = function() {
      util.copyToClipboard($('#pre-result').text().substring(COPYNAME.length));
    }

    $('div.page-header').on('click', '#button-query', onQueryButtonClick);
    $('#pre-result').on('click', '.copy', onCopy);
  },

  // 初始化聊天按钮
  initChat: function() {
    $('#side-popup').on('click', function() {
      const chat = $('#chat-frame');
      if (chat.attr('src') === undefined || chat.attr('src').length === 0) {
        chat.attr('src', 'http://172.16.16.63:3200');
        chat.focus();
      }
      chat.toggle();
      $(this).text($('#chat-frame').is(':hidden') ? "聊天" : "收起");
    });
  },

  initToolTip: function() {
    $('#params-table').on('mouseenter', "table td", function() {
      if (this.offsetWidth < this.scrollWidth) {
        $(this).attr('data-toggle', 'tooltip').attr('title', $(this).text());
      }
    });
    $('#params-table').on('mouseleave', 'table td', function() {
      $(this).attr('data-toggle', '');
    });
  },

  initEditRequest: function() {
    let msgBuilder = null;
    const $editRequest = $('#edit-request');
    const $inputContent = $editRequest.find('.input-content');
    const $inputResult = $editRequest.find('.input-result');
    const $inputParamsContent = $('#input-params-content');

    $editRequest.on('show.bs.modal', function() {
      $inputContent.val('');
      $inputResult.val('');
      msgBuilder = new QMMsgBuilder();
    })

    $editRequest.on('hide.bs.modal', function() {
      msgBuilder = null;
    })

    $editRequest.find('ul a').on('click', function() {
      if (!msgBuilder) {
        return;
      }
      const type = $(this).attr('type');
      const content = $inputContent.val();
      if (type.length && content.length) {
        if (type === 'text') {
          msgBuilder.pushText(content);
        } else if (type === 'emotion') {
          msgBuilder.pushSysEmotion(content);
        } else if (type === 'image') {
          msgBuilder.pushImage(content, 100, 100);
        }
        $inputResult.val(JSON.stringify(msgBuilder.getMsg(), undefined, 2));
        $inputContent.val('');
        $inputContent.focus();
      }
    })

    $editRequest.find('.btn-ok').on('click', function() {
      const inputResult = $inputResult.val();
      const params = $inputParamsContent.val();
      if (inputResult.length && params.length) {
        let obj = JSON.parse(params);
        obj.body = JSON.stringify(msgBuilder.getMsg());
        $inputParamsContent.val(JSON.stringify(obj, undefined, 2));
      }
      $editRequest.modal('hide');
    })
  }
}

main.exec();
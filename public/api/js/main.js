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

var main = {
  exec: function() {
    this.initSignin();
    this.initTree();
    this.initQueryButton();
    this.initChat();
    this.initToolTip();
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
      $.ajax({
        type: 'POST',
        url: '/api/qm/signin',
        dataType: 'JSON',
        data: {
          username: username,
          password: password
        },
        success: function(res) {
          if (res.code === 0) {
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
            alert('登录失败：' + res.error != undefined ? res.error : '未知错误！');
          }
        },
        error: function(error) {
          alert(`${error.statusText}(${error.status})`);
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
      let cmd = data.cmd;
      if (cmds[cmd]) {
        // 进行深拷贝
        let obj = JSON.parse(JSON.stringify(cmds[cmd]));
        $('#input-query-url').val(`${BASE_URL}${cmd}`);
        $('#input-params-content').val(formatParamsContent(obj.params));

        let paramsList = obj.params.slice();
        paramsList = paramsList.map(function(param) {
          param.defval = JSON.stringify(param.defval);
          param.eg = JSON.stringify(param.eg);
          return param;
        })
        const html = ejs.render($('#template-params-table').html(), { paramsList: paramsList });
        $('#params-table').html(html);
      }
    };

    $tree.treeview({ 
      data: getTree(),
      onNodeSelected: nodeSelected
    });
    $tree.treeview('toggleNodeSelected', [ 1, { silent: false }]);
  },

  // 初始化查询按钮
  initQueryButton: function() {
    $('div.page-header').on('click', '#button-query', function() {
      const url = $('#input-query-url').val();
      const params = $('#input-params-content').val();
      console.log(url);
      console.log(params);
      $.ajax({
        type: 'POST',
        url: url,
        dataType: 'JSON',
        data: { data: params },
        success: function(res) {
          $('#pre-result').html(util.syntaxHighlight(res));
        },
        error: function(error) {
          $('#pre-result').html(`${error.statusText}(${error.status})`);
        }
      });
    });
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
        $(this).attr('data-toggle', 'tooltip');
        $(this).attr('title', $(this).text());
      }
    });
    $('#params-table').on('mouseleave', 'table td', function() {
      $(this).attr('data-toggle', '');
    });
  }
}

main.exec();
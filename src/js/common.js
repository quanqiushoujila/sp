/*
 * @Author: kai
 * @Date:   2017-11-14 20:06:11
 * @Last Modified by:   kai
 * @Last Modified time: 2017-11-29 17:06:31
 */
'use strict';
// 通用方法
var _bm = {
  // 字段的验证，支持非空、手机、邮箱的判断
  validate: function(value, type) {
    var value = $.trim(value);
    // 非空验证
    if ('require' === type) {
      return !!value;
    }

    // 手机号验证
    if ('phone' === type) {
      return /^1\d{10}$/.test(value);
    }

    // 邮箱格式验证
    if ('email' === type) {
      return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
    }
  },
  // 正确提示
  successMsg: function(msg) {
    alert(msg || '成功');
  },
  // 错误提示
  errorMsg: function(msg) {
    alert(msg || '失败');
  },
  // 网络请求
  request: function(param) {
    var _this = this;
    $.ajax({
      url: param.url || '',
      dataType: param.dataType || 'json',
      data: param.data || '',
      type: param.type || 'get',
      success: function(res) {
        if (Config.status.SUCCESS === res.status) {
          typeof param.success === 'fnuction' && param.success(res);

        } else if (Config.status.ERROR === res.status) {
          typeof param.error === 'function' && param.error(res.msg);
        }
      },
      error: function(err) {
        typeof param.error === 'function' && param.error(err.statusText);
      }

    })
  },
  
  //返回上一页
  goBack: function() {
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE  
      if (history.length > 0) {
        window.history.go(-1);
      } else {
        window.opener = null;
        window.location.href = './index.html';
      }
    } else { //非IE浏览器  
      if (navigator.userAgent.indexOf('Firefox') >= 0 ||
        navigator.userAgent.indexOf('Opera') >= 0 ||
        navigator.userAgent.indexOf('Safari') >= 0 ||
        navigator.userAgent.indexOf('Chrome') >= 0 ||
        navigator.userAgent.indexOf('WebKit') >= 0) {

        if (window.history.length > 1) {
          window.history.go(-1);
        } else {
          window.opener = null;
          window.location.href = './index.html';
        }
      } else { //未知的浏览器  
        window.history.go(-1);
      }
    }
  }
};

// 登录注册找回密码
var _log = {
  init: function() {
    this.bindEvent();
  },

  bindEvent: function() {
    var _this = this;

    // 登录
    $('#login-submit').click(function() {
      var formData = {
        phone: $.trim($('#phone').val()),
        password: $.trim($('#password').val())
      }
      var validateResult = _this.loginValidate(formData);

      if (validateResult.status) {
        _bm.successMsg(validateResult.msg);
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }

    });

    // 注册获取验证码
    $('.btn-get-ma-register').click(function() {
      var formData = {
        phone: $.trim($('#phone').val())
      }

      var validateResult = _this.phoneValidate(formData);

      if (validateResult.status) {
        _this.setTimer($(this));
        $(this).text('(60s)重新获取').prop('disabled', true).removeClass('text-green');
        $('#phone').addClass('success-green');
        $('#ma').addClass('success-green');
        $('#password').addClass('success-green');
        if ($('.agree label input').prop('checked')) {
          $('.register-submit').prop('disabled', false).addClass('success-green');
        }
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }

    });

    // 同意协议
    $('.agree label').click(function(event) {
      var checked = $(this).find('input').prop('checked');
      if (checked) {
        $('.agree span').removeClass('agree-scueess');
        if (!$('.btn-get-ma').prop('disabled')) {
          $('.register-submit').prop('disabled', false).addClass('success-green');
        }
      } else {
        $('.register-submit').prop('disabled', true).removeClass('success-green');
        $('.agree span').addClass('agree-scueess');
      }
    });

    // 监听手机号是否输入
    $('#phone').bind('input OnInput', function() {
      var len = $.trim($(this).val()).length;
      if (len > 0) {
        $('.btn-get-ma').attr('disabled', false).addClass('text-green');
      } else {
        $('.btn-get-ma').attr('disabled', true).removeClass('text-green');
      }
    });

    // 找回密码注册获取验证码
    $('.btn-get-ma-forget-password').click(function() {
      var formData = {
        phone: $.trim($('#phone').val())
      }

      var validateResult = _this.phoneValidate(formData);

      if (validateResult.status) {
        _this.setTimer($(this));
        $(this).text('(60s)重新获取').prop('disabled', true).removeClass('text-green');
        $('#phone').addClass('success-green');
        $('#ma').addClass('success-green');
        $('#password').addClass('success-green');
        if ($('.agree label input').prop('checked')) {
          $('.register-submit').prop('disabled', false).addClass('success-green');
        }
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }

    });

    // 注册
    $('#register-submit').click(function() {
      var formData = {
        phone: $.trim($('#phone').val()),
        ma: $.trim($('#ma').val()),
        password: $.trim($('#password').val())
      }
      var validateResult = _this.registerValidate(formData);
      console.log(validateResult)
      if (validateResult.status) {
        _bm.successMsg(validateResult.msg)
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }
      return;
    });

    // 找回密码
    $('#forget-pass-submit').click(function() {
      var formData = {
        phone: $.trim($('#phone').val()),
        ma: $.trim($('#ma').val()),
        password: $.trim($('#password').val())
      }
      var validateResult = _this.registerValidate(formData);
      console.log(validateResult)
      if (validateResult.status) {
        _bm.successMsg(validateResult.msg)
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }
      return;
    });
  },

  // 时间倒计时
  setTimer: function(me) {
    var count = 2;
    var timer = setInterval(function() {
      if (--count === 0) {
        me.text('获取验证码').prop('disabled', false).addClass('text-green');
        clearInterval(timer);
        return;
      }

      me.text('(' + count + 's)重新获取').prop('disabled', true).removeClass('text-green');
    }, 1000);
  },

  // 登录验证
  loginValidate: function(formData) {
    var result = {
      msg: '',
      status: false
    };

    if (!_bm.validate(formData.phone, 'require')) {
      result.msg = '手机号不能为空';
      return result;
    }

    if (!_bm.validate(formData.password, 'require')) {
      result.msg = '密码不能为空';
      return result;
    }

    if (!_bm.validate(formData.phone, 'phone')) {
      result.msg = '手机号不正确';
      return result;
    }

    result.msg = '成功';
    result.status = true;
    return result;
  },

  // 手机号验证
  phoneValidate: function(formData) {
    var result = {
      msg: '',
      status: false
    };

    if (!_bm.validate(formData.phone, 'require')) {
      result.msg = '手机号不能为空';
      return result;
    }

    if (!_bm.validate(formData.phone, 'phone')) {
      result.msg = '手机号不正确';
      return result;
    }

    result.msg = '成功';
    result.status = true;
    return result;
  },
  // 注册验证
  registerValidate: function(formData) {
    var result = {
      msg: '',
      status: false
    };

    if (!_bm.validate(formData.phone, 'require')) {
      result.msg = '手机号不能为空';
      return result;
    }

    if (!_bm.validate(formData.ma, 'require')) {
      result.msg = '验证码不能为空';
      return result;
    }

    if (!_bm.validate(formData.password, 'require')) {
      result.msg = '密码不能为空';
      return result;
    }

    if (!_bm.validate(formData.phone, 'phone')) {
      result.msg = '手机号不正确';
      return result;
    }


    result.msg = '成功';
    result.status = true;
    return result;
  },
};

// 搜索
var _search = {
  init: function() {
    this.bindEvent();
  },

  bindEvent: function() {
    // 取消按钮
    $('.cancle-index, .back-index').click(function() {
      $('.input-search').val('');
      $('.search-type-two').hide();
      //$('.input-search').removeAttr('autofocus');
    });

    // 搜索按钮
    $('.search-text').click(function() {
      $('.search-type-two').show();
      $('.input-search').trigger("focus");
    });

  }
};

//分类筛选
var _sort = {
  init: function() {
    this.bindEvent();
    this.onLoad();
  },

  bindEvent: function() {
    var _this = this;
    $('.type-small-box').click(function() {
      var oldTypeListHeight = $('.sort-wrap .type-list').height();
      $(this).remove();
      var listTop = $('.center-content-list').offset().top;
      var newTypeListHeight = $('.sort-wrap .type-list').height();
      $('.center-content-list').animate({
          'top': listTop - (oldTypeListHeight - newTypeListHeight)
        },
        200
      );
    });

    // 排序
    $('.sort-wrap .sort-list .item').click(function(event) {
      var index = $(this).index();
      $('.shadow-wrap').show().find('.type-wrap').eq(index).show().siblings('.type-wrap').hide();
    });

    // 排序选择 
    $('.shadow-wrap .type-wrap .item').click(function(event) {
      event.stopPropagation();
      $(this).addClass('success-green').siblings('.item').removeClass('success-green')
        .parent().siblings('.type-wrap').find('.item').removeClass('success-green');

      _this.hideShadowList();

    });

    // 保姆列表页取消
    $('.cancle-list').click(function() {
      _this.hideShadowList();
    });

    $('.input-search-list').focus(function() {
      _this.hideShadowList();
    });

    $('.shadow-wrap').click(function(event) {
      _this.hideShadowList();
    });

    $('.choose-type').click(function(event) {
      event.stopPropagation();
    });

    // 筛选
    $('.sort-wrap .item-sort').click(function() {
      _this.removeListActiveClassName();
      $(this).toggleClass('green-active').siblings('.item-sort').removeClass('green-active');
    });

    //筛选确定
    $('.sort-wrap .btn-list-ok').click(function() {
      _this.hideShadowList();
    });

    //筛选取消
    $('.sort-wrap .btn-list-cancle').click(function() {
      _this.hideShadowList();
    });

  },

  hideShadowList: function() {
    $('.shadow-wrap').fadeOut(600);
  },

  removeListActiveClassName: function() {
    $('.sort-wrap .shadow-wrap .type-wrap .item').removeClass('success-green').parent()
      .siblings('.type-wrap').find('.item').removeClass('success-green');
  },

  removeChooseActiveClassName: function() {
    $('.sort-wrap .choose-type .item-sort').removeClass('green-active');
  },

  onLoad: function() {
    if ($('.center-content-list').length > 0) {
      var listTop = $('.center-content-list').offset().top;
      var typeListHeight = $('.sort-wrap .type-list').height();
      $('.center-content-list').css('top', listTop + typeListHeight);
    }
    // console.log('top', listTop + typeListHeight);
    // console.log('typeListHeight', typeListHeight);
  },
}

var _bind = {
  init: function() {
    this.bindEvent();
  },

  bindEvent: function() {
    $('.all-top-wrapper .focus').click(function(event) {
      $(this).toggleClass('success-green');
    });

    $('.user-footer1 .left a').click(function(event) {
      $(this).toggleClass('success-green').siblings().removeClass('success-green');
    });

    // 选择默认地址
    $('.my-address .address-list .item').click(function(event) {
      //var checked = $(this).find()
    });
  }
}

// 个人中心
var _my = {
  option: {
    unchecked: 'fa-circle-o',
    checked: 'fa-check-circle'
  },

  init: function () {
    this.bindEvent();
    this.onLoad();
  },

  bindEvent: function () {
    var _this = this;
    // 选择默认地址
    $('.my-address .address-list .item .detail').click(function () {
      $(this).next().find('input').prop('checked', true)
        .next().addClass('address-radio-active')
        .find('i').removeClass(_this.option.unchecked).addClass(_this.option.checked);
      $(this).parent().siblings('.item').find('input').prop('checked', false).next()
        .removeClass('address-radio-active').find('i')
        .removeClass(_this.option.checked).addClass(_this.option.unchecked);
    });
    //服务地址编辑
    $('.my-address .address-list .edit, .my-address .address-list .del').click(function (event) {
      event.stopPropagation();
    })
    //服务地址删除
  },

  onLoad: function () {
    var item = $('.my-address .address-list .item');
    for (var i = 0, len = item.size(); i < len; i++) {
      var radio = $(item[i]).find('input');
      if (radio.prop('checked')) {
        radio.next().addClass('address-radio-active').find('i')
          .removeClass(this.option.unchecked).addClass(this.option.checked);
        break;
      }
    }
  }
}

$(function() {
  _log.init();
  _search.init();
  _sort.init();
  _bind.init();
  // myaddress
  _my.init();
});
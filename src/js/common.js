/*
* @Author: kai
* @Date:   2017-11-14 20:06:11
* @Last Modified by:   kai
* @Last Modified time: 2017-11-17 14:07:09
*/
'use strict';
// 通用方法
var _bm = {
  // 字段的验证，支持非空、手机、邮箱的判断
  validate: function (value, type) {
    var value = $.trim(value);
    // 非空验证
    if('require' === type){
      return !!value;
    }

    // 手机号验证
    if('phone' === type){
      return /^1\d{10}$/.test(value);
    }

    // 邮箱格式验证
    if('email' === type){
      return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
    }
  },
  // 正确提示
  successMsg: function (msg) {
    alert(msg || '成功');
  },
  // 错误提示
  errorMsg: function (msg) {
     alert(msg || '失败');
  },
   // 网络请求
  request: function (param) {
    var _this = this;
    $.ajax({
      url:        param.url       || '',
      dataType:   param.dataType  || 'json',
      data:       param.data      || '',
      type:       param.type      || 'get',
      success:    function (res) {
        if (Config.status.SUCCESS === res.status) {
          typeof param.success === 'function' && param.success(res);

        } else if (Config.status.ERROR === res.status) {
          typeof param.error === 'function' && param.error(res.msg);
        }
      },
      error:    function (err) {
        typeof param.error === 'function' && param.error(err.statusText);

      }
      
    })
  },
};


// 登录注册找回密码
var _logValid = {
  init: function () {
    this.bindEvent();
  },

  bindEvent: function () {
    var _this = this;

    // 登录
    $('#login-submit').click(function () {
      var formData = {
        phone: $.trim($('#phone').val()),
        password: $.trim($('#password').val())
      }
      var validateResult = _this.logValidate(formData);

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
          $('#register-submit').prop('disabled', false).addClass('success-green');
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
        $('#register-submit').prop('disabled', false).addClass('success-green');
      } else {
        $('#register-submit').prop('disabled', true).removeClass('success-green');
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
          $('#register-submit').prop('disabled', false).addClass('success-green');
        }
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }

    });
  },

  // 时间倒计时
  setTimer: function (me) {
    var count = 2;
    var timer = setInterval(function () {
      if (--count === 0) {
        me.text('获取验证码').prop('disabled', false).addClass('text-green');
        clearInterval(timer);
        return;
      }

      me.text('('+ count +'s)重新获取').prop('disabled', true).removeClass('text-green');
    }, 1000);
  },

  // 登录验证
  logValidate: function (formData) {
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
  phoneValidate: function (formData) {
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
};


$(function() {
  _logValid.init();

});

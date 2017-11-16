/*
* @Author: kai
* @Date:   2017-11-14 20:06:11
* @Last Modified by:   kai
* @Last Modified time: 2017-11-16 20:06:25
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
    console.log(value)

    // 手机号验证
    if('phone' === type){
      return /^1\d{10}$/.test(value);
    }

    // 邮箱格式验证
    if('email' === type){
      return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
    }
  },
  // 正确提示信息
  successMsg: function (msg) {
    alert(msg || '成功');
  },
  // 错误提示信息
  errorMsg: function (msg) {
     alert(msg || '失败');
  }
}
// 登录注册
var _logValid = {
  init: function () {
    this.bindEvent();
  },

  bindEvent: function () {
    var _this = this;

    $('#login-submit').click(function () {
      var formData = {
        phone: $.trim($('#phone').val()),
        password: $.trim($('#password').val())
      }
      console.log(formData)
      var validateResult = _this.loginValidate(formData);
      console.log(validateResult)
      if (validateResult.status) {
        _bm.successMsg(validateResult.msg);
        return false;
      } else {
        _bm.errorMsg(validateResult.msg);
        return false;
      }
      
    });

  },

  // 登录验证
  loginValidate: function (formData) {
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
  }
}


$(function() {
  _logValid.init();

});

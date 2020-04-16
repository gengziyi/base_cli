/**
 * 作者：耿梓义
 */
export const valiSpecialChar = (rule, value, callback) => {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", "g", "i");
    if (pattern.test(value)) {
        callback(new Error("请勿输入特殊字符"));
    } else {
        callback();
    }
};
//过滤bs空格
export const filterBlankSpace = {
        validator(role, value, callback) {
            let res = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
            if (!res.test(value)) {
                callback(new Error('输入有误'))
            } else {
                callback()
            }
        }
    }
    // 必填字段校验规则(input)
export const requireRule = {
    required: true,
    message: "必须信息",
    trigger: "blur"
};
// 必填字段校验规则(select)
export const requireRule2 = {
    required: true,
    message: "必须信息",
    trigger: "change"
};
// 特殊字符校验规则
export const charRule = { validator: valiSpecialChar, trigger: "blur" };
// 长度校验规则
export const lengthRule = (charMaxLength, charMinLength = 1) => {
    return {
        min: charMinLength,
        max: charMaxLength,
        message: `长度为${charMinLength} 到 ${charMaxLength}位之间`,
        trigger: "blur"
    };
};
//身份证
export const idCardRule = {
        validator(rule, value, callback) {
            let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!reg.test(value)) {
                callback(new Error('身份证格式错误'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //纯数字和字母
export const numberRule = {
        validator(rule, value, callback) {
            let reg = /^[A-Za-z0-9]+$/;
            console.log(reg.test(value))
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('格式错误'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //纯中文
export const chineseRule = {
        validator(rule, value, callback) {
            let reg = /\d+/;
            if (reg.test(value) && value != '' && value != undefined) {
                callback(new Error('姓名中不允许有数字'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //姓名拼音
export const pyRule = {
        validator(rule, value, callback) {
            let reg = /^[a-z|A-Z]{1,}$/;
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('请输入正确拼音格式'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //验证电话号码
export const telephoneRule = {
        validator(rule, value, callback) {
            let reg = /^((0\d{2,3}-\d{7,8})|(1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}))$/;
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('号码格式错误,固话需加区号和符号‘-’'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //身高或者体重
export const bodyRule = {
        validator(rule, value, callback) {
            let reg = /^([1-9]{1})([0-9]{1,2})$/g;
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('请输入正确格式'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //邮箱
export const emailRule = { type: 'email', message: '请输入正确格式', trigger: 'blur' }
    //QQ
export const QQRule = {
        validator(rule, value, callback) {
            if (isNaN(Number(value)) && value != '' && value != undefined) {
                callback(new Error('请输入数字格式'));
            } else if (!(/^[1-9]{1}[0-9]{3,20}$/.test(value)) && value != '' && value != undefined) {
                callback(new Error('请输入正确格式'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //微信,通知书号
export const weChatRule = {
        validator(rule, value, callback) {
            let reg = /^\w{1,}$/;
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('请输入正确格式'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //邮编
export const postCodeRule = {
        validator(rule, value, callback) {
            let reg = /^[0-9]{6}$/;
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('请输入正确格式'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    //分数
export const scoreRule = {
        validator(rule, value, callback) {
            let reg = /^([1-9]{1,3})|(0)$/;
            if (!reg.test(value) && value != '' && value != undefined) {
                callback(new Error('请输入正确分数格式'));
            } else {
                callback()
            }
        },
        trigger: 'blur'
    }
    // 地址非空
export const addressRules = {
    validator(rule, value, callback) {
        // let reg = /^([1-9]{1,3})|(0)$/;
        console.log(value)
        if (value != '0' && value != undefined && value != '') {
            callback()
        } else {
            callback(new Error('请选择地址'));
        }
    },
    trigger: 'blur'
}
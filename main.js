global_timeout = 5000
max_times = 10000
count = 0
while (count < max_times) {
    count = count + 1
    launch("com.lovepi.setting")

    var pkg = "com.cgws.wealth"
    newRecord(pkg)
    launch(pkg);

    // sleep(2000);
    var agree_btn = id("dlg_app_privacy_btn_agree").findOne(global_timeout)
    if (agree_btn != null) {
        agree_btn.click()
    } else {
        click(540, 1500)
    }

    // sleep(1000);
    var skip = id("cgws_splash_kh_skip").findOne(global_timeout)
    if (skip != null) {
        skip.click()
    } else {
        click(950, 150)
    }

    // sleep(1000);
    var dlgCloseBtn = id("dlg_img_close").findOne(global_timeout)
    if (dlgCloseBtn != null) {
        dlgCloseBtn.click()
    }

    // sleep(1000);
    dlgCloseBtn = id("dlg_announcement_img_close").findOne(global_timeout)
    if (dlgCloseBtn != null) {
        dlgCloseBtn.click()
    }

    // sleep(1000);
    var login = id("btn_login").findOne(global_timeout)
    if (login != null) {
        login.click()
    } else {
        var sigin = id("cgws_main_home_fg_iv_sign_in").findOne(global_timeout)
        if (sigin != null) {
            sigin.click()
        }
    }

    // sleep(1000);
    var phone = id("trade_verify_edit_phone").findOne(global_timeout)
    if (phone != null) {
        phone.click()
    } else {
        click(380, 350)
    }

    var token = "BzU+4v8uZgIX5A6ZuFSvw+0gtKdiwTPdDK9CVgDJBk4oxcTglYChLarMcs5//9mB5EqUUsYx4aJ2x5On0EBSnQGfN8/ERFkwowfA6R1l+l8DcYUNOqRjva4OjPW4wRq5yBmgIBd7xyTaHcLbN3Ui+4Y4GJEN+meU5Z9sd8HqC00="
    var project_id = "14161"
    var mobile = getPhoneNum(project_id, token)

    // sleep(1000);
    setText(0, mobile)

    // sleep(2000);
    if (!requestScreenCapture()) {
        toastLog("请求截图失败");
        continue
    }

    // sleep(1000);
    left = 720
    top = 501
    right = 990
    bottom = 609

    captcha_try_count = 0
    while (captcha_try_count < 5) {
        captcha_try_count = captcha_try_count + 1

        captureScreen("/storage/emulated/0/Pictures/gw.png");
        var clip = images.clip(images.read("/storage/emulated/0/Pictures/gw.png"), left, top, right - left, bottom - top);
        let res = http.post("http://api.jfbym.com/api/YmServer/customApi", {
            'image': images.toBase64(clip),
            'token': 'taYgkWOQpc0l4gG8YxoarFIRZEzpKgk0kdLufEJsbJY',
            'type': '10103',
        });
        images.save(clip, "/sdcard/Pictures/gw_clip.png");
        if (res.statusCode != 200) {
            toastLog("请求失败: " + res.statusCode + " " + res.statusMessage);
            continue
        }

        jsonResp = res.body.json();
        captcha = jsonResp['data']['data']
        toastLog("captcha: " + captcha)
        
        // input captcha
        var captcha_input = id("trade_verify_et_verify_code").findOne(global_timeout)
        if (captcha_input != null) {
            captcha_input.click()
        } else {
            click(420, 550)
        }
        // sleep(1000);
        setText(1, captcha)
        // sleep(1000);
        var get_sms_code = id("trade_verify_txt_get_sms_code").findOne(global_timeout)
        if (get_sms_code != null) {
            get_sms_code.click()
        } else {
            click(870, 730)
        }

        // sleep(3000);
        var positiveBtn = id("common_dlg_positive_btn").findOne(global_timeout)
        if (positiveBtn != null) {
            positiveBtn.click()
        } else {
            click(800, 1250)
        }
        
        // sleep(3000);
        var captcha_err_label = id("trade_security_verify_text_error").findOne(global_timeout)
        if (captcha_err_label != null) {
            toastLog("captcha error, try again")
            continue
        }
        break
    }

    var code = getSmsCode(mobile, project_id, token)
    if (code != null) {
        var code_input = id("trade_verify_edit_code").findOne(global_timeout)
        if (code_input != null) {
            code_input.click()
        } else {
            click(400, 730)
        }
        // sleep(1000);
        setText(2, code)

        // sleep(3000);
        click(device.width / 2, device.height / 2 - 100)

        // sleep(3000)

        uploadPhoneNum(mobile)
    } else {
        toastLog("code is null")
    }
}

// 定义 uploadPhoneNum 函数
function uploadPhoneNum(phoneNum) {
    var url = "https://aadmin.focuslife.today/api/email-usages";
    var data = {
        email: phoneNum
    };
    
    var res = http.postJson(url, data);
    var jsonResp = res.body.json();
    toastLog(JSON.stringify(jsonResp));
}

// 示例调用
uploadPhoneNum("1234567890");


function newRecord(pkg) {
    var url = "http://127.0.0.1:1688/cmd?fun=newRecord&fake_android_id=1&fake_cache_key=1&update_sdcard_ts=1&random_drm_device_id=1&random_gsf_id=1&random_ipv6=1&targets=" + pkg
    var res = http.get(url)
    if (res.statusCode == 200) {
        var jsonResp = res.body.json();
        toastLog(JSON.stringify(jsonResp))
    } else {
        toastLog("请求失败: " + res.statusCode + " " + res.body.string());
    }
}

function getPhoneNum(project_id, token) {
    var url = "http://api.sqhyw.net:90/api/get_mobile?project_id=" + project_id + "&token=" + token
    var res = http.get(url);
    if (res.statusCode == 200) {
        var jsonResp = res.body.json();
        toastLog(JSON.stringify(jsonResp))
        var mobile = jsonResp['mobile']
        toastLog("phone_num: " + mobile)
        return mobile
    } else {
        toastLog("请求失败: " + res.statusCode + " " + res.body.string());
    }
    return null
}

function getSmsCode(mobile, project_id, token) {
    sms_try_count = 0
    while (sms_try_count < 60) {
        sms_try_count = sms_try_count + 1
        sleep(3000)
        
        var url = "http://api.sqhyw.net:90/api/get_message?phone_num=" + mobile + "&project_id=" + project_id + "&token=" + token
        var res = http.get(url);
        if (res.statusCode == 200) {
            var jsonResp = res.body.json();
            toastLog(JSON.stringify(jsonResp))
            var message = jsonResp['message']
            if (message == "短信还未到达,请继续获取") {
                continue
            }
            var code = jsonResp['code']
            toastLog("code: " + code)
            return code
        } else {
            toastLog("请求失败: " + res.statusCode + " " + res.body.string());
        }
    }
    return null
}

function base64Decode(str) {
    //base64解码字符集
    var _base64DecodeChars = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ];
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = _base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = _base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = _base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = _base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }

    // return out; // 会中文乱码
    return decodeURIComponent(escape(out)); // 解决中文乱码
};
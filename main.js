
count = 0
while (count < 50) {
    count = count + 1
    launch("com.lovepi.setting")

    var pkg = "com.cgws.wealth"
    var url = "http://127.0.0.1:1688/cmd?fun=newRecord&targets=" + pkg
    var res = http.get(url)
    if (res.statusCode != 200) {
        toastLog("请求失败: " + res.statusCode + " " + res.statusMessage);
        exit();
    }

    launch(pkg);

    sleep(2000);
    click(540, 1750);

    sleep(5000);
    click(950, 160);

    sleep(10000);
    back();

    sleep(10000);
    click(540, 1070);

    sleep(2000);
    click(540, 400);

    var token = "BzU+4v8uZgIX5A6ZuFSvw+0gtKdiwTPdDK9CVgDJBk4oxcTglYChLarMcs5//9mB5EqUUsYx4aJ2x5On0EBSnQGfN8/ERFkwowfA6R1l+l8DcYUNOqRjva4OjPW4wRq5yBmgIBd7xyTaHcLbN3Ui+4Y4GJEN+meU5Z9sd8HqC00="
    var project_id = "14161"
    var url = "http://api.sqhyw.net:90/api/get_mobile?project_id=" + project_id + "&token=" + token
    var res = http.get(url);
    if (res.statusCode != 200) {
        toastLog("请求失败: " + res.statusCode + " " + res.statusMessage);
        exit();
    }

    var jsonResp = res.body.json();
    var mobile = jsonResp['mobile']
    toastLog("phone_num: " + mobile)

    http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=input text " + mobile);
    // setText(mobile);

    sleep(2000);
    if (!requestScreenCapture()) {

        console.show()

        toastLog("请求截图失败");

        exit();

    } else {
        toastLog("请求截图成功");
    }

    captureScreen("/storage/emulated/0/Pictures/gw.png");
    var clip = images.clip(images.read("/storage/emulated/0/Pictures/gw.png"), 720, 568, 990 - 720, 676 - 568);

    let res = http.post("http://api.jfbym.com/api/YmServer/customApi", {
        'image': images.toBase64(clip),
        'token': 'taYgkWOQpc0l4gG8YxoarFIRZEzpKgk0kdLufEJsbJY',
        'type': '10103',
    });

    images.save(clip, "/sdcard/Pictures/gw_clip.png");

    if (res.statusCode != 200) {
        toastLog("请求失败: " + res.statusCode + " " + res.statusMessage);
        exit();
    }

    jsonResp = res.body.json();

    captcha = jsonResp['data']['data']
    toastLog("captcha: " + captcha)

    click(540, 620);
    input(2, captcha);
    sleep(2000);
    http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=input text " + captcha);

    sleep(2000);
    click(870, 820);

    sleep(2000);
    click(750, 1390);

    sleep(15000);

    url = "http://api.sqhyw.net:90/api/get_message?phone_num=" + mobile + "&project_id=" + project_id + "&token=" + token
    res = http.get(url);
    if (res.statusCode != 200) {
        toastLog("请求失败: " + res.statusCode + " " + res.statusMessage);
        exit();
    }

    var body = res.body.string()
    toastLog(body)
    code = body.substring(24, 30)
    toastLog("code: " + code)
    click(540, 820);
    http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=input text " + code);

    sleep(2000);
    click(540, 1080);

    sleep(10000)
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
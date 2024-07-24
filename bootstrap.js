// 设置 Gitee API 相关信息
const accessToken = 'c8df988c001001b99305405d09846877'; // 替换为你的 Gitee 访问令牌
const owner = 'lihuapinghust';
const repo = 'gw_script';
const ref = 'main';
const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repo}/zipball?access_token=${accessToken}&ref=${ref}`;
const targetDir = '/sdcard/Download/';
const zipFilePath = targetDir + 'gw_script.zip';

// 检查并创建目标目录
if (!files.exists(targetDir)) {
    files.createWithDirs(targetDir);
}

// 下载zip文件
console.log('开始下载仓库...');
var res = http.get(apiUrl);
if (res.statusCode === 200) {
    files.writeBytes(zipFilePath, res.body.bytes());
    console.log('仓库下载成功');

    // 解压zip文件
    console.log('开始解压...');
    unzipFile(zipFilePath, targetDir);

    // 删除zip文件
    files.remove(zipFilePath);
    console.log('清理完成');

    let scriptPath = `/sdcard/Download/${repo}-main/main.js`;
    if (files.exists(scriptPath)) {
        let scriptContent = files.read(scriptPath);
        engines.execScript("main.js", scriptContent);
        console.log('main.js脚本已成功加载并执行');
    } else {
        console.error('main.js脚本不存在: ' + scriptPath);
    }
} else {
    console.error('下载失败: ' + res.statusMessage);
}

// 解压函数
function unzipFile(zipFile, targetDir) {
    const unzipCommand = `unzip -o ${zipFile} -d ${targetDir}`;
    launch("com.lovepi.setting")
    sleep(2000)
    http.get(`http://127.0.0.1:1688/cmd?fun=execAsRoot&command=${unzipCommand}`);
}

const LOG_MAP = [
    ['/character/list', '获取角色列表'],
    ['/log/list?page=1&size=10', '获取日志列表'],
    ['/user/info', '获取自己的登入信息'],
    ['/auth/login', '用户登陆'],
    ['/book/list', '获取书籍列表'],
    ['/user/add', '用户添加'],
    ['/user/list', '获取用户列表'],
    ['/book-classify/list', '获取书籍分类列表'],
    ['/forget-password/list?page=1&size=20', '管理重置密码申请列表'],

];

export const getLogInfoByPath = (path) => {
    let title = '';

    LOG_MAP.forEach((item) => {
        if (path.includes(item[0])) {
            title = path.replace(item[0], item[1]);
        }
    });

    return title || path;
};
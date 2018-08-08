// var base_url = 'https://api.yixsu.com/index.php';
// var base_url_h5 = 'https://api.yixsu.com';
var base_url = 'http://www.myweb.com/git-res/earth_php/index.php';
var base_url_h5 = 'http://www.myweb.com/git-res/earth_php';

var urls = {
    login:base_url+'/wenyuanjiaoyu/auth/login',
    userinfo:base_url+'/wenyuanjiaoyu/users/info',
    send_code:base_url+'/waibao/common/send_code_wenyuan',
    verify_code:base_url+'/waibao/common/verify_code_wenyuan',
    bind_tel:base_url+'/wenyuanjiaoyu/users/bind_tel',
    news_list:base_url+'/wenyuanjiaoyu/news/index',
}

module.exports = {
    base_url:base_url,
    base_url_h5:base_url_h5,
    urls: urls
}

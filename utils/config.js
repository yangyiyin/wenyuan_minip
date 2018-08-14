var base_url = 'https://api.yixsu.com/index.php';
var base_url_h5 = 'https://api.yixsu.com';
// var base_url = 'http://www.myweb.com/git-res/earth_php/index.php';
// var base_url_h5 = 'http://www.myweb.com/git-res/earth_php';

var urls = {
    login:base_url+'/wenyuanjiaoyu/auth/login',
    userinfo:base_url+'/wenyuanjiaoyu/users/info',
    send_code:base_url+'/waibao/common/send_code_wenyuan',
    verify_code:base_url+'/waibao/common/verify_code_wenyuan',
    bind_tel:base_url+'/wenyuanjiaoyu/users/bind_tel',
    news_list:base_url+'/wenyuanjiaoyu/news/index',
    bind_student:base_url+'/wenyuanjiaoyu/student/bind_student',
    get_bind_students:base_url+'/wenyuanjiaoyu/student/get_bind_students',
    change_avatar:base_url+'/wenyuanjiaoyu/student/change_avatar',
    upload:base_url+'/waibao/common/qiniu_upload',
    pay_create:base_url+'/wenyuanjiaoyu/pay/wechat_pay_create',
    change_active_student:base_url+'/wenyuanjiaoyu/student/change_active_student',
    get_student_class_info:base_url+'/wenyuanjiaoyu/student/get_student_class_info',
    get_current_student:base_url+'/wenyuanjiaoyu/student/get_current_student',
    get_lession_time_list:base_url+'/wenyuanjiaoyu/student/get_lession_time_list',
    get_student_examinations:base_url+'/wenyuanjiaoyu/examination/get_student_examinations',
    get_examination_detail:base_url+'/wenyuanjiaoyu/examination/get_examination_detail',
    examination_sign:base_url+'/wenyuanjiaoyu/examination_signs/edit',
    edit_avatar:base_url+'/wenyuanjiaoyu/examination_signs/edit_avatar',
    get_current_student_examine_log:base_url+'/wenyuanjiaoyu/examination/get_current_student_examine_log',
    suggest_edit:base_url+'/wenyuanjiaoyu/suggest/edit',
    get_my_words:base_url+'/wenyuanjiaoyu/words/get_my_words',
}

module.exports = {
    base_url:base_url,
    base_url_h5:base_url_h5,
    urls: urls
}

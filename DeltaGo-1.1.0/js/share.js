$(function(){
	var Request = new Object();
	Request = GetRequest();
	var invitCode = localStorage.getItem('invitCode');
	var userInfo = JSON.parse(localStorage.getItem('userInfo'));
	var pname = userInfo.userNickname;
	$('.nk_name').text(pname);
	$('.person_img_border img').attr('src',(userInfo.userPortrait || '../images/account_icon_user@2x.png'));
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		text: 'http://res.enrich-global.com?name='+invitCode,
		width: 300,
		height: 300,
		colorDark : '#000000',
		colorLight : '#ffffff',
		correctLevel : QRCode.CorrectLevel.M,
		src: 'http://game.enrich-global.com/img/share_logo.jpg'
	});

	// $('.share').click(function(){
	// 	$('.zz').show();
	// 	$('.shareBox').css('display','flex');
	// })
	// $('.zz').click(function(){
	// 	$('.zz,.shareBox').hide();
	// })
	/********分享*********/
	//var invitCode = localStorage.getItem('invitCode');
	var url = 'app/wxShare/getShare';
	var data = {
		url: location.href.split('#')[0],
	};
	deltaGoAjax(url,data,getShare);
	function getShare(data){
		wx.config({
            debug: false,
            appId: 'wx9fdc8490ac670613',
            timestamp:data.data.timestamp,
            nonceStr: data.data.nonceStr,
            signature: data.data.signature,
            jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ'
            ]
        });

        /*定义分享内容*/
		var title  = 'DeltaGo';    //标题
		var desc   = '人是铁，钱是钢，一天不赚憋得慌。';    //内容
		var link   = 'http://wx-deltago.enrich-global.com?name='+invitCode;  //链接
		var imgUrl = 'http://game.enrich-global.com/img/share_logo.jpg'; //图片地址

		wx.ready(function(){
			//QQ
			wx.onMenuShareQQ({
	            title: title,   //标题
	            link: link,     //链接
	            desc: desc,
	            shareUrl: link,
	            imgUrl: imgUrl, //图片地址
	            success: function (res) {

	            },
	            cancel: function (res) {

	            }
	        });

	        //朋友圈
	        wx.onMenuShareTimeline({
	            title: title,   //标题
	            link: link,     //链接
	            imgUrl: imgUrl, //图片地址
	            success: function (res) {

	            },
	            cancel: function (res) {

	            }
	        });

	        //发给好友
	        wx.onMenuShareAppMessage({
	            title: title,   //标题
	            desc: desc,     //内容
	            link: link,     //链接
	            imgUrl: imgUrl, //图片地址
	            success: function (res) {

	            },
	            cancel: function (res) {

	            }
	        });
		})
	}

})
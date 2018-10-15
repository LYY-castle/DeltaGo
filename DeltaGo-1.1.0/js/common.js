	
// $(function(){
	/*********设置基础字体********/
	var fontSize = $(window).width()/18.75;//屏幕的宽
	$("html").css("font-size",fontSize +"px");

	/*********返回********/
	if($('.back-title').length > 0){
		$('.back-title-img').click(function(){
			if($(this).hasClass('home')){
				window.location.href = '../index.html?act=0';
			}else if($(this).hasClass('find')){
				window.location.href = '../index.html?act=1';
			}else if($(this).hasClass('mine')){
				window.location.href = '../index.html?act=2';
			}else{
				window.history.back(-1); 
			}
			
			// location.reload(); 
		})
	}

		var url = location.search; //获取url中"?"符后的字串  
	/*********获取url参数*********/
	function GetRequest() {
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}
	/********ajax********/
	function getUrl(){
		return 'http://112.74.165.232:8380/deltagoServiceWeb/';
		// return 'http://192.168.1.110:8080/deltagoServiceWeb/'; 
	}
	function deltaGoAjax(url,data,ok,type){
		url = getUrl() + url;
		data.tokenId = localStorage.getItem('tokenId');
		var aType;
		if(type){
			aType = 'get';
		}else{
			aType = 'post';
		}
		
		$.ajax({
            type:aType,
            url:url,
           	data:data,
           	beforeSend: function(xhr){
           		loadingShow();
           	},
            success: function(data){
            	if(data.status == 0){
            		ok(data);
            		$('body').find('.loading').remove();
            	}else if(data.status == 202){
            		$('body').find('.loading').remove();
            		errorMsg(data.msg);
            		localStorage.removeItem('tokenId');
            		window.location.href = '../index.html?act=2';
            	}else if(data.status == 201){
            		$('body').find('.loading').remove();
            		errorMsg(data.msg);
            		setTimeout(function(){
            			window.location.href = '../index.html?act=2';
            		},2000)
            	}else if(data.status == 402){
            		$('.msgBox .title').text('提示');
            		$('.preMsg').show();
            		$('.msg').hide();
            	}else{
            		$('body').find('.loading').remove();
            		errorMsg(data.msg);
            	}
                
            }
        })
	}

	/*****请求等待菊花图******/
	function loadingShow(){

   		var str = '<div class="loading">'+
						'<div class="mop-css-7 circleBox">'+
							'<div class="spinner-container container1">'+
								'<div class="circle1"></div>'+
								'<div class="circle2"></div>'+
								'<div class="circle3"></div>'+
								'<div class="circle4"></div>'+
							'</div>'+
							'<div class="spinner-container container2">'+
								'<div class="circle1"></div>'+
								'<div class="circle2"></div>'+
								'<div class="circle3"></div>'+
								'<div class="circle4"></div>'+
							'</div>'+
							'<div class="spinner-container container3">'+
								'<div class="circle1"></div>'+
								'<div class="circle2"></div>'+
								'<div class="circle3"></div>'+
								'<div class="circle4"></div>'+
							'</div>'+
						'</div>'+
       				'</div>';
   		$('body').append(str);
	}

	/*********请求错误弹框*********/
	function errorMsg(msg){
		$('.errorMsg').remove();
		var str = '<div class="errorMsg">'+msg+'</div>';
		$('body').append(str);
		$('body').find('.errorMsg').fadeIn(1000).delay(2000).fadeOut(1000);
	}
// })

	/**********将金额转为三位数一个，**********/
	function moneyToFloat(num){
		return parseFloat(num).toLocaleString();
	}

	/*********随机数**********/
	function random(){
		var rannum = Math.ceil(Math.random()*1000);
		return rannum;
	}


	/********时间戳改日期*********/
	function formDate(num){
		var date = new Date(num);
		Y = date.getFullYear() + '年';
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
		D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + '日 ';
		h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
		m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
		s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
		var ymdh = Y+M+D+h+m+s;
		return ymdh;
	}

	/*********分享**********/
	// var invitCode = localStorage.getItem('invitCode');
	if(!$('body').hasClass('SpecialShare')){
		document.write('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
		share();
	}
	function share(){
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
			var title  = 'DeltaGo'; //标题
			var desc   = ($('.back-title-text').text() || $('.tabActive div').eq(1).text());    //内容
			var link   = location.href.split('#')[0];  //链接
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
	}
	
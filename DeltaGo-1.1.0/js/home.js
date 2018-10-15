$(function(){
	deltaGoAjax('app/product/getAllProduct',{},creatProduce);
	function creatProduce(data){
		$('.produce').html('');
		data = data.data;
		$.each(data,function(k,val){
			var str = '';
			var num = 0;
			var dataType = val.productInfos;
			str += '<div class="produce_box" data-id="'+val.productDetailId+'">'+
				'<div class="produce_type bg1">'+
				// '<img src="'+val.productTitleLogo+'" class="paddingeLftImg">'+
				'<span class="produce_type_name">'+val.productTitle+'</span>'+
				'</div>';

			$.each(dataType,function(i,value){
				var bg = (num%2 == 0) ? 'bg2' : 'bg1';
				var selloutClass = '';
				var btn_img = '../images/home_button_buy.png';
				if(value.marketStatus == 0){
					var btn_img = '../images/home_button_sellout@2x.png';
					selloutClass = 'sellout';
				}else if(value.marketStatus == 2){
					var btn_img = '../images/happNewYear/home_button_buy_wheel@2x.png';
				}
				// if(value.productId == '0023'){
				// 	var btn_img = '../images/home_button_see.png';
				// }
				var productMinMoney = moneyToFloat(value.productMinMoney);
				str += '<div data-pid="'+value.productId+'" class="produce_content padding-left '+bg+'">'+
				'<div class="produce_content_left">'+
				'<p class="box_green">'+value.productCycleName+'</p>'+
				'<p class="box_green">$'+productMinMoney+'起投</p><br>'+
				'<p class="produce_type_name_ch">'+value.productName+'</p>'+
				'<p class="produce_type_name_en">'+value.productEnglishName+'</p>'+
				'</div>'+
				'<div class="produce_content_center">'+
				'<div class="income_title">'+
				'	预期年化收益'+
				'</div>'+
				'<div class="incomebox">'+
				'	<span class="income">'+value.productEarnRate.split('%')[0]+'</span><span class="">%</span>'+
				'</div>'+
				'</div>'+
				'<div class="produce_buy_box">'+
				// '<div class="produce_buy_btn '+selloutClass+'" data-pid="'+value.productId+'" data-marketStatus="'+value.marketStatus+'">立即购买</div>'+
				'<img class="produce_buy_btn '+selloutClass+'" data-pid="'+value.productId+'" data-marketStatus="'+value.marketStatus+'" src="'+btn_img+'">'+
				'</div>'+
				// '</div>'+
				'</div>';
				num++;

			})
			str += '</div>';
			$('.produce').append(str);
			// if(k == 0){
			// 	console.log(k);
			// 	$('.produce').find('.produce_buy_btn').css('height',3.75+'rem');
			// 	$('.produce').find('.produce_buy_btn').css('width',3.75+'rem');
			// 	$('.produce').find('.produce_buy_btn').css('backgroundImage','../images/home_button_sellout@2x.png');
			// 	$('.produce').find('.produce_buy_btn').css('background-size','100% 100%');
			// 	$('.produce').find('.produce_buy_btn').css('margin-top',0);
			// 	$('.produce').find('.produce_buy_btn').css('margin-left',1.35+'rem');
			// }
		})
		var html = '<span class="produce_type_msg box_green">每人仅限购新手专享产品一次</span>';
		$.each($('.produce .produce_box'),function(k,val){
			// var paddingImg = '<img src=../images/happNewYear/home_icon_newyear@2x.png class="paddingeLftImg">';
			// $(val).css('position','relative').find('.produce_type').prepend(paddingImg).find('.produce_type_name').addClass('paddingLeft');
			if($(val).attr('data-id') == 1){
				$(val).find('.produce_type').append(html);
				return false;
			}
		})
		
		buyGlodCard();
	}

	/********时间戳改日期*********/
	function newDate(){
		var date = new Date();
		Y = date.getFullYear() + '.';
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
		D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + '. ';
		h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
		m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
		// s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
		var ymdh = Y+M+D+h+m;
		return ymdh;
	}
	
	$('.inviterA').click(function(){
		var tokenId = localStorage.getItem('tokenId');
		if(!tokenId){
			errorMsg('请先登录');
			return;
		}
		window.top.location='invite.html';
	})

	function buyGlodCard(){
		$('.produce_buy_btn').click(function(){ //立即购买
			var tokenId = localStorage.getItem('tokenId');
			if(!tokenId){
				errorMsg('请先登录');
				return;
			}
			// if($(this).attr('data-pid') == '0023'){
			// 	console.log(111)
			// 	return;
			// }
			if($(this).attr('data-pid') == '0021'){
				window.top.location = '../template/PlanDetail.html?productId=0021'+'&shengyu=0'+'&time='+newDate()+'&marketStatus=0';
			}else{
				var pid = $(this).closest('.produce_content').attr('data-pid');
				window.top.location = '../template/buyGlodCard.html?productId='+pid+'&marketStatus='+$(this).attr('data-marketStatus');
			}
		})

		$('.produce_content_left,.produce_content_center').click(function(){ //查看产品详情
			var pid = $(this).closest('.produce_content').attr('data-pid');
			var type = $(this).closest('.produce_box').attr('data-id');
			if(type == '1'){
				window.top.location = '../template/productDetail_1.html?productId='+pid;
			}else if(type == '2' || type == '3'){
				window.top.location = '../template/productDetail_2.html?productId='+pid;
			}else if(type == '4'){
				if(pid == '0022'){
					window.top.location = '../template/productDetail_4.html?productId='+pid;
				}else if(pid == '0021'){
					window.top.location = '../template/productDetail_3.html?productId='+pid;
				}s
			}else if(type == '5'){
				if(pid == '0023'){
					// return;
					window.top.location = '../template/productDetail_5.html?productId='+pid;
				}
			}
			
		})
	}

	getBannerImg();
	function getBannerImg(){
		var url = 'app/banner/indexBanner';
		deltaGoAjax(url,{},creatBanner);
	}

	function creatBanner(data){  //轮播图
		var data = data.data;
		var str = '';
		$.each(data,function(k,val){
			str += '<div class="swiper-slide">'+
						'<img src="'+val.img+'" alt="">'+
					'</div>';
		});
		$('.home_banner').append(str);
		mySwiper();
	}

	function mySwiper(){
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: 3000,//可选选项，自动滑动
			pagination : '.swiper-pagination',
			autoplayDisableOnInteraction : false
		})
	}
	
})
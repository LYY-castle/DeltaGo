$(function(){
	var outType = 1;  //当前提现类型
	var outMoney; //当前可提现金额
	var reMainMoney; //当前佣金可提现金额
	var applicationStatus = 0; //联名卡申请状态
	var mySwiper = new Swiper('.swiper-container',{
		effect : 'coverflow',
		slidesPerView: 1.2,
		centeredSlides: true,
		coverflow: {
			rotate: 10,
			stretch: -25,
			depth: 100,
			modifier: 2,
			slideShadows : false
		},
		onSlidePrevEnd: function(swiper){
			$('.corpusCardsShow').show();
			$('.buy1').attr('data-type','income');
			$('.buy2').text('充值');
			outType = 1; //收益卡
			outMoney = $('.income_card .car_money').text();
		},
		onSlideNextEnd: function(swiper){
			$('.corpusCardsShow').hide();
			$('.buy1').attr('data-type','commission');
			$('.buy2').text('转入余额');
			outType = 2; //佣金
			outMoney = $('.commission_card .car_money').text();
		},
	})

	// $('.back-title-img').click(function(){  //代理
	// 	console.log(111)
	// })
	var userId;  //用户id
	var auditStatus; //身份认证状态
	var auditReason;
	$('.p_img').click(function(){  //我的账户
		window.top.location = '../template/my_account.html?pname='+userId;
	})
	$('.mine-title-img').click(function(){//消息
		window.top.location.href = '../template/message.html';
	})
	$('.p_qrcode').click(function(){  //分享
		window.top.location = '../template/share.html';
	})

	$('.buy1').click(function(){  // 提现
		errorMsg('提现系统升级中!');
		return;
		if(auditStatus == 0 ){
			window.top.location = '../template/idInsure.html?act=1&type='+outType+'&money='+outMoney;
		}else if(auditStatus == 1 || auditStatus == 3){
			window.top.location = '../template/idInsureDuring.html?status='+auditStatus+'&auditReason='+auditReason;
		}else if(auditStatus == 2){
			var url = 'app/withdraw/getLatestWithdrawRecord';
			deltaGoAjax(url,{},getLatestWithdrawRecord);
		}
	})

	function getLatestWithdrawRecord(data){
		if(data.data.withdrawStatus == 1 || data.data.withdrawStatus == 3){
			window.top.location = '../template/withdrawalDuring.html?type='+outType+'&money='+outMoney;
		}else{
			if(outType == 1){
				deltaGoAjax('app/withdraw/queryWithdraw',{},queryWithdraw);
			}else{
				window.top.location = '../template/outMoneyMethod.html?type='+outType+'&money='+outMoney;
			}
		}
	}

	function queryWithdraw(data){
		if(data.data == 0){
			window.top.location = '../template/outMoneyMethod.html?type='+outType+'&money='+outMoney;
		}else{
			$('.msgzz').show();
		}
	}

	$('.cancel').click(function(){
		$('.msgzz').hide();
	})
	$('.ok').click(function(){
		window.top.location = '../template/outMoneyMethod.html?type='+outType+'&money='+outMoney;
	})

	$('.buy2').click(function(){  // 充值  、、 转入余额
		if($('.buy2').text() == '充值'){
			window.top.location = '../template/recharge.html';
		}else{
			window.top.location = '../template/toRemain.html?reMainMoney='+reMainMoney;
	}
		
	})

	$('.addCard').click(function(){  //添加本金卡
		window.top.location = '../index.html';
	})

	$('.agent').click(function(){  //添加代理商
		window.top.location = '../template/agent.html';
	})

	$('.income_card').click(function(){ //收益卡
		if(parseInt($('.assetTotal').text()) == '0'){
			window.top.location = '../template/recharge.html';
		}else{
			var data = $(this).attr('data-card').replace('#',1);
			window.top.location = '../template/income.html?cardDetail='+encodeURI(encodeURI(data))+'&pname='+$('.p_name').text();
		}
	})

	$('.commission_card').click(function(){ //佣金卡
		if(reMainMoney == '0.00'){
			window.top.location = '../template/share.html?pname='+$('.p_name').text();
		}else{
			var data = $(this).attr('data-card').replace('#',1);
			window.top.location = '../template/commissionCard.html?cardDetail='+encodeURI(encodeURI(data))+'&pname='+$('.p_name').text();
		}
		
	})

	$('.corpusCardsAll').on('click','.corpusCardsBox',function(){  //本金卡
		var productBuyId = $(this).attr('data-card');
		if($(this).attr('data-cardT') == 2){
			window.top.location = '../template/predeterminedCardDetail.html?productBuyId='+productBuyId;
		}else{
			window.top.location = '../template/corpusCardDetail.html?productBuyId='+productBuyId;
		}
		
	})

	$('.income_card .logo').click(function(e){
		e.stopPropagation();
		if(applicationStatus == 0 || applicationStatus == 3){
			window.top.location = '../template/lianmingkashenqing1.html';
		}else{
			window.top.location = '../template/lianmingkashenqing3.html';
		}
	})

	var url = 'app/asset/getUserAssetDetail';
	deltaGoAjax(url,{},userPriInfo);
	function userPriInfo(data){
		$('.assetTotal').text(moneyToFloat(data.data.assetTotal));
		if(data.data.earnCard){
			var earnCard = data.data.earnCard;
			outMoney = earnCard.assetBalance;
			$('.income_card .car_money').text(moneyToFloat(earnCard.assetBalance));
			var CNumber = earnCard.assetCardNumber;
			$('.income_card .card-first').text(CNumber.substr(0,1));
			$('.income_card .card-last').text(CNumber.substr(CNumber.length-4));
			$('.income_card .en').text(data.data.userNickname  || 'DeltaGo');
			// $('.income_card .date').text(earnCard.assetExpireTime);
			$('.income_card').attr('data-card',JSON.stringify(earnCard));
		}
		if(data.data.brokerageCard){
			var commissionCard = data.data.brokerageCard;
			reMainMoney = commissionCard.assetBrokerageMoney;
			$('.commission_card .car_money').text(moneyToFloat(commissionCard.assetBrokerageMoney));
			var CNumber = commissionCard.brokerageCardNumber;
			$('.commission_card .card-first').text(CNumber.substr(0,1));
			$('.commission_card .card-last').text(CNumber.substr(CNumber.length-4));
			$('.commission_card .en').text(data.data.userNickname  || 'DeltaGo');
			// $('.commission_card .date').text(commissionCard.brokerageExpireTime);
			$('.commission_card').attr('data-card',JSON.stringify(commissionCard));
		}
		if(data.data.corpusCards){
			$('.addCard').hide();
			var corpusCards = data.data.corpusCards;
			$.each(corpusCards,function(k,val){
				var bgColor = randomColor();
				var CNumber = val.productCardNumber;
				var cardTypeEn = (val.cardType == 2) ? 'PREDETERMINED' : 'PRINCIPAL';
				var cardTypeCh = (val.cardType == 2) ? '预定' : '本金';
				var gradientColor1 = val.productColor.split(',')[0];
				var gradientColor2 = val.productColor.split(',')[1];
				var str = '<div class="corpusCardsBox" data-card='+val.productBuyId+' data-cardT="'+val.cardType+'" style="background:linear-gradient(to right top, '+gradientColor1+' , '+(gradientColor2 || gradientColor1)+')">'+
							'<div class="car_top">'+
								'<img class="car_logo" src="../images/mine_card_logo@2x.png">'+
								'<span class="car_income">'+cardTypeEn+'&nbsp;&nbsp;'+cardTypeCh+'</span>'+
							'</div>'+
							'<div class="car_center">'+
								'<div class="car_money">'+moneyToFloat(val.productBuyMoney)+'</div>'+
								'<div class="car_id">'+CNumber.substr(0,1)+'***&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;'+
								'****&nbsp;&nbsp;&nbsp;'+CNumber.substr(CNumber.length-4)+'</div>'+
							'</div>'+
							'<div class="car_bottom">'+
								'<span class="en">'+(data.data.userNickname  || 'DeltaGo')+'</span>'+
								'<span class="date" style="margin-right:0">'+val.productExpireTime+'</span>'+
							'</div>'+
						'</div>';
				$('.corpusCardsAll').append(str);
			})
			$('.corpusCardsAll').show();
		}
	}

	var url2 = 'app/user/getUserInfo';
	deltaGoAjax(url2,{},userInfo);
	function userInfo(data){
		data.data.userPortrait = (data.data.userPortrait || '../images/account_icon_user@2x.png');
		data.data.userNickname = (data.data.userNickname || 'DeltaGo');
		$('.userPortrait').attr('src',data.data.userPortrait)
		$('.p_name').text(data.data.userNickname);
		$('.p_babel').text(data.data.gradeName);
		userId = data.data.userId;
		auditStatus = data.data.auditStatus;
		auditReason = data.data.auditReason;
		applicationStatus = data.data.applicationStatus;
		localStorage.setItem('deal',data.data.deal);
		localStorage.setItem('invitCode',data.data.userInvitationCode);
		localStorage.setItem('userInfo',JSON.stringify(data.data));
	}


	function randomColor(){
		var color = '(';
		for(var i=0;i<3;i++){
			var Range = 180 - 50;   
			var Rand = Math.random();   
			var num = 50 + Math.round(Rand * Range)
			color += (num + ',')
		}
		color += '1)';
		return color;
	}
})
$(function(){

	/*******获取本金卡产品id********/
	var Request = new Object();
	Request = GetRequest();
	var pid = Request["productId"];
	var marketStatus = Request["marketStatus"];
	var productMinMoney = 0;
	var productEarnRate;
	if(marketStatus == 2){
		$('.dsp').show();
		$('.preT').hide();
		$('.preM').hide();
		$('.circle').click(function(){
			$(this).addClass('circleColor');
			$('.selectMethod .circle').not(this).removeClass('circleColor');
			$('.perBox').text('0');
			$('.enterPri').val('').attr('placeholder',moneyToFloat(productMinMoney)+'美元起投');
			if($(this).attr('data-money') == 1){
				$('.annual').text((productEarnRate.split('%')[0]/100+0.02)*100+'%');
				$('.preM').hide();
				$('.preT').hide();
				$('.preCnm').show();
				$('.bgColor').removeClass('bg2').addClass('bg1');
			}else{
				$('.annual').text((productEarnRate.split('%')[0]/100+0.01)*100+'%');
				$('.preM').show();
				$('.preT').show();
				$('.preCnm').hide();
				$('.bgColor').removeClass('bg1').addClass('bg2');
			}
		})
	}

 
	if(pid == '0017'){
		$('.floatIncome').show().find('.floatMsg').text('爱智富按每个季度公司所公布的公司净收益的30%进行发放。');
	}else if(pid == '0018'){
		$('.floatIncome').show().find('.floatMsg').text('爱智盈按每个季度公司所公布的公司净收益的50%进行发放。');
	}else if(pid == '0019'){
		$('.floatIncome').show().find('.floatMsg').text('爱智鑫按每个季度公司所公布的公司净收益的70%进行发放。');
	}
	var productCycle;
	deltaGoAjax('app/product/getProductDetail',{productId:pid},productInfo);
	function productInfo(data){  //获取产品详情
			enterProductInfos(data.data.productInfo);
	}
	function enterProductInfos(data){
		productMinMoney = data.productMinMoney;
		$('.minPriNum').text(moneyToFloat(data.productMinMoney));
		productEarnRate = data.productEarnRate;
		// if(marketStatus == 2){
		// 	productEarnRate = productEarnRate.split('%')[0];
		// }
		if(marketStatus == 2){
			$('.annual').text((productEarnRate.split('%')[0]/100+0.02)*100+'%');
		}else{
			$('.annual').text(productEarnRate);
		}
		
		$('.cardCycle').text(data.productCycleName);
		$('.back-title-text').text(data.productName);
		// $('.minPriNum').text(data.productMinMoney);
		// $('.minPriNum').text(data.productMinMoney);
		$('.enterPri').attr('placeholder',moneyToFloat(data.productMinMoney)+'美元起投');
		productCycle = data.productCycle;
		var endTime = productEndTime(productCycle);
		if(marketStatus == 2){
			$('.endTime').text('2018-11-01');
		}else{
			$('.endTime').text(endTime);
		}
		
	}
	function productEndTime(productCycle){
		var mydate = new Date();
		mydate.setDate(mydate.getDate() + productCycle)
		var y = mydate.getFullYear(); //获取完整的年份(4位,1970-????)
		var m = mydate.getMonth(); //获取当前月份(0-11,0代表1月)
		var d = mydate.getDate(); //获取当前日(1-31)
		m = (m+1 < 10) ? '0'+(m+1) : (m+1);
		d = d < 10 ? '0'+d : d;
		return y + '-' + m + '-' + d;
	}

	var rate;
	deltaGoAjax('app/asset/getExchangeRate',{},getExchangeRate);
	function getExchangeRate(data){ 
		rate = (data.data.sellingEarn/100).toFixed(4); 
		$('.current_exchange').text(rate);
	}
	$('.enterPri').keyup(function(){
		var rmbNum = rate*$('.enterPri').val();
		rmbNum = rmbNum.toFixed(2);
		$('.rmb').text(moneyToFloat(rmbNum)); //人民币
		if(marketStatus == 2){
			if($('.circleColor').attr('data-money') == 1){
				var income = ($('.enterPri').val() * ($('.annual').text().split('%')[0]/100 + 0.02) * productCycle ) / 365;
			}else{
				var income = ($('.enterPri').val() * ($('.annual').text().split('%')[0]/100 + 0.01) * productCycle ) / 365;
			}
		}else{
			var income = ($('.enterPri').val() * ($('.annual').text().split('%')[0]/100) * productCycle ) / 365;
		}
			
		$('.income_money').text(moneyToFloat(income.toFixed(2))); //预计收益


		if($('.circleColor').attr('data-money') == 1){ // 全额
			$('.DollarNum').text(moneyToFloat($('.enterPri').val()*1));
			$('.predetemineNum').text(moneyToFloat(rmbNum));
		}else{ //  10%
			$('.DollarNum').text(moneyToFloat($('.enterPri').val()*0.1));
			$('.predetemineNum').text(moneyToFloat(rmbNum*0.1));
		}
		
	})
	deltaGoAjax('app/asset/getAssetBalance',{},getAssetBalance);
	function getAssetBalance(data){ //获取余额
		$('.current_pri').text(moneyToFloat(data.data.assetBalance));
	}


	$('.Agreement span').click(function(){  //勾选协议
		if($('.agree').hasClass('agreeAct')){
			$('.agree').removeClass('agreeAct');
		}else{
			$('.agree').addClass('agreeAct');
		}
	})

	$('.btn_bottom').click(function(){
		if($('.enterPri').val() == ''){
			errorMsg('请输入金额!');
			return;
		}
		if(!$('.agree').hasClass('agreeAct')){
			errorMsg('请阅读投资协议!');
			return;
		}
		var deal = localStorage.getItem('deal');
		if(deal == 0){
			window.location.href = 'setDeal.html?isdeal=1&isFirst=1';
		}
		$('.msgzz').show();
	})
	function buyGlodCard(data){
		 // $('.dealP').val();
		var money = $('.enterPri').val();
		var data = {
				productId:pid,
				money: money
			};
		if(marketStatus == 2){
			if($('.circleColor').attr('data-money') == 2){
				data.reserveMoney = money * 0.1;
			}
		}
		deltaGoAjax('app/product/productBuy',data,buyOk);
		setTimeout(function(){
			dealOk();
		},2500);
		
	}
	function buyOk(data){
		if(marketStatus == 2){
			errorMsg('预购成功');
			setTimeout(function(){
				window.location.href = '../index.html?act=2';
			},2000)
		}else{
			var cardDetail = encodeURI(encodeURI(JSON.stringify(data.data)))
			window.location.href = '../template/buyCardOk.html?cardDetail='+cardDetail;
		}
	}

	$('.cancel').click(function(){
		$('.msgzz').hide();
		$('.dealP').val('');
	})
	
	dealOk();
	function dealOk(){
		$('.ok').click(function(){
			$('.ok').off('click');
			var data = {
				operation:'verify',
				dealPwd: $('.dealP').val()
			};
			deltaGoAjax('app/user/deal',data,buyGlodCard);
		})
	}
})
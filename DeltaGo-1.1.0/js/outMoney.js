$(function(){
	var Request = new Object();
	Request = GetRequest();
	var outType = Request['type'];
	var outMaxMoney;

	deltaGoAjax('app/asset/getAssetBalance',{},getAssetBalance);
	function getAssetBalance(data){
		if(outType == 1){
			outMaxMoney = data.data.assertBalanceCanWithdraw;
		}else{
			outMaxMoney = data.data.assertBrokerageCanWithdraw;
		}
		$('.WithdrawMoney').attr('placeholder','可提现金额 $'+moneyToFloat(outMaxMoney));
	}

	if(outType == 2){
		$('.remind').hide();
		$('.commission_remind').show();
		$('.Agreement').show();
	}
	$('.tokenId').val(localStorage.getItem('tokenId'));
	$('.withdrawType').val(outType);
	var formData;
	$('.sure').click(function(){
		if(parseFloat($('.WithdrawMoney').val())>parseFloat(outMaxMoney)){
			errorMsg('最大提现金额为 '+moneyToFloat(outMaxMoney)+'美元');
			return;
		}
		formData = $('form').serializeArray();
		var isOk = true;
		$.each(formData,function(k,val){
			if(val.value == ''){
				isOk = false;
				errorMsg('请填写完整信息');
				return false;
			}
		})
		if(!$('.agree').hasClass('agreeAct') && outType == 2){
			errorMsg('请阅读协议!');
			return;
		}
		var deal = localStorage.getItem('deal');
		if(deal == 0){
			window.location.href = 'setDeal.html?isdeal=1&isFirst=1';
		}
		if(isOk){
			$('.msgzz').show();
		}
		
	})

	$('.ok').click(function(){
		var data = {
				operation:'verify',
				dealPwd: $('.dealP').val()
			};
		deltaGoAjax('app/user/deal',data,outMoneySure);	
	})
	$('.cancel').click(function(){
		$('.msgzz').hide();
		 $('.dealP').val('');
	})
	function outMoneySure(){
		var url = 'app/withdraw/submitBankInfo';
		deltaGoAjax(url,formData,outMoneyOk);
	}
	function outMoneyOk(data){
		errorMsg('提现成功');
		setTimeout(function(){
			window.location.href = '../index.html?act=2';
		},2000)
	}

	$('.Agreement span').click(function(){  //勾选协议
		if($('.agree').hasClass('agreeAct')){
			$('.agree').removeClass('agreeAct');
		}else{
			$('.agree').addClass('agreeAct');
		}
	})
})
$(function(){
	var phone = localStorage.getItem('phone');
	var password = localStorage.getItem('password');
	if(phone != '' && phone != undefined && phone != null){
		$('.phoneNumber').val(phone);
	}
	if(password != '' && password != undefined && password != null){
		$('.password').val(password);
	}

	$(".login").click(function () {
		var regExp=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
		if($('.phoneNumber').val() == ''){
			errorMsg("密码不能为空");
			return;
		}
		if($(".password").val()==""){
			errorMsg("密码不能为空");
			return;
		}
		var url = 'app/login/login';
		var data = {
			phone:$(".phoneNumber").val(),
			password:$(".password").val(),
		};
		deltaGoAjax(url,data,loginOk)
	})
	function loginOk(result){
		localStorage.setItem('tokenId',result.data.tokenId);
		rememberPassword();
		window.location.href = '../index.html?act=2';
	}
	function rememberPassword(){
		localStorage.setItem('phone',$('.phoneNumber').val());
		if($('.r_choice').hasClass('agreeAct')){
			localStorage.setItem('password','');
		}else{
			localStorage.setItem('password',$('.password').val());
		}
	}
	$('.choice span').click(function(){  //记住密码
		if($('.r_choice').hasClass('agreeAct')){
			$('.r_choice').removeClass('agreeAct');
		}else{
			$('.r_choice').addClass('agreeAct');
		}
	})

})
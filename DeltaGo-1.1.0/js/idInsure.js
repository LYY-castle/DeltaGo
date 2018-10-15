$(function(){
	var Request = new Object();
	Request = GetRequest();
	var act = Request["act"];
	var outType = Request['type'];
	var outMoney = Request['money'];
	if(act == 1){
		
	}else{
		$('.top').hide();
		$('.next span').text('确定');
	}
	$('.tokenId').val(localStorage.getItem('tokenId'));
	$('.uploadImg').change(function(e){
		var index = $(this).attr('data-index');

		 //获取文件  
		 var file = $(".uploadImg")[index].files[0];  
	    //创建读取文件的对象  
	    var reader = new FileReader();  

	    //创建文件读取相关的变量  
	    var imgFile;  
	    //为文件读取成功设置事件  
	    reader.onload=function(e) {  
	    	imgFile = e.target.result;  
	    	$(".uploadImgA").eq(index).find('.tip').hide();
	    	$(".uploadImgA").eq(index).find('.cardImg').show().find('img').attr('src', imgFile); 
	    };  

	    //正式读取文件  
	    reader.readAsDataURL(file); 
	})	

	$('.uploadImgA').click(function(){
		$(this).siblings('.uploadImg').click();
	})

	$('.next').click(function(){
		$.ajax({
			url: getUrl()+'app/user/uploadUserIdentity',
			type: 'POST',
			cache: false,
			data: new FormData($('#myform')[0]),
			processData: false,
			contentType: false,
			success: function(data){
				if(data.status == 0){
            		ok(data);
            	}else if(data.status == 202){
            		errorMsg(data.msg);
            		localStorage.removeItem('tokenId');
            		window.location.href = '../index.html?act=2';
            	}else if(data.status == 201){
            		errorMsg(data.msg);
            		setTimeout(function(){
            			window.location.href = '../index.html?act=2';
            		},2000)
            	}else{
            		errorMsg('请确认身份信息上传成功');
            	}
			}
		});
	})
	function ok(data){
		if(act == 1){
			window.location.href = 'outMoneyMethod.html?type='+outType+'&money='+outMoney;
		}else{
			errorMsg(data.msg);
			setTimeout(function(){
				window.location.href = '../template/idINsureDuring.html?status=1'; 
			},2000)
		}
	}
})
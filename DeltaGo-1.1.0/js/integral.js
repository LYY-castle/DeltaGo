$(function(){
	$('.nav-title').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		switch($(this).index()){
			case 0:$('iframe').attr('src','chanpingjieshao.html'); break;
			case 1:$('iframe').attr('src','jituanjianjie.html'); break;
			case 2:$('iframe').attr('src','chuangshirenkongjian.html'); break;
		}
	})

	$('.back-title-img').click(function(){
		window.location.href = '../index.html'; 
	})
})
$(function(){
	var tokenId = localStorage.getItem('tokenId');
	if(tokenId != '' && tokenId != undefined && tokenId != null){
		$("footer ul li a").eq(2).attr('data-src','template/mine.html');
	}

	$("footer ul li a").click(function() {
		// $('iframe').attr('src',$(this).attr('data-src'));
		// $(this).addClass('tabActive').parent().siblings().find('a').removeClass('tabActive');
		if($(this).hasClass('tabActive')){
			return;
		}
		window.location.href = 'index.html?act='+$(this).parent().index();
	})

	var Request = new Object();
	Request = GetRequest();
	var act = Request["act"];
	if(act != undefined){
		$('iframe').attr('src',$("footer ul li a").eq(act).attr('data-src'));
		$("footer ul li a").eq(act).addClass('tabActive').parent().siblings().find('a').removeClass('tabActive');
	}else{
		$('iframe').attr('src',$("footer ul li a").eq(0).attr('data-src'))
	}
})
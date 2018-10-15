$(function(){
	var Request = new Object();
	Request = GetRequest();
	var pid = Request["productId"];
	$('.btn_bottom').click(function(){
		window.location.href = '../template/buyGlodCard.html?productId='+pid;
	})

	
	var url = 'app/product/getProductDetail';
	var data = {
		productId: pid,
	};
	deltaGoAjax(url,data,enterProductInfos,'get');
	function enterProductInfos(data){
		data = data.data.productInfo;
		var reg = /'\r\n'/g;
		$('.back-title-text').text(data.productName);
		$('.inc').text(data.productCycleName);
		$('.num').text(data.productEarnRate.split('%')[0]);
		$('.productIntroduce').html(data.productIntroduce.replace(/\r\n/g,'<br/><br/>'));
		var productMinMoney = moneyToFloat(data.productMinMoney);
		$('.minMoney').text(productMinMoney+'美元');
		$('.minMoneyIn').text(productMinMoney);
		var maxMoney = (data.productMaxMoney == null) ? '没有限额' : (moneyToFloat(data.productMaxMoney)+'美元');
		$('.maxMoney').text(maxMoney);
		$('.cper').text(data.productCycleName);
		$('.qtext').text(data.investmentAnalysis.split('？')[0]+'？');
		
		$('.atext').html(data.investmentAnalysis.split('？')[1].replace(/\r\n/g,'<br/><br/>'));

		var str = '';
		$.each(data.reports,function(k,val){
			$('.inReport').eq(k).attr('data-year',val.year);
			str += '<div class="inReport" data-year="'+val.year+'">'+
						'<div class="left">'+
							'<span>'+val.content.split('[')[0]+' </span>'+
							'<span class="f-8 inReportTime">['+val.content.split('[')[1]+'</span>'+
						'</div>'+
						'<div class="right"></div>'+
					'</div>';

		})
		$('.area7').append(str);

		if(data.productName.indexOf('7D') != -1){
			$('.area8_img img').attr('src','../images/product_img_invest7d@2x.png');
		}else if(data.productName.indexOf('6M') != -1){
			$('.area8_img img').attr('src','../images/product_img_invest6m@2x.png');
		}else{
			$('.area8_img img').attr('src','../images/product_img_invest1y@2x.png');
		}
	}

	$('.area7').on('click','.inReport',function(){
		window.location.href = '../template/touzibaogaoxinshoubiao.html?productId='+pid+'&year='+$(this).attr('data-year')+'&quarter='+$(this).index();
	})

})
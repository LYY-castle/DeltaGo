$(function(){
	var Request = new Object();
	Request = GetRequest();
	var pid = Request["productId"];
	
	if(pid == '0017'){
		$('.area9').removeClass('bg2').addClass('bg1');
		$('.area12').show().find('.floatMsg').text('爱智富按每个季度公司所公布的公司净收益的30%进行发放。比如客户投资“爱智富”产品，一季度公司净收益2%，客户可得浮动收益0.6%。浮动收益按季度发放，在3月、6月、9月及12月公布。');
	}else if(pid == '0018'){
		$('.area9').removeClass('bg2').addClass('bg1');
		$('.area12').show().find('.floatMsg').text('爱智盈按每个季度公司所公布的公司净收益的50%进行发放。比如客户投资“爱智富”产品，一季度公司净收益3%，客户可得浮动收益1.5%。浮动收益按季度发放，在3月、6月、9月及12月公布。');
	}else if(pid == '0019'){
		$('.area9').removeClass('bg2').addClass('bg1');
		$('.area12').show().find('.floatMsg').text('爱智鑫按每个季度公司所公布的公司净收益的70%进行发放。比如客户投资“爱智鑫”产品，一季度公司净收益5%，客户可得浮动收益3.5%。浮动收益按季度发放，在3月、6月、9月及12月公布。');
	}

	$('.btn_bottom').click(function(){
		window.location.href = '../template/buyGlodCard.html?productId='+pid;
	})

	var url = 'app/product/getProductDetail';
	var data = {
		productId: pid,
	};
	deltaGoAjax(url,data,getProductDetail,'get');
	function getProductDetail(data){
		enterProductInfos(data.data.productInfo);
		setEchartsData(data.data.allocation);
	}
	function enterProductInfos(data){
		$('.back-title-text').text(data.productName);
		$('.inc').text(data.productCycleName);
		$('.num').text(data.productEarnRate.split('%')[0]);
		$('.productIntroduce').html(data.productIntroduce.replace(/\r\n/g,'<br/><br/>'))
		$('.minMoney').text(moneyToFloat(data.productMinMoney)+'美元');
		$('.cper').text(data.productCycleName);
		$('.qtext').text(data.investmentAnalysis.split('？')[0]+'？');
		var reg = /'\r\n'/g;
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

		if(data.productName.indexOf('爱易') != -1){
			$('.area8_img img').attr('src','../images/product_img_invest6@2x.png');
		}else{
			$('.area8_img img').attr('src','../images/product_img_invest12@2x.png');
		}
	}

	$('.area7').on('click','.inReport',function(){
		window.location.href = '../template/touzibaogaoqita.html?productId='+pid+'&year='+$(this).attr('data-year')+'&quarter='+$(this).index();
	})

	function setEchartsData(data){
		var myChart1 = echarts.init(document.getElementById('myChart1'));
		myChart1.setOption({
			title: {
				text:'标的类配比',
				x:'center',
				textStyle: {
					color:'rgba(255,255,255,0.8)',
					fontSize:'13',
				}
			},
			legend: {
				orient : 'vertical',
				x : 'center',
				y : '60%',
				data: [{
					name:'国际债券',
					icon:'bar'
				},{
					name:'全球基金',
					icon:'bar'
				},{
					name:'货币市场',
					icon:'bar'
				},{
					name:'商品市场',
					icon:'bar'
				},{
					name:'其他',
					icon:'bar'
				}],
				textStyle: {
					color:'rgba(255,255,255,0.8)',
					fontSize:'12'
				}
			},
			color:['#028ED8','#0FA43D','#FFE500','#F49101','#E60013'],
			series : [
			{
				type:'pie',
				radius : ['40%', '70%'],
				itemStyle : {
					normal : {
						label : {
							show : false
						},
						labelLine : {
							show : false
						}
					}
				},
				center:['50%','35%'],
				data:[
				{value:data.investment_1, name:'国际债券'},
				{value:data.investment_2, name:'全球基金'},
				{value:data.investment_3, name:'货币市场'},
				{value:data.investment_4, name:'商品市场'},
				{value:data.investment_5, name:'其他'}
				]
			}
			]
		});

		var myChart2 = echarts.init(document.getElementById('myChart2'));
		myChart2.setOption({
			title: {
				text:'资产类配比',
				x:'center',
				textStyle: {
					color:'rgba(255,255,255,0.8)',
					fontSize:'13',
				}
			},
			legend: {
				orient : 'vertical',
				x : 'center',
				y : '60%',
				data: [{
					name:'现金类资产',
					icon:'bar'
				},{
					name:'固定类资产',
					icon:'bar'
				},{
					name:'浮动类资产',
					icon:'bar'
				},{
					name:'风险类资产',
					icon:'bar'
				}],
				textStyle: {
					color:'rgba(255,255,255,0.8)',
					fontSize:'12'
				}
			},
			color:['#9B0981','#1D2087','#147677','#9B6619'],
			series : [
			{
				type:'pie',
				radius : ['40%', '70%'],
				itemStyle : {
					normal : {
						label : {
							show : false
						},
						labelLine : {
							show : false
						}
					}
				},
				center:['50%','35%'],
				data:[
				{value:data.asset_1, name:'现金类资产'},
				{value:data.asset_2, name:'固定类资产'},
				{value:data.asset_3, name:'浮动类资产'},
				{value:data.asset_4, name:'风险类资产'}
				]
			}
			]
		});
	}


	
})
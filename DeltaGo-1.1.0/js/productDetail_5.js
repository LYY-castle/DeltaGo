$(function(){
	var Request = new Object();
	Request = GetRequest();
	var pid = Request["productId"];
	var shengyu;
	var nowDate;
	var marketStatus;
	$('.btn_bottom').click(function(){
		window.location.href = '../template/buyGlodCard.html?productId='+pid+'&marketStatus='+marketStatus;;
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
		var productMinMoney = moneyToFloat(data.productMinMoney);
		$('.minMoney').text(productMinMoney+'美元');
		$('.minMoneyIn').text(productMinMoney);
		var maxMoney = (data.productMaxMoney == null) ? '没有限额' : (moneyToFloat(data.productMaxMoney)+'美元');
		$('.maxMoney').text(maxMoney);
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
		$('.shengyu').text(moneyToFloat(data.productSurplusQuota));
		shengyu = data.productSurplusQuota;
		$('.nowDate').text(data.time);
		nowDate = data.time;
		marketStatus = data.marketStatus;
		if(data.marketStatus == 0){
			$('.btn_bottom').text('已售完').off('click');
			$('.shengyu').text('0');
		}else if(data.marketStatus == -1){
			$('.btn_bottom').text('已兑付').off('click');
			$('.shengyu').text('0');
		}
	}

	$('.area7').on('click','.inReport',function(){
		window.location.href = '../template/touzibaogaozhinengvn.html?productId='+pid+'&year='+$(this).attr('data-year')+'&shengyu='+shengyu+'&time='+nowDate+'&marketStatus='+marketStatus;
	})

	function currentDate(){ 
		var d=new Date();
		var str=''; 
		str +=d.getFullYear()+'.'; 
		str +=((d.getMonth()+1) > 10 ? (d.getMonth()+1) : '0'+(d.getMonth()+1) )+'.'; 
		str +=((d.getDate()+1) > 10 ? (d.getDate()+1) : '0'+(d.getDate()+1) )+' '; 
		str +=d.getHours()+':'; 
		str +=d.getMinutes(); 
		// str +=d.getSeconds()+'秒'; 
		return str; 
	} 

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
					name:'股票市场',
					icon:'bar'
				},{
					name:'金融衍生品',
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
				{value:data.investment_1, name:'股票市场'},
				{value:data.investment_2, name:'金融衍生品'},
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
	$('.shengyubox').click(function(){
		window.location.href = '../template/PlanDetail.html?productId='+pid+'&shengyu='+shengyu+'&time='+nowDate+'&marketStatus='+marketStatus;;
	})
	
})
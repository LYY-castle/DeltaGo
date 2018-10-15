$(function(){
	init();
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}
	function init(){
		var Request = new Object();
		Request = GetRequest();
		var productId = Request["productId"];
		var year = Request["year"];
		var quarter = Request["quarter"];

		$('.ec-title .year').text(year);
		if(quarter == 1){
			$('.quarter').text('一');
			var time = year+'-03-31';
		}else if(quarter == 2){
			$('.quarter').text('二');
			var time = year+'-06-30';
		}else if(quarter == 3){
			$('.quarter').text('三');
			var time = year+'-09-30';
		}else{
			$('.quarter').text('四');
			var time = year+'-12-31';
		}

		$('.btn_bottom').click(function(){
			window.location.href = '../template/buyGlodCard.html?productId='+productId;
		})

		$('.nowDate').text(time);

		var url = 'app/product/getInvestmentReport';
		var data = {
				productId: productId,
				year: year,
				quarter: quarter
			};
		deltaGoAjax(url,data,ok);
	}

	function ok(result){
		data = result.data;	
		$('.averageQuarterEarn').text(data.averageQuarterEarn+'%');
		info(data.info);  //产品信息
		quarterEarns(data.quarterEarns,data.info.productReportName);  //月即时平均年化
		formerYearEarn(data.formerYearRepay);  //过往收益
		totalRepays(data.totalRepays);  //历史业绩
		repays(data.repays);  //季度回报
		productPeriodRisk(data.info.productPeriodType,data.info.productRiskType);  //风格箱
		regionPropertyTrade(data.info);  //交易方向
		monthEarns(data.monthEarns); //折线图
		investment(data.info); //资产分布柱状图
		fund(data.info); //五大基金/债券持仓
		turnNull();
	}

	function info(data){  
		$('.type_name').text(data.productName);
		$('.table1_class span').text(data.productGroup);
		// $('.table1_zhishu span').text(data.productIndex);
		$('.table1_shichang span').text(data.productMarket);
		$('.table1_name span').text(data.productReportName);
		$('.table1_date span').text(data.productFoundDate);
		$('.table1_people span').text(data.productHandler);
		$('.table1_xitong span').text(data.productOs);
	}

	function quarterEarns(data,name){  
		$('.area2 .quarterEarns td').eq(0).text(name.split('（')[1].split('）')[0])
		$.each(data,function(k,val){
			$('.area2 .top-border td').eq(k+1).text(val.month+'月');
			$('.area2 .quarterEarns td').eq(k+1).text(val.earn+'%');
		})
	}

	function formerYearEarn(data){  
		$('.formerYearEarn tr').eq(1).find('td').eq(1).text(data.totalRepay);
		$('.formerYearEarn tr').eq(2).find('td').eq(1).text(data.yearRepay1);
		$('.formerYearEarn tr').eq(3).find('td').eq(1).text(data.yearRepay2);
		$('.formerYearEarn tr').eq(4).find('td').eq(1).text(data.yearRepay3);
	}

	function totalRepays(data){  
		var str1 = '';
		var str2 = '';
		$.each(data,function(k,val){
			if(k == 0){
				str1 += '<td>今年以来</td>';
			}else{
				str1 += '<td>'+val.year+'</td>';
			}
			
			str2 += '<td class="FF894C">'+val.totalRepay+'</td>';
		})
		$('.area2 .totalRepays tr').eq(0).append(str1);
		$('.area2 .totalRepays tr').eq(1).append(str2);
	}

	function repays(data){
		$.each(data,function(k,val){
			$('.area2 .repays tr').eq(k+1).find('td').eq(0).text(val[0].year+'总回报');
			$.each(val,function(i,value){
				$('.area2 .repays tr').eq(k+1).find('td').eq(i+1).text(value.repay);
			})
		})
	}

	function productPeriodRisk(period,risk){
		$('.jiugongge').eq(3-period).find('div').eq(3).addClass('activeT');
		$('.jiugongge-msg div').eq(risk-1).addClass('activeT');
		// $('.jiugongge div').removeClass('activeB');
		$('.jiugongge').eq(3-period).find('div').eq(risk-1).addClass('activeB');
	}

	function regionPropertyTrade(data){
		var str = '';
		for(var i=1;i<6;i++){
			str = 'region_'+i;
			$('.region tr').eq(i).find('td').eq(1).text(data[str]);
		}
		for(var i=1;i<7;i++){
			str = 'property_'+i;
			$('.property tr').eq(i).find('td').eq(1).text(data[str]);
		}
		for(var i=1;i<7;i++){
			str = 'trade_'+i;
			$('.trade tr').eq(i).find('td').eq(1).text(data[str]);
		}
	}

	function fund(data){
		for(var i=1;i<=5;i++){
			$('.fund tr').eq(i).find('td').eq(1).text(data['fund_'+i]);
			$('.bond tr').eq(i).find('td').eq(1).text(data['bond_'+i]);
		}
	}

	function turnNull(){
		$.each($('td'),function(k,val){
			if($(val).text() == 'null'){
				$(val).text('-');
			}
		})
	}

	function monthEarns(data){
		var month = [];
		var num = [];
		$.each(data,function(k,val){
			month[k] = val.month+'月';
			num[k] = val.earn;
		})
	    var myChart1 = echarts.init(document.getElementById('myChart1'));
	    myChart1.setOption({
	    	tooltip: {
	    		trigger: 'axis'
	    	},
	    	grid:{
	    		borderWidth:0,
	    		x:40,
	    		y:10,
	    		x2:10,
	    		y2:40
	    	},
	    	xAxis:  {
	    		type: 'category',
	    		boundaryGap: false,
	    		splitLine:{
	    			show: false,
	    		},
	    		axisLabel: {
	    			textStyle:{
	    				color:'rgba(255,255,255,0.5)'
	    			},
	    		},
	    		axisLine: {
	    			lineStyle:{
	    				color:'rgba(255,255,255,0.3)',
	    				width:1
	    			}
	    		},
	    		data: month
	    	},
	    	yAxis: {
	    		type: 'value',
	    		splitLine:{
	    			show: true,
	    			lineStyle:{
	    				color: ['rgba(255,255,255,0.1)'],
	    				width: 1,
	    				type: 'solid'
	    			}
	    		},
	    		axisLine: {
	    			lineStyle:{
	    				color:'rgba(255,255,255,0.3)',
	    				width:1
	    			}
	    		},
	    		axisLabel: {
	    			formatter: '{value} %',
	    			textStyle:{
	    				color:'rgba(255,255,255,0.5)'
	    			}
	    		},
	    	},
	    	series: [
	    	{
	    		type:'line',
	    		itemStyle: {
	    			normal: {
	    				color:'#31C3EF',
	    			}
	    		},
	    		data:num,
	    	}
	    	]
	    });
	}

	function investment(data){
		var num = [];
		for(var i=0;i<5;i++){
			num[i] = data['investment_'+(i+1)];
		}
		var dataColor = ['#E60013','#F49101','#FFE500','#0FA43D','#028ED8'];
		var myChart2 = echarts.init(document.getElementById('myChart2'));
		myChart2.setOption({
			title:{
				x:'right',
				text:'占净资产（%）',
				textStyle:{
					color:'#65E157',
					fontSize:'14',
				}
			},
			grid:{
				borderWidth:0,
				x:70,
				y:20,
				x2:55,
				y2:40
			},

			xAxis : [
			{
				type : 'value',
				axisLabel : {
					formatter: '{value} %',
					textStyle:{
						color:'#fff'
					}
				},
				splitLine:{
					show: true,
					lineStyle:{
						color: ['rgba(255,255,255,0.1)'],
						width: 1,
						type: 'solid'
					}
				},
				axisLine: {
					lineStyle:{
						color:'rgba(255,255,255,0.3)',
						width:1
					}
				},
			}
			],
			yAxis : [
			{
				type : 'category',
				splitLine:{show: false},
				data : ['国际债券','全球基金','货币市场','商品市场','其他'],
				axisLabel : {
					textStyle:{
						color:'#fff'
					}
				},
				axisLine: {
					lineStyle:{
						color:'rgba(255,255,255,0.3)',
						width:1
					}
				}
			}
			],
			series : [
			{
				type:'bar',
				itemStyle: {
					normal: {
						color: function (value){
							return dataColor[4-value.dataIndex]; 
						},
						label : {
							formatter: '{c} %',
							show: true,
							textStyle:{
								color:'#FF894C'
							}
						},

					}
				},
				data:num
			}
			]
		});
	}

	function nowDate(){
		var mydate = new Date();
		var y = mydate.getFullYear(); //获取完整的年份(4位,1970-????)
		var m = mydate.getMonth(); //获取当前月份(0-11,0代表1月)
		var d = mydate.getDate(); //获取当前日(1-31)
		m = (m+1 < 10) ? '0'+(m+1) : (m+1);
		d = d < 10 ? '0'+d : d;
		return y + '-' + m + '-' + d;
	}

})
        
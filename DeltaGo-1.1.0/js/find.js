$(function(){
	// $('body').bind('touchmove', function(e) {
 //       var  winHeight = $(window).scrollTop();
 //        if(winHeight = 20+'rem'){
 //            $('.circle_notice').css('position','fixed');

 //        }
 //    });
    deltaGoAjax('app/banner/collageBanner',{},collageBanner);
	function collageBanner(data){ //轮播图
        var str = '';
        $.each(data.data,function(k,val){
            str += '<div class="swiper-slide">'+
              '<img src="'+val.img+'" alt="">'+
              '</div>';
        })
        $('.slide1').append(str);
        mySwiper1();
	}
	function mySwiper1(){
		var mySwiper1 = new Swiper('.swiper-container1', {
			autoplay: 3000,//可选选项，自动滑动
			pagination : '.swiper-pagination',
			autoplayDisableOnInteraction : false
		})
	}

	getEnrichNews();   //新闻资讯
    function getEnrichNews(){
        $.ajax({
            type:"get",
            url:"https://api-prod.wallstreetcn.com/apiv1/content/articles?category=global&limit=20&cursor=&platform=wscn-platform",
            success: function(data){
                var newsArr = [];
                for(var i=0;i<data.data.items.length;i++){
                    if(!data.data.items[i].is_priced){
                        newsArr.push(data.data.items[i]);
                    }
                    if(newsArr.length == 5){
                        break;
                    }
                }
                addEnrichNews(newsArr);
            }
        })
    }
    function addEnrichNews(data){
    	var str = '';
    	$.each(data,function(k,val){
    		str += '<div class="swiper-slide">'+
							'<div class="content1">'+
								'<img class="c_top" src="'+val.image_uri+'">'+
								'<div class="c_bottom">'+
									'<div class="topic">'+val.title+'</div>'+
									'<a href="#">'+
										'<div class="search" onclick="window.top.location=\'newsDetail.html?nid='+val.id+'\'">查看详情</div>'+
									'</a>'+
								'</div>'+
							'</div>'+
						'</div>';
    	})
    	$('.slider2').append(str);
    	mySwiper2();
    }
    function mySwiper2(){
    	var mySwiper2 = new Swiper('.swiper-container2', {
    		slidesPerView: 'auto',
    		freeMode: true,
    		// spaceBetween: 10,
    		onSlideChangeEnd: function(swiper){
    			if(swiper.activeIndex == 3){
    				mySwiper2.unlockSwipeToNext();
    			}
    		}

    	})
	}
	// $('.search').click(function(){ //查看详情
	// 	var nid = $(this).attr('data-id');
	// 	window.top.location = '../template/newsDetail.html?nid='+nid;
	// })


	getAllNews('global-channel');   //环球资讯
	$('.new_type').click(function(){
		getAllNews($(this).attr('data-channel'));
		$(this).addClass('active').siblings().removeClass('active');
	})
    function getAllNews(channel){
    	$('.news_box').html('');
        $.ajax({
            type:"get",
            url:"https://api-prod.wallstreetcn.com/apiv1/content/lives?channel="+channel+"&client=pc&cursor=&limit=40",
            success: function(data){
                var newsArr = [];
                for(var i=0;i<data.data.items.length;i++){
                    if(!data.data.items[i].is_priced){
                        newsArr.push(data.data.items[i]);
                    }
                    if(newsArr.length == 20){
                        break;
                    }
                }
                addAllNews(newsArr);
            }
        })
    }
    function addAllNews(data){
    	var str = '';
    	$.each(data,function(k,val){
    		var bg = (k%2 == 0) ? 'bg2' : 'bg1';
    		var time = formatDate(val.display_time);
    		str += '<div class="news_area '+bg+'">'+
						'<div class="news_time">'+time+'</div>'+
						'<div class="news_content">'+
							'<p>'+val.content_text+'</p>'+
						'</div>'+
					'</div>';
    	})
    	$('.news_box').append(str);
    }

    function formatDate(timestr) { 
    	var date = new Date(timestr*1000);
    	var hour=date.getHours(); 
    	var minute=date.getMinutes(); 
    	minute = (minute < 10) ? '0'+minute : minute;
    	return hour+":"+minute; 
    } 
})
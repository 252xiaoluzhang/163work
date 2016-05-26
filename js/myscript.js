window.onload=function(){
    // 获取轮播图效果需要的对象
    var oUl1=getById('slider');
    var oUl2=getById('sign');
    var oLi1=oUl1.getElementsByTagName('li');
    var oLi2=oUl2.getElementsByTagName('li');

    var index=0;
    var timer=null;
    //遍历每一个按钮，分别绑定事件
    for(var i=0; i<oLi2.length;i++){
        oLi2[i].id = i;
        oLi1[i].id = i;
        oLi1[i].onmouseover=function(){
            clearInterval(timer);                     //鼠标移到banner图片上时，清除定时器，轮播图不再变化
        };
        oLi2[i].onclick=function(){
            clearInterval(timer);                     //鼠标点击按钮时，清除定时器并切换到相应的轮播图
            changeSlider(this.id);
        };
        oLi1[i].onmouseout=function(){
            timer=setInterval(autoPlay,5000);         //鼠标移出banner图片上时，重新启动定时器       
            index=this.id;                             //确保鼠标移开时，淡入图在当前图片基础上循环    
        }
    }
    //页面加载完的时候应该首先清除定时器
    if(timer){
        clearInterval(timer);
        timer=null;
    }
    //添加定时器，轮播图开始5s切换一次
    timer=setInterval(autoPlay,5000);
    //autoPlay函数
    function autoPlay(){
        index++;
        if(index==oLi2.length){
            index=0;
        }
        changeSlider(index);
    }
    //定义改变slider和按钮状态的函数
    function changeSlider(curIndex){
        for(var j=0;j<oLi2.length;j++){
            oLi2[j].className='';
            oLi1[j].style.display='none';
        }
        oLi2[curIndex].className='cur';
        fadeout(oLi1[curIndex]);
    }
    //创建课程列表区域
    var temp='<div class="m-courlist">\
                <div class="sm1">\
                    <img src="" alt="课程 " class="img1">\
                    <h3 class="tit"></h3>\
                    <h4 class="ower"></h4>\
                    <button></button>\
                    <div class="price">¥<span></span></div>\
                </div>\
                <div class="layer">\
                    <div class="f-clearfix top">\
                        <img src="" alt="" class="f-floatL img2">\
                        <div class="f-floatL" >\
                            <h3 class="tit"></h3>\
                            <h4 class="num"><span></span>人在学</h4>\
                            <h4 class="ower">发布者：<span></span></h4>\
                            <h4 class="type">分类：<span></span></h4>\
                        </div>\
                    </div>\
                    <p></p>\
                </div>\
            </div>';
    var box=document.createElement('div');
    addClass(box,"con con1 f-clearfix");
    box.setAttribute('id','con1');
    var course1=getById('course1');
    var turnPage=getById('turnPage');
    var pagelist=turnPage.getElementsByTagName('span');
    var pagePre=getByClass(turnPage,"pre")[0];
    var pageNext=getByClass(turnPage,"next")[0];
    course1.insertBefore(box,turnPage);
    var con1=getById('con1');
    var cours=getByClass(con1,'m-courlist');
    // 根据窗口宽度是否小于1205px判断生成的课程数量是15还是20
    for(var i=0;i<(getInner().width<1205?15:20);i++){
        box.innerHTML+=temp;
    }
    // 定义ajax获取课程列表数据并将数据添加到刚刚生成的列表区域的函数
    function getCourses(index,singlenum,typ){
        get("http://study.163.com/webDev/couresByCategory.htm",{
            pageNo:index,
            psize:singlenum,
            type:typ
        },function(data){
            var obj = JSON.parse(data); 
            for(var k=0;k<8;k++){
                removeClass(pagelist[k],'check2');
            }
            addClass(pagelist[obj.pagination.pageIndex-1],'check2');
            for(var i=0;i<obj.pagination.pageSize;i++){
                cours[i].getElementsByTagName('img')[0].setAttribute("src",obj.list[i].middlePhotoUrl);
                cours[i].getElementsByTagName('h3')[0].innerHTML=obj.list[i].name;
                cours[i].getElementsByTagName('h4')[0].innerHTML=obj.list[i].provider;
                cours[i].getElementsByTagName('button')[0].innerHTML=obj.list[i].learnerCount;
                cours[i].getElementsByTagName('span')[0].innerHTML=obj.list[i].price;
                cours[i].getElementsByTagName('img')[1].setAttribute("src",obj.list[i].middlePhotoUrl);
                cours[i].getElementsByTagName('h3')[1].innerHTML=obj.list[i].name;
                cours[i].getElementsByTagName('span')[1].innerHTML=obj.list[i].learnerCount;
                cours[i].getElementsByTagName('span')[2].innerHTML=obj.list[i].provider;
                cours[i].getElementsByTagName('span')[3].innerHTML=obj.list[i].categoryName;
                cours[i].getElementsByTagName('p')[0].innerHTML=obj.list[i].description;
            };
        });
    }
    var courseNum=getInner().width<1205?15:20;   //根据窗口宽度判断ajax需要获取的每页返回的数据个数
    getCourses(1,courseNum,10);                    //调用getCourses函数
    var tab=getByClass(course1,'m-tab')[0];
    var tab_li=tab.getElementsByTagName('li');
    for(var k=0;k<8;k++){                                       // 给每一个分页器页码注册点击翻页事件
        eventUtility.addEvent(pagelist[k],'click',helper(k+1));
    }
    function helper(k){                                         //辅助函数，其实是利用闭包
        return function(){
            var t;
            if(hasClass(tab_li[0],'check1')){
                t=10;
            }else{
                t=20;
            };
            var pageS=getInner().width<1205?15:20;
            getCourses(k,pageS,t);
        }
    }
    // 为分页器的上一页添加点击事件
    eventUtility.addEvent(pagePre,'click',function(){ 
    	var oIndex=getCurIndex(pagelist,'check2');
    	console.log(oIndex);
    	helper(oIndex-1)();
    });
    // 为分页器的下一页添加点击事件
    eventUtility.addEvent(pageNext,'click',function(){
    	var oIndex=getCurIndex(pagelist,'check2');
    	console.log(oIndex);
    	helper(oIndex+1)();
    });
    //课程列表内容区tab切换
    eventUtility.addEvent(tab_li[0],'click',function(){
        for(var i=0;i<2;i++){
            removeClass(tab_li[i],'check1')
        }
        addClass(tab_li[0],'check1');
        var pageS=getInner().width<1205?15:20;
        getCourses(1,pageS,10);
    });
    eventUtility.addEvent(tab_li[1],'click',function(){
        for(var i=0;i<2;i++){
            removeClass(tab_li[i],'check1')
        }
        addClass(tab_li[1],'check1');
        var pageS=getInner().width<1205?15:20;
        getCourses(1,pageS,20);
    });
    // 右侧热门推荐
    var temp2='<li class="f-clearfix">\
                <img src="" alt="排行图片" class="f-floatL">\
                <div class="f-floatL">\
                    <h3></h3>\
                    <span></span>\
                </div>\
            </li>';
    var box2=document.createElement('ol');
    box2.setAttribute('id','rank1');
    for(var i=0;i<20;i++){
        box2.innerHTML+=temp2;
    }
    var ranking1=getById('ranking1');
    ranking1.appendChild(box2);
    var rank1=getById('rank1');
    var rank1li=rank1.getElementsByTagName('li');
    // ajax获取右侧热门推荐的课程排行榜
    get("http://study.163.com/webDev/hotcouresByCategory.htm",{},function(data){
        var obj = JSON.parse(data);
        for(var i=0;i<20;i++){
            rank1li[i].getElementsByTagName('img')[0].setAttribute("src",obj[i].smallPhotoUrl);
            rank1li[i].getElementsByTagName('h3')[0].innerHTML=obj[i].name;
            rank1li[i].getElementsByTagName('span')[0].innerHTML=obj[i].learnerCount;
        };
    });
    var box22=ranking1.getElementsByTagName('ol')[0];
    var index1=0;
    // 为课程排行榜添加5秒一次的滚动效果
    timer1=setInterval(autoPlay2,5000);
    function autoPlay2(){
        index1++;
        startMove(box22,'top',-70*index1);
        if(index1==20){
            box22.setAttribute("top","0px");
            index1=0;
        }
    }
    // 显示机构介绍的视频弹窗
    var oIntro=getById('intro');
    var oVideo0=oIntro.getElementsByTagName('img')[0];
    var oVideo=getById('video');
    var oVideo1=oVideo.getElementsByTagName('video')[0];
    var close2=getByClass(oVideo,'close')[0];
    var oScreen=getById('screen');
    eventUtility.addEvent(oVideo0,'click',function(){
        show(oVideo);
        center(oVideo,950,676);
        oVideo1.load();
        oVideo1.play();
        lock(oScreen);
    });
    // 浏览器视窗大小发生变化时，保持视频弹窗居中
    eventUtility.addEvent(window,'resize',function(){
        center(oVideo,950,676);
    });
    // 点击视频弹窗的关闭按钮，弹窗关闭
    eventUtility.addEvent(close2,'click',function(){
        hide(oVideo);
        oVideo1.pause();
        unlock(oScreen);
    });
    //根据cookie判断是否关闭顶部通知栏
    var advert=getById('advert');
    var noRemind=advert.getElementsByTagName('a')[1];
    if(!getcookie().noRemind){
        show(advert);
    }
    eventUtility.addEvent(noRemind,'click',function(){
        hide(advert);
        setcookie("noRemind",true,365);
    });
    // 登录和关注功能
    var topNav=getById('topNav');
    var follow=getByClass(topNav,'follow')[0];
    var oLogin=getById('m-login');
    var close1=getByClass(oLogin,'close')[0];
    var subm=getById('submit');
    var username=getById('name');
    var psd=getById('psd');
    var focused=getByClass(topNav,'focused f-floatL')[0];
    var unfollow=focused.getElementsByTagName('span')[0];
    // 页面刷新或者打开新页面时，如果已登录且已关注，就显示为已关注
    if((getcookie().loginSuc)&&(getcookie().followSuc)){
        hide(follow);
        show(focused);
    }
    // 点击关注按钮事件
    eventUtility.addEvent(follow,'click',function(){
        if(getcookie().loginSuc){
            hide(follow);
            show(focused);
            setcookie('followSuc',true,300);
        }else{
            show(oLogin);
            center(oLogin,387,288);
            lock(oScreen);
        }
    });
    // 取消关注按钮事件
    eventUtility.addEvent(unfollow,'click',function(){
        hide(focused);
        show(follow);
        setcookie('followSuc','',300);
    });
    eventUtility.addEvent(close1,'click',function(){
        hide(oLogin);
        unlock(oScreen);
    });
    // 浏览器视窗大小发生变化时，保持登录弹窗居中
    eventUtility.addEvent(window,'resize',function(){
        center(oLogin,387,288);
        // lock(oScreen);
    });
    function login(){
        var usernameMD5=MD5(username.value);
        var psdMD5=MD5(psd.value);
        get("http://study.163.com/webDev/login.htm",{
            userName:usernameMD5,
            password:psdMD5
        },function(data){
            if(data==1){
                hide(oLogin);
                unlock(oScreen);
                setcookie("loginSuc",true,300);
                get("http://study.163.com/webDev/attention.htm",{},function(data1){
                    if(data1==1){
                        setcookie('followSuc',true,300);
                        show(focused);
                        hide(follow);
                    }
                });
            }else{
            	alert("账号或者密码错误");
            }
        });
    }
    // 登录窗提交按钮事件
    var loginForm=document.forms.login;
    eventUtility.addEvent(loginForm,'submit',function(event){
    	login();
    	eventUtility.preventDef(event);
    });
    

    



















}
// id选择器函数封装
function getById(id){
    return document.getElementById(id);
}
// 类选择器函数
function getByClass(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}
//设置cookie
function setcookie(name,key,day) {
    var time=new Date();
    time.setTime(time.getTime()+day*24*60*60*1000);
    document.cookie=name+"="+key+((day == null) ? '' : ";expires=" +time.toGMTString());
}
//获取cookie
function getcookie() {
  var cookie = {};
  var all = document.cookie;
  if (all === '') return cookie;
  var list = all.split('; ');
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];
    var p = item.indexOf('=');
    var name = item.substring(0, p);
    name = decodeURIComponent(name);
    var value = item.substring(p + 1);
    value = decodeURIComponent(value);
    cookie[name] = value;
  }
  return cookie;
}

//删除cookie
function clearcookie(name){
    if(document.cookie.length>0){
        var start=document.cookie.indexOf(name+'=');
        if(start!=-1){
            setcookie(name,"",-1);
        }
    }
}
// 获得元素的子节点
function getElementChildren(node) {
    return node ? node.children || (function (node) {
        var children = [];
        if (node = node.firstChild) do {
            if (node.nodeType === 1) children.push(node);
        } while (node = node.nextSibling)
        return children;
    })(node) : [];
};
// 判断class是否存在
function hasClass(obj, cls) {  
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
// 添加class
function addClass(obj, cls) {  
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  
// 移除class
function removeClass(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}  
// 切换class
function toggleClass(obj,cls){  
    if(hasClass(obj,cls)){  
        removeClass(obj, cls);  
    }else{  
        addClass(obj, cls);  
    }  
}  

// ajax请求GET方法的封装
function get(url, options, callback){
    var xhr = createXHR();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if((xhr.status >= 200 && xhr.status < 300)||xhr.status == 304){
                callback(xhr.responseText);
            }else{
                console.error('Request was unsuccessful: ' + xhr.status);
            }
        }
    }
    var newUrl = url + '?' + serialize(options);
    xhr.open('get', newUrl, true);
    xhr.send(null);
 }
 
//创建xhr的兼容写法
 function  createXHR(){ 
    //检测原生XHR对象是否存在，如果存在刚返回它的新实例； 
    //如果不存在，则检测ActiveX对象; 
    //如果两个都不存在，就抛出一个错误。 
    if(typeof XMLHttpRequest != "undefined"){ 
        return new XMLHttpRequest(); 
    }else if(typeof ActiveXObject != "undefined"){ 
        //适合IE7之前的版本 
        if(typeof arguments.callee.activeXString != "string"){ 
            var versions = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"]; 
            for(var i=0,len=versions.length; i<len; i++){ 
                try{ 
                    new ActiveXObject(versions[i]); 
                    arguments.callee.activeXString = versions[i]; 
                    break; 
                }catch (ex){ 
                    //跳过 
                } 
            } 
        } 
         
        return new ActiveXObject(arguments.callee.activeXString); 
    }else{ 
        throw new Error("No XHR object available."); 
    }; 
}
 
//参数序列化
function serialize(data) {
    if (!data){
        return '';
    };
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)){
            continue;
        };
        if (typeof data[name] === 'function'){
            continue;
        };
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
// 跨浏览器事件处理程序
var eventUtility = {
    addEvent : function(el, type, fn) {
        if(typeof addEventListener !== "undefined") {
            el.addEventListener(type, fn, false);
        } else if(typeof attachEvent !== "undefined") {
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
    },
    reEvent : function(el, type, fn) {
        if(typeof removeEventListener !== "undefined") {
            el.removeEventListener(type, fn, false);
        } else if(typeof detachEvent !== "undefined") {
            el.detachEvent("on" + type, fn);
        } else {
            el["on" + type] = null;
        }
    },
    getTarget : function(event) {
        if(typeof event.target !== "undefined") {
            return event.target;
        } else {
            return event.srcElement;
        }
    },
    getEvent : function(event){
        return event?event:window.event;
    },
    preventDef : function(event) {
        if(typeof event.preventDefault !== "undefined") {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopProp:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    }
};
// 阻止浏览器默认行为
function stopDefault(e) {
    //如果提供了事件对象，则这是一个非IE浏览器 
    if(e && e.preventDefault) {
    　　//阻止默认浏览器动作(W3C)
    　　e.preventDefault();
    } else {
    　　//IE中阻止函数器默认动作的方式 
    　　window.event.returnValue = false; 
    }
    return false;
}
//滚动运动框架
function startMove(obj,attr,iTarget,fn){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		//取当前值
		var icur=0;
		if(attr=='opacity'){
			icur=Math.round(parseFloat(getStyle(obj,attr))*100);
		}else{
			var icur= parseInt(getStyle(obj,attr));
		}
		//计算运动速度
		var speed=(iTarget-icur)/8;
		
		speed=speed>0?Math.ceil(speed):Math.floor(speed);
		//检测停止
		if(icur==iTarget){
			clearInterval(obj.timer);
			if(fn){
				fn();
			}
		}
		else{
			if(attr=='opacity'){
				obj.style.filter = 'alpha(opacity:'+(icur+speed)+')';   //IE浏览器
				obj.style.opacity=(icur+speed)/100;                     //火狐，Chrome浏览器
			}else{
				obj.style[attr]=icur+speed+'px';
			}
		}
	},30)
}
//淡入运动框架
function fadeout (ele) {
    ele.style.display='block';
    clearInterval(ele.timer);
    var stepLength = 1/25;
    ele.style.opacity = 0;                //火狐，Chrome浏览器
    ele.style.filter = 'alpha(opacity:0)';    //IE浏览器
    ele.timer=setInterval(function(){
        var icur=parseFloat(getStyle(ele,'opacity'));
        if (parseFloat(ele.style.opacity)-stepLength < 1) {
            ele.style.opacity = parseFloat(ele.style.opacity)+stepLength;
            ele.style.filter = 'alpha(opacity:'+(icur+stepLength)*100+')';
        } else {
            ele.style.opacity = 1;
            ele.style.filter = 'alpha(opacity:100)';
            clearInterval(ele.timer);
        }
    },20)
}
//获取样式函数
function getStyle(obj,attr){              
    if(obj.currentStyle){                 //针对IE浏览器
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,false)[attr];  //针对火狐浏览器
    }
}
//设置元素居中
function center(obj,width,height){
    var top = (getInner().height-height)/2;
    var left = (getInner().width-width)/2;
        obj.style.top = top+'px';
        obj.style.left = left+'px';
}
//跨浏览器获取视窗大小
function getInner(){
    if(typeof window.innerWidth != 'undefined'){
        return {
            width: window.innerWidth,            //火狐浏览器
            height: window.innerHeight
        }
    }else{
        return {
            width: document.documentElement.clientWidth,     //其余浏览器，尤其是IE
            height: document.documentElement.clientHeight
        }
    }
}
//锁屏功能
function lock(obj){
        // obj.style.width = getInner().width+'px';
        // obj.style.height = getInner().height+'px';
        obj.style.display = 'block';
}
//开屏功能
function unlock(obj){
        obj.style.display = 'none';
}
// 显示元素函数
function show(obj){
    obj.style.display = 'block';
}
// 隐藏元素函数
function hide(obj){
    obj.style.display = 'none';
}
// 获取当前页码序号
function getCurIndex(list,classname){
	for(var i=0; i<list.length;i++){
		if(hasClass(list[i],classname)){
			return ++i;
		}
	}
}

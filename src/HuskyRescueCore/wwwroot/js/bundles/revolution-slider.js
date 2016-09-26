/********************************************
	-	THEMEPUNCH TOOLS Ver. 1.0     -
	 Last Update of Tools 17.11.2014
*********************************************/


/*
* @fileOverview TouchSwipe - jQuery Plugin
* @version 1.6.6
*
* @author Matt Bryson http://www.github.com/mattbryson
* @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
* @see http://labs.skinkers.com/touchSwipe/
* @see http://plugins.jquery.com/project/touchSwipe
*
* Copyright (c) 2010 Matt Bryson
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/
(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{a(jQuery)}}(function(f){var p="left",o="right",e="up",x="down",c="in",z="out",m="none",s="auto",l="swipe",t="pinch",A="tap",j="doubletap",b="longtap",y="hold",D="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled,d=window.navigator.pointerEnabled||window.navigator.msPointerEnabled,B="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe"};f.fn.swipe=function(G){var F=f(this),E=F.data(B);if(E&&typeof G==="string"){if(E[G]){return E[G].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+G+" does not exist on jQuery.swipe")}}else{if(!E&&(typeof G==="object"||!G)){return w.apply(this,arguments)}}return F};f.fn.swipe.defaults=n;f.fn.swipe.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipe.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:z};f.fn.swipe.pageScroll={NONE:m,HORIZONTAL:D,VERTICAL:u,AUTO:s};f.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:i};function w(E){if(E&&(E.allowPageScroll===undefined&&(E.swipe!==undefined||E.swipeStatus!==undefined))){E.allowPageScroll=m}if(E.click!==undefined&&E.tap===undefined){E.tap=E.click}if(!E){E={}}E=f.extend({},f.fn.swipe.defaults,E);return this.each(function(){var G=f(this);var F=G.data(B);if(!F){F=new C(this,E);G.data(B,F)}})}function C(a4,av){var az=(a||d||!av.fallbackToMouseEvents),J=az?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",ay=az?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",U=az?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",S=az?null:"mouseleave",aD=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ag=0,aP=null,ab=0,a1=0,aZ=0,G=1,aq=0,aJ=0,M=null;var aR=f(a4);var Z="start";var W=0;var aQ=null;var T=0,a2=0,a5=0,ad=0,N=0;var aW=null,af=null;try{aR.bind(J,aN);aR.bind(aD,a9)}catch(ak){f.error("events not supported "+J+","+aD+" on jQuery.swipe")}this.enable=function(){aR.bind(J,aN);aR.bind(aD,a9);return aR};this.disable=function(){aK();return aR};this.destroy=function(){aK();aR.data(B,null);return aR};this.option=function(bc,bb){if(av[bc]!==undefined){if(bb===undefined){return av[bc]}else{av[bc]=bb}}else{f.error("Option "+bc+" does not exist on jQuery.swipe.options")}return null};function aN(bd){if(aB()){return}if(f(bd.target).closest(av.excludedElements,aR).length>0){return}var be=bd.originalEvent?bd.originalEvent:bd;var bc,bb=a?be.touches[0]:be;Z=g;if(a){W=be.touches.length}else{bd.preventDefault()}ag=0;aP=null;aJ=null;ab=0;a1=0;aZ=0;G=1;aq=0;aQ=aj();M=aa();R();if(!a||(W===av.fingers||av.fingers===i)||aX()){ai(0,bb);T=at();if(W==2){ai(1,be.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}if(av.swipeStatus||av.pinchStatus){bc=O(be,Z)}}else{bc=false}if(bc===false){Z=q;O(be,Z);return bc}else{if(av.hold){af=setTimeout(f.proxy(function(){aR.trigger("hold",[be.target]);if(av.hold){bc=av.hold.call(aR,be,be.target)}},this),av.longTapThreshold)}ao(true)}return null}function a3(be){var bh=be.originalEvent?be.originalEvent:be;if(Z===h||Z===q||am()){return}var bd,bc=a?bh.touches[0]:bh;var bf=aH(bc);a2=at();if(a){W=bh.touches.length}if(av.hold){clearTimeout(af)}Z=k;if(W==2){if(a1==0){ai(1,bh.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}else{aH(bh.touches[1]);aZ=au(aQ[0].end,aQ[1].end);aJ=ar(aQ[0].end,aQ[1].end)}G=a7(a1,aZ);aq=Math.abs(a1-aZ)}if((W===av.fingers||av.fingers===i)||!a||aX()){aP=aL(bf.start,bf.end);al(be,aP);ag=aS(bf.start,bf.end);ab=aM();aI(aP,ag);if(av.swipeStatus||av.pinchStatus){bd=O(bh,Z)}if(!av.triggerOnTouchEnd||av.triggerOnTouchLeave){var bb=true;if(av.triggerOnTouchLeave){var bg=aY(this);bb=E(bf.end,bg)}if(!av.triggerOnTouchEnd&&bb){Z=aC(k)}else{if(av.triggerOnTouchLeave&&!bb){Z=aC(h)}}if(Z==q||Z==h){O(bh,Z)}}}else{Z=q;O(bh,Z)}if(bd===false){Z=q;O(bh,Z)}}function L(bb){var bc=bb.originalEvent;if(a){if(bc.touches.length>0){F();return true}}if(am()){W=ad}a2=at();ab=aM();if(ba()||!an()){Z=q;O(bc,Z)}else{if(av.triggerOnTouchEnd||(av.triggerOnTouchEnd==false&&Z===k)){bb.preventDefault();Z=h;O(bc,Z)}else{if(!av.triggerOnTouchEnd&&a6()){Z=h;aF(bc,Z,A)}else{if(Z===k){Z=q;O(bc,Z)}}}}ao(false);return null}function a9(){W=0;a2=0;T=0;a1=0;aZ=0;G=1;R();ao(false)}function K(bb){var bc=bb.originalEvent;if(av.triggerOnTouchLeave){Z=aC(h);O(bc,Z)}}function aK(){aR.unbind(J,aN);aR.unbind(aD,a9);aR.unbind(ay,a3);aR.unbind(U,L);if(S){aR.unbind(S,K)}ao(false)}function aC(bf){var be=bf;var bd=aA();var bc=an();var bb=ba();if(!bd||bb){be=q}else{if(bc&&bf==k&&(!av.triggerOnTouchEnd||av.triggerOnTouchLeave)){be=h}else{if(!bc&&bf==h&&av.triggerOnTouchLeave){be=q}}}return be}function O(bd,bb){var bc=undefined;if(I()||V()){bc=aF(bd,bb,l)}else{if((P()||aX())&&bc!==false){bc=aF(bd,bb,t)}}if(aG()&&bc!==false){bc=aF(bd,bb,j)}else{if(ap()&&bc!==false){bc=aF(bd,bb,b)}else{if(ah()&&bc!==false){bc=aF(bd,bb,A)}}}if(bb===q){a9(bd)}if(bb===h){if(a){if(bd.touches.length==0){a9(bd)}}else{a9(bd)}}return bc}function aF(be,bb,bd){var bc=undefined;if(bd==l){aR.trigger("swipeStatus",[bb,aP||null,ag||0,ab||0,W,aQ]);if(av.swipeStatus){bc=av.swipeStatus.call(aR,be,bb,aP||null,ag||0,ab||0,W,aQ);if(bc===false){return false}}if(bb==h&&aV()){aR.trigger("swipe",[aP,ag,ab,W,aQ]);if(av.swipe){bc=av.swipe.call(aR,be,aP,ag,ab,W,aQ);if(bc===false){return false}}switch(aP){case p:aR.trigger("swipeLeft",[aP,ag,ab,W,aQ]);if(av.swipeLeft){bc=av.swipeLeft.call(aR,be,aP,ag,ab,W,aQ)}break;case o:aR.trigger("swipeRight",[aP,ag,ab,W,aQ]);if(av.swipeRight){bc=av.swipeRight.call(aR,be,aP,ag,ab,W,aQ)}break;case e:aR.trigger("swipeUp",[aP,ag,ab,W,aQ]);if(av.swipeUp){bc=av.swipeUp.call(aR,be,aP,ag,ab,W,aQ)}break;case x:aR.trigger("swipeDown",[aP,ag,ab,W,aQ]);if(av.swipeDown){bc=av.swipeDown.call(aR,be,aP,ag,ab,W,aQ)}break}}}if(bd==t){aR.trigger("pinchStatus",[bb,aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchStatus){bc=av.pinchStatus.call(aR,be,bb,aJ||null,aq||0,ab||0,W,G,aQ);if(bc===false){return false}}if(bb==h&&a8()){switch(aJ){case c:aR.trigger("pinchIn",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchIn){bc=av.pinchIn.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break;case z:aR.trigger("pinchOut",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchOut){bc=av.pinchOut.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break}}}if(bd==A){if(bb===q||bb===h){clearTimeout(aW);clearTimeout(af);if(Y()&&!H()){N=at();aW=setTimeout(f.proxy(function(){N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}},this),av.doubleTapThreshold)}else{N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}}}}else{if(bd==j){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("doubletap",[be.target]);if(av.doubleTap){bc=av.doubleTap.call(aR,be,be.target)}}}else{if(bd==b){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("longtap",[be.target]);if(av.longTap){bc=av.longTap.call(aR,be,be.target)}}}}}return bc}function an(){var bb=true;if(av.threshold!==null){bb=ag>=av.threshold}return bb}function ba(){var bb=false;if(av.cancelThreshold!==null&&aP!==null){bb=(aT(aP)-ag)>=av.cancelThreshold}return bb}function ae(){if(av.pinchThreshold!==null){return aq>=av.pinchThreshold}return true}function aA(){var bb;if(av.maxTimeThreshold){if(ab>=av.maxTimeThreshold){bb=false}else{bb=true}}else{bb=true}return bb}function al(bb,bc){if(av.allowPageScroll===m||aX()){bb.preventDefault()}else{var bd=av.allowPageScroll===s;switch(bc){case p:if((av.swipeLeft&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case o:if((av.swipeRight&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case e:if((av.swipeUp&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break;case x:if((av.swipeDown&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break}}}function a8(){var bc=aO();var bb=X();var bd=ae();return bc&&bb&&bd}function aX(){return !!(av.pinchStatus||av.pinchIn||av.pinchOut)}function P(){return !!(a8()&&aX())}function aV(){var be=aA();var bg=an();var bd=aO();var bb=X();var bc=ba();var bf=!bc&&bb&&bd&&bg&&be;return bf}function V(){return !!(av.swipe||av.swipeStatus||av.swipeLeft||av.swipeRight||av.swipeUp||av.swipeDown)}function I(){return !!(aV()&&V())}function aO(){return((W===av.fingers||av.fingers===i)||!a)}function X(){return aQ[0].end.x!==0}function a6(){return !!(av.tap)}function Y(){return !!(av.doubleTap)}function aU(){return !!(av.longTap)}function Q(){if(N==null){return false}var bb=at();return(Y()&&((bb-N)<=av.doubleTapThreshold))}function H(){return Q()}function ax(){return((W===1||!a)&&(isNaN(ag)||ag<av.threshold))}function a0(){return((ab>av.longTapThreshold)&&(ag<r))}function ah(){return !!(ax()&&a6())}function aG(){return !!(Q()&&Y())}function ap(){return !!(a0()&&aU())}function F(){a5=at();ad=event.touches.length+1}function R(){a5=0;ad=0}function am(){var bb=false;if(a5){var bc=at()-a5;if(bc<=av.fingerReleaseThreshold){bb=true}}return bb}function aB(){return !!(aR.data(B+"_intouch")===true)}function ao(bb){if(bb===true){aR.bind(ay,a3);aR.bind(U,L);if(S){aR.bind(S,K)}}else{aR.unbind(ay,a3,false);aR.unbind(U,L,false);if(S){aR.unbind(S,K,false)}}aR.data(B+"_intouch",bb===true)}function ai(bc,bb){var bd=bb.identifier!==undefined?bb.identifier:0;aQ[bc].identifier=bd;aQ[bc].start.x=aQ[bc].end.x=bb.pageX||bb.clientX;aQ[bc].start.y=aQ[bc].end.y=bb.pageY||bb.clientY;return aQ[bc]}function aH(bb){var bd=bb.identifier!==undefined?bb.identifier:0;var bc=ac(bd);bc.end.x=bb.pageX||bb.clientX;bc.end.y=bb.pageY||bb.clientY;return bc}function ac(bc){for(var bb=0;bb<aQ.length;bb++){if(aQ[bb].identifier==bc){return aQ[bb]}}}function aj(){var bb=[];for(var bc=0;bc<=5;bc++){bb.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return bb}function aI(bb,bc){bc=Math.max(bc,aT(bb));M[bb].distance=bc}function aT(bb){if(M[bb]){return M[bb].distance}return undefined}function aa(){var bb={};bb[p]=aw(p);bb[o]=aw(o);bb[e]=aw(e);bb[x]=aw(x);return bb}function aw(bb){return{direction:bb,distance:0}}function aM(){return a2-T}function au(be,bd){var bc=Math.abs(be.x-bd.x);var bb=Math.abs(be.y-bd.y);return Math.round(Math.sqrt(bc*bc+bb*bb))}function a7(bb,bc){var bd=(bc/bb)*1;return bd.toFixed(2)}function ar(){if(G<1){return z}else{return c}}function aS(bc,bb){return Math.round(Math.sqrt(Math.pow(bb.x-bc.x,2)+Math.pow(bb.y-bc.y,2)))}function aE(be,bc){var bb=be.x-bc.x;var bg=bc.y-be.y;var bd=Math.atan2(bg,bb);var bf=Math.round(bd*180/Math.PI);if(bf<0){bf=360-Math.abs(bf)}return bf}function aL(bc,bb){var bd=aE(bc,bb);if((bd<=45)&&(bd>=0)){return p}else{if((bd<=360)&&(bd>=315)){return p}else{if((bd>=135)&&(bd<=225)){return o}else{if((bd>45)&&(bd<135)){return x}else{return e}}}}}function at(){var bb=new Date();return bb.getTime()}function aY(bb){bb=f(bb);var bd=bb.offset();var bc={left:bd.left,right:bd.left+bb.outerWidth(),top:bd.top,bottom:bd.top+bb.outerHeight()};return bc}function E(bb,bc){return(bb.x>bc.left&&bb.x<bc.right&&bb.y>bc.top&&bb.y<bc.bottom)}}}));



if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = console.groupCollapsed = function() {};
}

if (window.tplogs==true)
	try {
		console.groupCollapsed("ThemePunch GreenSocks Logs");
	} catch(e) { }


var oldgs = window.GreenSockGlobals;
	oldgs_queue = window._gsQueue;
	
var punchgs = window.GreenSockGlobals = {};

if (window.tplogs==true)
	try {
		console.info("Build GreenSock SandBox for ThemePunch Plugins");
		console.info("GreenSock TweenLite Engine Initalised by ThemePunch Plugin");
	} catch(e) {}

/*!
 * VERSION: 1.14.2
 * DATE: 2014-10-28
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function(t,e){"use strict";var i=t.GreenSockGlobals=t.GreenSockGlobals||t;if(!i.TweenLite){var s,r,n,a,o,l=function(t){var e,s=t.split("."),r=i;for(e=0;s.length>e;e++)r[s[e]]=r=r[s[e]]||{};return r},h=l("com.greensock"),_=1e-10,u=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},m=function(){},f=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return null!=i&&(i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e)}}(),c={},p=function(s,r,n,a){this.sc=c[s]?c[s].sc:[],c[s]=this,this.gsClass=null,this.func=n;var o=[];this.check=function(h){for(var _,u,m,f,d=r.length,v=d;--d>-1;)(_=c[r[d]]||new p(r[d],[])).gsClass?(o[d]=_.gsClass,v--):h&&_.sc.push(this);if(0===v&&n)for(u=("com.greensock."+s).split("."),m=u.pop(),f=l(u.join("."))[m]=this.gsClass=n.apply(n,o),a&&(i[m]=f,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+s.split(".").pop(),[],function(){return f}):s===e&&"undefined"!=typeof module&&module.exports&&(module.exports=f)),d=0;this.sc.length>d;d++)this.sc[d].check()},this.check(!0)},d=t._gsDefine=function(t,e,i,s){return new p(t,e,i,s)},v=h._class=function(t,e,i){return e=e||function(){},d(t,[],function(){return e},i),e};d.globals=i;var g=[0,0,1,1],T=[],y=v("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?g.concat(e):g},!0),w=y.map={},P=y.register=function(t,e,i,s){for(var r,n,a,o,l=e.split(","),_=l.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=l[_],r=s?v("easing."+n,null,!0):h.easing[n]||{},a=u.length;--a>-1;)o=u[a],w[n+"."+o]=w[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(n=y.prototype,n._calcEnd=!1,n.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},s=["Linear","Quad","Cubic","Quart","Quint,Strong"],r=s.length;--r>-1;)n=s[r]+",Power"+r,P(new y(null,null,1,r),n,"easeOut",!0),P(new y(null,null,2,r),n,"easeIn"+(0===r?",easeNone":"")),P(new y(null,null,3,r),n,"easeInOut");w.linear=h.easing.Linear.easeIn,w.swing=h.easing.Quad.easeInOut;var b=v("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});n=b.prototype,n.addEventListener=function(t,e,i,s,r){r=r||0;var n,l,h=this._listeners[t],_=0;for(null==h&&(this._listeners[t]=h=[]),l=h.length;--l>-1;)n=h[l],n.c===e&&n.s===i?h.splice(l,1):0===_&&r>n.pr&&(_=l+1);h.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==a||o||a.wake()},n.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},n.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s&&(s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i))};var k=t.requestAnimationFrame,A=t.cancelAnimationFrame,S=Date.now||function(){return(new Date).getTime()},x=S();for(s=["ms","moz","webkit","o"],r=s.length;--r>-1&&!k;)k=t[s[r]+"RequestAnimationFrame"],A=t[s[r]+"CancelAnimationFrame"]||t[s[r]+"CancelRequestAnimationFrame"];v("Ticker",function(t,e){var i,s,r,n,l,h=this,u=S(),f=e!==!1&&k,c=500,p=33,d=function(t){var e,a,o=S()-x;o>c&&(u+=o-p),x+=o,h.time=(x-u)/1e3,e=h.time-l,(!i||e>0||t===!0)&&(h.frame++,l+=e+(e>=n?.004:n-e),a=!0),t!==!0&&(r=s(d)),a&&h.dispatchEvent("tick")};b.call(h),h.time=h.frame=0,h.tick=function(){d(!0)},h.lagSmoothing=function(t,e){c=t||1/_,p=Math.min(e,c,0)},h.sleep=function(){null!=r&&(f&&A?A(r):clearTimeout(r),s=m,r=null,h===a&&(o=!1))},h.wake=function(){null!==r?h.sleep():h.frame>10&&(x=S()-c+5),s=0===i?m:f&&k?k:function(t){return setTimeout(t,0|1e3*(l-h.time)+1)},h===a&&(o=!0),d(2)},h.fps=function(t){return arguments.length?(i=t,n=1/(i||60),l=this.time+n,h.wake(),void 0):i},h.useRAF=function(t){return arguments.length?(h.sleep(),f=t,h.fps(i),void 0):f},h.fps(t),setTimeout(function(){f&&(!r||5>h.frame)&&h.useRAF(!1)},1500)}),n=h.Ticker.prototype=new h.events.EventDispatcher,n.constructor=h.Ticker;var R=v("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,B){o||a.wake();var i=this.vars.useFrames?q:B;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});a=R.ticker=new h.Ticker,n=R.prototype,n._dirty=n._gc=n._initted=n._paused=!1,n._totalTime=n._time=0,n._rawPrevTime=-1,n._next=n._last=n._onUpdate=n._timeline=n.timeline=null,n._paused=!1;var C=function(){o&&S()-x>2e3&&a.wake(),setTimeout(C,2e3)};C(),n.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},n.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},n.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},n.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},n.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},n.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},n.render=function(){},n.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,(this._gc||!this.timeline)&&this._enabled(!0),this},n.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},n._enabled=function(t,e){return o||a.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},n._kill=function(){return this._enabled(!1,!1)},n.kill=function(t,e){return this._kill(t,e),this},n._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},n._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},n.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=f(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},n.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},n.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},n.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},n.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},n.totalTime=function(t,e,i){if(o||a.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&(this.render(t,e,!1),z.length&&M())}return this},n.progress=n.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},n.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},n.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},n.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||_,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},n.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},n.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){o||t||a.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var D=v("core.SimpleTimeline",function(t){R.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});n=D.prototype=new R,n.constructor=D,n.kill()._gc=!1,n._first=n._last=n._recent=null,n._sortChildren=!1,n.add=n.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._recent=t,this._timeline&&this._uncache(!0),this},n._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},n.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},n.rawTime=function(){return o||a.wake(),this._totalTime};var I=v("TweenLite",function(e,i,s){if(R.call(this,i,s),this.render=I.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:I.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),l=this.vars.overwrite;if(this._overwrite=l=null==l?Q[I.defaultOverwrite]:"number"==typeof l?l>>0:Q[l],(o||e instanceof Array||e.push&&f(e))&&"number"!=typeof e[0])for(this._targets=a=u(e),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(u(n))):(this._siblings[r]=$(n,this,!1),1===l&&this._siblings[r].length>1&&H(n,this,null,1,this._siblings[r])):(n=a[r--]=I.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=$(e,this,!1),1===l&&this._siblings.length>1&&H(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-_,this.render(-this._delay))},!0),E=function(e){return e&&e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},O=function(t,e){var i,s={};for(i in t)G[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!U[i]||U[i]&&U[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};n=I.prototype=new R,n.constructor=I,n.kill()._gc=!1,n.ratio=0,n._firstPT=n._targets=n._overwrittenProps=n._startAt=null,n._notifyPluginsOfEnabled=n._lazy=!1,I.version="1.14.2",I.defaultEase=n._ease=new y(null,null,1,1),I.defaultOverwrite="auto",I.ticker=a,I.autoSleep=!0,I.lagSmoothing=function(t,e){a.lagSmoothing(t,e)},I.selector=t.$||t.jQuery||function(e){var i=t.$||t.jQuery;return i?(I.selector=i,i(e)):"undefined"==typeof document?e:document.querySelectorAll?document.querySelectorAll(e):document.getElementById("#"===e.charAt(0)?e.substr(1):e)};var z=[],L={},N=I._internals={isArray:f,isSelector:E,lazyTweens:z},U=I._plugins={},F=N.tweenLookup={},j=0,G=N.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1},Q={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},q=R._rootFramesTimeline=new D,B=R._rootTimeline=new D,M=N.lazyRender=function(){var t,e=z.length;for(L={};--e>-1;)t=z[e],t&&t._lazy!==!1&&(t.render(t._lazy[0],t._lazy[1],!0),t._lazy=!1);z.length=0};B._startTime=a.time,q._startTime=a.frame,B._active=q._active=!0,setTimeout(M,1),R._updateRoot=I.render=function(){var t,e,i;if(z.length&&M(),B.render((a.time-B._startTime)*B._timeScale,!1,!1),q.render((a.frame-q._startTime)*q._timeScale,!1,!1),z.length&&M(),!(a.frame%120)){for(i in F){for(e=F[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete F[i]}if(i=B._first,(!i||i._paused)&&I.autoSleep&&!q._first&&1===a._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||a.sleep()}}},a.addEventListener("tick",R._updateRoot);var $=function(t,e,i){var s,r,n=t._gsTweenID;if(F[n||(t._gsTweenID=n="t"+j++)]||(F[n]={target:t,tweens:[]}),e&&(s=F[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return F[n].tweens},K=function(t,e,i,s){var r,n,a=t.vars.onOverwrite;return a&&(r=a(t,e,i,s)),a=I.onOverwrite,a&&(n=a(t,e,i,s)),r!==!1&&n!==!1},H=function(t,e,i,s,r){var n,a,o,l;if(1===s||s>=4){for(l=r.length,n=0;l>n;n++)if((o=r[n])!==e)o._gc||K(o,e)&&o._enabled(!1,!1)&&(a=!0);else if(5===s)break;return a}var h,u=e._startTime+_,m=[],f=0,c=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(h=h||J(e,0,c),0===J(o,h,c)&&(m[f++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale>u&&((c||!o._initted)&&2e-10>=u-o._startTime||(m[f++]=o)));for(n=f;--n>-1;)if(o=m[n],2===s&&o._kill(i,t,e)&&(a=!0),2!==s||!o._firstPT&&o._initted){if(2!==s&&!K(o,e))continue;o._enabled(!1,!1)&&(a=!0)}return a},J=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*_>n-e?_:(n+=t.totalDuration()/t._timeScale/r)>e+_?0:n-e-_};n._init=function(){var t,e,i,s,r,n=this.vars,a=this._overwrittenProps,o=this._duration,l=!!n.immediateRender,h=n.ease;if(n.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),r={};for(s in n.startAt)r[s]=n.startAt[s];if(r.overwrite=!1,r.immediateRender=!0,r.lazy=l&&n.lazy!==!1,r.startAt=r.delay=null,this._startAt=I.to(this.target,0,r),l)if(this._time>0)this._startAt=null;else if(0!==o)return}else if(n.runBackwards&&0!==o)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{0!==this._time&&(l=!1),i={};for(s in n)G[s]&&"autoCSS"!==s||(i[s]=n[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=l&&n.lazy!==!1,i.immediateRender=l,this._startAt=I.to(this.target,0,i),l){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=h=h?h instanceof y?h:"function"==typeof h?new y(h,n.easeParams):w[h]||I.defaultEase:I.defaultEase,n.easeParams instanceof Array&&h.config&&(this._ease=h.config.apply(h,n.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],a?a[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,a);if(e&&I._onPluginEvent("_onInitAllProps",this),a&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),n.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=n.onUpdate,this._initted=!0},n._initProps=function(e,i,s,r){var n,a,o,l,h,_;if(null==e)return!1;L[e._gsTweenID]&&M(),this.vars.css||e.style&&e!==t&&e.nodeType&&U.css&&this.vars.autoCSS!==!1&&O(this.vars,e);for(n in this.vars){if(_=this.vars[n],G[n])_&&(_ instanceof Array||_.push&&f(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(U[n]&&(l=new U[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=h={_next:this._firstPT,t:l,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:l._priority},a=l._overwriteProps.length;--a>-1;)i[l._overwriteProps[a]]=this._firstPT;(l._priority||l._onInitAllProps)&&(o=!0),(l._onDisable||l._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=h={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},h.s=h.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),h.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-h.s||0;h&&h._next&&(h._next._prev=h)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&H(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(L[e._gsTweenID]=!0),o)},n.render=function(t,e,i){var s,r,n,a,o=this._time,l=this._duration,h=this._rawPrevTime;if(t>=l)this._totalTime=this._time=l,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===l&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>h||h===_)&&h!==t&&(i=!0,h>_&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||h===t?t:_);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===l&&h>0&&h!==_)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===l&&(this._initted||!this.vars.lazy||i)&&(h>=0&&(i=!0),this._rawPrevTime=a=!e||t||h===t?t:_)),this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var u=t/l,m=this._easeType,f=this._easePower;(1===m||3===m&&u>=.5)&&(u=1-u),3===m&&(u*=2),1===f?u*=u:2===f?u*=u*u:3===f?u*=u*u*u:4===f&&(u*=u*u*u*u),this.ratio=1===m?1-u:2===m?u:.5>t/l?u/2:1-u/2}else this.ratio=this._ease.getRatio(t/l);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=h,z.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/l):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===l)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||T))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&t!==-1e-4&&this._startAt.render(t,e,i),e||(this._time!==o||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||T)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&t!==-1e-4&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||T),0===l&&this._rawPrevTime===_&&a!==_&&(this._rawPrevTime=0))}},n._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:I.selector(e)||e;var s,r,n,a,o,l,h,_,u;if((f(e)||E(e))&&"number"!=typeof e[0])for(s=e.length;--s>-1;)this._kill(t,e[s])&&(l=!0);else{if(this._targets){for(s=this._targets.length;--s>-1;)if(e===this._targets[s]){o=this._propLookup[s]||{},this._overwrittenProps=this._overwrittenProps||[],r=this._overwrittenProps[s]=t?this._overwrittenProps[s]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,r=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){if(h=t||o,_=t!==r&&"all"!==r&&t!==o&&("object"!=typeof t||!t._tempKill),i&&(I.onOverwrite||this.vars.onOverwrite)){for(n in h)o[n]&&(u||(u=[]),u.push(n));if(!K(this,i,e,u))return!1}for(n in h)(a=o[n])&&(a.pg&&a.t._kill(h)&&(l=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),_&&(r[n]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return l},n.invalidate=function(){return this._notifyPluginsOfEnabled&&I._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],R.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-_,this.render(-this._delay)),this},n._enabled=function(t,e){if(o||a.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=$(s[i],this,!0);else this._siblings=$(this.target,this,!0)}return R.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?I._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},I.to=function(t,e,i){return new I(t,e,i)},I.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new I(t,e,i)},I.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new I(t,e,s)},I.delayedCall=function(t,e,i,s,r){return new I(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:r,overwrite:0})},I.set=function(t,e){return new I(t,0,e)},I.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:I.selector(t)||t;var i,s,r,n;if((f(t)||E(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(I.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=$(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},I.killTweensOf=I.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=I.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var V=v("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=V.prototype},!0);if(n=V.prototype,V.version="1.10.1",V.API=2,n._firstPT=null,n._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},n.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=Math.round(e):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},n._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},n._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},I._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},V.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===V.API&&(U[(new t[e])._propName]=t[e]);return!0},d.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=v("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){V.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new V(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,V.activate([a]),a},s=t._gsQueue){for(r=0;s.length>r;r++)s[r]();for(n in c)c[n].func||t.console.log("GSAP encountered missing dependency: com.greensock."+n)}o=!1}})("undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window,"TweenLite");

/*!
 * VERSION: 1.14.2
 * DATE: 2014-10-18
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],o(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));o(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals,a=n.isSelector,o=n.isArray,h=n.lazyTweens,l=n.lazyRender,_=[],u=_gsScope._gsDefine.globals,c=function(t){var e,i={};for(e in t)i[e]=t[e];return i},p=function(t,e,i,s){var r=t._timeline._totalTime;(e||!this._forcingPlayhead)&&(t._timeline.pause(t._startTime),e&&e.apply(s||t._timeline,i||_),this._forcingPlayhead&&t._timeline.seek(r))},f=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},m=s.prototype=new e;return s.version="1.14.2",m.constructor=s,m.kill()._gc=m._forcingPlayhead=!1,m.to=function(t,e,s,r){var n=s.repeat&&u.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},m.from=function(t,e,s,r){return this.add((s.repeat&&u.TweenMax||i).from(t,e,s),r)},m.fromTo=function(t,e,s,r,n){var a=r.repeat&&u.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},m.staggerTo=function(t,e,r,n,o,h,l,_){var u,p=new s({onComplete:h,onCompleteParams:l,onCompleteScope:_,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),t=t||[],a(t)&&(t=f(t)),n=n||0,0>n&&(t=f(t),t.reverse(),n*=-1),u=0;t.length>u;u++)r.startAt&&(r.startAt=c(r.startAt)),p.to(t[u],e,c(r),u*n);return this.add(p,o)},m.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},m.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},m.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},m.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},m.add=function(r,n,a,h){var l,_,u,c,p,f;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&o(r)){for(a=a||"normal",h=h||0,l=n,_=r.length,u=0;_>u;u++)o(c=r[u])&&(c=new s({tweens:c})),this.add(c,l),"string"!=typeof c&&"function"!=typeof c&&("sequence"===a?l=c._startTime+c.totalDuration()/c._timeScale:"start"===a&&(c._startTime-=c.delay())),l+=h;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(p=this,f=p.rawTime()>r._startTime;p._timeline;)f&&p._timeline.smoothChildTiming?p.totalTime(p._totalTime,!0):p._gc&&p._enabled(!0,!1),p=p._timeline;return this},m.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&o(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},m._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},m.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},m.insert=m.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},m.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},m.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},m.addPause=function(t,e,i,s){return this.call(p,["{self}",e,i,s],this,t)},m.removeLabel=function(t){return delete this._labels[t],this},m.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},m._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&o(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},m.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},m.stop=function(){return this.paused(!0)},m.gotoAndPlay=function(t,e){return this.play(t,e)},m.gotoAndStop=function(t,e){return this.pause(t,e)},m.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,o,u,c=this._dirty?this.totalDuration():this._totalDuration,p=this._time,f=this._startTime,m=this._timeScale,d=this._paused;if(t>=c?(this._totalTime=this._time=c,this._reversed||this._hasPausedChild()||(n=!0,o="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(u=!0,this._rawPrevTime>r&&(o="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=c+1e-4):1e-7>t?(this._totalTime=this._time=0,(0!==p||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(o="onReverseComplete",n=this._reversed),0>t?(this._active=!1,this._rawPrevTime>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):this._totalTime=this._time=this._rawPrevTime=t,this._time!==p&&this._first||i||u){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==p&&t>0&&(this._active=!0),0===p&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_)),this._time>=p)for(s=this._first;s&&(a=s._next,!this._paused||d);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||d);)(s._active||p>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||(h.length&&l(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_))),o&&(this._gc||(f===this._startTime||m!==this._timeScale)&&(0===this._time||c>=this.totalDuration())&&(n&&(h.length&&l(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[o]&&this.vars[o].apply(this.vars[o+"Scope"]||this,this.vars[o+"Params"]||_)))}},m._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},m.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},m.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},m.recent=function(){return this._recent},m._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},m.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},m._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},m.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},m.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},m._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},m.totalTime=function(){this._forcingPlayhead=!0;var e=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,e},m.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},m.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},m.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},m.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t){"use strict";var e=function(){return(_gsScope.GreenSockGlobals||_gsScope)[t]};"function"==typeof define&&define.amd?define(["TweenLite"],e):"undefined"!=typeof module&&module.exports&&(require("./TweenLite.js"),module.exports=e())}("TimelineLite");

/*!
 * VERSION: beta 1.9.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=_gsScope.GreenSockGlobals||_gsScope,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},c=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},p=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},f=u("Back",p("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),p("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),p("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),p=u,f=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--p>-1;)i=f?Math.random():1/u*p,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),f?s+=Math.random()*r-.5*r:p%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new c(1,1,null),p=u;--p>-1;)a=l[p],o=new c(a.x,a.y,o);this._prev=new c(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),f},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();

/*!
 * VERSION: 1.14.2
 * DATE: 2014-10-28
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,r,s,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o={},l=a.prototype=new t("css");l.constructor=a,a.version="1.14.2",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",l="px",a.suffixMap={top:l,right:l,bottom:l,left:l,width:l,height:l,fontSize:l,padding:l,margin:l,perspective:l,lineHeight:""};var h,u,f,p,_,c,d=/(?:\d|\-\d|\.\d|\-\.\d)+/g,m=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,g=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,v=/(?![+-]?\d*\.?\d+|e[+-]\d+)[^0-9]/g,y=/(?:\d|\-|\+|=|#|\.)*/g,x=/opacity *= *([^)]*)/i,T=/opacity:([^;]*)/i,w=/alpha\(opacity *=.+?\)/i,b=/^(rgb|hsl)/,P=/([A-Z])/g,S=/-([a-z])/gi,R=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,C=function(t,e){return e.toUpperCase()},k=/(?:Left|Right|Width)/i,O=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,A=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,D=/,(?=[^\)]*(?:\(|$))/gi,M=Math.PI/180,L=180/Math.PI,N={},z=document,X=z.createElement("div"),I=z.createElement("img"),E=a._internals={_specialProps:o},F=navigator.userAgent,Y=function(){var t,e=F.indexOf("Android"),i=z.createElement("div");return f=-1!==F.indexOf("Safari")&&-1===F.indexOf("Chrome")&&(-1===e||Number(F.substr(e+8,1))>3),_=f&&6>Number(F.substr(F.indexOf("Version/")+8,1)),p=-1!==F.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(F)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(F))&&(c=parseFloat(RegExp.$1)),i.innerHTML="<a style='top:1px;opacity:.55;'>a</a>",t=i.getElementsByTagName("a")[0],t?/^0.55/.test(t.style.opacity):!1}(),B=function(t){return x.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},U=function(t){window.console&&console.log(t)},j="",W="",V=function(t,e){e=e||X;var i,r,s=e.style;if(void 0!==s[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],r=5;--r>-1&&void 0===s[i[r]+t];);return r>=0?(W=3===r?"ms":i[r],j="-"+W.toLowerCase()+"-",W+t):null},q=z.defaultView?z.defaultView.getComputedStyle:function(){},H=a.getStyle=function(t,e,i,r,s){var n;return Y||"opacity"!==e?(!r&&t.style[e]?n=t.style[e]:(i=i||q(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(P,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==s||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:s):B(t)},G=E.convertToPixels=function(t,i,r,s,n){if("px"===s||!s)return r;if("auto"===s||!r)return 0;var o,l,h,u=k.test(i),f=t,p=X.style,_=0>r;if(_&&(r=-r),"%"===s&&-1!==i.indexOf("border"))o=r/100*(u?t.clientWidth:t.clientHeight);else{if(p.cssText="border:0 solid red;position:"+H(t,"position")+";line-height:0;","%"!==s&&f.appendChild)p[u?"borderLeftWidth":"borderTopWidth"]=r+s;else{if(f=t.parentNode||z.body,l=f._gsCache,h=e.ticker.frame,l&&u&&l.time===h)return l.width*r/100;p[u?"width":"height"]=r+s}f.appendChild(X),o=parseFloat(X[u?"offsetWidth":"offsetHeight"]),f.removeChild(X),u&&"%"===s&&a.cacheWidths!==!1&&(l=f._gsCache=f._gsCache||{},l.time=h,l.width=100*(o/r)),0!==o||n||(o=G(t,i,r,s,!0))}return _?-o:o},Q=E.calculateOffset=function(t,e,i){if("absolute"!==H(t,"position",i))return 0;var r="left"===e?"Left":"Top",s=H(t,"margin"+r,i);return t["offset"+r]-(G(t,e,parseFloat(s),s.replace(y,""))||0)},Z=function(t,e){var i,r,s={};if(e=e||q(t,null))if(i=e.length)for(;--i>-1;)s[e[i].replace(S,C)]=e.getPropertyValue(e[i]);else for(i in e)s[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===s[i]&&(s[i.replace(S,C)]=e[i]);return Y||(s.opacity=B(t)),r=Ae(t,e,!1),s.rotation=r.rotation,s.skewX=r.skewX,s.scaleX=r.scaleX,s.scaleY=r.scaleY,s.x=r.x,s.y=r.y,be&&(s.z=r.z,s.rotationX=r.rotationX,s.rotationY=r.rotationY,s.scaleZ=r.scaleZ),s.filters&&delete s.filters,s},$=function(t,e,i,r,s){var n,a,o,l={},h=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||s&&s[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(l[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(v,"")?n:0:Q(t,a),void 0!==h[a]&&(o=new fe(h,a,h[a],o)));if(r)for(a in r)"className"!==a&&(l[a]=r[a]);return{difs:l,firstMPT:o}},K={width:["Left","Right"],height:["Top","Bottom"]},J=["marginLeft","marginRight","marginTop","marginBottom"],te=function(t,e,i){var r=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),s=K[e],n=s.length;for(i=i||q(t,null);--n>-1;)r-=parseFloat(H(t,"padding"+s[n],i,!0))||0,r-=parseFloat(H(t,"border"+s[n]+"Width",i,!0))||0;return r},ee=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),r=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],s=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==s?s="0":"center"===s&&(s="50%"),("center"===r||isNaN(parseFloat(r))&&-1===(r+"").indexOf("="))&&(r="50%"),e&&(e.oxp=-1!==r.indexOf("%"),e.oyp=-1!==s.indexOf("%"),e.oxr="="===r.charAt(1),e.oyr="="===s.charAt(1),e.ox=parseFloat(r.replace(v,"")),e.oy=parseFloat(s.replace(v,""))),r+" "+s+(i.length>2?" "+i[2]:"")},ie=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},re=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)},se=function(t,e,i,r){var s,n,a,o,l=1e-6;return null==t?o=e:"number"==typeof t?o=t:(s=360,n=t.split("_"),a=Number(n[0].replace(v,""))*(-1===t.indexOf("rad")?1:L)-("="===t.charAt(1)?0:e),n.length&&(r&&(r[i]=e+a),-1!==t.indexOf("short")&&(a%=s,a!==a%(s/2)&&(a=0>a?a+s:a-s)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*s)%s-(0|a/s)*s:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*s)%s-(0|a/s)*s)),o=e+a),l>o&&o>-l&&(o=0),o},ne={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ae=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},oe=a.parseColor=function(t){var e,i,r,s,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),ne[t]?ne[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),r=t.charAt(3),t="#"+e+e+i+i+r+r),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(d),s=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=ae(s+1/3,e,i),t[1]=ae(s,e,i),t[2]=ae(s-1/3,e,i),t):(t=t.match(d)||ne.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):ne.black},le="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(l in ne)le+="|"+l+"\\b";le=RegExp(le+")","gi");var he=function(t,e,i,r){if(null==t)return function(t){return t};var s,n=e?(t.match(le)||[""])[0]:"",a=t.split(n).join("").match(g)||[],o=t.substr(0,t.indexOf(a[0])),l=")"===t.charAt(t.length-1)?")":"",h=-1!==t.indexOf(" ")?" ":",",u=a.length,f=u>0?a[0].replace(d,""):"";return u?s=e?function(t){var e,p,_,c;if("number"==typeof t)t+=f;else if(r&&D.test(t)){for(c=t.replace(D,"|").split("|"),_=0;c.length>_;_++)c[_]=s(c[_]);return c.join(",")}if(e=(t.match(le)||[n])[0],p=t.split(e).join("").match(g)||[],_=p.length,u>_--)for(;u>++_;)p[_]=i?p[0|(_-1)/2]:a[_];return o+p.join(h)+h+e+l+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=f;else if(r&&D.test(t)){for(n=t.replace(D,"|").split("|"),p=0;n.length>p;p++)n[p]=s(n[p]);return n.join(",")}if(e=t.match(g)||[],p=e.length,u>p--)for(;u>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(h)+l}:function(t){return t}},ue=function(t){return t=t.split(","),function(e,i,r,s,n,a,o){var l,h=(i+"").split(" ");for(o={},l=0;4>l;l++)o[t[l]]=h[l]=h[l]||h[(l-1)/2>>0];return s.parse(e,o,n,a)}},fe=(E._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,r,s,n=this.data,a=n.proxy,o=n.firstMPT,l=1e-6;o;)e=a[o.v],o.r?e=Math.round(e):l>e&&e>-l&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(s=i.xs0+i.s+i.xs1,r=1;i.l>r;r++)s+=i["xn"+r]+i["xs"+(r+1)];i.e=s}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,r,s){this.t=t,this.p=e,this.v=i,this.r=s,r&&(r._prev=this,this._next=r)}),pe=(E._parseToProxy=function(t,e,i,r,s,n){var a,o,l,h,u,f=r,p={},_={},c=i._transform,d=N;for(i._transform=null,N=e,r=u=i.parse(t,e,r,s),N=d,n&&(i._transform=c,f&&(f._prev=null,f._prev&&(f._prev._next=null)));r&&r!==f;){if(1>=r.type&&(o=r.p,_[o]=r.s+r.c,p[o]=r.s,n||(h=new fe(r,"s",o,h,r.r),r.c=0),1===r.type))for(a=r.l;--a>0;)l="xn"+a,o=r.p+"_"+l,_[o]=r.data[l],p[o]=r[l],n||(h=new fe(r,l,o,h,r.rxp[l]));r=r._next}return{proxy:p,end:_,firstMPT:h,pt:u}},E.CSSPropTween=function(t,e,r,s,a,o,l,h,u,f,p){this.t=t,this.p=e,this.s=r,this.c=s,this.n=l||e,t instanceof pe||n.push(this.n),this.r=h,this.type=o||0,u&&(this.pr=u,i=!0),this.b=void 0===f?r:f,this.e=void 0===p?r+s:p,a&&(this._next=a,a._prev=this)}),_e=a.parseComplex=function(t,e,i,r,s,n,a,o,l,u){i=i||n||"",a=new pe(t,e,0,0,a,u?2:1,null,!1,o,i,r),r+="";var f,p,_,c,g,v,y,x,T,w,P,S,R=i.split(", ").join(",").split(" "),C=r.split(", ").join(",").split(" "),k=R.length,O=h!==!1;for((-1!==r.indexOf(",")||-1!==i.indexOf(","))&&(R=R.join(" ").replace(D,", ").split(" "),C=C.join(" ").replace(D,", ").split(" "),k=R.length),k!==C.length&&(R=(n||"").split(" "),k=R.length),a.plugin=l,a.setRatio=u,f=0;k>f;f++)if(c=R[f],g=C[f],x=parseFloat(c),x||0===x)a.appendXtra("",x,ie(g,x),g.replace(m,""),O&&-1!==g.indexOf("px"),!0);else if(s&&("#"===c.charAt(0)||ne[c]||b.test(c)))S=","===g.charAt(g.length-1)?"),":")",c=oe(c),g=oe(g),T=c.length+g.length>6,T&&!Y&&0===g[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(C[f]).join("transparent")):(Y||(T=!1),a.appendXtra(T?"rgba(":"rgb(",c[0],g[0]-c[0],",",!0,!0).appendXtra("",c[1],g[1]-c[1],",",!0).appendXtra("",c[2],g[2]-c[2],T?",":S,!0),T&&(c=4>c.length?1:c[3],a.appendXtra("",c,(4>g.length?1:g[3])-c,S,!1)));else if(v=c.match(d)){if(y=g.match(m),!y||y.length!==v.length)return a;for(_=0,p=0;v.length>p;p++)P=v[p],w=c.indexOf(P,_),a.appendXtra(c.substr(_,w-_),Number(P),ie(y[p],P),"",O&&"px"===c.substr(w+P.length,2),0===p),_=w+P.length;a["xs"+a.l]+=c.substr(_)}else a["xs"+a.l]+=a.l?" "+c:c;if(-1!==r.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,f=1;a.l>f;f++)S+=a["xs"+f]+a.data["xn"+f];a.e=S+a["xs"+f]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},ce=9;for(l=pe.prototype,l.l=l.pr=0;--ce>0;)l["xn"+ce]=0,l["xs"+ce]="";l.xs0="",l._next=l._prev=l.xfirst=l.data=l.plugin=l.setRatio=l.rxp=null,l.appendXtra=function(t,e,i,r,s,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=r||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=s,a["xn"+o]=e,a.plugin||(a.xfirst=new pe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,s,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=s,a)):(a["xs"+o]+=e+(r||""),a)};var de=function(t,e){e=e||{},this.p=e.prefix?V(t)||t:t,o[t]=o[this.p]=this,this.format=e.formatter||he(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},me=E._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var r,s,n=t.split(","),a=e.defaultValue;for(i=i||[a],r=0;n.length>r;r++)e.prefix=0===r&&e.prefix,e.defaultValue=i[r]||a,s=new de(n[r],e)},ge=function(t){if(!o[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";me(t,{parser:function(t,i,r,s,n,a,l){var h=(_gsScope.GreenSockGlobals||_gsScope).com.greensock.plugins[e];return h?(h._cssRegister(),o[r].parse(t,i,r,s,n,a,l)):(U("Error: "+e+" js file not loaded."),n)}})}};l=de.prototype,l.parseComplex=function(t,e,i,r,s,n){var a,o,l,h,u,f,p=this.keyword;if(this.multi&&(D.test(i)||D.test(e)?(o=e.replace(D,"|").split("|"),l=i.replace(D,"|").split("|")):p&&(o=[e],l=[i])),l){for(h=l.length>o.length?l.length:o.length,a=0;h>a;a++)e=o[a]=o[a]||this.dflt,i=l[a]=l[a]||this.dflt,p&&(u=e.indexOf(p),f=i.indexOf(p),u!==f&&(i=-1===f?l:o,i[a]+=" "+p));e=o.join(", "),i=l.join(", ")}return _e(t,this.p,e,i,this.clrs,this.dflt,r,this.pr,s,n)},l.parse=function(t,e,i,r,n,a){return this.parseComplex(t.style,this.format(H(t,this.p,s,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){me(t,{parser:function(t,r,s,n,a,o){var l=new pe(t,s,0,0,a,2,s,!1,i);return l.plugin=o,l.setRatio=e(t,r,n._tween,s),l},priority:i})};var ve,ye="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),xe=V("transform"),Te=j+"transform",we=V("transformOrigin"),be=null!==V("perspective"),Pe=E.Transform=function(){this.skewY=0},Se=window.SVGElement,Re=function(t,e,i){var r,s=z.createElementNS("http://www.w3.org/2000/svg",t),n=/([a-z])([A-Z])/g;for(r in i)s.setAttributeNS(null,r.replace(n,"$1-$2").toLowerCase(),i[r]);return e.appendChild(s),s},Ce=document.documentElement,ke=function(){var t,e,i,r=c||/Android/i.test(F)&&!window.chrome;return z.createElementNS&&!r&&(t=Re("svg",Ce),e=Re("rect",t,{width:100,height:50,x:100}),i=e.getBoundingClientRect().left,e.style[we]="50% 50%",e.style[xe]="scale(0.5,0.5)",r=i===e.getBoundingClientRect().left,Ce.removeChild(t)),r}(),Oe=function(t,e,i){var r=t.getBBox();e=ee(e).split(" "),i.xOrigin=(-1!==e[0].indexOf("%")?parseFloat(e[0])/100*r.width:parseFloat(e[0]))+r.x,i.yOrigin=(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*r.height:parseFloat(e[1]))+r.y},Ae=E.getTransform=function(t,e,i,r){if(t._gsTransform&&i&&!r)return t._gsTransform;var n,o,l,h,u,f,p,_,c,d,m,g,v,y=i?t._gsTransform||new Pe:new Pe,x=0>y.scaleX,T=2e-5,w=1e5,b=179.99,P=b*M,S=be?parseFloat(H(t,we,e,!1,"0 0 0").split(" ")[2])||y.zOrigin||0:0,R=parseFloat(a.defaultTransformPerspective)||0;if(xe?n=H(t,Te,e,!0):t.currentStyle&&(n=t.currentStyle.filter.match(O),n=n&&4===n.length?[n[0].substr(4),Number(n[2].substr(4)),Number(n[1].substr(4)),n[3].substr(4),y.x||0,y.y||0].join(","):""),n&&"none"!==n&&"matrix(1, 0, 0, 1, 0, 0)"!==n){for(o=(n||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],l=o.length;--l>-1;)h=Number(o[l]),o[l]=(u=h-(h|=0))?(0|u*w+(0>u?-.5:.5))/w+h:h;if(16===o.length){var C=o[8],k=o[9],A=o[10],D=o[12],N=o[13],z=o[14];if(y.zOrigin&&(z=-y.zOrigin,D=C*z-o[12],N=k*z-o[13],z=A*z+y.zOrigin-o[14]),!i||r||null==y.rotationX){var X,I,E,F,Y,B,U,j=o[0],W=o[1],V=o[2],q=o[3],G=o[4],Q=o[5],Z=o[6],$=o[7],K=o[11],J=Math.atan2(Z,A),te=-P>J||J>P;y.rotationX=J*L,J&&(F=Math.cos(-J),Y=Math.sin(-J),X=G*F+C*Y,I=Q*F+k*Y,E=Z*F+A*Y,C=G*-Y+C*F,k=Q*-Y+k*F,A=Z*-Y+A*F,K=$*-Y+K*F,G=X,Q=I,Z=E),J=Math.atan2(C,j),y.rotationY=J*L,J&&(B=-P>J||J>P,F=Math.cos(-J),Y=Math.sin(-J),X=j*F-C*Y,I=W*F-k*Y,E=V*F-A*Y,k=W*Y+k*F,A=V*Y+A*F,K=q*Y+K*F,j=X,W=I,V=E),J=Math.atan2(W,Q),y.rotation=J*L,J&&(U=-P>J||J>P,F=Math.cos(-J),Y=Math.sin(-J),j=j*F+G*Y,I=W*F+Q*Y,Q=W*-Y+Q*F,Z=V*-Y+Z*F,W=I),U&&te?y.rotation=y.rotationX=0:U&&B?y.rotation=y.rotationY=0:B&&te&&(y.rotationY=y.rotationX=0),y.scaleX=(0|Math.sqrt(j*j+W*W)*w+.5)/w,y.scaleY=(0|Math.sqrt(Q*Q+k*k)*w+.5)/w,y.scaleZ=(0|Math.sqrt(Z*Z+A*A)*w+.5)/w,y.skewX=0,y.perspective=K?1/(0>K?-K:K):0,y.x=D,y.y=N,y.z=z}}else if(!(be&&!r&&o.length&&y.x===o[4]&&y.y===o[5]&&(y.rotationX||y.rotationY)||void 0!==y.x&&"none"===H(t,"display",e))){var ee=o.length>=6,ie=ee?o[0]:1,re=o[1]||0,se=o[2]||0,ne=ee?o[3]:1;y.x=o[4]||0,y.y=o[5]||0,f=Math.sqrt(ie*ie+re*re),p=Math.sqrt(ne*ne+se*se),_=ie||re?Math.atan2(re,ie)*L:y.rotation||0,c=se||ne?Math.atan2(se,ne)*L+_:y.skewX||0,d=f-Math.abs(y.scaleX||0),m=p-Math.abs(y.scaleY||0),Math.abs(c)>90&&270>Math.abs(c)&&(x?(f*=-1,c+=0>=_?180:-180,_+=0>=_?180:-180):(p*=-1,c+=0>=c?180:-180)),g=(_-y.rotation)%180,v=(c-y.skewX)%180,(void 0===y.skewX||d>T||-T>d||m>T||-T>m||g>-b&&b>g&&false|g*w||v>-b&&b>v&&false|v*w)&&(y.scaleX=f,y.scaleY=p,y.rotation=_,y.skewX=c),be&&(y.rotationX=y.rotationY=y.z=0,y.perspective=R,y.scaleZ=1)}y.zOrigin=S;for(l in y)T>y[l]&&y[l]>-T&&(y[l]=0)}else y={x:0,y:0,z:0,scaleX:1,scaleY:1,scaleZ:1,skewX:0,skewY:0,perspective:R,rotation:0,rotationX:0,rotationY:0,zOrigin:0};return i&&(t._gsTransform=y),y.svg=Se&&t instanceof Se&&t.parentNode instanceof Se,y.svg&&(Oe(t,H(t,we,s,!1,"50% 50%")+"",y),ve=a.useSVGTransformAttr||ke),y.xPercent=y.yPercent=0,y},De=function(t){var e,i,r=this.data,s=-r.rotation*M,n=s+r.skewX*M,a=1e5,o=(0|Math.cos(s)*r.scaleX*a)/a,l=(0|Math.sin(s)*r.scaleX*a)/a,h=(0|Math.sin(n)*-r.scaleY*a)/a,u=(0|Math.cos(n)*r.scaleY*a)/a,f=this.t.style,p=this.t.currentStyle;if(p){i=l,l=-h,h=-i,e=p.filter,f.filter="";var _,d,m=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,T="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+l+", M21="+h+", M22="+u,w=r.x+m*r.xPercent/100,b=r.y+g*r.yPercent/100;if(null!=r.ox&&(_=(r.oxp?.01*m*r.ox:r.ox)-m/2,d=(r.oyp?.01*g*r.oy:r.oy)-g/2,w+=_-(_*o+d*l),b+=d-(_*h+d*u)),v?(_=m/2,d=g/2,T+=", Dx="+(_-(_*o+d*l)+w)+", Dy="+(d-(_*h+d*u)+b)+")"):T+=", sizingMethod='auto expand')",f.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(A,T):T+" "+e,(0===t||1===t)&&1===o&&0===l&&0===h&&1===u&&(v&&-1===T.indexOf("Dx=0, Dy=0")||x.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&f.removeAttribute("filter")),!v){var P,S,R,C=8>c?1:-1;for(_=r.ieOffsetX||0,d=r.ieOffsetY||0,r.ieOffsetX=Math.round((m-((0>o?-o:o)*m+(0>l?-l:l)*g))/2+w),r.ieOffsetY=Math.round((g-((0>u?-u:u)*g+(0>h?-h:h)*m))/2+b),ce=0;4>ce;ce++)S=J[ce],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):G(this.t,S,parseFloat(P),P.replace(y,""))||0,R=i!==r[S]?2>ce?-r.ieOffsetX:-r.ieOffsetY:2>ce?_-r.ieOffsetX:d-r.ieOffsetY,f[S]=(r[S]=Math.round(i-R*(0===ce||2===ce?1:C)))+"px"}}},Me=E.set3DTransformRatio=function(t){var e,i,r,s,n,a,o,l,h,u,f,_,c,d,m,g,v,y,x,T,w,b,P,S=this.data,R=this.t.style,C=S.rotation*M,k=S.scaleX,O=S.scaleY,A=S.scaleZ,D=S.x,L=S.y,N=S.z,z=S.perspective;if(!(1!==t&&0!==t||"auto"!==S.force3D||S.rotationY||S.rotationX||1!==A||z||N))return Le.call(this,t),void 0;if(p){var X=1e-4;X>k&&k>-X&&(k=A=2e-5),X>O&&O>-X&&(O=A=2e-5),!z||S.z||S.rotationX||S.rotationY||(z=0)}if(C||S.skewX)y=Math.cos(C),x=Math.sin(C),e=y,n=x,S.skewX&&(C-=S.skewX*M,y=Math.cos(C),x=Math.sin(C),"simple"===S.skewType&&(T=Math.tan(S.skewX*M),T=Math.sqrt(1+T*T),y*=T,x*=T)),i=-x,a=y;else{if(!(S.rotationY||S.rotationX||1!==A||z||S.svg))return R[xe]=(S.xPercent||S.yPercent?"translate("+S.xPercent+"%,"+S.yPercent+"%) translate3d(":"translate3d(")+D+"px,"+L+"px,"+N+"px)"+(1!==k||1!==O?" scale("+k+","+O+")":""),void 0;e=a=1,i=n=0}f=1,r=s=o=l=h=u=_=c=d=0,m=z?-1/z:0,g=S.zOrigin,v=1e5,C=S.rotationY*M,C&&(y=Math.cos(C),x=Math.sin(C),h=f*-x,c=m*-x,r=e*x,o=n*x,f*=y,m*=y,e*=y,n*=y),C=S.rotationX*M,C&&(y=Math.cos(C),x=Math.sin(C),T=i*y+r*x,w=a*y+o*x,b=u*y+f*x,P=d*y+m*x,r=i*-x+r*y,o=a*-x+o*y,f=u*-x+f*y,m=d*-x+m*y,i=T,a=w,u=b,d=P),1!==A&&(r*=A,o*=A,f*=A,m*=A),1!==O&&(i*=O,a*=O,u*=O,d*=O),1!==k&&(e*=k,n*=k,h*=k,c*=k),g&&(_-=g,s=r*_,l=o*_,_=f*_+g),S.svg&&(s+=S.xOrigin-(S.xOrigin*e+S.yOrigin*i),l+=S.yOrigin-(S.xOrigin*n+S.yOrigin*a)),s=(T=(s+=D)-(s|=0))?(0|T*v+(0>T?-.5:.5))/v+s:s,l=(T=(l+=L)-(l|=0))?(0|T*v+(0>T?-.5:.5))/v+l:l,_=(T=(_+=N)-(_|=0))?(0|T*v+(0>T?-.5:.5))/v+_:_,R[xe]=(S.xPercent||S.yPercent?"translate("+S.xPercent+"%,"+S.yPercent+"%) matrix3d(":"matrix3d(")+[(0|e*v)/v,(0|n*v)/v,(0|h*v)/v,(0|c*v)/v,(0|i*v)/v,(0|a*v)/v,(0|u*v)/v,(0|d*v)/v,(0|r*v)/v,(0|o*v)/v,(0|f*v)/v,(0|m*v)/v,s,l,_,z?1+-_/z:1].join(",")+")"},Le=E.set2DTransformRatio=function(t){var e,i,r,s,n,a,o,l,h,u,f,p=this.data,_=this.t,c=_.style,d=p.x,m=p.y;return!(p.rotationX||p.rotationY||p.z||p.force3D===!0||"auto"===p.force3D&&1!==t&&0!==t)||p.svg&&ve||!be?(s=p.scaleX,n=p.scaleY,p.rotation||p.skewX||p.svg?(e=p.rotation*M,i=e-p.skewX*M,r=1e5,a=Math.cos(e)*s,o=Math.sin(e)*s,l=Math.sin(i)*-n,h=Math.cos(i)*n,p.svg&&(d+=p.xOrigin-(p.xOrigin*a+p.yOrigin*l),m+=p.yOrigin-(p.xOrigin*o+p.yOrigin*h),f=1e-6,f>d&&d>-f&&(d=0),f>m&&m>-f&&(m=0)),u=(0|a*r)/r+","+(0|o*r)/r+","+(0|l*r)/r+","+(0|h*r)/r+","+d+","+m+")",p.svg&&ve?_.setAttribute("transform","matrix("+u):c[xe]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+u):c[xe]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+s+",0,0,"+n+","+d+","+m+")",void 0):(this.setRatio=Me,Me.call(this,t),void 0)};me("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent",{parser:function(t,e,i,r,n,o,l){if(r._transform)return n;var h,u,f,p,_,c,d,m=r._transform=Ae(t,s,!0,l.parseTransform),g=t.style,v=1e-6,y=ye.length,x=l,T={};if("string"==typeof x.transform&&xe)f=X.style,f[xe]=x.transform,f.display="block",f.position="absolute",z.body.appendChild(X),h=Ae(X,null,!1),z.body.removeChild(X);else if("object"==typeof x){if(h={scaleX:re(null!=x.scaleX?x.scaleX:x.scale,m.scaleX),scaleY:re(null!=x.scaleY?x.scaleY:x.scale,m.scaleY),scaleZ:re(x.scaleZ,m.scaleZ),x:re(x.x,m.x),y:re(x.y,m.y),z:re(x.z,m.z),xPercent:re(x.xPercent,m.xPercent),yPercent:re(x.yPercent,m.yPercent),perspective:re(x.transformPerspective,m.perspective)},d=x.directionalRotation,null!=d)if("object"==typeof d)for(f in d)x[f]=d[f];else x.rotation=d;"string"==typeof x.x&&-1!==x.x.indexOf("%")&&(h.x=0,h.xPercent=re(x.x,m.xPercent)),"string"==typeof x.y&&-1!==x.y.indexOf("%")&&(h.y=0,h.yPercent=re(x.y,m.yPercent)),h.rotation=se("rotation"in x?x.rotation:"shortRotation"in x?x.shortRotation+"_short":"rotationZ"in x?x.rotationZ:m.rotation,m.rotation,"rotation",T),be&&(h.rotationX=se("rotationX"in x?x.rotationX:"shortRotationX"in x?x.shortRotationX+"_short":m.rotationX||0,m.rotationX,"rotationX",T),h.rotationY=se("rotationY"in x?x.rotationY:"shortRotationY"in x?x.shortRotationY+"_short":m.rotationY||0,m.rotationY,"rotationY",T)),h.skewX=null==x.skewX?m.skewX:se(x.skewX,m.skewX),h.skewY=null==x.skewY?m.skewY:se(x.skewY,m.skewY),(u=h.skewY-m.skewY)&&(h.skewX+=u,h.rotation+=u)}for(be&&null!=x.force3D&&(m.force3D=x.force3D,c=!0),m.skewType=x.skewType||m.skewType||a.defaultSkewType,_=m.force3D||m.z||m.rotationX||m.rotationY||h.z||h.rotationX||h.rotationY||h.perspective,_||null==x.scale||(h.scaleZ=1);--y>-1;)i=ye[y],p=h[i]-m[i],(p>v||-v>p||null!=x[i]||null!=N[i])&&(c=!0,n=new pe(m,i,m[i],p,n),i in T&&(n.e=T[i]),n.xs0=0,n.plugin=o,r._overwriteProps.push(n.n));return p=x.transformOrigin,p&&m.svg&&(Oe(t,p,h),n=new pe(m,"xOrigin",m.xOrigin,h.xOrigin-m.xOrigin,n,-1,"transformOrigin"),n.b=m.xOrigin,n.e=n.xs0=h.xOrigin,n=new pe(m,"yOrigin",m.yOrigin,h.yOrigin-m.yOrigin,n,-1,"transformOrigin"),n.b=m.yOrigin,n.e=n.xs0=h.yOrigin,p="0px 0px"),(p||be&&_&&m.zOrigin)&&(xe?(c=!0,i=we,p=(p||H(t,i,s,!1,"50% 50%"))+"",n=new pe(g,i,0,0,n,-1,"transformOrigin"),n.b=g[i],n.plugin=o,be?(f=m.zOrigin,p=p.split(" "),m.zOrigin=(p.length>2&&(0===f||"0px"!==p[2])?parseFloat(p[2]):f)||0,n.xs0=n.e=p[0]+" "+(p[1]||"50%")+" 0px",n=new pe(m,"zOrigin",0,0,n,-1,n.n),n.b=f,n.xs0=n.e=m.zOrigin):n.xs0=n.e=p):ee(p+"",m)),c&&(r._transformType=m.svg&&ve||!_&&3!==this._transformType?2:3),n},prefix:!0}),me("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),me("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,l,h,u,f,p,_,c,d,m,g,v,y,x,T,w,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(d=parseFloat(t.offsetWidth),m=parseFloat(t.offsetHeight),o=e.split(" "),l=0;b.length>l;l++)this.p.indexOf("border")&&(b[l]=V(b[l])),f=u=H(t,b[l],s,!1,"0px"),-1!==f.indexOf(" ")&&(u=f.split(" "),f=u[0],u=u[1]),p=h=o[l],_=parseFloat(f),v=f.substr((_+"").length),y="="===p.charAt(1),y?(c=parseInt(p.charAt(0)+"1",10),p=p.substr(2),c*=parseFloat(p),g=p.substr((c+"").length-(0>c?1:0))||""):(c=parseFloat(p),g=p.substr((c+"").length)),""===g&&(g=r[i]||v),g!==v&&(x=G(t,"borderLeft",_,v),T=G(t,"borderTop",_,v),"%"===g?(f=100*(x/d)+"%",u=100*(T/m)+"%"):"em"===g?(w=G(t,"borderLeft",1,"em"),f=x/w+"em",u=T/w+"em"):(f=x+"px",u=T+"px"),y&&(p=parseFloat(f)+c+g,h=parseFloat(u)+c+g)),a=_e(P,b[l],f+" "+u,p+" "+h,!1,"0px",a);return a},prefix:!0,formatter:he("0px 0px 0px 0px",!1,!0)}),me("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,r,n,a){var o,l,h,u,f,p,_="background-position",d=s||q(t,null),m=this.format((d?c?d.getPropertyValue(_+"-x")+" "+d.getPropertyValue(_+"-y"):d.getPropertyValue(_):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==m.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=H(t,"backgroundImage").replace(R,""),p&&"none"!==p)){for(o=m.split(" "),l=g.split(" "),I.setAttribute("src",p),h=2;--h>-1;)m=o[h],u=-1!==m.indexOf("%"),u!==(-1!==l[h].indexOf("%"))&&(f=0===h?t.offsetWidth-I.width:t.offsetHeight-I.height,o[h]=u?parseFloat(m)/100*f+"px":100*(parseFloat(m)/f)+"%");m=o.join(" ")}return this.parseComplex(t.style,m,g,n,a)},formatter:ee}),me("backgroundSize",{defaultValue:"0 0",formatter:ee}),me("perspective",{defaultValue:"0px",prefix:!0}),me("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),me("transformStyle",{prefix:!0}),me("backfaceVisibility",{prefix:!0}),me("userSelect",{prefix:!0}),me("margin",{parser:ue("marginTop,marginRight,marginBottom,marginLeft")}),me("padding",{parser:ue("paddingTop,paddingRight,paddingBottom,paddingLeft")}),me("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,r,n,a){var o,l,h;return 9>c?(l=t.currentStyle,h=8>c?" ":",",o="rect("+l.clipTop+h+l.clipRight+h+l.clipBottom+h+l.clipLeft+")",e=this.format(e).split(",").join(h)):(o=this.format(H(t,this.p,s,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),me("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),me("autoRound,strictUnits",{parser:function(t,e,i,r,s){return s}}),me("border",{defaultValue:"0px solid #000",parser:function(t,e,i,r,n,a){return this.parseComplex(t.style,this.format(H(t,"borderTopWidth",s,!1,"0px")+" "+H(t,"borderTopStyle",s,!1,"solid")+" "+H(t,"borderTopColor",s,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(le)||["#000"])[0]}}),me("borderWidth",{parser:ue("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),me("float,cssFloat,styleFloat",{parser:function(t,e,i,r,s){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new pe(n,a,0,0,s,-1,i,!1,0,n[a],e)}});var Ne=function(t){var e,i=this.t,r=i.filter||H(this.data,"filter")||"",s=0|this.s+this.c*t;100===s&&(-1===r.indexOf("atrix(")&&-1===r.indexOf("radient(")&&-1===r.indexOf("oader(")?(i.removeAttribute("filter"),e=!H(this.data,"filter")):(i.filter=r.replace(w,""),e=!0)),e||(this.xn1&&(i.filter=r=r||"alpha(opacity="+s+")"),-1===r.indexOf("pacity")?0===s&&this.xn1||(i.filter=r+" alpha(opacity="+s+")"):i.filter=r.replace(x,"opacity="+s))};me("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,r,n,a){var o=parseFloat(H(t,"opacity",s,!1,"1")),l=t.style,h="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),h&&1===o&&"hidden"===H(t,"visibility",s)&&0!==e&&(o=0),Y?n=new pe(l,"opacity",o,e-o,n):(n=new pe(l,"opacity",100*o,100*(e-o),n),n.xn1=h?1:0,l.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=Ne),h&&(n=new pe(l,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",r._overwriteProps.push(n.n),r._overwriteProps.push(i)),n}});var ze=function(t,e){e&&(t.removeProperty?("ms"===e.substr(0,2)&&(e="M"+e.substr(1)),t.removeProperty(e.replace(P,"-$1").toLowerCase())):t.removeAttribute(e))},Xe=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:ze(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};me("className",{parser:function(t,e,r,n,a,o,l){var h,u,f,p,_,c=t.getAttribute("class")||"",d=t.style.cssText;if(a=n._classNamePT=new pe(t,r,0,0,a,2),a.setRatio=Xe,a.pr=-11,i=!0,a.b=c,u=Z(t,s),f=t._gsClassPT){for(p={},_=f.data;_;)p[_.p]=1,_=_._next;f.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:c.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.setAttribute("class",a.e),h=$(t,u,Z(t),l,p),t.setAttribute("class",c),a.data=h.firstMPT,t.style.cssText=d,a=a.xfirst=n.parse(t,h.difs,a,o)),a}});var Ie=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,r,s,n=this.t.style,a=o.transform.parse;if("all"===this.e)n.cssText="",s=!0;else for(e=this.e.split(" ").join("").split(","),r=e.length;--r>-1;)i=e[r],o[i]&&(o[i].parse===a?s=!0:i="transformOrigin"===i?we:o[i].p),ze(n,i);s&&(ze(n,xe),this.t._gsTransform&&delete this.t._gsTransform)}};for(me("clearProps",{parser:function(t,e,r,s,n){return n=new pe(t,r,0,0,n,2),n.setRatio=Ie,n.e=e,n.pr=-10,n.data=s._tween,i=!0,n}}),l="bezier,throwProps,physicsProps,physics2D".split(","),ce=l.length;ce--;)ge(l[ce]);l=a.prototype,l._firstPT=null,l._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,h=e.autoRound,i=!1,r=e.suffixMap||a.suffixMap,s=q(t,""),n=this._overwriteProps;var l,p,c,d,m,g,v,y,x,w=t.style;if(u&&""===w.zIndex&&(l=H(t,"zIndex",s),("auto"===l||""===l)&&this._addLazySet(w,"zIndex",0)),"string"==typeof e&&(d=w.cssText,l=Z(t,s),w.cssText=d+";"+e,l=$(t,l,Z(t)).difs,!Y&&T.test(e)&&(l.opacity=parseFloat(RegExp.$1)),e=l,w.cssText=d),this._firstPT=p=this.parse(t,e,null),this._transformType){for(x=3===this._transformType,xe?f&&(u=!0,""===w.zIndex&&(v=H(t,"zIndex",s),("auto"===v||""===v)&&this._addLazySet(w,"zIndex",0)),_&&this._addLazySet(w,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(x?"visible":"hidden"))):w.zoom=1,c=p;c&&c._next;)c=c._next;y=new pe(t,"transform",0,0,null,2),this._linkCSSP(y,null,c),y.setRatio=x&&be?Me:xe?Le:De,y.data=this._transform||Ae(t,s,!0),n.pop()}if(i){for(;p;){for(g=p._next,c=d;c&&c.pr>p.pr;)c=c._next;(p._prev=c?c._prev:m)?p._prev._next=p:d=p,(p._next=c)?c._prev=p:m=p,p=g}this._firstPT=d}return!0},l.parse=function(t,e,i,n){var a,l,u,f,p,_,c,d,m,g,v=t.style;for(a in e)_=e[a],l=o[a],l?i=l.parse(t,_,a,this,i,n,e):(p=H(t,a,s)+"",m="string"==typeof _,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||m&&b.test(_)?(m||(_=oe(_),_=(_.length>3?"rgba(":"rgb(")+_.join(",")+")"),i=_e(v,a,p,_,!0,"transparent",i,0,n)):!m||-1===_.indexOf(" ")&&-1===_.indexOf(",")?(u=parseFloat(p),c=u||0===u?p.substr((u+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(u=te(t,a,s),c="px"):"left"===a||"top"===a?(u=Q(t,a,s),c="px"):(u="opacity"!==a?0:1,c="")),g=m&&"="===_.charAt(1),g?(f=parseInt(_.charAt(0)+"1",10),_=_.substr(2),f*=parseFloat(_),d=_.replace(y,"")):(f=parseFloat(_),d=m?_.substr((f+"").length)||"":""),""===d&&(d=a in r?r[a]:c),_=f||0===f?(g?f+u:f)+d:e[a],c!==d&&""!==d&&(f||0===f)&&u&&(u=G(t,a,u,c),"%"===d?(u/=G(t,a,100,"%")/100,e.strictUnits!==!0&&(p=u+"%")):"em"===d?u/=G(t,a,1,"em"):"px"!==d&&(f=G(t,a,f,d),d="px"),g&&(f||0===f)&&(_=f+u+d)),g&&(f+=u),!u&&0!==u||!f&&0!==f?void 0!==v[a]&&(_||"NaN"!=_+""&&null!=_)?(i=new pe(v,a,f||u||0,0,i,-1,a,!1,0,p,_),i.xs0="none"!==_||"display"!==a&&-1===a.indexOf("Style")?_:p):U("invalid "+a+" tween value: "+e[a]):(i=new pe(v,a,u,f-u,i,0,a,h!==!1&&("px"===d||"zIndex"===a),0,p,_),i.xs0=d)):i=_e(v,a,p,_,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);
return i},l.setRatio=function(t){var e,i,r,s=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;s;){if(e=s.c*t+s.s,s.r?e=Math.round(e):n>e&&e>-n&&(e=0),s.type)if(1===s.type)if(r=s.l,2===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2;else if(3===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3;else if(4===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3+s.xn3+s.xs4;else if(5===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3+s.xn3+s.xs4+s.xn4+s.xs5;else{for(i=s.xs0+e+s.xs1,r=1;s.l>r;r++)i+=s["xn"+r]+s["xs"+(r+1)];s.t[s.p]=i}else-1===s.type?s.t[s.p]=s.xs0:s.setRatio&&s.setRatio(t);else s.t[s.p]=e+s.xs0;s=s._next}else for(;s;)2!==s.type?s.t[s.p]=s.b:s.setRatio(t),s=s._next;else for(;s;)2!==s.type?s.t[s.p]=s.e:s.setRatio(t),s=s._next},l._enableTransforms=function(t){this._transform=this._transform||Ae(this._target,s,!0),this._transformType=this._transform.svg&&ve||!t&&3!==this._transformType?2:3};var Ee=function(){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)};l._addLazySet=function(t,e,i){var r=this._firstPT=new pe(t,e,0,0,this._firstPT,2);r.e=i,r.setRatio=Ee,r.data=this},l._linkCSSP=function(t,e,i,r){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,r=!0),i?i._next=t:r||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},l._kill=function(e){var i,r,s,n=e;if(e.autoAlpha||e.alpha){n={};for(r in e)n[r]=e[r];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(s=i.xfirst,s&&s._prev?this._linkCSSP(s._prev,i._next,s._prev._prev):s===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,s._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var Fe=function(t,e,i){var r,s,n,a;if(t.slice)for(s=t.length;--s>-1;)Fe(t[s],e,i);else for(r=t.childNodes,s=r.length;--s>-1;)n=r[s],a=n.type,n.style&&(e.push(Z(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||Fe(n,e,i)};return a.cascadeTo=function(t,i,r){var s,n,a,o=e.to(t,i,r),l=[o],h=[],u=[],f=[],p=e._internals.reservedProps;for(t=o._targets||o.target,Fe(t,h,f),o.render(i,!0),Fe(t,u),o.render(0,!0),o._enabled(!0),s=f.length;--s>-1;)if(n=$(f[s],h[s],u[s]),n.firstMPT){n=n.difs;for(a in r)p[a]&&(n[a]=r[a]);l.push(e.to(f[s],i,n))}return l},t.activate([a]),a},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t){"use strict";var e=function(){return(_gsScope.GreenSockGlobals||_gsScope)[t]};"function"==typeof define&&define.amd?define(["TweenLite"],e):"undefined"!=typeof module&&module.exports&&(require("../TweenLite.js"),module.exports=e())}("CSSPlugin");

/*!
 * VERSION: beta 0.3.3
 * DATE: 2014-10-29
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(function(t){"use strict";var e=t.GreenSockGlobals||t,i=function(t){var i,s=t.split("."),r=e;for(i=0;s.length>i;i++)r[s[i]]=r=r[s[i]]||{};return r},s=i("com.greensock.utils"),r=function(t){var e=t.nodeType,i="";if(1===e||9===e||11===e){if("string"==typeof t.textContent)return t.textContent;for(t=t.firstChild;t;t=t.nextSibling)i+=r(t)}else if(3===e||4===e)return t.nodeValue;return i},n=document,a=n.defaultView?n.defaultView.getComputedStyle:function(){},o=/([A-Z])/g,h=function(t,e,i,s){var r;return(i=i||a(t,null))?(t=i.getPropertyValue(e.replace(o,"-$1").toLowerCase()),r=t||i.length?t:i[e]):t.currentStyle&&(i=t.currentStyle,r=i[e]),s?r:parseInt(r,10)||0},l=function(t){return t.length&&t[0]&&(t[0].nodeType&&t[0].style&&!t.nodeType||t[0].length&&t[0][0])?!0:!1},_=function(t){var e,i,s,r=[],n=t.length;for(e=0;n>e;e++)if(i=t[e],l(i))for(s=i.length,s=0;i.length>s;s++)r.push(i[s]);else r.push(i);return r},u=")eefec303079ad17405c",c=/(?:<br>|<br\/>|<br \/>)/gi,p=n.all&&!n.addEventListener,f="<div style='position:relative;display:inline-block;"+(p?"*display:inline;*zoom:1;'":"'"),m=function(t){t=t||"";var e=-1!==t.indexOf("++"),i=1;return e&&(t=t.split("++").join("")),function(){return f+(t?" class='"+t+(e?i++:"")+"'>":">")}},d=s.SplitText=e.SplitText=function(t,e){if("string"==typeof t&&(t=d.selector(t)),!t)throw"cannot split a null element.";this.elements=l(t)?_(t):[t],this.chars=[],this.words=[],this.lines=[],this._originals=[],this.vars=e||{},this.split(e)},g=function(t,e,i){var s=t.nodeType;if(1===s||9===s||11===s)for(t=t.firstChild;t;t=t.nextSibling)g(t,e,i);else(3===s||4===s)&&(t.nodeValue=t.nodeValue.split(e).join(i))},v=function(t,e){for(var i=e.length;--i>-1;)t.push(e[i])},y=function(t,e,i,s,o){c.test(t.innerHTML)&&(t.innerHTML=t.innerHTML.replace(c,u));var l,_,p,f,d,y,T,w,b,x,P,S,C,k,R=r(t),A=e.type||e.split||"chars,words,lines",O=-1!==A.indexOf("lines")?[]:null,D=-1!==A.indexOf("words"),M=-1!==A.indexOf("chars"),L="absolute"===e.position||e.absolute===!0,z=L?"&#173; ":" ",I=-999,E=a(t),N=h(t,"paddingLeft",E),F=h(t,"borderBottomWidth",E)+h(t,"borderTopWidth",E),X=h(t,"borderLeftWidth",E)+h(t,"borderRightWidth",E),U=h(t,"paddingTop",E)+h(t,"paddingBottom",E),B=h(t,"paddingLeft",E)+h(t,"paddingRight",E),j=h(t,"textAlign",E,!0),Y=t.clientHeight,q=t.clientWidth,G="</div>",V=m(e.wordsClass),Q=m(e.charsClass),W=-1!==(e.linesClass||"").indexOf("++"),H=e.linesClass,Z=-1!==R.indexOf("<"),$=!0,K=[],J=[],te=[];for(W&&(H=H.split("++").join("")),Z&&(R=R.split("<").join("{{LT}}")),l=R.length,f=V(),d=0;l>d;d++)if(T=R.charAt(d),")"===T&&R.substr(d,20)===u)f+=($?G:"")+"<BR/>",$=!1,d!==l-20&&R.substr(d+20,20)!==u&&(f+=" "+V(),$=!0),d+=19;else if(" "===T&&" "!==R.charAt(d-1)&&d!==l-1&&R.substr(d-20,20)!==u){for(f+=$?G:"",$=!1;" "===R.charAt(d+1);)f+=z,d++;(")"!==R.charAt(d+1)||R.substr(d+1,20)!==u)&&(f+=z+V(),$=!0)}else f+=M&&" "!==T?Q()+T+"</div>":T;for(t.innerHTML=f+($?G:""),Z&&g(t,"{{LT}}","<"),y=t.getElementsByTagName("*"),l=y.length,w=[],d=0;l>d;d++)w[d]=y[d];if(O||L)for(d=0;l>d;d++)b=w[d],p=b.parentNode===t,(p||L||M&&!D)&&(x=b.offsetTop,O&&p&&x!==I&&"BR"!==b.nodeName&&(_=[],O.push(_),I=x),L&&(b._x=b.offsetLeft,b._y=x,b._w=b.offsetWidth,b._h=b.offsetHeight),O&&(D!==p&&M||(_.push(b),b._x-=N),p&&d&&(w[d-1]._wordEnd=!0),"BR"===b.nodeName&&b.nextSibling&&"BR"===b.nextSibling.nodeName&&O.push([])));for(d=0;l>d;d++)b=w[d],p=b.parentNode===t,"BR"!==b.nodeName?(L&&(S=b.style,D||p||(b._x+=b.parentNode._x,b._y+=b.parentNode._y),S.left=b._x+"px",S.top=b._y+"px",S.position="absolute",S.display="block",S.width=b._w+1+"px",S.height=b._h+"px"),D?p&&""!==b.innerHTML?J.push(b):M&&K.push(b):p?(t.removeChild(b),w.splice(d--,1),l--):!p&&M&&(x=!O&&!L&&b.nextSibling,t.appendChild(b),x||t.appendChild(n.createTextNode(" ")),K.push(b))):O||L?(t.removeChild(b),w.splice(d--,1),l--):D||t.appendChild(b);if(O){for(L&&(P=n.createElement("div"),t.appendChild(P),C=P.offsetWidth+"px",x=P.offsetParent===t?0:t.offsetLeft,t.removeChild(P)),S=t.style.cssText,t.style.cssText="display:none;";t.firstChild;)t.removeChild(t.firstChild);for(k=!L||!D&&!M,d=0;O.length>d;d++){for(_=O[d],P=n.createElement("div"),P.style.cssText="display:block;text-align:"+j+";position:"+(L?"absolute;":"relative;"),H&&(P.className=H+(W?d+1:"")),te.push(P),l=_.length,y=0;l>y;y++)"BR"!==_[y].nodeName&&(b=_[y],P.appendChild(b),k&&(b._wordEnd||D)&&P.appendChild(n.createTextNode(" ")),L&&(0===y&&(P.style.top=b._y+"px",P.style.left=N+x+"px"),b.style.top="0px",x&&(b.style.left=b._x-x+"px")));0===l&&(P.innerHTML="&nbsp;"),D||M||(P.innerHTML=r(P).split(String.fromCharCode(160)).join(" ")),L&&(P.style.width=C,P.style.height=b._h+"px"),t.appendChild(P)}t.style.cssText=S}L&&(Y>t.clientHeight&&(t.style.height=Y-U+"px",Y>t.clientHeight&&(t.style.height=Y+F+"px")),q>t.clientWidth&&(t.style.width=q-B+"px",q>t.clientWidth&&(t.style.width=q+X+"px"))),v(i,K),v(s,J),v(o,te)},T=d.prototype;T.split=function(t){this.isSplit&&this.revert(),this.vars=t||this.vars,this._originals.length=this.chars.length=this.words.length=this.lines.length=0;for(var e=this.elements.length;--e>-1;)this._originals[e]=this.elements[e].innerHTML,y(this.elements[e],this.vars,this.chars,this.words,this.lines);return this.chars.reverse(),this.words.reverse(),this.lines.reverse(),this.isSplit=!0,this},T.revert=function(){if(!this._originals)throw"revert() call wasn't scoped properly.";for(var t=this._originals.length;--t>-1;)this.elements[t].innerHTML=this._originals[t];return this.chars=[],this.words=[],this.lines=[],this.isSplit=!1,this},d.selector=t.$||t.jQuery||function(e){var i=t.$||t.jQuery;return i?(d.selector=i,i(e)):"undefined"==typeof document?e:document.querySelectorAll?document.querySelectorAll(e):document.getElementById("#"===e.charAt(0)?e.substr(1):e)},d.version="0.3.3"})(_gsScope),function(t){"use strict";var e=function(){return(_gsScope.GreenSockGlobals||_gsScope)[t]};"function"==typeof define&&define.amd?define(["TweenLite"],e):"undefined"!=typeof module&&module.exports&&(module.exports=e())}("SplitText");


try{
	window.GreenSockGlobals = null;
	window._gsQueue = null;
	window._gsDefine = null;

	delete(window.GreenSockGlobals);
	delete(window._gsQueue);
	delete(window._gsDefine);	
   } catch(e) {}

try{
	window.GreenSockGlobals = oldgs;
	window._gsQueue = oldgs_queue;
	} catch(e) {}

if (window.tplogs==true)
	try {
		console.groupEnd();
	} catch(e) {}





(function(e,t){
		e.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage"]};e.expr[":"].uncached=function(t){var n=document.createElement("img");n.src=t.src;return e(t).is('img[src!=""]')&&!n.complete};e.fn.waitForImages=function(t,n,r){if(e.isPlainObject(arguments[0])){n=t.each;r=t.waitForAll;t=t.finished}t=t||e.noop;n=n||e.noop;r=!!r;if(!e.isFunction(t)||!e.isFunction(n)){throw new TypeError("An invalid callback was supplied.")}return this.each(function(){var i=e(this),s=[];if(r){var o=e.waitForImages.hasImageProperties||[],u=/url\((['"]?)(.*?)\1\)/g;i.find("*").each(function(){var t=e(this);if(t.is("img:uncached")){s.push({src:t.attr("src"),element:t[0]})}e.each(o,function(e,n){var r=t.css(n);if(!r){return true}var i;while(i=u.exec(r)){s.push({src:i[2],element:t[0]})}})})}else{i.find("img:uncached").each(function(){s.push({src:this.src,element:this})})}var f=s.length,l=0;if(f==0){t.call(i[0])}e.each(s,function(r,s){var o=new Image;e(o).bind("load error",function(e){l++;n.call(s.element,l,f,e.type=="load");if(l==f){t.call(i[0]);return false}});o.src=s.src})})};		
})(jQuery)

/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for Revolution Slider
 * @version: 4.6.4 (26.11.2014)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
**************************************************************************/


(function(jQuery,undefined){




	////////////////////////////////////////
	// THE REVOLUTION PLUGIN STARTS HERE //
	///////////////////////////////////////

	jQuery.fn.extend({

		// OUR PLUGIN HERE :)
		revolution: function(options) {



				////////////////////////////////
				// SET DEFAULT VALUES OF ITEM //
				////////////////////////////////
				var defaults = {
					delay:9000,
					startheight:500,
					startwidth:960,
					fullScreenAlignForce:"off",
					autoHeight:"off",
					hideTimerBar:"off",
					hideThumbs:200,
					hideNavDelayOnMobile:1500,

					thumbWidth:100,							// Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
					thumbHeight:50,
					thumbAmount:3,

					navigationType:"bullet",				// bullet, thumb, none
					navigationArrows:"solo",				// nextto, solo, none
					navigationInGrid:"off",					// on/off

					hideThumbsOnMobile:"off",
					hideBulletsOnMobile:"off",
					hideArrowsOnMobile:"off",
					hideThumbsUnderResoluition:0,

					navigationStyle:"round",				// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item),

					navigationHAlign:"center",				// Vertical Align top,center,bottom
					navigationVAlign:"bottom",				// Horizontal Align left,center,right
					navigationHOffset:0,
					navigationVOffset:20,

					soloArrowLeftHalign:"left",
					soloArrowLeftValign:"center",
					soloArrowLeftHOffset:20,
					soloArrowLeftVOffset:0,

					soloArrowRightHalign:"right",
					soloArrowRightValign:"center",
					soloArrowRightHOffset:20,
					soloArrowRightVOffset:0,

					keyboardNavigation:"on",

					touchenabled:"on",						// Enable Swipe Function : on/off
					onHoverStop:"on",						// Stop Banner Timet at Hover on Slide on/off


					stopAtSlide:-1,							// Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
					stopAfterLoops:-1,						// Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

					hideCaptionAtLimit:0,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
					hideAllCaptionAtLimit:0,				// Hide all The Captions if Width of Browser is less then this value
					hideSliderAtLimit:0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value

					shadow:0,								//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
					fullWidth:"off",						// Turns On or Off the Fullwidth Image Centering in FullWidth Modus
					fullScreen:"off",
					minFullScreenHeight:0,					// The Minimum FullScreen Height
					fullScreenOffsetContainer:"",			// Size for FullScreen Slider minimising Calculated on the Container sizes
					fullScreenOffset:"0",					// Size for FullScreen Slider minimising
					dottedOverlay:"none",					//twoxtwo, threexthree, twoxtwowhite, threexthreewhite

					forceFullWidth:"off",						// Force The FullWidth

					spinner:"spinner0",

					swipe_treshold : 75,					// The number of pixels that the user must move their finger by before it is considered a swipe.
					swipe_min_touches : 1,					// Min Finger (touch) used for swipe
					drag_block_vertical:false,				// Prevent Vertical Scroll during Swipe
					isJoomla:false,
					parallax:"off",
					parallaxLevels: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85],
					parallaxBgFreeze: "off",
					parallaxOpacity:"on",
					parallaxDisableOnMobile:"off",
					panZoomDisableOnMobile:"off",
					simplifyAll:"on",
					minHeight:0,
					nextSlideOnWindowFocus:"off",

					startDelay:0		// Delay before the first Animation starts.


				};

					options = jQuery.extend({}, defaults, options);

					return this.each(function() {


						// REPORT SOME IMPORTAN INFORMATION ABOUT THE SLIDER
						if (window.tplogs==true)
						 try{
								console.groupCollapsed("Slider Revolution 4.6.3 Initialisation on "+jQuery(this).attr('id'));
								console.groupCollapsed("Used Options:");
								console.info(options);
								console.groupEnd();
								console.groupCollapsed("Tween Engine:")
							} catch(e) {}

						// CHECK IF TweenLite IS LOADED AT ALL
						if (punchgs.TweenLite==undefined) {
						   if (window.tplogs==true)
						    try{ console.error("GreenSock Engine Does not Exist!");
						    } catch(e) {}
							return false;
						}

						punchgs.force3D = true;

						if (window.tplogs==true)
							try{ console.info("GreenSock Engine Version in Slider Revolution:"+punchgs.TweenLite.version);
							} catch(e) {

							}

						if (options.simplifyAll=="on") {

						} else {
							punchgs.TweenLite.lagSmoothing(1000,16);
							punchgs.force3D = "true";
						}

						if (window.tplogs==true)
							try{
								console.groupEnd();
								console.groupEnd();
							} catch(e) {}


						initSlider(jQuery(this),options)


					})
				},


		// METHODE PAUSE
		revscroll: function(oy) {
					return this.each(function() {
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0)
							jQuery('body,html').animate({scrollTop:(container.offset().top+(container.find('>ul >li').height())-oy)+"px"},{duration:400});
					})
				},

		// METHODE PAUSE
		revredraw: function(oy) {
					return this.each(function() {
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {
							var bt = container.parent().find('.tp-bannertimer');
							var opt = bt.data('opt');
							containerResized(container,opt);
						}
					})
				},
		// METHODE PAUSE
		revkill: function(oy) {

						var self = this,
							container=jQuery(this);

						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {

							container.data('conthover',1);
							container.data('conthover-changed',1);
							container.trigger('revolution.slide.onpause');
							var bt = container.parent().find('.tp-bannertimer');
							var opt = bt.data('opt');
							opt.bannertimeronpause = true;
							container.trigger('stoptimer');

							punchgs.TweenLite.killTweensOf(container.find('*'),false);
							punchgs.TweenLite.killTweensOf(container,false);
							container.unbind('hover, mouseover, mouseenter,mouseleave, resize');
							var resizid = "resize.revslider-"+container.attr('id');
							jQuery(window).off(resizid);
							container.find('*').each(function() {
									var el = jQuery(this);

									el.unbind('on, hover, mouseenter,mouseleave,mouseover, resize,restarttimer, stoptimer');
									el.off('on, hover, mouseenter,mouseleave,mouseover, resize');
									el.data('mySplitText',null);
									el.data('ctl',null);
									if (el.data('tween')!=undefined)
										el.data('tween').kill();
									if (el.data('kenburn')!=undefined)
										el.data('kenburn').kill();
									el.remove();
									el.empty();
									el=null;
							})


							punchgs.TweenLite.killTweensOf(container.find('*'),false);
							punchgs.TweenLite.killTweensOf(container,false);
							bt.remove();
							try{container.closest('.forcefullwidth_wrapper_tp_banner').remove();} catch(e) {}
							try{container.closest('.rev_slider_wrapper').remove()} catch(e) {}
							try{container.remove();} catch(e) {}
							container.empty();
							container.html();
							container = null;

							opt = null;
							delete(self.container);
							delete(self.opt);

							return true;
						} else {
							return false;
						}


				},

		// METHODE PAUSE
		revpause: function(options) {

					return this.each(function() {
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {
							container.data('conthover',1);
							container.data('conthover-changed',1);
							container.trigger('revolution.slide.onpause');
							var bt = container.parent().find('.tp-bannertimer');
							var opt = bt.data('opt');
							opt.bannertimeronpause = true;
							container.trigger('stoptimer');
						}
					})


				},

		// METHODE RESUME
		revresume: function(options) {
					return this.each(function() {
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {
							container.data('conthover',0);
							container.data('conthover-changed',1);
							container.trigger('revolution.slide.onresume');
							var bt = container.parent().find('.tp-bannertimer');
							var opt = bt.data('opt');
							opt.bannertimeronpause = false;
							container.trigger('starttimer');
						}
					})

				},

		// METHODE NEXT
		revnext: function(options) {
					return this.each(function() {

						// CATCH THE CONTAINER
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0)
							container.parent().find('.tp-rightarrow').click();


					})

				},

		// METHODE RESUME
		revprev: function(options) {
					return this.each(function() {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0)
							container.parent().find('.tp-leftarrow').click();
					})

				},

		// METHODE LENGTH
		revmaxslide: function(options) {
						// CATCH THE CONTAINER
						return jQuery(this).find('>ul:first-child >li').length;
				},


		// METHODE CURRENT
		revcurrentslide: function(options) {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {
							var bt = container.parent().find('.tp-bannertimer');
							var opt = bt.data('opt');
							return opt.act;
						}
				},

		// METHODE CURRENT
		revlastslide: function(options) {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {
							var bt = container.parent().find('.tp-bannertimer');
							var opt = bt.data('opt');
							return opt.lastslide;
						}
				},


		// METHODE JUMP TO SLIDE
		revshowslide: function(slide) {
					return this.each(function() {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						if (container!=undefined && container.length>0 && jQuery('body').find('#'+container.attr('id')).length>0) {
							container.data('showus',slide);
							container.parent().find('.tp-rightarrow').click();
						}
					})

				}


})
		/*******************************************
			-	IS IOS VERSION OLDER THAN 5 ??	-
		*******************************************/

		function iOSVersion() {
			var oldios = false;
			if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
		        if (navigator.userAgent.match(/OS 4_\d like Mac OS X/i)) {
		        	oldios = true;
				}
		    } else {
				   oldios = false;
		    }
			return oldios;
		}

		function initSlider(container,opt) {
						if (container==undefined) return false;

						if (container.data('aimg')!=undefined) {
							if ((container.data('aie8')=="enabled" && isIE(8)) || (container.data('amobile')=="enabled" && is_mobile()))
								container.html('<img class="tp-slider-alternative-image" src="'+container.data("aimg")+'">');
						}
						// PREPARE FALL BACK SETTINGS
						if (opt.navigationStyle=="preview1" ||  opt.navigationStyle=="preview3" || opt.navigationStyle=="preview4") {
									opt.soloArrowLeftHalign="left";
									opt.soloArrowLeftValign="center";
									opt.soloArrowLeftHOffset=0;
									opt.soloArrowLeftVOffset=0;
									opt.soloArrowRightHalign="right";
									opt.soloArrowRightValign="center";
									opt.soloArrowRightHOffset=0;
									opt.soloArrowRightVOffset=0;
									opt.navigationArrows="solo";
						}


						// SIMPLIFY ANIMATIONS ON OLD IOS AND IE8 IF NEEDED
						if (opt.simplifyAll=="on" && (isIE(8) || iOSVersion())) {
							container.find('.tp-caption').each(function() {
								var tc = jQuery(this);
								tc.removeClass("customin").removeClass("customout").addClass("fadein").addClass("fadeout");
								tc.data('splitin',"");
								tc.data('speed',400);
							})
							container.find('>ul>li').each(function() {
								var li= jQuery(this);
								li.data('transition',"fade");
								li.data('masterspeed',500);
								li.data('slotamount',1);
								var img = li.find('>img').first();
								img.data('kenburns',"off");
							});
						}





						opt.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);

						if (opt.fullWidth!="on" && opt.fullScreen!="on") opt.autoHeight = "off";
						if (opt.fullScreen=="on") opt.autoHeight = "on";
						if (opt.fullWidth!="on" && opt.fullScreen!="on") forceFulWidth="off";

						if (opt.fullWidth=="on" && opt.autoHeight=="off")
							container.css({maxHeight:opt.startheight+"px"});

						if (is_mobile() && opt.hideThumbsOnMobile=="on" && opt.navigationType=="thumb")
						   opt.navigationType = "none"

						if (is_mobile() && opt.hideBulletsOnMobile=="on" && opt.navigationType=="bullet")
						   opt.navigationType = "none"

						if (is_mobile() && opt.hideBulletsOnMobile=="on" && opt.navigationType=="both")
						   opt.navigationType = "none"

						if (is_mobile() && opt.hideArrowsOnMobile=="on")
						   opt.navigationArrows = "none"

						if (opt.forceFullWidth=="on" && container.closest('.forcefullwidth_wrapper_tp_banner').length==0) {

							var loff = container.parent().offset().left;
							var mb = container.parent().css('marginBottom');
							var mt = container.parent().css('marginTop');
							if (mb==undefined) mb=0;
							if (mt==undefined) mt=0;

							container.parent().wrap('<div style="position:relative;width:100%;height:auto;margin-top:'+mt+';margin-bottom:'+mb+'" class="forcefullwidth_wrapper_tp_banner"></div>');
							container.closest('.forcefullwidth_wrapper_tp_banner').append('<div class="tp-fullwidth-forcer" style="width:100%;height:'+container.height()+'px"></div>');
							container.css({'backgroundColor':container.parent().css('backgroundColor'),'backgroundImage':container.parent().css('backgroundImage')});
							//container.parent().css({'position':'absolute','width':jQuery(window).width()});
							container.parent().css({'left':(0-loff)+"px",position:'absolute','width':jQuery(window).width()});
							opt.width=jQuery(window).width();
						}

						// HIDE THUMBS UNDER RESOLUTION
						try{
							if (opt.hideThumbsUnderResolution>jQuery(window).width() && opt.hideThumbsUnderResolution!=0) {
								container.parent().find('.tp-bullets.tp-thumbs').css({display:"none"});
							} else {
								container.parent().find('.tp-bullets.tp-thumbs').css({display:"block"});
							}
						} catch(e) {}

						if (!container.hasClass("revslider-initialised")) {

									container.addClass("revslider-initialised");
									if (container.attr('id')==undefined) container.attr('id',"revslider-"+Math.round(Math.random()*1000+5));

									// CHECK IF FIREFOX 13 IS ON WAY.. IT HAS A STRANGE BUG, CSS ANIMATE SHOULD NOT BE USED



									opt.firefox13 = false;
									opt.ie = !jQuery.support.opacity;
									opt.ie9 = (document.documentMode == 9);

									opt.origcd=opt.delay;

									// CHECK THE jQUERY VERSION
									var version = jQuery.fn.jquery.split('.'),
										versionTop = parseFloat(version[0]),
										versionMinor = parseFloat(version[1]),
										versionIncrement = parseFloat(version[2] || '0');

									if (versionTop==1 && versionMinor < 7) {
										container.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:'+version+' <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>');
									}

									if (versionTop>1) opt.ie=false;


									// Delegate .transition() calls to .animate()
									// if the browser can't do CSS transitions.
									if (!jQuery.support.transition)
										jQuery.fn.transition = jQuery.fn.animate;

									// CATCH THE CONTAINER


									 // LOAD THE YOUTUBE API IF NECESSARY

									container.find('.caption').each(function() { jQuery(this).addClass('tp-caption')});

									if (is_mobile()) {
										container.find('.tp-caption').each(function() {
											var nextcaption = jQuery(this);
											if (nextcaption.data('autoplayonlyfirsttime') == true || nextcaption.data('autoplayonlyfirsttime')=="true")
													nextcaption.data('autoplayonlyfirsttime',"false");
											if (nextcaption.data('autoplay')==true || nextcaption.data('autoplay')=="true")
												 nextcaption.data('autoplay',false);

										})
									}


									var addedyt=0;
									var addedvim=0;
									var addedvid=0;
									var httpprefix = "http";

									if (location.protocol === 'https:') {
											httpprefix = "https";
									}
									container.find('.tp-caption').each(function(i) {
										// IF SRC EXIST, RESET SRC'S since WE DONT NEED THEM !!

										try {

												if ((jQuery(this).data('ytid')!=undefined  || jQuery(this).find('iframe').attr('src').toLowerCase().indexOf('youtube')>0) && addedyt==0) {
													addedyt=1;
													var s = document.createElement("script");
													var httpprefix2 = "https";
													s.src = httpprefix2+"://www.youtube.com/iframe_api"; /* Load Player API*/

													var before = document.getElementsByTagName("script")[0];
													var loadit = true;
													jQuery('head').find('*').each(function(){
														if (jQuery(this).attr('src') == httpprefix2+"://www.youtube.com/iframe_api")
														   loadit = false;
													});
													if (loadit) {
														before.parentNode.insertBefore(s, before);


													}
												}
											} catch(e) {}

										try{
											   if ((jQuery(this).data('vimeoid')!=undefined || jQuery(this).find('iframe').attr('src').toLowerCase().indexOf('vimeo')>0) && addedvim==0) {
													addedvim=1;
													var f = document.createElement("script");
													f.src = httpprefix+"://a.vimeocdn.com/js/froogaloop2.min.js"; /* Load Player API*/
													var before = document.getElementsByTagName("script")[0];

													var loadit = true;
													jQuery('head').find('*').each(function(){
														if (jQuery(this).attr('src') == httpprefix+"://a.vimeocdn.com/js/froogaloop2.min.js")
														   loadit = false;
													});
													if (loadit)
														before.parentNode.insertBefore(f, before);
												}
											} catch(e) {}

										try{
											if ((jQuery(this).data('videomp4')!=undefined || jQuery(this).data('videowebm')!=undefined))  {

											}
										} catch(e) {}
									});




									// REMOVE ANY VIDEO JS SETTINGS OF THE VIDEO  IF NEEDED
									container.find('.tp-caption video').each(function(i) {
										jQuery(this).removeClass("video-js").removeClass("vjs-default-skin");
										jQuery(this).attr("preload","");
										jQuery(this).css({display:"none"});
									});

									container.find('>ul:first-child >li').each(function() {
											var t = jQuery(this);
											t.data('origindex',t.index());
										})

									// SHUFFLE MODE
									if (opt.shuffle=="on") {
										var fsa = new Object,
											fli = container.find('>ul:first-child >li:first-child')

										fsa.fstransition = fli.data('fstransition');
										fsa.fsmasterspeed = fli.data('fsmasterspeed');
										fsa.fsslotamount = fli.data('fsslotamount');



										for (var u=0;u<container.find('>ul:first-child >li').length;u++) {
											var it = Math.round(Math.random()*container.find('>ul:first-child >li').length);
											container.find('>ul:first-child >li:eq('+it+')').prependTo(container.find('>ul:first-child'));
										}

										var newfli = container.find('>ul:first-child >li:first-child');
										 newfli.data('fstransition',fsa.fstransition);
										 newfli.data('fsmasterspeed',fsa.fsmasterspeed);
										 newfli.data('fsslotamount',fsa.fsslotamount);
									}


									// CREATE SOME DEFAULT OPTIONS FOR LATER
									opt.slots=4;
									opt.act=-1;
									opt.next=0;

									// IF START SLIDE IS SET
									if (opt.startWithSlide !=undefined) opt.next=opt.startWithSlide;

									// IF DEEPLINK HAS BEEN SET
									var deeplink = getUrlVars("#")[0];
									if (deeplink.length<9) {
										if (deeplink.split('slide').length>1) {
											var dslide=parseInt(deeplink.split('slide')[1],0);
											if (dslide<1) dslide=1;
											if (dslide>container.find('>ul:first >li').length) dslide=container.find('>ul:first >li').length;
											opt.next=dslide-1;
										}
									}


									opt.firststart=1;

									// BASIC OFFSET POSITIONS OF THE BULLETS
									if (opt.navigationHOffset==undefined) opt.navOffsetHorizontal=0;
									if (opt.navigationVOffset==undefined) opt.navOffsetVertical=0;



									container.append('<div class="tp-loader '+opt.spinner+'">'+
												  		'<div class="dot1"></div>'+
												  	    '<div class="dot2"></div>'+
												  	    '<div class="bounce1"></div>'+
														'<div class="bounce2"></div>'+
														'<div class="bounce3"></div>'+
													 '</div>');

									// RESET THE TIMER
									if (container.find('.tp-bannertimer').length==0) container.append('<div class="tp-bannertimer" style="visibility:hidden"></div>');
									var bt=container.find('.tp-bannertimer');
									if (bt.length>0) {
										bt.css({'width':'0%'});
									};


									// WE NEED TO ADD A BASIC CLASS FOR SETTINGS.CSS
									container.addClass("tp-simpleresponsive");
									opt.container=container;

									//if (container.height()==0) container.height(opt.startheight);

									// AMOUNT OF THE SLIDES
									opt.slideamount = container.find('>ul:first >li').length;


									// A BASIC GRID MUST BE DEFINED. IF NO DEFAULT GRID EXIST THAN WE NEED A DEFAULT VALUE, ACTUAL SIZE OF CONAINER
									if (container.height()==0) container.height(opt.startheight);
									if (opt.startwidth==undefined || opt.startwidth==0) opt.startwidth=container.width();
									if (opt.startheight==undefined || opt.startheight==0) opt.startheight=container.height();

									// OPT WIDTH && HEIGHT SHOULD BE SET
									opt.width=container.width();
									opt.height=container.height();


									// DEFAULT DEPENDECIES
									opt.bw= opt.startwidth / container.width();
									opt.bh = opt.startheight / container.height();

									// IF THE ITEM ALREADY IN A RESIZED FORM
									if (opt.width!=opt.startwidth) {

										opt.height = Math.round(opt.startheight * (opt.width/opt.startwidth));

										container.height(opt.height);

									}

									// LETS SEE IF THERE IS ANY SHADOW
									if (opt.shadow!=0) {
										container.parent().append('<div class="tp-bannershadow tp-shadow'+opt.shadow+'"></div>');
										var loff=0;
										if (opt.forceFullWidth=="on")
													loff = 0-opt.container.parent().offset().left;
										container.parent().find('.tp-bannershadow').css({'width':opt.width,'left':loff});
									}


									container.find('ul').css({'display':'none'});

									var fliparent = container;


									// PREPARE THE SLIDES
									container.find('ul').css({'display':'block'});
									prepareSlides(container,opt);
									if (opt.parallax!="off") checkForParallax(container,opt);

									// CREATE BULLETS
									if (opt.slideamount >1) createBullets(container,opt);

									if (opt.slideamount >1 && opt.navigationType=="thumb") createThumbs(container,opt);
									if (opt.slideamount >1) createArrows(container,opt);
									if (opt.keyboardNavigation=="on") createKeyboard(container,opt);


									swipeAction(container,opt);


									if (opt.hideThumbs>0) hideThumbs(container,opt);
									setTimeout(function() {
										swapSlide(container,opt);
									},opt.startDelay);
									opt.startDelay=0;
									// START COUNTDOWN
									if (opt.slideamount >1) countDown(container,opt);
									setTimeout(function() {
										container.trigger('revolution.slide.onloaded');
									},500);



									/******************************
										-	FULLSCREEN CHANGE	-
									********************************/
									// FULLSCREEN MODE TESTING
									jQuery("body").data('rs-fullScreenMode',false);
									jQuery(window).on ('mozfullscreenchange webkitfullscreenchange fullscreenchange',function(){
									     jQuery("body").data('rs-fullScreenMode',!jQuery("body").data('rs-fullScreenMode'));
									     if (jQuery("body").data('rs-fullScreenMode')) {
										     setTimeout(function() {
										     	jQuery(window).trigger("resize");

										     },200);
									     }
									})


									var resizid = "resize.revslider-"+container.attr('id');

									// IF RESIZED, NEED TO STOP ACTUAL TRANSITION AND RESIZE ACTUAL IMAGES
									jQuery(window).on(resizid,function() {
										if (container==undefined) return false;
										if (jQuery('body').find(container)!=0)
											if (opt.forceFullWidth=="on" ) {

												var loff = opt.container.closest('.forcefullwidth_wrapper_tp_banner').offset().left;
												//opt.container.parent().css({'width':jQuery(window).width()});
												opt.container.parent().css({'left':(0-loff)+"px",'width':jQuery(window).width()});
											}

											if (container.outerWidth(true)!=opt.width || container.is(":hidden")) {
													containerResized(container,opt);
											}




									});

									// HIDE THUMBS UNDER SIZE...
									try{
										if (opt.hideThumbsUnderResoluition!=0 && opt.navigationType=="thumb") {
											if (opt.hideThumbsUnderResoluition>jQuery(window).width())
												jQuery('.tp-bullets').css({display:"none"});
											 else
											 	jQuery('.tp-bullets').css({display:"block"});
										}
									} catch(e) {}



									// CHECK IF THE CAPTION IS A "SCROLL ME TO POSITION" CAPTION IS
									//if (opt.fullScreen=="on") {
										container.find('.tp-scrollbelowslider').on('click',function() {
												var off=0;
												try{
												 	off = jQuery('body').find(opt.fullScreenOffsetContainer).height();
												 } catch(e) {}
												try{
												 	off = off - parseInt(jQuery(this).data('scrolloffset'),0);
												 } catch(e) {}


												jQuery('body,html').animate(
													{scrollTop:(container.offset().top+(container.find('>ul >li').height())-off)+"px"},{duration:400});
											});
									//}


									// FIRST TIME STOP/START HIDE / SHOW SLIDER
									//REMOVE AND SHOW SLIDER ON DEMAND
									var contpar= container.parent();
									if (jQuery(window).width()<opt.hideSliderAtLimit) {
										container.trigger('stoptimer');
										if (contpar.css('display')!="none")
											contpar.data('olddisplay',contpar.css('display'));
										contpar.css({display:"none"});
									}

									tabBlurringCheck(container,opt);

						}

	}



/******************************
	-	MODULES	-
********************************/


		/////////////////////////////////////////
		// main visibility API function
		// check if current tab is active or not
		var vis = (function(){
		    var stateKey,
		        eventKey,
		        keys = {
		                hidden: "visibilitychange",
		                webkitHidden: "webkitvisibilitychange",
		                mozHidden: "mozvisibilitychange",
		                msHidden: "msvisibilitychange"
		    };
		    for (stateKey in keys) {
		        if (stateKey in document) {
		            eventKey = keys[stateKey];
		            break;
		        }
		    }
		    return function(c) {
		        if (c) document.addEventListener(eventKey, c);
		        return !document[stateKey];
		    }
		})();

		var tabBlurringCheck = function(container,opt) {

			var notIE = (document.documentMode === undefined),
			    isChromium = window.chrome;

			if (notIE && !isChromium) {

			    // checks for Firefox and other  NON IE Chrome versions
			    jQuery(window).on("focusin", function () {
					if (container==undefined) return false;

			        setTimeout(function(){
			            // TAB IS ACTIVE, WE CAN START ANY PART OF THE SLIDER
			            if (opt.nextSlideOnWindowFocus=="on") container.revnext();
			            container.revredraw();
			        },300);

			    }).on("focusout", function () {
					// TAB IS NOT ACTIVE, WE CAN STOP ANY PART OF THE SLIDER
			    });

			} else {

			    // checks for IE and Chromium versions
			    if (window.addEventListener) {

			        // bind focus event
			        window.addEventListener("focus", function (event) {
						if (container==undefined) return false;
			            setTimeout(function(){
			                 // TAB IS ACTIVE, WE CAN START ANY PART OF THE SLIDER
				            if (opt.nextSlideOnWindowFocus=="on") container.revnext();
							container.revredraw();
			            },300);

			        }, false);

			        // bind blur event
			        window.addEventListener("blur", function (event) {
						// TAB IS NOT ACTIVE, WE CAN STOP ANY PART OF THE SLIDER
			        }, false);

			    } else {

			        // bind focus event
			        window.attachEvent("focus", function (event) {

			            setTimeout(function(){
							if (container==undefined) return false;
							// TAB IS ACTIVE, WE CAN START ANY PART OF THE SLIDER
				            if (opt.nextSlideOnWindowFocus=="on") container.revnext();
							container.revredraw();
				         },300);

			        });

			        // bind focus event
			        window.attachEvent("blur", function (event) {
						// TAB IS NOT ACTIVE, WE CAN STOP ANY PART OF THE SLIDER
			        });
			    }
			}
		}

		///////////////////////////
		// GET THE URL PARAMETER //
		///////////////////////////
		var getUrlVars = function (hashdivider)
			{
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf(hashdivider) + 1).split('_');
				for(var i = 0; i < hashes.length; i++)
				{
					hashes[i] = hashes[i].replace('%3D',"=");
					hash = hashes[i].split('=');
					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				return vars;
			}

		//////////////////////////
		//	CONTAINER RESIZED	//
		/////////////////////////
		var containerResized = function (container,opt) {

			if (container==undefined) return false;
			// HIDE THUMBS UNDER SIZE...
			try{
				if (opt.hideThumbsUnderResoluition!=0 && opt.navigationType=="thumb") {
					if (opt.hideThumbsUnderResoluition>jQuery(window).width())
						jQuery('.tp-bullets').css({display:"none"});
					 else
					 	jQuery('.tp-bullets').css({display:"block"});
				}
			} catch(e) {}



			container.find('.defaultimg').each(function(i) {
					setSize(jQuery(this),opt);
			});


			//REMOVE AND SHOW SLIDER ON DEMAND
			var contpar= container.parent();
			if (jQuery(window).width()<opt.hideSliderAtLimit) {
				container.trigger('stoptimer');
				if (contpar.css('display')!="none")
					contpar.data('olddisplay',contpar.css('display'));
				contpar.css({display:"none"});

			} else {

				if (container.is(":hidden")) {
					if (contpar.data('olddisplay')!=undefined && contpar.data('olddisplay')!="undefined" && contpar.data('olddisplay') != "none")
						contpar.css({display:contpar.data('olddisplay')});
					else
						contpar.css({display:"block"});
					container.trigger('restarttimer');
					setTimeout(function() {
						containerResized(container,opt);
					},150)
				}
			}


			var loff=0;
			if (opt.forceFullWidth=="on")
						loff = 0-opt.container.parent().offset().left;
			try{
				container.parent().find('.tp-bannershadow').css({'width':opt.width,'left':loff});
			} catch(e) {}

			var actsh = container.find('>ul >li:eq('+opt.act+') .slotholder');
			var nextsh = container.find('>ul >li:eq('+opt.next+') .slotholder');
			removeSlots(container,opt,container);
			punchgs.TweenLite.set(nextsh.find('.defaultimg'),{opacity:0});
			actsh.find('.defaultimg').css({'opacity':1});

			nextsh.find('.defaultimg').each(function() {
				var dimg = jQuery(this);

				if (opt.panZoomDisableOnMobile == "on") {
					// NO KEN BURNS ON MOBILE DEVICES

				} else {
					if (dimg.data('kenburn')!=undefined) {
					   dimg.data('kenburn').restart();
					   startKenBurn(container,opt,true)
					}
				}
			});

			var nextli = container.find('>ul >li:eq('+opt.next+')');



			var arr = container.parent().find('.tparrows');
			if (arr.hasClass("preview2"))
				arr.css({width:(parseInt(arr.css('minWidth'),0))});


			animateTheCaptions(nextli, opt,true);
			//restartBannerTimer(opt,container);
			setBulPos(container,opt);

		}




		/*********************************
			-	CHECK IF BROWSER IS IE	-
		********************************/
		var isIE = function( version, comparison ){
		    var $div = jQuery('<div style="display:none;"/>').appendTo(jQuery('body'));
		    $div.html('<!--[if '+(comparison||'')+' IE '+(version||'')+']><a>&nbsp;</a><![endif]-->');
		    var ieTest = $div.find('a').length;
		    $div.remove();
		    return ieTest;
		}



		var callingNewSlide = function(opt,container) {
						// CHECK THE LOOPS !!
						if (opt.next==container.find('>ul >li').length-1) {
								opt.looptogo=opt.looptogo-1;
								if (opt.looptogo<=0)
										opt.stopLoop="on";
							}
						swapSlide(container,opt);

		}






		////////////////////////////////
		//	-	CREATE THE BULLETS -  //
		////////////////////////////////
		var createBullets = function(container,opt) {
			var starthidebullets = "hidebullets";
			if (opt.hideThumbs==0) starthidebullets = "";

			if (opt.navigationType=="bullet"  || opt.navigationType=="both") {
						container.parent().append('<div class="tp-bullets '+starthidebullets+' simplebullets '+opt.navigationStyle+'"></div>');
			}

			var bullets = container.parent().find('.tp-bullets');
			container.find('>ul:first >li').each(function(i) {
							var src=container.find(">ul:first >li:eq("+i+") img:first").attr('src');
							bullets.append('<div class="bullet"></div>');
							var bullet= bullets.find('.bullet:first');
				});
			// ADD THE BULLET CLICK FUNCTION HERE
			bullets.find('.bullet').each(function(i) {
				var bul = jQuery(this);
				if (i==opt.slideamount-1) bul.addClass('last');
				if (i==0) bul.addClass('first');

				bul.click(function() {
					var sameslide = false,
						buli = bul.index();

					if (opt.navigationArrows=="withbullet" || opt.navigationArrows=="nexttobullets")
						buli = bul.index()-1;

					if (buli == opt.act) sameslide=true;

					if (opt.transition==0 && !sameslide) {
						opt.next = buli;
						callingNewSlide(opt,container);
					}
				});

			});
			bullets.append('<div class="tpclear"></div>');
			setBulPos(container,opt);
		}

		//////////////////////
		//	CREATE ARROWS	//
		/////////////////////
		var createArrows = function(container,opt) {
						var bullets = container.find('.tp-bullets'),
							hidden="",
							starthidearrows = "hidearrows",
							arst= opt.navigationStyle;

						if (opt.hideThumbs==0) starthidearrows = "";


						if (opt.navigationArrows=="none") hidden="visibility:hidden;display:none";
						opt.soloArrowStyle = "default"+" "+opt.navigationStyle;

						if (opt.navigationArrows!="none" && opt.navigationArrows!="nexttobullets") arst = opt.soloArrowStyle;

						function aArrow(dir) {
							container.parent().append('<div style="'+hidden+'" class="tp-'+dir+'arrow '+starthidearrows+' tparrows '+arst+'"><div class="tp-arr-allwrapper"><div class="tp-arr-iwrapper"><div class="tp-arr-imgholder"></div><div class="tp-arr-imgholder2"></div><div class="tp-arr-titleholder"></div><div class="tp-arr-subtitleholder"></div></div></div></div>');
						}
						aArrow("left");
						aArrow("right");

						// 	THE LEFT / RIGHT BUTTON CLICK !	 //
						container.parent().find('.tp-rightarrow').click(function() {
							if (opt.transition==0) {
									if (container.data('showus') !=undefined && container.data('showus') != -1)
										opt.next = container.data('showus')-1;
									else
										opt.next = opt.next+1;
									container.data('showus',-1);
									if (opt.next >= opt.slideamount) opt.next=0;
									if (opt.next<0) opt.next=0;

									if (opt.act !=opt.next)
										callingNewSlide(opt,container);
							}
						});

						container.parent().find('.tp-leftarrow').click(function() {
							if (opt.transition==0) {
									opt.next = opt.next-1;
									opt.leftarrowpressed=1;
									if (opt.next < 0) opt.next=opt.slideamount-1;
									callingNewSlide(opt,container);
							}
						});

						setBulPos(container,opt);

		}

		//////////////////////////////////
		//	ENABLE KEYBOARD INTERACTION	//
		//////////////////////////////////
		var createKeyboard = function(container,opt) {
						// 	THE LEFT / RIGHT BUTTON CLICK !	 //
						jQuery(document).keydown(function(e){
							if (opt.transition==0 && e.keyCode == 39) {
									if (container.data('showus') !=undefined && container.data('showus') != -1)
										opt.next = container.data('showus')-1;
									else
										opt.next = opt.next+1;
									container.data('showus',-1);
									if (opt.next >= opt.slideamount) opt.next=0;
									if (opt.next<0) opt.next=0;
									if (opt.act !=opt.next)
										callingNewSlide(opt,container);
							}

							if (opt.transition==0 && e.keyCode == 37) {
									opt.next = opt.next-1;
									opt.leftarrowpressed=1;
									if (opt.next < 0) opt.next=opt.slideamount-1;
									callingNewSlide(opt,container);
							}
						});

						setBulPos(container,opt);

		}

		////////////////////////////
		// SET THE SWIPE FUNCTION //
		////////////////////////////
		var swipeAction = function(container,opt) {
			// TOUCH ENABLED SCROLL
				var aps = "vertical";

				if (opt.touchenabled=="on") {
							if (opt.drag_block_vertical == true)
							    aps = "none";

							container.swipe({
								allowPageScroll:aps,
								fingers:opt.swipe_min_touches,
								treshold:opt.swipe_treshold,
								swipe:function(event,direction,distance,duration,fingerCount,fingerData) {
									switch (direction) {
										case "left":
											 if (opt.transition==0) {
																opt.next = opt.next+1;
																if (opt.next == opt.slideamount) opt.next=0;
																callingNewSlide(opt,container);
														}
										break;
										case "right":
											if (opt.transition==0) {
																opt.next = opt.next-1;
																opt.leftarrowpressed=1;
																if (opt.next < 0) opt.next=opt.slideamount-1;
																callingNewSlide(opt,container);
														}
										break;
										case "up":
											if (aps=="none")
												jQuery("html, body").animate({scrollTop:(container.offset().top + container.height())+"px"});
										break;
										case "down":
											if (aps=="none")
												jQuery("html, body").animate({scrollTop:(container.offset().top - jQuery(window).height())+"px"});
										break;
									}
								}
							})

				}

		}




		////////////////////////////////////////////////////////////////
		// SHOW AND HIDE THE THUMBS IF MOUE GOES OUT OF THE BANNER  ///
		//////////////////////////////////////////////////////////////
		var hideThumbs = function(container,opt) {

			var bullets = container.parent().find('.tp-bullets'),
				ca = container.parent().find('.tparrows');

			if (bullets==null) {
				container.append('<div class=".tp-bullets"></div>');
				var bullets = container.parent().find('.tp-bullets');
			}

			if (ca==null) {
				container.append('<div class=".tparrows"></div>');
				var ca = container.parent().find('.tparrows');
			}


			//var bp = (thumbs.parent().outerHeight(true) - opt.height)/2;

			//	ADD THUMBNAIL IMAGES FOR THE BULLETS //
			container.data('hideThumbs',opt.hideThumbs);

			bullets.addClass("hidebullets");
			ca.addClass("hidearrows");

			if (is_mobile()) {
				try{
					container.hammer().on('touch', function() {
						container.addClass("hovered");
						if (opt.onHoverStop=="on")
							container.trigger('stoptimer');
						clearTimeout(container.data('hideThumbs'));
						bullets.removeClass("hidebullets");
						ca.removeClass("hidearrows");


					});

					container.hammer().on('release', function() {
						container.removeClass("hovered");
						container.trigger('starttimer');
						if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
							container.data('hideThumbs', setTimeout(function() {
									bullets.addClass("hidebullets");
									ca.addClass("hidearrows");
									container.trigger('starttimer');
							},opt.hideNavDelayOnMobile));
					});
				} catch(e) {}

			} else {
				bullets.hover(function() {
				opt.overnav = true;
				if (opt.onHoverStop=="on")
					container.trigger('stoptimer');
				bullets.addClass("hovered");
				clearTimeout(container.data('hideThumbs'));
				bullets.removeClass("hidebullets");
				ca.removeClass("hidearrows");
					},
				function() {
					opt.overnav = false;
					container.trigger('starttimer');
					bullets.removeClass("hovered");
					if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
						container.data('hideThumbs', setTimeout(function() {
						bullets.addClass("hidebullets");
						ca.addClass("hidearrows");
						},opt.hideThumbs));
				});


				ca.hover(function() {
					opt.overnav = true;
					if (opt.onHoverStop=="on")
						container.trigger('stoptimer');
					bullets.addClass("hovered");
					clearTimeout(container.data('hideThumbs'));
					bullets.removeClass("hidebullets");
					ca.removeClass("hidearrows");

				},
				function() {
					opt.overnav = false;
					container.trigger('starttimer');
					bullets.removeClass("hovered");
					});



				container.on('mouseenter', function() {
					container.addClass("hovered");
					if (opt.onHoverStop=="on")
						container.trigger('stoptimer');
					clearTimeout(container.data('hideThumbs'));
					bullets.removeClass("hidebullets");
					ca.removeClass("hidearrows");


				});

				container.on('mouseleave', function() {
					container.removeClass("hovered");
					container.trigger('starttimer');
					if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
						container.data('hideThumbs', setTimeout(function() {
								bullets.addClass("hidebullets");
								ca.addClass("hidearrows");
						},opt.hideThumbs));
				});
			}


		}


		//////////////////////////////
		//	SET POSITION OF BULLETS	//
		//////////////////////////////
		var setBulPos = function(container,opt) {
			var topcont=container.parent();
			var bullets=topcont.find('.tp-bullets');

			if (opt.navigationType=="thumb") {
				bullets.find('.thumb').each(function(i) {
					var thumb = jQuery(this);

					thumb.css({'width':opt.thumbWidth * opt.bw+"px", 'height':opt.thumbHeight*opt.bh+"px"});

				})
				var bup = bullets.find('.tp-mask');

				bup.width(opt.thumbWidth*opt.thumbAmount * opt.bw);
				bup.height(opt.thumbHeight * opt.bh);
				bup.parent().width(opt.thumbWidth*opt.thumbAmount * opt.bw);
				bup.parent().height(opt.thumbHeight * opt.bh);
			}


			var tl = topcont.find('.tp-leftarrow');
			var tr = topcont.find('.tp-rightarrow');

			if (opt.navigationType=="thumb" && opt.navigationArrows=="nexttobullets") opt.navigationArrows="solo";
			// IM CASE WE HAVE NAVIGATION BULLETS TOGETHER WITH ARROWS
			if (opt.navigationArrows=="nexttobullets") {
				tl.prependTo(bullets).css({'float':'left'});
				tr.insertBefore(bullets.find('.tpclear')).css({'float':'left'});
			}
			var loff=0;
			if (opt.forceFullWidth=="on")
						loff = 0-opt.container.parent().offset().left;

			var gridposX = 0,
				gridposY = 0;

			if (opt.navigationInGrid=="on") {
				gridposX = container.width()>opt.startwidth ? (container.width() - opt.startwidth)/2 : 0,
				gridposY = container.height()>opt.startheight ? (container.height() - opt.startheight)/2 : 0;
			}



			if (opt.navigationArrows!="none" && opt.navigationArrows!="nexttobullets") {
				var lv = opt.soloArrowLeftValign,
					lh = opt.soloArrowLeftHalign,
					rv = opt.soloArrowRightValign,
					rh = opt.soloArrowRightHalign,
					lvo = opt.soloArrowLeftVOffset,
					lho = opt.soloArrowLeftHOffset,
					rvo = opt.soloArrowRightVOffset,
					rho = opt.soloArrowRightHOffset;

				tl.css({'position':'absolute'});
				tr.css({'position':'absolute'});

				if (lv=="center")	tl.css({'top':'50%','marginTop':(lvo-Math.round(tl.innerHeight()/2))+"px"})
				else
				if (lv=="bottom")	tl.css({'top':'auto','bottom':(0+lvo)+"px"})
				else
				if (lv=="top")	 	tl.css({'bottom':'auto','top':(0+lvo)+"px"});

				if (lh=="center")	tl.css({'left':'50%','marginLeft':(loff+lho-Math.round(tl.innerWidth()/2))+"px"})
				else
				if (lh=="left")	tl.css({'left':(gridposX+lho+loff)+"px"})
				else
				if (lh=="right")	tl.css({'right':(gridposX+lho-loff)+"px"});

				if (rv=="center")	tr.css({'top':'50%','marginTop':(rvo-Math.round(tr.innerHeight()/2))+"px"})
				else
				if (rv=="bottom")	tr.css({'top':'auto','bottom':(0+rvo)+"px"})
				else
				if (rv=="top")	tr.css({'bottom':'auto','top':(0+rvo)+"px"})

				if (rh=="center")	tr.css({'left':'50%','marginLeft':(loff+rho-Math.round(tr.innerWidth()/2))+"px"})
				else
				if (rh=="left")	tr.css({'left':(gridposX+rho+loff)+"px"})
				else
				if (rh=="right")	tr.css({'right':(gridposX+rho-loff)+"px"})


				if (tl.position()!=null)
					tl.css({'top':Math.round(parseInt(tl.position().top,0))+"px"});

				if (tr.position()!=null)
					tr.css({'top':Math.round(parseInt(tr.position().top,0))+"px"});
			}

			if (opt.navigationArrows=="none") {
				tl.css({'visibility':'hidden'});
				tr.css({'visibility':'hidden'});
			}

			// SET THE POSITIONS OF THE BULLETS // THUMBNAILS
			var nv = opt.navigationVAlign,
				nh = opt.navigationHAlign,
				nvo = opt.navigationVOffset * opt.bh,
				nho = opt.navigationHOffset * opt.bw;

			if (nv=="center")	 bullets.css({'top':'50%','marginTop':(nvo-Math.round(bullets.innerHeight()/2))+"px"});
			if (nv=="bottom")	 bullets.css({'bottom':(0+nvo)+"px"});
			if (nv=="top")	 bullets.css({'top':(0+nvo)+"px"});

			if (nh=="center")	bullets.css({'left':'50%','marginLeft':(loff+nho-Math.round(bullets.innerWidth()/2))+"px"});
			if (nh=="left")	bullets.css({'left':(0+nho+loff)+"px"});
			if (nh=="right")	bullets.css({'right':(0+nho-loff)+"px"});
		}


		/*******************************************************
			-	HANDLING OF PREVIEWS AND CUSTOM PREVIEWS	-
		*******************************************************/

		var handleSpecialPreviews = function(opt) {

			var container= opt.container;
			// FILL WITH INFOS THE NAVIGATION ARROWS
			opt.beforli = opt.next-1;
			opt.comingli = opt.next+1;

			if (opt.beforli<0) opt.beforli = opt.slideamount-1;
			if (opt.comingli>=opt.slideamount) opt.comingli = 0;

			var comingli = container.find('>ul:first-child >li:eq('+opt.comingli+')'),
				beforli = container.find('>ul:first-child >li:eq('+opt.beforli+')'),
				previmgsrc = beforli.find('.defaultimg').attr('src'),
				nextimgsrc = comingli.find('.defaultimg').attr('src');

			// SAVE REFERENCES
			if (opt.arr == undefined) {
				opt.arr = container.parent().find('.tparrows'),
				opt.rar = container.parent().find('.tp-rightarrow'),
				opt.lar = container.parent().find('.tp-leftarrow'),
				opt.raimg = opt.rar.find('.tp-arr-imgholder'),
				opt.laimg = opt.lar.find('.tp-arr-imgholder'),
				opt.raimg_b = opt.rar.find('.tp-arr-imgholder2'),
				opt.laimg_b = opt.lar.find('.tp-arr-imgholder2'),
				opt.ratit = opt.rar.find('.tp-arr-titleholder'),
				opt.latit = opt.lar.find('.tp-arr-titleholder');
			}

			// READ REFERENCES
				var arr = opt.arr,
					rar = opt.rar,
					lar = opt.lar,
					raimg = opt.raimg,
					laimg = opt.laimg,
					raimg_b = opt.raimg_b,
					laimg_b = opt.laimg_b,
					ratit = opt.ratit,
					latit = opt.latit;


			if (comingli.data('title') != undefined) ratit.html(comingli.data('title'));
			if (beforli.data('title') != undefined) latit.html(beforli.data('title'));


			if (rar.hasClass("itishovered")) {
					rar.width(ratit.outerWidth(true)+parseInt(rar.css('minWidth'),0));
				}

			if (lar.hasClass("itishovered")) {
					lar.width(latit.outerWidth(true)+parseInt(lar.css('minWidth'),0));
				}

			if (arr.hasClass("preview2") && !arr.hasClass("hashoveralready")) {

				arr.addClass("hashoveralready");

				if (!is_mobile())
					arr.hover(function() {

						var arr = jQuery(this),
							th = arr.find('.tp-arr-titleholder');
						if (jQuery(window).width()>767)
							arr.width(th.outerWidth(true)+parseInt(arr.css('minWidth'),0));
						arr.addClass("itishovered");
					},function() {
						var arr = jQuery(this),
							th = arr.find('.tp-arr-titleholder');
						arr.css({width:parseInt(arr.css('minWidth'),0)});
						arr.removeClass("itishovered");
					});
				else {
					var arr = jQuery(this),
						th = arr.find('.tp-arr-titleholder');
						th.addClass("alwayshidden");
					punchgs.TweenLite.set(th,{autoAlpha:0});
				}

			}

			if (beforli.data('thumb')!=undefined) previmgsrc = beforli.data('thumb');
			if (comingli.data('thumb')!=undefined) nextimgsrc = comingli.data('thumb')


			// CHANGE THE IMAGE SOURCE (AND ANIMATE IF PREVIEW4 MODE IS ON
			if (!arr.hasClass("preview4")) {

				punchgs.TweenLite.to(raimg,0.5,{autoAlpha:0,onComplete:function() {
					raimg.css({'backgroundImage':'url('+nextimgsrc+')'});
					laimg.css({'backgroundImage':'url('+previmgsrc+')'});
				}});
				punchgs.TweenLite.to(laimg,0.5,{autoAlpha:0,onComplete:function() {
					punchgs.TweenLite.to(raimg,0.5,{autoAlpha:1,delay:0.2});
					punchgs.TweenLite.to(laimg,0.5,{autoAlpha:1,delay:0.2});
				}});
			} else {

				raimg_b.css({'backgroundImage':'url('+nextimgsrc+')'});
				laimg_b.css({'backgroundImage':'url('+previmgsrc+')'});

				punchgs.TweenLite.fromTo(raimg_b,0.8,{force3D:punchgs.force3d,x:0},{x:-raimg.width(),ease:punchgs.Power3.easeOut,delay:1,onComplete:function() {
					raimg.css({'backgroundImage':'url('+nextimgsrc+')'});
					punchgs.TweenLite.set(raimg_b,{x:0});
				}});
				punchgs.TweenLite.fromTo(laimg_b,0.8,{force3D:punchgs.force3d,x:0},{x:raimg.width(),ease:punchgs.Power3.easeOut,delay:1,onComplete:function() {
					laimg.css({'backgroundImage':'url('+previmgsrc+')'});
					punchgs.TweenLite.set(laimg_b,{x:0});
				}});



				punchgs.TweenLite.fromTo(raimg,0.8,{x:0},{force3D:punchgs.force3d,x:-raimg.width(),ease:punchgs.Power3.easeOut,delay:1,onComplete:function() {
					punchgs.TweenLite.set(raimg,{x:0});
				}});
				punchgs.TweenLite.fromTo(laimg,0.8,{x:0},{force3D:punchgs.force3d,x:raimg.width(),ease:punchgs.Power3.easeOut,delay:1,onComplete:function() {
					punchgs.TweenLite.set(laimg,{x:0});
				}});
			}

			// HOVER EFFECTS ARE SPECIAL ON PREVIEW4
			if (rar.hasClass("preview4") && !rar.hasClass("hashoveralready")) {

				rar.addClass("hashoveralready");
				rar.hover(function() {
					var iw = jQuery(this).find('.tp-arr-iwrapper');
					var all = jQuery(this).find('.tp-arr-allwrapper');
					punchgs.TweenLite.fromTo(iw,0.4,{x:iw.width()},{x:0,delay:0.3,ease:punchgs.Power3.easeOut,overwrite:"all"});
					punchgs.TweenLite.to(all,0.2,{autoAlpha:1,overwrite:"all"});

				},function() {
					var iw = jQuery(this).find('.tp-arr-iwrapper');
					var all = jQuery(this).find('.tp-arr-allwrapper');
					punchgs.TweenLite.to(iw,0.4,{x:iw.width(),ease:punchgs.Power3.easeOut,delay:0.2,overwrite:"all"});
					punchgs.TweenLite.to(all,0.2,{delay:0.6,autoAlpha:0,overwrite:"all"});
				});


				lar.hover(function() {
					var iw = jQuery(this).find('.tp-arr-iwrapper');
					var all = jQuery(this).find('.tp-arr-allwrapper');
					punchgs.TweenLite.fromTo(iw,0.4,{x:(0-iw.width())},{x:0,delay:0.3,ease:punchgs.Power3.easeOut,overwrite:"all"});
					punchgs.TweenLite.to(all,0.2,{autoAlpha:1,overwrite:"all"});

				},function() {
					var iw = jQuery(this).find('.tp-arr-iwrapper');
					var all = jQuery(this).find('.tp-arr-allwrapper');
					punchgs.TweenLite.to(iw,0.4,{x:(0-iw.width()),ease:punchgs.Power3.easeOut,delay:0.2,overwrite:"all"});
					punchgs.TweenLite.to(all,0.2,{delay:0.6,autoAlpha:0,overwrite:"all"});
				});

			}
			// END OF NAVIGATION ARROW CONTENT FILLING

		}
		//////////////////////////////////////////////////////////
		//	-	SET THE IMAGE SIZE TO FIT INTO THE CONTIANER -  //
		////////////////////////////////////////////////////////
		var setSize = function(img,opt) {


				opt.container.closest('.forcefullwidth_wrapper_tp_banner').find('.tp-fullwidth-forcer').css({'height':opt.container.height()});
				opt.container.closest('.rev_slider_wrapper').css({'height':opt.container.height()});


				opt.width=parseInt(opt.container.width(),0);
				opt.height=parseInt(opt.container.height(),0);



				opt.bw= (opt.width / opt.startwidth);
				opt.bh = (opt.height / opt.startheight);

				if (opt.bh>opt.bw) opt.bh=opt.bw;
				if (opt.bh<opt.bw) opt.bw = opt.bh;
				if (opt.bw<opt.bh) opt.bh = opt.bw;
				if (opt.bh>1) { opt.bw=1; opt.bh=1; }
				if (opt.bw>1) {opt.bw=1; opt.bh=1; }


				//opt.height= opt.startheight * opt.bh;
				opt.height = Math.round(opt.startheight * (opt.width/opt.startwidth));


				if (opt.height>opt.startheight && opt.autoHeight!="on") opt.height=opt.startheight;


				if (opt.fullScreen=="on") {
						opt.height = opt.bw * opt.startheight;
						var cow = opt.container.parent().width();
						var coh = jQuery(window).height();

						if (opt.fullScreenOffsetContainer!=undefined) {
							try{
								var offcontainers = opt.fullScreenOffsetContainer.split(",");
								jQuery.each(offcontainers,function(index,searchedcont) {
									coh = coh - jQuery(searchedcont).outerHeight(true);
									if (coh<opt.minFullScreenHeight) coh=opt.minFullScreenHeight;
								});
							} catch(e) {}

							 try{

								 if (opt.fullScreenOffset.split("%").length>1 && opt.fullScreenOffset!=undefined && opt.fullScreenOffset.length>0) {

										coh = coh - (jQuery(window).height()* parseInt(opt.fullScreenOffset,0)/100);
								 } else {
								 	if (opt.fullScreenOffset!=undefined && opt.fullScreenOffset.length>0)
								 		coh = coh - parseInt(opt.fullScreenOffset,0);
								 }


								 if (coh<opt.minFullScreenHeight) coh=opt.minFullScreenHeight;

							} catch(e) {}
						}

						opt.container.parent().height(coh);

						opt.container.closest('.rev_slider_wrapper').height(coh);
						opt.container.css({'height':'100%'});

						opt.height=coh;
						if (opt.minHeight!=undefined && opt.height<opt.minHeight)
							opt.height = opt.minHeight;
				} else {
						if (opt.minHeight!=undefined && opt.height<opt.minHeight)
							opt.height = opt.minHeight;

						opt.container.height(opt.height);
				}


				opt.slotw=Math.ceil(opt.width/opt.slots);

				if (opt.fullScreen=="on")
					opt.sloth=Math.ceil(jQuery(window).height()/opt.slots);
				else
					opt.sloth=Math.ceil(opt.height/opt.slots);

				if (opt.autoHeight=="on")
				 	opt.sloth=Math.ceil(img.height()/opt.slots);




		}




		/////////////////////////////////////////
		//	-	PREPARE THE SLIDES / SLOTS -  //
		///////////////////////////////////////
		var prepareSlides = function(container,opt) {

			container.find('.tp-caption').each(function() { jQuery(this).addClass(jQuery(this).data('transition')); jQuery(this).addClass('start') });

			// PREPARE THE UL CONTAINER TO HAVEING MAX HEIGHT AND HEIGHT FOR ANY SITUATION
			container.find('>ul:first').css({overflow:'hidden',width:'100%',height:'100%',maxHeight:container.parent().css('maxHeight')}).addClass("tp-revslider-mainul");
			if (opt.autoHeight=="on") {
			   container.find('>ul:first').css({overflow:'hidden',width:'100%',height:'100%',maxHeight:"none"});
			   container.css({'maxHeight':'none'});
			   container.parent().css({'maxHeight':'none'});
			 }

			container.find('>ul:first >li').each(function(j) {
				var li=jQuery(this);
				li.addClass("tp-revslider-slidesli");

				// MAKE LI OVERFLOW HIDDEN FOR FURTHER ISSUES
				li.css({'width':'100%','height':'100%','overflow':'hidden'});

				// IF LINK ON SLIDE EXISTS, NEED TO CREATE A PROPER LAYER FOR IT.
				if (li.data('link')!=undefined) {
					var link = li.data('link');
					var target="_self";
					var zindex=60;
					if (li.data('slideindex')=="back") zindex=0;
					var linktoslide=checksl = li.data('linktoslide');
					if (linktoslide != undefined) {
						if (linktoslide!="next" && linktoslide!="prev")
							container.find('>ul:first-child >li').each(function() {
									var t = jQuery(this);
									if (t.data('origindex')+1==checksl) linktoslide = t.index()+1;
							});
					}
					if (li.data('target')!=undefined) target=li.data('target');
					if (link!="slide") linktoslide="no";
					var apptxt = '<div class="tp-caption sft slidelink" style="width:100%;height:100%;z-index:'+zindex+';" data-x="center" data-y="center" data-linktoslide="'+linktoslide+'" data-start="0"><a style="width:100%;height:100%;display:block"';
					if (link!="slide") apptxt = apptxt + ' target="'+target+'" href="'+link+'"';
					apptxt = apptxt + '><span style="width:100%;height:100%;display:block"></span></a></div>';

					li.append(apptxt);
				}
			});

			// RESOLVE OVERFLOW HIDDEN OF MAIN CONTAINER
			container.parent().css({'overflow':'visible'});


			container.find('>ul:first >li >img').each(function(j) {

				var img=jQuery(this);

				img.addClass('defaultimg');
				if (img.data('lazyload')!=undefined && img.data('lazydone') != 1) {

				} else {
					setSize(img,opt);
				}

				if (isIE(8)) {
					img.data('kenburns',"off");
				}

				// TURN OF KEN BURNS IF WE ARE ON MOBILE AND IT IS WISHED SO
				if (opt.panZoomDisableOnMobile == "on"  && is_mobile()) {
					img.data('kenburns',"off");
					img.data('bgfit',"cover");
				}

				img.wrap('<div class="slotholder" style="width:100%;height:100%;"'+
						  'data-duration="'+img.data('duration')+'"'+
						  'data-zoomstart="'+img.data("zoomstart")+'"'+
						  'data-zoomend="'+img.data("zoomend")+'"'+
						  'data-rotationstart="'+img.data("rotationstart")+'"'+
						  'data-rotationend="'+img.data("rotationend")+'"'+
						  'data-ease="'+img.data("ease")+'"'+
						  'data-duration="'+img.data("duration")+'"'+
						  'data-bgpositionend="'+img.data("bgpositionend")+'"'+
						  'data-bgposition="'+img.data("bgposition")+'"'+
						  'data-duration="'+img.data("duration")+'"'+
						  'data-kenburns="'+img.data("kenburns")+'"'+
						  'data-easeme="'+img.data("ease")+'"'+
						  'data-bgfit="'+img.data("bgfit")+'"'+
						  'data-bgfitend="'+img.data("bgfitend")+'"'+
						  'data-owidth="'+img.data("owidth")+'"'+
						  'data-oheight="'+img.data("oheight")+'"'+
						  '></div>');

				if (opt.dottedOverlay!="none" && opt.dottedOverlay!=undefined)
						img.closest('.slotholder').append('<div class="tp-dottedoverlay '+opt.dottedOverlay+'"></div>');

				var src=img.attr('src'),
					ll = img.data('lazyload'),
					bgfit = img.data('bgfit'),
					bgrepeat = img.data('bgrepeat'),
					bgposition = img.data('bgposition');


				if (bgfit==undefined) bgfit="cover";
				if (bgrepeat==undefined) bgrepeat="no-repeat";
				if (bgposition==undefined) bgposition="center center"


				var pari = img.closest('.slotholder');
				img.replaceWith('<div class="tp-bgimg defaultimg" data-lazyload="'+img.data('lazyload')+'" data-bgfit="'+bgfit+'"data-bgposition="'+bgposition+'" data-bgrepeat="'+bgrepeat+'" data-lazydone="'+img.data('lazydone')+'" src="'+src+'" data-src="'+src+'" style="background-color:'+img.css("backgroundColor")+';background-repeat:'+bgrepeat+';background-image:url('+src+');background-size:'+bgfit+';background-position:'+bgposition+';width:100%;height:100%;"></div>');

				if (isIE(8)) {
					pari.find('.tp-bgimg').css({backgroundImage:"none",'background-image':'none'});
					pari.find('.tp-bgimg').append('<img class="ieeightfallbackimage defaultimg" src="'+src+'" style="width:100%">');
				}

				img.css({'opacity':0});
				img.data('li-id',j);

			});
		}


		///////////////////////
		// PREPARE THE SLIDE //
		//////////////////////
		var prepareOneSlide = function(slotholder,opt,visible,vorh) {

				var sh=slotholder,
					img = sh.find('.defaultimg'),
					scalestart = sh.data('zoomstart'),
					rotatestart = sh.data('rotationstart');

				if (img.data('currotate')!=undefined)
					rotatestart = img.data('currotate');
				if (img.data('curscale')!=undefined && vorh=="box")
					scalestart = img.data('curscale')*100;
				else
				if (img.data('curscale')!=undefined)
					scalestart = img.data('curscale');

				setSize(img,opt)

				var src = img.data('src'),
					bgcolor=img.css('backgroundColor'),
					w = opt.width,
					h = opt.height,
					fulloff = img.data("fxof"),
					fullyoff=0;

				if (opt.autoHeight=="on") h = opt.container.height();
				if (fulloff==undefined) fulloff=0;



				var off=0,
					bgfit = img.data('bgfit'),
					bgrepeat = img.data('bgrepeat'),
					bgposition = img.data('bgposition');

				if (bgfit==undefined) bgfit="cover";
				if (bgrepeat==undefined) bgrepeat="no-repeat";
				if (bgposition==undefined) bgposition="center center";

				if (isIE(8)) {
					sh.data('kenburns',"off");
					var imgsrc=src;
			    	src="";
				}

				switch (vorh) {
					// BOX ANIMATION PREPARING
					case "box":
						// SET THE MINIMAL SIZE OF A BOX
						var basicsize = 0,
							x = 0,
							y = 0;

						if (opt.sloth>opt.slotw)
							basicsize=opt.sloth
						else
							basicsize=opt.slotw;

						if (!visible) {
							var off=0-basicsize;
						}

						opt.slotw = basicsize;
						opt.sloth = basicsize;
						var x=0;
						var y=0;

						if (sh.data('kenburns')=="on") {
						   bgfit=scalestart;
						   if (bgfit.toString().length<4)
							   bgfit = calculateKenBurnScales(bgfit,sh,opt);
						 }

						for (var j=0;j<opt.slots;j++) {

							y=0;
							for (var i=0;i<opt.slots;i++) 	{


								sh.append('<div class="slot" '+
										  'style="position:absolute;'+
													'top:'+(fullyoff+y)+'px;'+
													'left:'+(fulloff+x)+'px;'+
													'width:'+basicsize+'px;'+
													'height:'+basicsize+'px;'+
													'overflow:hidden;">'+

										  '<div class="slotslide" data-x="'+x+'" data-y="'+y+'" '+
										  			'style="position:absolute;'+
													'top:'+(0)+'px;'+
													'left:'+(0)+'px;'+
													'width:'+basicsize+'px;'+
													'height:'+basicsize+'px;'+
													'overflow:hidden;">'+

										  '<div style="position:absolute;'+
													'top:'+(0-y)+'px;'+
													'left:'+(0-x)+'px;'+
													'width:'+w+'px;'+
													'height:'+h+'px;'+
													'background-color:'+bgcolor+';'+
													'background-image:url('+src+');'+
													'background-repeat:'+bgrepeat+';'+
													'background-size:'+bgfit+';background-position:'+bgposition+';">'+
										  '</div></div></div>');
								y=y+basicsize;

								if (isIE(8)) {

									sh.find('.slot ').last().find('.slotslide').append('<img src="'+imgsrc+'">');
									ieimgposition(sh,opt);
								}

								if (scalestart!=undefined && rotatestart!=undefined)
										punchgs.TweenLite.set(sh.find('.slot').last(),{rotationZ:rotatestart});
							}
							x=x+basicsize;
						}
					break;

					// SLOT ANIMATION PREPARING
					case "vertical":
					case "horizontal":
						if (sh.data('kenburns')=="on") {
						   bgfit=scalestart;
						   if (bgfit.toString().length<4)
							   bgfit = calculateKenBurnScales(bgfit,sh,opt);
						 }
						 if (vorh == "horizontal") {
							if (!visible) var off=0-opt.slotw;
							for (var i=0;i<opt.slots;i++) {
									sh.append('<div class="slot" style="position:absolute;'+
																	'top:'+(0+fullyoff)+'px;'+
																	'left:'+(fulloff+(i*opt.slotw))+'px;'+
																	'overflow:hidden;width:'+(opt.slotw+0.6)+'px;'+
																	'height:'+h+'px">'+
									'<div class="slotslide" style="position:absolute;'+
																	'top:0px;left:'+off+'px;'+
																	'width:'+(opt.slotw+0.6)+'px;'+
																	'height:'+h+'px;overflow:hidden;">'+
									'<div style="background-color:'+bgcolor+';'+
																	'position:absolute;top:0px;'+
																	'left:'+(0-(i*opt.slotw))+'px;'+
																	'width:'+w+'px;height:'+h+'px;'+
																	'background-image:url('+src+');'+
																	'background-repeat:'+bgrepeat+';'+
																	'background-size:'+bgfit+';background-position:'+bgposition+';">'+
									'</div></div></div>');
									if (scalestart!=undefined && rotatestart!=undefined)
										punchgs.TweenLite.set(sh.find('.slot').last(),{rotationZ:rotatestart});
									if (isIE(8)) {
									   sh.find('.slot ').last().find('.slotslide').append('<img class="ieeightfallbackimage" src="'+imgsrc+'" style="width:100%;height:auto">');
									   ieimgposition(sh,opt);
								}
							}
						} else {
							if (!visible) var off=0-opt.sloth;
							for (var i=0;i<opt.slots+2;i++) {
								sh.append('<div class="slot" style="position:absolute;'+
														 'top:'+(fullyoff+(i*opt.sloth))+'px;'+
														 'left:'+(fulloff)+'px;'+
														 'overflow:hidden;'+
														 'width:'+w+'px;'+
														 'height:'+(opt.sloth)+'px">'+

											 '<div class="slotslide" style="position:absolute;'+
																 'top:'+(off)+'px;'+
																 'left:0px;width:'+w+'px;'+
																 'height:'+opt.sloth+'px;'+
																 'overflow:hidden;">'+
											'<div style="background-color:'+bgcolor+';'+
																	'position:absolute;'+
																	'top:'+(0-(i*opt.sloth))+'px;'+
																	'left:0px;'+
																	'width:'+w+'px;height:'+h+'px;'+
																	'background-image:url('+src+');'+
																	'background-repeat:'+bgrepeat+';'+
																	'background-size:'+bgfit+';background-position:'+bgposition+';">'+

											'</div></div></div>');
									if (scalestart!=undefined && rotatestart!=undefined)
										punchgs.TweenLite.set(sh.find('.slot').last(),{rotationZ:rotatestart});
									if (isIE(8)) {
								    	sh.find('.slot ').last().find('.slotslide').append('<img class="ieeightfallbackimage" src="'+imgsrc+'" style="width:100%;height:auto;">');
								    	ieimgposition(sh,opt);
									}
							}
						}
					break;
				}
		}

		/***********************************************
			-	MOVE IE8 IMAGE IN RIGHT POSITION	-
		***********************************************/

		var ieimgposition = function(nextsh,opt) {

			if (isIE(8)) {

					var ie8img = nextsh.find('.ieeightfallbackimage');

					var ie8w = ie8img.width(),
						ie8h = ie8img.height();



					if (opt.startwidth/opt.startheight <nextsh.data('owidth')/nextsh.data('oheight'))
						ie8img.css({width:"auto",height:"100%"})
					else
						ie8img.css({width:"100%",height:"auto"})


					setTimeout(function() {

						var ie8w = ie8img.width(),
						    ie8h = ie8img.height(),
						    bgp = nextsh.data('bgposition');


						if (bgp=="center center")
							ie8img.css({position:"absolute",top:opt.height/2 - ie8h/2+"px", left:opt.width/2-ie8w/2+"px"});

						if (bgp=="center top" || bgp=="top center")
							ie8img.css({position:"absolute",top:"0px", left:opt.width/2-ie8w/2+"px"});

						if (bgp=="center bottom" || bgp=="bottom center")
							ie8img.css({position:"absolute",bottom:"0px", left:opt.width/2-ie8w/2+"px"});


						if (bgp=="right top" || bgp=="top right")
							ie8img.css({position:"absolute",top:"0px", right:"0px"});

						if (bgp=="right bottom" || bgp=="bottom right")
							ie8img.css({position:"absolute",bottom:"0px", right:"0px"});

						if (bgp=="right center" || bgp=="center right")
							ie8img.css({position:"absolute",top:opt.height/2 - ie8h/2+"px", right:"0px"});

						if (bgp=="left bottom" || bgp=="bottom left")
							ie8img.css({position:"absolute",bottom:"0px", left:"0px"});

						if (bgp=="left center" || bgp=="center left")
							ie8img.css({position:"absolute",top:opt.height/2 - ie8h/2+"px", left:"0px"});
					},20);
				}
		}

		///////////////////////
		//	REMOVE SLOTS	//
		/////////////////////
		var removeSlots = function(container,opt,where) {
				where.find('.slot').each(function() {
					jQuery(this).remove();
				});
				opt.transition = 0;
		}


		/*******************************************
			-	PREPARE LOADING OF IMAGES	-
		********************************************/
		var loadAllPrepared = function(container,alreadyinload) {

			container.find('img, .defaultimg').each(function(i) {
				var img = jQuery(this),
					ill = img.data('lazyload');

				if (ill!=img.attr('src') && alreadyinload<3 && ill!=undefined && ill!='undefined') {

					if (ill !=undefined && ill !='undefined') {
						img.attr('src',ill);

						var limg = new Image();

						limg.onload = function(i) {
							img.data('lazydone',1);
							if (img.hasClass("defaultimg")) setDefImg(img,limg);
						}
						limg.error = function() {
							img.data('lazydone',1);
						}

						limg.src=img.attr('src');
						if (limg.complete) {
								if (img.hasClass("defaultimg")) setDefImg(img,limg);
								img.data('lazydone',1);
						}

					}
				} else {

					if ((ill === undefined || ill === 'undefined') && img.data('lazydone')!=1) {
						var limg = new Image();
						limg.onload = function() {
							if (img.hasClass("defaultimg")) setDefImg(img,limg);
							img.data('lazydone',1);
						}
						limg.error = function() {
							img.data('lazydone',1);
						}


						if (img.attr('src')!=undefined && img.attr('src')!='undefined') 	{
							limg.src = img.attr('src');
						} else
							limg.src = img.data('src');

						if (limg.complete) {
								if (img.hasClass("defaultimg")) {
									setDefImg(img,limg);
								}
								img.data('lazydone',1);
						}
					}
				}
			})
		}

		var setDefImg = function(img,limg) {
			var nextli = img.closest('li'),
				ww = limg.width,
				hh = limg.height;

			nextli.data('owidth',ww);
			nextli.data('oheight',hh);
			nextli.find('.slotholder').data('owidth',ww);
			nextli.find('.slotholder').data('oheight',hh);
			nextli.data('loadeddone',1);
		}

		var waitForLoads = function(element,call,opt) {

			loadAllPrepared(element,0);
			var inter = setInterval(function() {
				opt.bannertimeronpause = true;
				opt.container.trigger('stoptimer');
				opt.cd=0;
				 var found = 0;
				 element.find('img, .defaultimg').each(function(i) {
				 	if (jQuery(this).data('lazydone')!=1) {
				 		found++;

				 	}
				 });

				 if (found>0)
					 loadAllPrepared(element,found);
				 else {
					 clearInterval(inter);
					 if (call!=undefined)
					 	call();
				 }

			},100)
		}


		//////////////////////////////
		//	-	SWAP THE SLIDES -  //
		////////////////////////////
		var swapSlide = function(container,opt) {

				try{
					var actli =container.find('>ul:first-child >li:eq('+opt.act+')');
				} catch(e) {
					var actli=container.find('>ul:first-child >li:eq(1)');
				}
				opt.lastslide=opt.act;
				var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');

				var defimg= nextli.find('.defaultimg');


				opt.bannertimeronpause = true;
				container.trigger('stoptimer');
				opt.cd=0;

				if (defimg.data('lazyload') !=undefined && defimg.data('lazyload') !="undefined" && defimg.data('lazydone') !=1 ) {

					if (!isIE(8))
						defimg.css({backgroundImage:'url("'+nextli.find('.defaultimg').data('lazyload')+'")'});
					else {
						defimg.attr('src',nextli.find('.defaultimg').data('lazyload'));
					}

					defimg.data('src',nextli.find('.defaultimg').data('lazyload'));
					defimg.data('lazydone',1);
					defimg.data('orgw',0);
					nextli.data('loadeddone',1);

					container.find('.tp-loader').css({display:"block"});
					waitForLoads(container.find('.tp-static-layers'),function() {
						waitForLoads(nextli,function() {
								var nextsh = nextli.find('.slotholder');
								if (nextsh.data('kenburns')=="on") {
									var waitfordimension = setInterval(function() {
										var ow = nextsh.data('owidth');
										if (ow>=0) {
											clearInterval(waitfordimension);
											swapSlideCall(opt,defimg,container)
										}
									},10)
								} else
								 swapSlideCall(opt,defimg,container)
						},opt);
					},opt);

				} else {

					if (nextli.data('loadeddone')===undefined) {
						nextli.data('loadeddone',1);
						waitForLoads(nextli,function() {
							  swapSlideCall(opt,defimg,container)
							},opt);
					} else

					 swapSlideCall(opt,defimg,container)
				}

		}

		var swapSlideCall = function(opt,defimg,container) {
			opt.bannertimeronpause = false;
		    opt.cd=0;
		    container.trigger('nulltimer');
		    container.find('.tp-loader').css({display:"none"});
		    setSize(defimg,opt);
			setBulPos(container,opt);
			setSize(defimg,opt);
		   	swapSlideProgress(container,opt);

		}

		/******************************
			-	SWAP SLIDE PROGRESS	-
		********************************/
		/*!SWAP SLIDE*/
		var swapSlideProgress = function(container,opt) {


			container.trigger('revolution.slide.onbeforeswap');

			opt.transition = 1;
			opt.videoplaying = false;
			//konsole.log("VideoPlay set to False due swapSlideProgress");

			try{
				var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
			} catch(e) {
				var actli=container.find('>ul:first-child >li:eq(1)');
			}

			opt.lastslide=opt.act;

			var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');

			setTimeout(function() {
				handleSpecialPreviews(opt);
			},200);

			var actsh = actli.find('.slotholder'),
				nextsh = nextli.find('.slotholder');

			if (nextsh.data('kenburns')=="on" || actsh.data('kenburns')=="on") {
				stopKenBurn(container,opt);
				container.find('.kenburnimg').remove();
			}


			// IF DELAY HAS BEEN SET VIA THE SLIDE, WE TAKE THE NEW VALUE, OTHER WAY THE OLD ONE...
			if (nextli.data('delay')!=undefined) {
						opt.cd=0;
						opt.delay=nextli.data('delay');
			} else {
				opt.delay=opt.origcd;
			}


			if (opt.firststart==1)
				punchgs.TweenLite.set(actli,{autoAlpha:0});

			punchgs.TweenLite.set(actli,{zIndex:18});
			punchgs.TweenLite.set(nextli,{autoAlpha:0,zIndex:20});

			///////////////////////////
			//	REMOVE THE CAPTIONS //
			///////////////////////////
			var removetime = 0;
			if (actli.index() != nextli.index() && opt.firststart!=1) {
				removetime = removeTheCaptions(actli,opt);

			}

			if (actli.data('saveperformance')!="on") removetime = 0;

			setTimeout(function() {
				//opt.cd=0;
			    //container.trigger('nulltimer');
			    container.trigger('restarttimer');
				slideAnimation(container,opt,nextli,actli,actsh,nextsh);
			},removetime)

		}


		/******************************************
			-	START THE LAYER ANIMATION 	-
		*******************************************/

		var slideAnimation = function(container,opt,nextli,actli,actsh,nextsh) {

			// IF THERE IS AN OTHER FIRST SLIDE START HAS BEED SELECTED
			if (nextli.data('differentissplayed') =='prepared') {
				nextli.data('differentissplayed','done');
				nextli.data('transition',nextli.data('savedtransition'));
				nextli.data('slotamount',nextli.data('savedslotamount'));
				nextli.data('masterspeed',nextli.data('savedmasterspeed'));
			}


			if (nextli.data('fstransition') != undefined && nextli.data('differentissplayed') !="done") {
				nextli.data('savedtransition',nextli.data('transition'));
				nextli.data('savedslotamount',nextli.data('slotamount'));
				nextli.data('savedmasterspeed',nextli.data('masterspeed'));

				nextli.data('transition',nextli.data('fstransition'));
				nextli.data('slotamount',nextli.data('fsslotamount'));
				nextli.data('masterspeed',nextli.data('fsmasterspeed'));

				nextli.data('differentissplayed','prepared');
			}

			container.find('.active-revslide').removeClass('.active-revslide');
			nextli.addClass("active-revslide");

			///////////////////////////////////////
			// TRANSITION CHOOSE - RANDOM EFFECTS//
			///////////////////////////////////////


			if (nextli.data('transition')==undefined) nextli.data('transition',"random");

			var nexttrans = 0,
				transtext = nextli.data('transition').split(","),
				curtransid = nextli.data('nexttransid') == undefined ? -1 : nextli.data('nexttransid');

			if (nextli.data('randomtransition')=="on")
				curtransid = Math.round(Math.random()*transtext.length);
			else
				curtransid=curtransid+1;

			if (curtransid==transtext.length) curtransid=0;
			nextli.data('nexttransid',curtransid);



			var comingtransition = transtext[curtransid];

			if (opt.ie) {
				if (comingtransition=="boxfade") comingtransition = "boxslide";
				if (comingtransition=="slotfade-vertical") comingtransition = "slotzoom-vertical";
				if (comingtransition=="slotfade-horizontal") comingtransition = "slotzoom-horizontal";
			}

			if (isIE(8)) {
				comingtransition = 11;
			}


			var specials = 0;

			if (opt.parallax=="scroll" && opt.parallaxFirstGo==undefined) {
				opt.parallaxFirstGo = true;
				scrollParallax(container,opt);
				setTimeout(function() {
					scrollParallax(container,opt);
				},210);
				setTimeout(function() {
					scrollParallax(container,opt);
				},420);

			}




		/*	if (opt.ffnn == undefined) opt.ffnn=0;
			comingtransition=opt.ffnn;

			if ( direction==1)
				opt.ffnn=opt.ffnn-1;
			else
				opt.ffnn=opt.ffnn+1;

			if (opt.ffnn>46) opt.ffnn=0;
			if (opt.ffnn<0) opt.ffnn = 46;

			jQuery('.logo').html('Next Anim:'+comingtransition);


			if (comingtransition=="boxslide" || comingtransition == "boxfade" || comingtransition == "papercut" ||
				comingtransition==0 || comingtransition == 1 || comingtransition == 16)
				comingtransition = 9;*/


			/* Transition Name ,
			   Transition Code,
			   Transition Sub Code,
			   Max Slots,
			   MasterSpeed Delays,
			   Preparing Slots (box,slideh, slidev),
			   Call on nextsh (null = no, true/false for visibility first preparing),
			   Call on actsh (null = no, true/false for visibility first preparing),
			*/



			if (comingtransition=="slidehorizontal") {
						comingtransition = "slideleft"
					if (opt.leftarrowpressed==1)
						comingtransition = "slideright"
				}

			if (comingtransition=="slidevertical") {
						comingtransition = "slideup"
					if (opt.leftarrowpressed==1)
						comingtransition = "slidedown"
				}

			if (comingtransition=="parallaxhorizontal") {
						comingtransition = "parallaxtoleft"
					if (opt.leftarrowpressed==1)
						comingtransition = "parallaxtoright"
				}


			if (comingtransition=="parallaxvertical") {
						comingtransition = "parallaxtotop"
					if (opt.leftarrowpressed==1)
						comingtransition = "parallaxtobottom"
				}




			var transitionsArray = [ ['boxslide' , 0, 1, 10, 0,'box',false,null,0],
									 ['boxfade', 1, 0, 10, 0,'box',false,null,1],
									 ['slotslide-horizontal', 2, 0, 0, 200,'horizontal',true,false,2],
									 ['slotslide-vertical', 3, 0,0,200,'vertical',true,false,3],
									 ['curtain-1', 4, 3,0,0,'horizontal',true,true,4],
									 ['curtain-2', 5, 3,0,0,'horizontal',true,true,5],
									 ['curtain-3', 6, 3,25,0,'horizontal',true,true,6],
									 ['slotzoom-horizontal', 7, 0,0,400,'horizontal',true,true,7],
									 ['slotzoom-vertical', 8, 0,0,0,'vertical',true,true,8],
									 ['slotfade-horizontal', 9, 0,0,500,'horizontal',true,null,9],
									 ['slotfade-vertical', 10, 0,0 ,500,'vertical',true,null,10],
									 ['fade', 11, 0, 1 ,300,'horizontal',true,null,11],
									 ['slideleft', 12, 0,1,0,'horizontal',true,true,12],
									 ['slideup', 13, 0,1,0,'horizontal',true,true,13],
									 ['slidedown', 14, 0,1,0,'horizontal',true,true,14],
									 ['slideright', 15, 0,1,0,'horizontal',true,true,15],
									 ['papercut', 16, 0,0,600,'',null,null,16],
									 ['3dcurtain-horizontal', 17, 0,20,100,'vertical',false,true,17],
									 ['3dcurtain-vertical', 18, 0,10,100,'horizontal',false,true,18],
									 ['cubic', 19, 0,20,600,'horizontal',false,true,19],
									 ['cube',19,0,20,600,'horizontal',false,true,20],
									 ['flyin', 20, 0,4,600,'vertical',false,true,21],
									 ['turnoff', 21, 0,1,1600,'horizontal',false,true,22],
									 ['incube', 22, 0,20,200,'horizontal',false,true,23],
									 ['cubic-horizontal', 23, 0,20,500,'vertical',false,true,24],
									 ['cube-horizontal', 23, 0,20,500,'vertical',false,true,25],
									 ['incube-horizontal', 24, 0,20,500,'vertical',false,true,26],
									 ['turnoff-vertical', 25, 0,1,200,'horizontal',false,true,27],
									 ['fadefromright', 12, 1,1,0,'horizontal',true,true,28],
									 ['fadefromleft', 15, 1,1,0,'horizontal',true,true,29],
									 ['fadefromtop', 14, 1,1,0,'horizontal',true,true,30],
									 ['fadefrombottom', 13, 1,1,0,'horizontal',true,true,31],
									 ['fadetoleftfadefromright', 12, 2,1,0,'horizontal',true,true,32],
									 ['fadetorightfadetoleft', 15, 2,1,0,'horizontal',true,true,33],
									 ['fadetobottomfadefromtop', 14, 2,1,0,'horizontal',true,true,34],
									 ['fadetotopfadefrombottom', 13, 2,1,0,'horizontal',true,true,35],
									 ['parallaxtoright', 12, 3,1,0,'horizontal',true,true,36],
									 ['parallaxtoleft', 15, 3,1,0,'horizontal',true,true,37],
									 ['parallaxtotop', 14, 3,1,0,'horizontal',true,true,38],
									 ['parallaxtobottom', 13, 3,1,0,'horizontal',true,true,39],
									 ['scaledownfromright', 12, 4,1,0,'horizontal',true,true,40],
									 ['scaledownfromleft', 15, 4,1,0,'horizontal',true,true,41],
									 ['scaledownfromtop', 14, 4,1,0,'horizontal',true,true,42],
									 ['scaledownfrombottom', 13, 4,1,0,'horizontal',true,true,43],
									 ['zoomout', 13, 5,1,0,'horizontal',true,true,44],
									 ['zoomin', 13, 6,1,0,'horizontal',true,true,45],
									 ['notransition',26,0,1,0,'horizontal',true,null,46]
								   ];


			var flatTransitions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];
			var premiumTransitions = [16,17,18,19,20,21,22,23,24,25,26,27]

			var nexttrans =0;
			var specials = 1;
			var STAindex = 0;
			var indexcounter =0;
			var STA = new Array;

			//START THE KEN BURN PAN ZOOM ANIMATION
			if (nextsh.data('kenburns')=="on") {
					if (comingtransition == "boxslide" || comingtransition==0 ||
						comingtransition == "boxfade" || comingtransition==1 ||
						comingtransition == "papercut" || comingtransition==16
						)
						comingtransition = 11;

						startKenBurn(container,opt,true,true);
			}



			// RANDOM TRANSITIONS
			if (comingtransition == "random") {
				comingtransition = Math.round(Math.random()*transitionsArray.length-1);
				if (comingtransition>transitionsArray.length-1) comingtransition=transitionsArray.length-1;
			}

			// RANDOM FLAT TRANSITIONS
			if (comingtransition == "random-static") {
				comingtransition = Math.round(Math.random()*flatTransitions.length-1);
				if (comingtransition>flatTransitions.length-1) comingtransition=flatTransitions.length-1;
				comingtransition = flatTransitions[comingtransition];
			}

			// RANDOM PREMIUM TRANSITIONS
			if (comingtransition == "random-premium") {
				comingtransition = Math.round(Math.random()*premiumTransitions.length-1);
				if (comingtransition>premiumTransitions.length-1) comingtransition=premiumTransitions.length-1;
				comingtransition = premiumTransitions[comingtransition];
			}

			//joomla only change: avoid problematic transitions that don't compatible with mootools
			var problematicTransitions = [12,13,14,15,16,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];
			if(opt.isJoomla == true && window.MooTools != undefined && problematicTransitions.indexOf(comingtransition) != -1){

				var newTransIndex = Math.round(Math.random() * (premiumTransitions.length-2) ) + 1;

				//some limits fix
				if (newTransIndex > premiumTransitions.length-1)
					newTransIndex = premiumTransitions.length-1;

				if(newTransIndex == 0)
					newTransIndex = 1;

				comingtransition = premiumTransitions[newTransIndex];
			}



			function findTransition() {
				// FIND THE RIGHT TRANSITION PARAMETERS HERE
				jQuery.each(transitionsArray,function(inde,trans) {
					if (trans[0] == comingtransition || trans[8] == comingtransition) {
						nexttrans = trans[1];
						specials = trans[2];
						STAindex = indexcounter;
					}
					indexcounter = indexcounter+1;
				})
			}

			findTransition();

			// CHECK IF WE HAVE IE8 AND THAN FALL BACK ON FLAT TRANSITIONS
			if (isIE(8) && nexttrans>15 && nexttrans<28) {
				comingtransition = Math.round(Math.random()*flatTransitions.length-1);
				if (comingtransition>flatTransitions.length-1) comingtransition=flatTransitions.length-1;
				comingtransition = flatTransitions[comingtransition];
				indexcounter =0;
				findTransition();
			}




			// WHICH DIRECTION DID WE HAD ?
			var direction=-1;
			if (opt.leftarrowpressed==1 || opt.act>opt.next) direction=1;



			opt.leftarrowpressed=0;

			if (nexttrans>26) nexttrans = 26;
			if (nexttrans<0) nexttrans = 0;


			// DEFINE THE MASTERSPEED FOR THE SLIDE //
			var masterspeed=300;
			if (nextli.data('masterspeed')!=undefined && nextli.data('masterspeed')>99 && nextli.data('masterspeed')<opt.delay)
				masterspeed = nextli.data('masterspeed');
			if (nextli.data('masterspeed')!=undefined && nextli.data('masterspeed')>opt.delay)
				masterspeed = opt.delay;

			// PREPARED DEFAULT SETTINGS PER TRANSITION
			STA = transitionsArray[STAindex];

			/////////////////////////////////////////////
			// SET THE BULLETS SELECTED OR UNSELECTED  //
			/////////////////////////////////////////////
			container.parent().find(".bullet").each(function() {
				var bul = jQuery(this),
					buli = bul.index();
				bul.removeClass("selected");

				if (opt.navigationArrows=="withbullet" || opt.navigationArrows=="nexttobullets")
					buli = bul.index()-1;

				if (buli == opt.next) bul.addClass('selected');

			});

			///////////////////////////////
			//	MAIN TIMELINE DEFINITION //
			///////////////////////////////

			var mtl = new punchgs.TimelineLite({onComplete:function() {
							letItFree(container,opt,nextsh,actsh,nextli,actli,mtl);
						}});
			//SET DEFAULT IMG UNVISIBLE AT START
			mtl.add(punchgs.TweenLite.set(nextsh.find('.defaultimg'),{opacity:0}));
			mtl.pause();




			/////////////////////////////////////////////
			//	SET THE ACTUAL AMOUNT OF SLIDES !!     //
			//  SET A RANDOM AMOUNT OF SLOTS          //
			///////////////////////////////////////////
			if (nextli.data('slotamount')==undefined || nextli.data('slotamount')<1) {
				opt.slots=Math.round(Math.random()*12+4);
				if (comingtransition=="boxslide")
					opt.slots=Math.round(Math.random()*6+3);
				else
				if (comingtransition=="flyin")
					opt.slots=Math.round(Math.random()*4+1);
			 } else {
				opt.slots=nextli.data('slotamount');

			}

			/////////////////////////////////////////////
			//	SET THE ACTUAL AMOUNT OF SLIDES !!     //
			//  SET A RANDOM AMOUNT OF SLOTS          //
			///////////////////////////////////////////
			if (nextli.data('rotate')==undefined)
				opt.rotate = 0
			 else
				if (nextli.data('rotate')==999)
					opt.rotate=Math.round(Math.random()*360);
				 else
				    opt.rotate=nextli.data('rotate');
			if (!jQuery.support.transition  || opt.ie || opt.ie9) opt.rotate=0;




			//////////////////////////////
			//	FIRST START 			//
			//////////////////////////////
			if (opt.firststart==1) opt.firststart=0;


			// ADJUST MASTERSPEED
			masterspeed = masterspeed + STA[4];

			if ((nexttrans==4 || nexttrans==5 || nexttrans==6) && opt.slots<3 ) opt.slots=3;

			// ADJUST SLOTS
			if (STA[3] != 0) opt.slots = Math.min(opt.slots,STA[3]);
			if (nexttrans==9) opt.slots = opt.width/20;
			if (nexttrans==10) opt.slots = opt.height/20;

			// prepareOneSlide

			if (STA[7] !=null) prepareOneSlide(actsh,opt,STA[7],STA[5]);
			if (STA[6] !=null) prepareOneSlide(nextsh,opt,STA[6],STA[5]);


			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==0) {								// BOXSLIDE


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						var maxz = Math.ceil(opt.height/opt.sloth);
						var curz = 0;
						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							curz=curz+1;
							if (curz==maxz) curz=0;

							mtl.add(punchgs.TweenLite.from(ss,(masterspeed)/600,
												{opacity:0,top:(0-opt.sloth),left:(0-opt.slotw),rotation:opt.rotate,force3D:"auto",ease:punchgs.Power2.easeOut}),((j*15) + ((curz)*30))/1500);
						});
			}
			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==1) {

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						var maxtime,
							maxj = 0;

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this),
								rand=Math.random()*masterspeed+300,
								rand2=Math.random()*500+200;
							if (rand+rand2>maxtime) {
								maxtime = rand2+rand2;
								maxj = j;
							}
							mtl.add(punchgs.TweenLite.from(ss,rand/1000,
										{autoAlpha:0, force3D:"auto",rotation:opt.rotate,ease:punchgs.Power2.easeInOut}),rand2/1000);
						});
			}


			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==2) {

						var subtl = new punchgs.TimelineLite();
						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this);
							subtl.add(punchgs.TweenLite.to(ss,masterspeed/1000,{left:opt.slotw, force3D:"auto",rotation:(0-opt.rotate)}),0);
							mtl.add(subtl,0);
						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function() {
							var ss=jQuery(this);
							subtl.add(punchgs.TweenLite.from(ss,masterspeed/1000,{left:0-opt.slotw, force3D:"auto",rotation:opt.rotate}),0);
							mtl.add(subtl,0);
						});
			}



			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==3) {
						var subtl = new punchgs.TimelineLite();

						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this);
							subtl.add(punchgs.TweenLite.to(ss,masterspeed/1000,{top:opt.sloth,rotation:opt.rotate,force3D:"auto",transformPerspective:600}),0);
							mtl.add(subtl,0);

						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function() {
							var ss=jQuery(this);
							subtl.add(punchgs.TweenLite.from(ss,masterspeed/1000,{top:0-opt.sloth,rotation:opt.rotate,ease:punchgs.Power2.easeOut,force3D:"auto",transformPerspective:600}),0);
							mtl.add(subtl,0);
						});
			}



			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==4 || nexttrans==5) {

						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						var cspeed = (masterspeed)/1000,
							ticker = cspeed,
							subtl = new punchgs.TimelineLite();

						actsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							var del = (i*cspeed)/opt.slots;
							if (nexttrans==5) del = ((opt.slots-i-1)*cspeed)/(opt.slots)/1.5;
							subtl.add(punchgs.TweenLite.to(ss,cspeed*3,{transformPerspective:600,force3D:"auto",top:0+opt.height,opacity:0.5,rotation:opt.rotate,ease:punchgs.Power2.easeInOut,delay:del}),0);
							mtl.add(subtl,0);
						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							var del = (i*cspeed)/opt.slots;
							if (nexttrans==5) del = ((opt.slots-i-1)*cspeed)/(opt.slots)/1.5;
							subtl.add(punchgs.TweenLite.from(ss,cspeed*3,
											{top:(0-opt.height),opacity:0.5,rotation:opt.rotate,force3D:"auto",ease:punchgs.Power2.easeInOut,delay:del}),0);
							mtl.add(subtl,0);

						});


			}

			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==6) {


						if (opt.slots<2) opt.slots=2;
						if (opt.slots % 2) opt.slots = opt.slots+1;

						var subtl = new punchgs.TimelineLite();

						//SET DEFAULT IMG UNVISIBLE
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);

						actsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							if (i+1<opt.slots/2)
								var tempo = (i+2)*90;
							else
								var tempo = (2+opt.slots-i)*90;

							subtl.add(punchgs.TweenLite.to(ss,(masterspeed+tempo)/1000,{top:0+opt.height,opacity:1,force3D:"auto",rotation:opt.rotate,ease:punchgs.Power2.easeInOut}),0);
							mtl.add(subtl,0);
						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);

							if (i+1<opt.slots/2)
								var tempo = (i+2)*90;
							else
								var tempo = (2+opt.slots-i)*90;

							subtl.add(punchgs.TweenLite.from(ss,(masterspeed+tempo)/1000,
													{top:(0-opt.height),opacity:1,force3D:"auto",rotation:opt.rotate,ease:punchgs.Power2.easeInOut}),0);
							mtl.add(subtl,0);
						});
			}


			////////////////////////////////////
			// THE SLOTSZOOM - TRANSITION II. //
			////////////////////////////////////
			if (nexttrans==7) {

						masterspeed = masterspeed *2;
						if (masterspeed>opt.delay) masterspeed=opt.delay;
						var subtl = new punchgs.TimelineLite();

						//SET DEFAULT IMG UNVISIBLE
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);

						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this).find('div');
							subtl.add(punchgs.TweenLite.to(ss,masterspeed/1000,{
									left:(0-opt.slotw/2)+'px',
									top:(0-opt.height/2)+'px',
									width:(opt.slotw*2)+"px",
									height:(opt.height*2)+"px",
									opacity:0,
									rotation:opt.rotate,
									force3D:"auto",
									ease:punchgs.Power2.easeOut}),0);
							mtl.add(subtl,0);

						});

						//////////////////////////////////////////////////////////////
						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
						///////////////////////////////////////////////////////////////
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this).find('div');

							subtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
										{left:0,top:0,opacity:0,transformPerspective:600},
										{left:(0-i*opt.slotw)+'px',
										 ease:punchgs.Power2.easeOut,
										 force3D:"auto",
									     top:(0)+'px',
									     width:opt.width,
									     height:opt.height,
										 opacity:1,rotation:0,
										 delay:0.1}),0);
							mtl.add(subtl,0);
						});
			}




			////////////////////////////////////
			// THE SLOTSZOOM - TRANSITION II. //
			////////////////////////////////////
			if (nexttrans==8) {

						masterspeed = masterspeed * 3;
						if (masterspeed>opt.delay) masterspeed=opt.delay;
						var subtl = new punchgs.TimelineLite();



						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this).find('div');
							subtl.add(punchgs.TweenLite.to(ss,masterspeed/1000,
										  {left:(0-opt.width/2)+'px',
										   top:(0-opt.sloth/2)+'px',
										   width:(opt.width*2)+"px",
										   height:(opt.sloth*2)+"px",
										   force3D:"auto",
										   opacity:0,rotation:opt.rotate}),0);
							mtl.add(subtl,0);

						});


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
						///////////////////////////////////////////////////////////////
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this).find('div');

							subtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
										  {left:0, top:0,opacity:0,force3D:"auto"},
										  {'left':(0)+'px',
										   'top':(0-i*opt.sloth)+'px',
										   'width':(nextsh.find('.defaultimg').data('neww'))+"px",
										   'height':(nextsh.find('.defaultimg').data('newh'))+"px",
										   opacity:1,rotation:0,
										   }),0);
							mtl.add(subtl,0);
						});
			}


			////////////////////////////////////////
			// THE SLOTSFADE - TRANSITION III.   //
			//////////////////////////////////////
			if (nexttrans==9 || nexttrans==10) {
						var ssamount=0;
						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							ssamount++;
							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,{autoAlpha:0,force3D:"auto",transformPerspective:600},
																				 {autoAlpha:1,ease:punchgs.Power2.easeInOut,delay:(i*5)/1000}),0);

						});
			}

			///////////////////////////
			// SIMPLE FADE ANIMATION //
			///////////////////////////
			if (nexttrans==11 || nexttrans==26) {


						var ssamount=0;
						if (nexttrans==26) masterspeed=0;

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							mtl.add(punchgs.TweenLite.from(ss,masterspeed/1000,{autoAlpha:0,force3D:"auto",ease:punchgs.Power2.easeInOut}),0);
						});
			}

			if (nexttrans==12 || nexttrans==13 || nexttrans==14 || nexttrans==15) {
						masterspeed = masterspeed;
						if (masterspeed>opt.delay) masterspeed=opt.delay;
						//masterspeed = 1000;

						setTimeout(function() {
							punchgs.TweenLite.set(actsh.find('.defaultimg'),{autoAlpha:0});

						},100);

						var oow = opt.width,
							ooh = opt.height,
							ssn=nextsh.find('.slotslide'),
							twx = 0,
							twy = 0,
							op = 1,
							scal = 1,
							fromscale = 1,
							easeitout = punchgs.Power2.easeInOut,
							easeitin = punchgs.Power2.easeInOut,
							speedy = masterspeed/1000,
							speedy2 = speedy;


						if (opt.fullWidth=="on" || opt.fullScreen=="on") {
							oow=ssn.width();
							ooh=ssn.height();
						}

						if (nexttrans==12)
							twx = oow;
						else
						if (nexttrans==15)
							twx = 0-oow;
						else
						if (nexttrans==13)
							twy = ooh;
						else
						if (nexttrans==14)
							twy = 0-ooh;


						// DEPENDING ON EXTENDED SPECIALS, DIFFERENT SCALE AND OPACITY FUNCTIONS NEED TO BE ADDED
						if (specials == 1) op = 0;
						if (specials == 2) op = 0;
						if (specials == 3) {
								easeitout = punchgs.Power2.easeInOut;
								easeitin = punchgs.Power1.easeInOut;
								speedy = masterspeed / 1200;
						}

						if (specials==4 || specials==5)
							scal=0.6;
						if (specials==6 )
							scal=1.4;


						if (specials==5 || specials==6) {
						    fromscale=1.4;
						    op=0;
						    oow=0;
						    ooh=0;twx=0;twy=0;
						 }
						if (specials==6) fromscale=0.6;
						var dd = 0;

						mtl.add(punchgs.TweenLite.from(ssn,speedy,
										{left:twx, top:twy, scale:fromscale, opacity:op,rotation:opt.rotate,ease:easeitin,force3D:"auto"}),0);

						var ssa=actsh.find('.slotslide');

						if (specials==4 || specials==5) {
							oow = 0; ooh=0;
						}

						if (specials!=1)
							switch (nexttrans) {
								case 12:
									mtl.add(punchgs.TweenLite.to(ssa,speedy2,{'left':(0-oow)+'px',force3D:"auto",scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout}),0);
								break;
								case 15:
									mtl.add(punchgs.TweenLite.to(ssa,speedy2,{'left':(oow)+'px',force3D:"auto",scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout}),0);
								break;
								case 13:
									mtl.add(punchgs.TweenLite.to(ssa,speedy2,{'top':(0-ooh)+'px',force3D:"auto",scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout}),0);
								break;
								case 14:
									mtl.add(punchgs.TweenLite.to(ssa,speedy2,{'top':(ooh)+'px',force3D:"auto",scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout}),0);
								break;
							}

			}

			//////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XVI.  //
			//////////////////////////////////////
			if (nexttrans==16) {						// PAPERCUT


					var subtl = new punchgs.TimelineLite();
					mtl.add(punchgs.TweenLite.set(actli,{'position':'absolute','z-index':20}),0);
					mtl.add(punchgs.TweenLite.set(nextli,{'position':'absolute','z-index':15}),0);


					// PREPARE THE CUTS
					actli.wrapInner('<div class="tp-half-one" style="position:relative; width:100%;height:100%"></div>');

					actli.find('.tp-half-one').clone(true).appendTo(actli).addClass("tp-half-two");
					actli.find('.tp-half-two').removeClass('tp-half-one');

					var oow = opt.width,
						ooh = opt.height;
					if (opt.autoHeight=="on")
						ooh = container.height();


					actli.find('.tp-half-one .defaultimg').wrap('<div class="tp-papercut" style="width:'+oow+'px;height:'+ooh+'px;"></div>')
					actli.find('.tp-half-two .defaultimg').wrap('<div class="tp-papercut" style="width:'+oow+'px;height:'+ooh+'px;"></div>')
					actli.find('.tp-half-two .defaultimg').css({position:'absolute',top:'-50%'});
					actli.find('.tp-half-two .tp-caption').wrapAll('<div style="position:absolute;top:-50%;left:0px;"></div>');

					mtl.add(punchgs.TweenLite.set(actli.find('.tp-half-two'),
					                 {width:oow,height:ooh,overflow:'hidden',zIndex:15,position:'absolute',top:ooh/2,left:'0px',transformPerspective:600,transformOrigin:"center bottom"}),0);

					mtl.add(punchgs.TweenLite.set(actli.find('.tp-half-one'),
					                 {width:oow,height:ooh/2,overflow:'visible',zIndex:10,position:'absolute',top:'0px',left:'0px',transformPerspective:600,transformOrigin:"center top"}),0);

					// ANIMATE THE CUTS
					var img=actli.find('.defaultimg'),
						ro1=Math.round(Math.random()*20-10),
						ro2=Math.round(Math.random()*20-10),
						ro3=Math.round(Math.random()*20-10),
						xof = Math.random()*0.4-0.2,
						yof = Math.random()*0.4-0.2,
						sc1=Math.random()*1+1,
						sc2=Math.random()*1+1,
						sc3=Math.random()*0.3+0.3;

					mtl.add(punchgs.TweenLite.set(actli.find('.tp-half-one'),{overflow:'hidden'}),0);
					mtl.add(punchgs.TweenLite.fromTo(actli.find('.tp-half-one'),masterspeed/800,
					                 {width:oow,height:ooh/2,position:'absolute',top:'0px',left:'0px',force3D:"auto",transformOrigin:"center top"},
					                 {scale:sc1,rotation:ro1,y:(0-ooh-ooh/4),autoAlpha:0,ease:punchgs.Power2.easeInOut}),0);
					mtl.add(punchgs.TweenLite.fromTo(actli.find('.tp-half-two'),masterspeed/800,
					                 {width:oow,height:ooh,overflow:'hidden',position:'absolute',top:ooh/2,left:'0px',force3D:"auto",transformOrigin:"center bottom"},
					                 {scale:sc2,rotation:ro2,y:ooh+ooh/4,ease:punchgs.Power2.easeInOut,autoAlpha:0,onComplete:function() {
						                // CLEAN UP
										punchgs.TweenLite.set(actli,{'position':'absolute','z-index':15});
										punchgs.TweenLite.set(nextli,{'position':'absolute','z-index':20});
										if (actli.find('.tp-half-one').length>0)  {
											actli.find('.tp-half-one .defaultimg').unwrap();
											actli.find('.tp-half-one .slotholder').unwrap();
										}
										actli.find('.tp-half-two').remove();
					                 }}),0);

					subtl.add(punchgs.TweenLite.set(nextsh.find('.defaultimg'),{autoAlpha:1}),0);

					if (actli.html()!=null)
						mtl.add(punchgs.TweenLite.fromTo(nextli,(masterspeed-200)/1000,
														{scale:sc3,x:(opt.width/4)*xof, y:(ooh/4)*yof,rotation:ro3,force3D:"auto",transformOrigin:"center center",ease:punchgs.Power2.easeOut},
														{autoAlpha:1,scale:1,x:0,y:0,rotation:0}),0);

					mtl.add(subtl,0);


			}

			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XVII.  //
			///////////////////////////////////////
			if (nexttrans==17) {								// 3D CURTAIN HORIZONTAL


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							mtl.add(punchgs.TweenLite.fromTo(ss,(masterspeed)/800,
											{opacity:0,rotationY:0,scale:0.9,rotationX:-110,force3D:"auto",transformPerspective:600,transformOrigin:"center center"},
											{opacity:1,top:0,left:0,scale:1,rotation:0,rotationX:0,force3D:"auto",rotationY:0,ease:punchgs.Power3.easeOut,delay:j*0.06}),0);

						});
			}



			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XVIII.  //
			///////////////////////////////////////
			if (nexttrans==18) {								// 3D CURTAIN VERTICAL

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							mtl.add(punchgs.TweenLite.fromTo(ss,(masterspeed)/500,
											{autoAlpha:0,rotationY:310,scale:0.9,rotationX:10,force3D:"auto",transformPerspective:600,transformOrigin:"center center"},
											{autoAlpha:1,top:0,left:0,scale:1,rotation:0,rotationX:0,force3D:"auto",rotationY:0,ease:punchgs.Power3.easeOut,delay:j*0.06}),0);
						});



			}


			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XIX.  //
			///////////////////////////////////////
			if (nexttrans==19 || nexttrans==22) {								// IN CUBE

						var subtl = new punchgs.TimelineLite();
						//SET DEFAULT IMG UNVISIBLE

						mtl.add(punchgs.TweenLite.set(actli,{zIndex:20}),0);
						mtl.add(punchgs.TweenLite.set(nextli,{zIndex:20}),0);
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index'),
							chix2=actli.css('z-index'),
							rot = 90,
							op = 1,
							torig ="center center ";

						if (direction==1) rot = -90;

						if (nexttrans==19) {
							torig = torig+"-"+opt.height/2;
							op=0;

						} else {
							torig = torig+opt.height/2;
						}

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						punchgs.TweenLite.set(container,{transformStyle:"flat",backfaceVisibility:"hidden",transformPerspective:600});

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							subtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{transformStyle:"flat",backfaceVisibility:"hidden",left:0,rotationY:opt.rotate,z:10,top:0,scale:1,force3D:"auto",transformPerspective:600,transformOrigin:torig,rotationX:rot},
											{left:0,rotationY:0,top:0,z:0, scale:1,force3D:"auto",rotationX:0, delay:(j*50)/1000,ease:punchgs.Power2.easeInOut}),0);
							subtl.add(punchgs.TweenLite.to(ss,0.1,{autoAlpha:1,delay:(j*50)/1000}),0);
							mtl.add(subtl);
						});

						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							var rot = -90;
							if (direction==1) rot = 90;

							subtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{transformStyle:"flat",backfaceVisibility:"hidden",autoAlpha:1,rotationY:0,top:0,z:0,scale:1,force3D:"auto",transformPerspective:600,transformOrigin:torig, rotationX:0},
											{autoAlpha:1,rotationY:opt.rotate,top:0,z:10, scale:1,rotationX:rot, delay:(j*50)/1000,force3D:"auto",ease:punchgs.Power2.easeInOut}),0);

							mtl.add(subtl);
						});
			}




			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XX.  //
			///////////////////////////////////////
			if (nexttrans==20 ) {								// FLYIN


						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index'),
							chix2=actli.css('z-index');

						if (direction==1) {
						   var ofx = -opt.width
						   var rot  =70;
						   var torig = "left center -"+opt.height/2;
						} else {
							var ofx = opt.width;
							var rot = -70;
							var torig = "right center -"+opt.height/2;
						}


						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1500,
											{left:ofx,rotationX:40,z:-600, opacity:op,top:0,force3D:"auto",transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{left:0, delay:(j*50)/1000,ease:punchgs.Power2.easeInOut}),0);

							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{rotationX:40,z:-600, opacity:op,top:0,scale:1,force3D:"auto",transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{rotationX:0,opacity:1,top:0,z:0, scale:1,rotationY:0, delay:(j*50)/1000,ease:punchgs.Power2.easeInOut}),0);

							mtl.add(punchgs.TweenLite.to(ss,0.1,{opacity:1,force3D:"auto",delay:(j*50)/1000+masterspeed/2000}),0);

						});
						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							if (direction!=1) {
							   var ofx = -opt.width
							   var rot  =70;
							   var torig = "left center -"+opt.height/2;
							} else {
								var ofx = opt.width;
								var rot = -70;
								var torig = "right center -"+opt.height/2;
							}
							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{opacity:1,rotationX:0,top:0,z:0,scale:1,left:0, force3D:"auto",transformPerspective:600,transformOrigin:torig, rotationY:0},
											{opacity:1,rotationX:40,top:0, z:-600, left:ofx, force3D:"auto",scale:0.8,rotationY:rot, delay:(j*50)/1000,ease:punchgs.Power2.easeInOut}),0);
							mtl.add(punchgs.TweenLite.to(ss,0.1,{force3D:"auto",opacity:0,delay:(j*50)/1000+(masterspeed/1000 - (masterspeed/10000))}),0);
						});
			}

			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XX.  //
			///////////////////////////////////////
			if (nexttrans==21 || nexttrans==25) {								// TURNOFF


						//SET DEFAULT IMG UNVISIBLE

						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index'),
							chix2=actli.css('z-index'),
							rot = 90,
							ofx = -opt.width,
							rot2 = -rot;

						if (direction==1) {
						   if (nexttrans==25) {
						   	 var torig = "center top 0";
						   	 rot = opt.rotate;
						   } else {
						     var torig = "left center 0";
						     rot2 = opt.rotate;
						   }

						} else {
							ofx = opt.width;
							rot = -90;
							if (nexttrans==25) {
						   	 var torig = "center bottom 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     var torig = "right center 0";
						     rot2 = opt.rotate;
						   }
						}

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);


							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{left:0,transformStyle:"flat",rotationX:rot2,z:0, autoAlpha:0,top:0,scale:1,force3D:"auto",transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{left:0,rotationX:0,top:0,z:0, autoAlpha:1,scale:1,rotationY:0,force3D:"auto", ease:punchgs.Power3.easeInOut}),0);
						});


						if (direction!=1) {
						   	ofx = -opt.width
						   	rot  = 90;

						   if (nexttrans==25) {
						   	 torig = "center top 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     torig = "left center 0";
						     rot2 = opt.rotate;
						   }

						} else {
							ofx = opt.width;
							rot = -90;
							if (nexttrans==25) {
						   	 torig = "center bottom 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     torig = "right center 0";
						     rot2 = opt.rotate;
						   }
						}

						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{left:0,transformStyle:"flat",rotationX:0,z:0, autoAlpha:1,top:0,scale:1,force3D:"auto",transformPerspective:600,transformOrigin:torig,rotationY:0},
											{left:0,rotationX:rot2,top:0,z:0,autoAlpha:1,force3D:"auto", scale:1,rotationY:rot,ease:punchgs.Power1.easeInOut}),0);
						});
			}



			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XX.  //
			///////////////////////////////////////
			if (nexttrans==23 || nexttrans == 24) {								// cube-horizontal - inboxhorizontal


						//SET DEFAULT IMG UNVISIBLE
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index'),
							chix2=actli.css('z-index'),
							rot = -90,
							op = 1,
							opx=0;

						if (direction==1) rot = 90;
						if (nexttrans==23) {
							var torig = "center center -"+opt.width/2;
							op=0;
						} else
							var torig = "center center "+opt.width/2;

						punchgs.TweenLite.set(container,{transformStyle:"preserve-3d",backfaceVisibility:"hidden",perspective:2500});
										nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{left:opx,rotationX:opt.rotate,force3D:"auto",opacity:op,top:0,scale:1,transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{left:0,rotationX:0,autoAlpha:1,top:0,z:0, scale:1,rotationY:0, delay:(j*50)/500,ease:punchgs.Power2.easeInOut}),0);
						});

						rot = 90;
						if (direction==1) rot = -90;

						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							mtl.add(punchgs.TweenLite.fromTo(ss,masterspeed/1000,
											{left:0,autoAlpha:1,rotationX:0,top:0,z:0,scale:1,force3D:"auto",transformPerspective:600,transformOrigin:torig, rotationY:0},
											{left:opx,autoAlpha:1,rotationX:opt.rotate,top:0, scale:1,rotationY:rot, delay:(j*50)/500,ease:punchgs.Power2.easeInOut}),0);



						});
								}


			// SHOW FIRST LI && ANIMATE THE CAPTIONS
			mtl.pause();
			animateTheCaptions(nextli, opt,null,mtl);
			punchgs.TweenLite.to(nextli,0.001,{autoAlpha:1});

			var data={};
			data.slideIndex=opt.next+1;
			data.slide = nextli;
			container.trigger('revolution.slide.onchange',data);
			setTimeout(function() { container.trigger('revolution.slide.onafterswap'); },masterspeed);
			container.trigger('revolution.slide.onvideostop');

		}






		/**************************************
			-	GIVE FREE THE TRANSITIOSN	-
		**************************************/
		var letItFree = function(container,opt,nextsh,actsh,nextli,actli,mtl) {
					punchgs.TweenLite.to(nextsh.find('.defaultimg'),0.001,{autoAlpha:1,onComplete:function() {
						removeSlots(container,opt,nextli);
					}});
					if (nextli.index()!=actli.index()) {
						punchgs.TweenLite.to(actli,0.2,{autoAlpha:0,onComplete:function() {
							removeSlots(container,opt,actli);
						}});
					}
					opt.act=opt.next;
					if (opt.navigationType=="thumb") moveSelectedThumb(container);
					if (nextsh.data('kenburns')=="on") {
						startKenBurn(container,opt);
					}
					container.find('.current-sr-slide-visible').removeClass("current-sr-slide-visible");
					nextli.addClass("current-sr-slide-visible");
					if (opt.parallax=="scroll" || opt.parallax=="scroll+mouse" || opt.parallax=="mouse+scroll") {
								scrollParallax(container,opt);
					}

					mtl.clear();

			}


		//////////////////////////////////////////
		// CHANG THE YOUTUBE PLAYER STATE HERE //
		////////////////////////////////////////
		var  onPlayerStateChange = function(event) {

			 var embedCode = event.target.getVideoEmbedCode();
			 var ytcont = jQuery('#'+embedCode.split('id="')[1].split('"')[0])
			 var container = ytcont.closest('.tp-simpleresponsive');
			 var player = ytcont.parent().data('player');

			if (event.data == YT.PlayerState.PLAYING) {

				var bt = container.find('.tp-bannertimer');
				var opt = bt.data('opt');


				if (ytcont.closest('.tp-caption').data('volume')=="mute")
					  player.mute();

				opt.videoplaying=true;
				container.trigger('stoptimer');
				container.trigger('revolution.slide.onvideoplay');

			} else {

				var bt = container.find('.tp-bannertimer');
				var opt = bt.data('opt');

				if ((event.data!=-1 && event.data!=3)) {

					opt.videoplaying=false;
					container.trigger('starttimer');
					container.trigger('revolution.slide.onvideostop');

				}

				if (event.data==0 && opt.nextslideatend==true)
					opt.container.revnext();
				else {

					opt.videoplaying=false;
					container.trigger('starttimer');
					container.trigger('revolution.slide.onvideostop');
				}

			}


		  }



		 ////////////////////////
		// VIMEO ADD EVENT /////
		////////////////////////
		var addEvent = function(element, eventName, callback) {

					if (element.addEventListener)
						element.addEventListener(eventName, callback, false);
					else
						element.attachEvent(eventName, callback, false);
		}





		/////////////////////////////////////
		// EVENT HANDLING FOR VIMEO VIDEOS //
		/////////////////////////////////////

		var vimeoready_auto = function(player_id,autoplay) {

			var froogaloop = $f(player_id),
				vimcont = jQuery('#'+player_id),
				container = vimcont.closest('.tp-simpleresponsive'),
				nextcaption = vimcont.closest('.tp-caption');

			setTimeout(function() {
				froogaloop.addEvent('ready', function(data) {
						if(autoplay) froogaloop.api('play');


							froogaloop.addEvent('play', function(data) {
								var bt = container.find('.tp-bannertimer');
								var opt = bt.data('opt');

								opt.videoplaying=true;
								container.trigger('stoptimer');
								if (nextcaption.data('volume')=="mute")
								  froogaloop.api('setVolume',"0");
							});

							froogaloop.addEvent('finish', function(data) {
									var bt = container.find('.tp-bannertimer');
									var opt = bt.data('opt');
									opt.videoplaying=false;
									container.trigger('starttimer');

									container.trigger('revolution.slide.onvideoplay'); //opt.videostartednow=1;
									if (opt.nextslideatend==true)
										opt.container.revnext();

							});

							froogaloop.addEvent('pause', function(data) {
									var bt = container.find('.tp-bannertimer');
									var opt = bt.data('opt');
									opt.videoplaying=false;
									container.trigger('starttimer');
									container.trigger('revolution.slide.onvideostop'); //opt.videostoppednow=1;
							});

						// PLAY VIDEO IF THUMBNAIL HAS BEEN CLICKED
						 nextcaption.find('.tp-thumb-image').click(function() {
							 punchgs.TweenLite.to(jQuery(this),0.3,{autoAlpha:0,force3D:"auto",ease:punchgs.Power3.easeInOut})
							 froogaloop.api("play");
						 })
					});
				},150);
			}



			/////////////////////////////////////
			// RESIZE HTML5VIDEO FOR FULLSCREEN//
			/////////////////////////////////////
			var updateHTML5Size = function(pc,container) {
					var windowW = container.width();
					var windowH = container.height();
					var mediaAspect = pc.data('mediaAspect');
					if (mediaAspect == undefined) mediaAspect = 1;


					var windowAspect = windowW/windowH;

					pc.css({position:"absolute"});
					var video = pc.find('video');


					if (windowAspect < mediaAspect) {
						// taller
						punchgs.TweenLite.to(pc,0.0001,{width:windowH*mediaAspect,force3D:"auto",top:0,
												left:0-(windowH*mediaAspect-windowW)/2,
												height:windowH});

					} else {
						// wider
						punchgs.TweenLite.to(pc,0.0001,{width:windowW,force3D:"auto",top:0-(windowW/mediaAspect-windowH)/2,
												left:0,
												height:windowW/mediaAspect});
					}
				}



				/////////////////////////////////////
				//	-	CREATE ANIMATION OBJECT	-  //
				/////////////////////////////////////
				var newAnimObject = function() {
										var a = new Object();
										a.x=0;
										a.y=0;
										a.rotationX = 0;
										a.rotationY = 0;
										a.rotationZ = 0;
										a.scale = 1;
										a.scaleX = 1;
										a.scaleY = 1;
										a.skewX = 0;
										a.skewY = 0;
										a.opacity=0;
										a.transformOrigin = "center, center";
										a.transformPerspective = 400;
										a.rotation = 0;
										return a;
									}

				///////////////////////////////////////////////////
				// ANALYSE AND READ OUT DATAS FROM HTML CAPTIONS //
				///////////////////////////////////////////////////
				var getAnimDatas = function(frm,data) {

									var customarray = data.split(';');
									jQuery.each(customarray,function(index,param) {

										param = param.split(":")

										var w = param[0],
											v = param[1];
										if (w=="rotationX") frm.rotationX = parseInt(v,0);
										if (w=="rotationY") frm.rotationY = parseInt(v,0);
										if (w=="rotationZ") frm.rotationZ = parseInt(v,0);
										if (w=="rotationZ") frm.rotation = parseInt(v,0);
										if (w=="scaleX")  frm.scaleX = parseFloat(v);
										if (w=="scaleY")  frm.scaleY = parseFloat(v);
										if (w=="opacity") frm.opacity = parseFloat(v);
										if (w=="skewX")   frm.skewX = parseInt(v,0);
										if (w=="skewY")   frm.skewY = parseInt(v,0);
										if (w=="x") frm.x = parseInt(v,0);
										if (w=="y") frm.y = parseInt(v,0);
										if (w=="z") frm.z = parseInt(v,0);
										if (w=="transformOrigin") frm.transformOrigin = v.toString();
										if (w=="transformPerspective") frm.transformPerspective=parseInt(v,0);
									})

									return frm;
								}
				///////////////////////////////////////////////////////////////////
				// ANALYSE AND READ OUT DATAS FROM HTML CAPTIONS ANIMATION STEPS //
				///////////////////////////////////////////////////////////////////
				var getAnimSteps = function(data) {

						var paramarray = data.split("animation:");
						var params = new Object();

						params.animation = getAnimDatas(newAnimObject(),paramarray[1]);
						var customarray = paramarray[0].split(';');

						jQuery.each(customarray,function(index,param) {
							param = param.split(":")
							var w = param[0],
								v = param[1];
							if (w=="typ") params.typ = v;
							if (w=="speed") params.speed = parseInt(v,0)/1000;
							if (w=="start") params.start = parseInt(v,0)/1000;
							if (w=="elementdelay")  params.elementdelay = parseFloat(v);
							if (w=="ease")  params.ease = v;
						})

					return params;
				}




				////////////////////////
				// SHOW THE CAPTION  //
				///////////////////////
				var animateTheCaptions = function(nextli, opt,recalled,mtl) {

						// MAKE SURE THE ANIMATION ENDS WITH A CLEANING ON MOZ TRANSFORMS
						function animcompleted() {
						}

						function tlstart() {
						}

						if (nextli.data('ctl')==undefined) {
							nextli.data('ctl',new punchgs.TimelineLite());
						}

						var ctl = nextli.data('ctl'),
							offsetx=0,
							offsety=0,
							allcaptions = nextli.find('.tp-caption'),
							allstaticcaptions = opt.container.find('.tp-static-layers').find('.tp-caption');


						ctl.pause();

						jQuery.each(allstaticcaptions, function(index,staticcapt) {
							allcaptions.push(staticcapt);
						});

						allcaptions.each(function(i) {
								var internrecalled = recalled,
							    	staticdirection = -1,	// 1 -> In,  2-> Out  0-> Ignore  -1-> Not Static
									nextcaption=jQuery(this);

								if (nextcaption.hasClass("tp-static-layer")) {
										var nss = nextcaption.data('startslide'),
											nes = nextcaption.data('endslide');

									if ( nss == -1 || nss == "-1")
										nextcaption.data('startslide',0);

									if ( nes== -1 || nes == "-1")
										nextcaption.data('endslide',opt.slideamount);

									if (nss==0 && nes==opt.slideamount-1)
										nextcaption.data('endslide',opt.slideamount+1);


									// RESET SETTIGNS AFTER SETTING THEM AGAIN
									nss = nextcaption.data('startslide'),
									nes = nextcaption.data('endslide');


									// IF STATIC ITEM CURRENTLY NOT VISIBLE
									if (!nextcaption.hasClass("tp-is-shown")) {
										// IF ITEM SHOULD BECOME VISIBLE


										if ((nss<=opt.next && nes>=opt.next) ||
											(nss == opt.next) || (nes == opt.next)){

												nextcaption.addClass("tp-is-shown");
												staticdirection = 1;
										} else {

											staticdirection = 0;
										}
									// IF STATIC ITEM ALREADY VISIBLE
									} else {
										if ((nes==opt.next) ||
											(nss > opt.next) ||
											(nes < opt.next)) {

											staticdirection = 2;
											//nextcaption.removeClass("tp-is-shown");
										} else {
											staticdirection = 0;
										}

									}

									//if (staticdirection==2) staticdirection = 0;

								}

								offsetx = opt.width/2 - (opt.startwidth*opt.bw)/2;

								var xbw = opt.bw;
								var xbh = opt.bh;

								if (opt.fullScreen=="on")
									  offsety = opt.height/2 - (opt.startheight*opt.bh)/2;

								if (opt.autoHeight=="on" || (opt.minHeight!=undefined && opt.minHeight>0))
									  offsety = opt.container.height()/2 - (opt.startheight*opt.bh)/2;;


								if (offsety<0) offsety=0;



								var handlecaption=0;

								// HIDE CAPTION IF RESOLUTION IS TOO LOW
								if (opt.width<opt.hideCaptionAtLimit && nextcaption.data('captionhidden')=="on") {
									nextcaption.addClass("tp-hidden-caption")
									handlecaption=1;
								} else {
									if (opt.width<opt.hideAllCaptionAtLimit || opt.width<opt.hideAllCaptionAtLilmit)	{
										nextcaption.addClass("tp-hidden-caption")
										handlecaption=1;
									} else {
										nextcaption.removeClass("tp-hidden-caption")
									}
								}



								if (handlecaption==0) {

									// ADD A CLICK LISTENER TO THE CAPTION
									if (nextcaption.data('linktoslide')!=undefined && !nextcaption.hasClass("hasclicklistener")) {
										nextcaption.addClass("hasclicklistener")
										nextcaption.css({'cursor':'pointer'});
										if (nextcaption.data('linktoslide')!="no") {
											nextcaption.click(function() {
												var nextcaption=jQuery(this);
												var dir = nextcaption.data('linktoslide');
												if (dir!="next" && dir!="prev") {
													opt.container.data('showus',dir);
													opt.container.parent().find('.tp-rightarrow').click();
												} else
													if (dir=="next")
														opt.container.parent().find('.tp-rightarrow').click();
												else
													if (dir=="prev")
														opt.container.parent().find('.tp-leftarrow').click();
											});
										}
									}// END OF CLICK LISTENER


									if (offsetx<0) offsetx=0;


									if (nextcaption.hasClass("tp-videolayer") || nextcaption.find('iframe').length>0 || nextcaption.find('video').length>0 ) {

										// YOUTUBE AND VIMEO LISTENRES INITIALISATION
										var frameID = "iframe"+Math.round(Math.random()*100000+1),
											vidw = nextcaption.data("videowidth"),
											vidh = nextcaption.data("videoheight"),
											vida = nextcaption.data("videoattributes"),
											vidytid = nextcaption.data('ytid'),
											vimeoid = nextcaption.data('vimeoid'),
											videopreload = nextcaption.data('videpreload'),
											videomp = nextcaption.data('videomp4'),
											videowebm = nextcaption.data('videowebm'),
											videoogv = nextcaption.data('videoogv'),
											videocontrols = nextcaption.data('videocontrols'),
											httpprefix = "http",
											videoloop = nextcaption.data('videoloop')=="loop" ? "loop" : nextcaption.data('videoloop')=="loopandnoslidestop" ? "loop" : "";

										if (nextcaption.data('thumbimage')!=undefined && nextcaption.data('videoposter')==undefined)
											nextcaption.data('videoposter',nextcaption.data('thumbimage'))

										// ADD YOUTUBE IFRAME IF NEEDED
										if (vidytid!=undefined && String(vidytid).length>1 && nextcaption.find('iframe').length==0) {
											httpprefix = "https";

											if (videocontrols=="none") {
										 		vida = vida.replace("controls=1","controls=0");
										 		if (vida.toLowerCase().indexOf('controls')==-1)
										 		  vida = vida+"&controls=0";
										 	}
											nextcaption.append('<iframe style="visible:hidden" src="'+httpprefix+'://www.youtube.com/embed/'+vidytid+'?'+vida+'" width="'+vidw+'" height="'+vidh+'" style="width:'+vidw+'px;height:'+vidh+'px"></iframe>');
										}

										// ADD VIMEO IFRAME IF NEEDED
										if (vimeoid!=undefined && String(vimeoid).length>1 && nextcaption.find('iframe').length==0) {
											if (location.protocol === 'https:')
												httpprefix = "https";

											nextcaption.append('<iframe style="visible:hidden" src="'+httpprefix+'://player.vimeo.com/video/'+vimeoid+'?'+vida+'" width="'+vidw+'" height="'+vidh+'" style="width:'+vidw+'px;height:'+vidh+'px"></iframe>');
										}

										// ADD HTML5 VIDEO IF NEEDED
										if ((videomp!=undefined || videowebm!=undefined) && nextcaption.find('video').length==0) {

											if (videocontrols!="controls") videocontrols="";
											var apptxt = '<video style="visible:hidden" class="" '+videoloop+' preload="'+videopreload+'" width="'+vidw+'" height="'+vidh+'"';
											/*if (nextcaption.data('videoposter')!=undefined)
												apptxt = apptxt + 'poster="'+nextcaption.data('videoposter')+'">';
												apptxt = apptxt + '<source src="'+videomp+'" type="video/mp4" />';
												apptxt = apptxt + '<source src="'+videowebm+'" type="video/webm" />';
												apptxt = apptxt + '<source src="'+videoogv+'" type="video/ogg" />';
												apptxt = apptxt + '</video>';
											nextcaption.append(apptxt);*/
											
											if (nextcaption.data('videoposter')!=undefined)
												if (nextcaption.data('videoposter') != undefined) apptxt = apptxt + 'poster="'+nextcaption.data('videoposter')+'">';
												if (videowebm!=undefined && get_browser().toLowerCase()=="firefox") apptxt = apptxt + '<source src="'+videowebm+'" type="video/webm" />';
												if (videomp!=undefined) apptxt = apptxt + '<source src="'+videomp+'" type="video/mp4" />';
												if (videoogv!=undefined) apptxt = apptxt + '<source src="'+videoogv+'" type="video/ogg" />';
												apptxt = apptxt + '</video>';
											nextcaption.append(apptxt);

											if (videocontrols=="controls")
												nextcaption.append('<div class="tp-video-controls">'+
																		'<div class="tp-video-button-wrap"><button type="button" class="tp-video-button tp-vid-play-pause">Play</button></div>'+
																		'<div class="tp-video-seek-bar-wrap"><input  type="range" class="tp-seek-bar" value="0"></div>'+
																		'<div class="tp-video-button-wrap"><button  type="button" class="tp-video-button tp-vid-mute">Mute</button></div>'+
																		'<div class="tp-video-vol-bar-wrap"><input  type="range" class="tp-volume-bar" min="0" max="1" step="0.1" value="1"></div>'+
																		'<div class="tp-video-button-wrap"><button  type="button" class="tp-video-button tp-vid-full-screen">Full-Screen</button></div>'+
																	'</div>');
										}

										// RESET DEFAULTS
										var autoplaywason = false;
										if (nextcaption.data('autoplayonlyfirsttime') == true || nextcaption.data('autoplayonlyfirsttime')=="true" || nextcaption.data('autoplay')==true) {
											nextcaption.data('autoplay',true);
											autoplaywason = true;
										}


										nextcaption.find('iframe').each(function() {
												var ifr=jQuery(this);

												punchgs.TweenLite.to(ifr,0.1,{autoAlpha:1, zIndex:0, transformStyle:"preserve-3d",z:0,rotationX:0,force3D:"auto"});
												if (is_mobile()) {
													var oldsrc = ifr.attr('src');
													ifr.attr('src',"");
													ifr.attr('src',oldsrc);
												}


												// START YOUTUBE HANDLING
												opt.nextslideatend = nextcaption.data('nextslideatend');

												// IF VIDEOPOSTER EXISTING
												if (nextcaption.data('videoposter')!=undefined && nextcaption.data('videoposter').length>2 && nextcaption.data('autoplay')!=true && !internrecalled) {
													if (nextcaption.find('.tp-thumb-image').length==0)
														nextcaption.append('<div class="tp-thumb-image" style="cursor:pointer; position:absolute;top:0px;left:0px;width:100%;height:100%;background-image:url('+nextcaption.data('videoposter')+'); background-size:cover"></div>');
													else
													  punchgs.TweenLite.set(nextcaption.find('.tp-thumb-image'),{autoAlpha:1});
												}

												// IF IFRAME IS A YOUTUBE FRAME
												if (ifr.attr('src').toLowerCase().indexOf('youtube')>=0) {

														// IF LISTENER DOES NOT EXIST YET
														 if (!ifr.hasClass("HasListener")) {
															try {
																ifr.attr('id',frameID);
																var player;
																var ytint = setInterval(function() {
																	if (YT !=undefined)
																		if (typeof YT.Player != undefined && typeof YT.Player !="undefined") {
																			player = new YT.Player(frameID, {
																				events: {
																					"onStateChange": onPlayerStateChange,
																					'onReady': function(event) {
																						var embedCode = event.target.getVideoEmbedCode(),
																							ytcont = jQuery('#'+embedCode.split('id="')[1].split('"')[0]),
																							nextcaption = ytcont.closest('.tp-caption'),
																							videorate = nextcaption.data('videorate'),
																							videostart = nextcaption.data('videostart');


																						if (videorate!=undefined)
																							event.target.setPlaybackRate(parseFloat(videorate));

																						/*if (nextcaption.data('autoplay')==true || autoplaywason)
																							event.target.playVideo();*/

																						if (!is_mobile() && nextcaption.data('autoplay')==true || autoplaywason) {
																								nextcaption.data('timerplay',setTimeout(function() {
																									event.target.playVideo();
																								},nextcaption.data('start')));
																						}

																						// PLAY VIDEO IF THUMBNAIL HAS BEEN CLICKED
																						 nextcaption.find('.tp-thumb-image').click(function() {
																							 punchgs.TweenLite.to(jQuery(this),0.3,{autoAlpha:0,force3D:"auto",ease:punchgs.Power3.easeInOut})
																							 if (!is_mobile()) {
																								 player.playVideo();
																							}
																						 })

																					}
																				}
																			});
																		}
																		ifr.addClass("HasListener");
																		nextcaption.data('player',player);
																		clearInterval(ytint);
																}, 100)
															} catch(e) {}
													 } else {
													 	if (!recalled) {
														 	var player=nextcaption.data('player');
															if (nextcaption.data('forcerewind')=="on" && !is_mobile())
																	player.seekTo(0);

															if (!is_mobile() && nextcaption.data('autoplay')==true || autoplaywason) {
																	nextcaption.data('timerplay',setTimeout(function() {
																		player.playVideo();
																	},nextcaption.data('start')));
															}
														}
													 } // END YOUTUBE HANDLING


												} else

												// START VIMEO HANDLING
												if (ifr.attr('src').toLowerCase().indexOf('vimeo')>=0) {
														   if (!ifr.hasClass("HasListener")) {
																ifr.addClass("HasListener");
																ifr.attr('id',frameID);
																var isrc = ifr.attr('src');
																var queryParameters = {}, queryString = isrc,
																re = /([^&=]+)=([^&]*)/g, m;
																// Creates a map with the query string parameters
																while (m = re.exec(queryString)) {
																	queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
																}

																if (queryParameters['player_id']!=undefined)
																	isrc = isrc.replace(queryParameters['player_id'],frameID);
																else
																	isrc=isrc+"&player_id="+frameID;

																try{ isrc = isrc.replace('api=0','api=1'); } catch(e) {}

																isrc=isrc+"&api=1";

																ifr.attr('src',isrc);
																var player = nextcaption.find('iframe')[0];
																var vimint = setInterval(function() {
																	if ($f !=undefined){
																		if (typeof $f(frameID).api != undefined && typeof $f(frameID).api !="undefined") {

																			$f(player).addEvent('ready', function(){
																				vimeoready_auto(frameID,autoplaywason)
																			});
																			clearInterval(vimint);
																		}
																	}
																},100);

															 } else {
															 		if (!recalled) {
																		if (!is_mobile() && (nextcaption.data('autoplay')==true || nextcaption.data('forcerewind')=="on")) {

																			var ifr = nextcaption.find('iframe');
																			var id = ifr.attr('id');
																			var froogaloop = $f(id);
																			if (nextcaption.data('forcerewind')=="on")
																					froogaloop.api("seekTo",0);
																			nextcaption.data('timerplay',setTimeout(function() {
																				if (nextcaption.data('autoplay')==true)
																					froogaloop.api("play");
																			},nextcaption.data('start')));
																		}
																	}
															 }// END HAS LISTENER HANDLING
												}  // END OF VIMEO HANDLING
										}); // END OF LOOP THROUGH IFRAMES



										// START OF HTML5 VIDEOS
										if ((is_mobile() && nextcaption.data('disablevideoonmobile')==1) ||isIE(8)) nextcaption.find('video').remove();
										//if (is_mobile() && jQuery(window).width()<569)  nextcaption.find('video').remove()

										if (nextcaption.find('video').length>0) {
											nextcaption.find('video').each(function(i) {

												var video = this,
													jvideo = jQuery(this);


												if (!jvideo.parent().hasClass("html5vid"))
													jvideo.wrap('<div class="html5vid" style="position:relative;top:0px;left:0px;width:auto;height:auto"></div>');

												var html5vid = jvideo.parent();

												// WAITING FOR META DATAS

												addEvent(video,'loadedmetadata',function(html5vid) {
														html5vid.data('metaloaded',1);
												}(html5vid));


												clearInterval(html5vid.data('interval'));
												html5vid.data('interval',setInterval(function() {
													if (html5vid.data('metaloaded')==1 || video.duration!=NaN) {
														clearInterval(html5vid.data('interval'));
														// FIRST TIME LOADED THE HTML5 VIDEO
														if (!html5vid.hasClass("HasListener")) {
																html5vid.addClass("HasListener");

																if (nextcaption.data('dottedoverlay')!="none" && nextcaption.data('dottedoverlay')!=undefined)
																if (nextcaption.find('.tp-dottedoverlay').length!=1)
																	html5vid.append('<div class="tp-dottedoverlay '+nextcaption.data('dottedoverlay')+'"></div>');

																if (jvideo.attr('control') == undefined ) {
																	if (html5vid.find('.tp-video-play-button').length==0)
																		html5vid.append('<div class="tp-video-play-button"><i class="revicon-right-dir"></i><div class="tp-revstop"></div></div>');
																	html5vid.find('video, .tp-poster, .tp-video-play-button').click(function() {
																		if (html5vid.hasClass("videoisplaying"))
																			video.pause();
																		else
																			video.play();
																	})
																}

																if (nextcaption.data('forcecover')==1 || nextcaption.hasClass('fullscreenvideo'))  {
																	if (nextcaption.data('forcecover')==1) {
																		updateHTML5Size(html5vid,opt.container);
																		html5vid.addClass("fullcoveredvideo");
																		nextcaption.addClass("fullcoveredvideo");
																	}
																	html5vid.css({width:"100%", height:"100%"});
																}



																var playButton = nextcaption.find('.tp-vid-play-pause')[0],
																	muteButton = nextcaption.find('.tp-vid-mute')[0],
																	fullScreenButton = nextcaption.find('.tp-vid-full-screen')[0],
																	seekBar = nextcaption.find('.tp-seek-bar')[0],
																	volumeBar = nextcaption.find('.tp-volume-bar')[0];

																if (playButton!=undefined) {
																	// Event listener for the play/pause button
																	addEvent(playButton,"click", function() {
																		if (video.paused == true)
																			// Play the video
																			video.play();
																		else
																			// Pause the video
																			video.pause();
																	});

																	// Event listener for the mute button
																	addEvent(muteButton,"click", function() {
																		if (video.muted == false) {
																			// Mute the video
																			video.muted = true;

																			// Update the button text
																			muteButton.innerHTML = "Unmute";
																		} else {
																			// Unmute the video
																			video.muted = false;

																			// Update the button text
																			muteButton.innerHTML = "Mute";
																		}
																	});

																	// Event listener for the full-screen button
																	addEvent(fullScreenButton,"click", function() {
																		if (video.requestFullscreen) {
																			video.requestFullscreen();
																		} else if (video.mozRequestFullScreen) {
																			video.mozRequestFullScreen(); // Firefox
																		} else if (video.webkitRequestFullscreen) {
																			video.webkitRequestFullscreen(); // Chrome and Safari
																		}
																	});


																	// Event listener for the seek bar
																	addEvent(seekBar,"change", function() {
																		// Calculate the new time
																		var time = video.duration * (seekBar.value / 100);
																		// Update the video time
																		video.currentTime = time;
																	});


																	// Update the seek bar as the video plays
																	addEvent(video,"timeupdate", function() {
																		// Calculate the slider value
																		var value = (100 / video.duration) * video.currentTime;

																		// Update the slider value
																		seekBar.value = value;
																	});

																	// Pause the video when the seek handle is being dragged
																	addEvent(seekBar,"mousedown", function() {
																		video.pause();
																	});

																	// Play the video when the seek handle is dropped
																	addEvent(seekBar,"mouseup", function() {
																		video.play();
																	});

																	// Event listener for the volume bar
																	addEvent(volumeBar,"change", function() {
																		// Update the video volume
																		video.volume = volumeBar.value;
																	});
																}


																// VIDEO EVENT LISTENER FOR "PLAY"
																addEvent(video,"play",function() {
																		if (nextcaption.data('volume')=="mute")
																			  video.muted=true;

																		html5vid.addClass("videoisplaying");

			 															if (nextcaption.data('videoloop')=="loopandnoslidestop") {
																			opt.videoplaying=false;
																			opt.container.trigger('starttimer');
																			opt.container.trigger('revolution.slide.onvideostop');
																		} else {

																			opt.videoplaying=true;
																			opt.container.trigger('stoptimer');
																			opt.container.trigger('revolution.slide.onvideoplay');
																		}

																		var playButton = nextcaption.find('.tp-vid-play-pause')[0],
																			muteButton = nextcaption.find('.tp-vid-mute')[0];
																		if (playButton!=undefined)
																			playButton.innerHTML = "Pause";
																		if (muteButton!=undefined && video.muted)
																			muteButton.innerHTML = "Unmute";
																	});

																// VIDEO EVENT LISTENER FOR "PAUSE"
																addEvent(video,"pause",function() {
																			html5vid.removeClass("videoisplaying");
																			opt.videoplaying=false;
																			opt.container.trigger('starttimer');
																			opt.container.trigger('revolution.slide.onvideostop');
																			var playButton = nextcaption.find('.tp-vid-play-pause')[0];
																			if (playButton!=undefined)
																				playButton.innerHTML = "Play";

																	});

																// VIDEO EVENT LISTENER FOR "END"
																addEvent(video,"ended",function() {
																			html5vid.removeClass("videoisplaying");
																			opt.videoplaying=false;
																			opt.container.trigger('starttimer');
																			opt.container.trigger('revolution.slide.onvideostop');
																			if (opt.nextslideatend==true)
																				opt.container.revnext();
																	});

															} // END OF LISTENER DECLARATION

															var autoplaywason = false;
															if (nextcaption.data('autoplayonlyfirsttime') == true || nextcaption.data('autoplayonlyfirsttime')=="true")
																autoplaywason = true;

															var mediaaspect=16/9;
															if (nextcaption.data('aspectratio')=="4:3") mediaaspect=4/3;
															html5vid.data('mediaAspect',mediaaspect);

															if (html5vid.closest('.tp-caption').data('forcecover')==1) {
																updateHTML5Size(html5vid,opt.container);
																html5vid.addClass("fullcoveredvideo");
															}

															jvideo.css({display:"block"});
															opt.nextslideatend = nextcaption.data('nextslideatend');

															// IF VIDEO SHOULD BE AUTOPLAYED
															if (nextcaption.data('autoplay')==true || autoplaywason==true) {


																if (nextcaption.data('videoloop')=="loopandnoslidestop") {
																	opt.videoplaying=false;
																	opt.container.trigger('starttimer');
																	opt.container.trigger('revolution.slide.onvideostop');
																} else {
																	opt.videoplaying=true;
																	opt.container.trigger('stoptimer');
																	opt.container.trigger('revolution.slide.onvideoplay');
																}


																if (nextcaption.data('forcerewind')=="on" && !html5vid.hasClass("videoisplaying"))
																	if (video.currentTime>0) video.currentTime=0;

																if (nextcaption.data('volume')=="mute")
																	video.muted = true;

																html5vid.data('timerplay',setTimeout(function() {

																	if (nextcaption.data('forcerewind')=="on" && !html5vid.hasClass("videoisplaying"))
																		if (video.currentTime>0) video.currentTime=0;

																	if (nextcaption.data('volume')=="mute")
																			video.muted = true;


																		video.play();
																},10+nextcaption.data('start')));
															}

															if (html5vid.data('ww') == undefined) html5vid.data('ww',jvideo.attr('width'));
															if (html5vid.data('hh') == undefined) html5vid.data('hh',jvideo.attr('height'));

															if (!nextcaption.hasClass("fullscreenvideo") && nextcaption.data('forcecover')==1) {
																try{
																	html5vid.width(html5vid.data('ww')*opt.bw);
																	html5vid.height(html5vid.data('hh')*opt.bh);
																} catch(e) {}
															}

															clearInterval(html5vid.data('interval'));
													}
												}),100); // END OF SET INTERVAL

											});
										} // END OF HTML5 VIDEO FUNCTIONS

										// IF AUTOPLAY IS ON, WE NEED SOME STOP FUNCTION ON
										if (nextcaption.data('autoplay')==true) {
											setTimeout(function() {

												if (nextcaption.data('videoloop')!="loopandnoslidestop") {
													opt.videoplaying=true;
													opt.container.trigger('stoptimer');
												}
											},200)
											if (nextcaption.data('videoloop')!="loopandnoslidestop") {
												opt.videoplaying=true;
												opt.container.trigger('stoptimer');
											}

											if (nextcaption.data('autoplayonlyfirsttime') == true || nextcaption.data('autoplayonlyfirsttime')=="true" ) {
												nextcaption.data('autoplay',false);
												nextcaption.data('autoplayonlyfirsttime',false);
											}
										}
									}




									// NEW ENGINE
									//if (nextcaption.hasClass("randomrotate") && (opt.ie || opt.ie9)) nextcaption.removeClass("randomrotate").addClass("sfb");
									//	nextcaption.removeClass('noFilterClass');



								    var imw =0;
								    var imh = 0;

									if (nextcaption.find('img').length>0) {
														var im = nextcaption.find('img');
														if (im.width()==0) im.css({width:"auto"});
														if (im.height()==0) im.css({height:"auto"});

														if (im.data('ww') == undefined && im.width()>0) im.data('ww',im.width());
														if (im.data('hh') == undefined && im.height()>0) im.data('hh',im.height());

														var ww = im.data('ww');
														var hh = im.data('hh');

														if (ww==undefined) ww=0;
														if (hh==undefined) hh=0;

														im.width(ww*opt.bw);
														im.height(hh*opt.bh);
														imw = im.width();
														imh = im.height();
									} else {

									if (nextcaption.find('iframe').length>0 || nextcaption.find('video').length>0) {

															var html5vid = false,
																im = nextcaption.find('iframe');
															if (im.length==0) {
																	im = nextcaption.find('video');
																	html5vid = true;
															}
															im.css({display:"block"});

															if (nextcaption.data('ww') == undefined) nextcaption.data('ww',im.width());
															if (nextcaption.data('hh') == undefined) nextcaption.data('hh',im.height());

															var ww = nextcaption.data('ww'),
																hh = nextcaption.data('hh');

															var nc =nextcaption;
																if (nc.data('fsize') == undefined) nc.data('fsize',parseInt(nc.css('font-size'),0) || 0);
																if (nc.data('pt') == undefined) nc.data('pt',parseInt(nc.css('paddingTop'),0) || 0);
																if (nc.data('pb') == undefined) nc.data('pb',parseInt(nc.css('paddingBottom'),0) || 0);
																if (nc.data('pl') == undefined) nc.data('pl',parseInt(nc.css('paddingLeft'),0) || 0);
																if (nc.data('pr') == undefined) nc.data('pr',parseInt(nc.css('paddingRight'),0) || 0);

																if (nc.data('mt') == undefined) nc.data('mt',parseInt(nc.css('marginTop'),0) || 0);
																if (nc.data('mb') == undefined) nc.data('mb',parseInt(nc.css('marginBottom'),0) || 0);
																if (nc.data('ml') == undefined) nc.data('ml',parseInt(nc.css('marginLeft'),0) || 0);
																if (nc.data('mr') == undefined) nc.data('mr',parseInt(nc.css('marginRight'),0) || 0);

																if (nc.data('bt') == undefined) nc.data('bt',parseInt(nc.css('borderTop'),0) || 0);
																if (nc.data('bb') == undefined) nc.data('bb',parseInt(nc.css('borderBottom'),0) || 0);
																if (nc.data('bl') == undefined) nc.data('bl',parseInt(nc.css('borderLeft'),0) || 0);
																if (nc.data('br') == undefined) nc.data('br',parseInt(nc.css('borderRight'),0) || 0);

																if (nc.data('lh') == undefined) nc.data('lh',parseInt(nc.css('lineHeight'),0) || 0);

																// IE8 FIX FOR AUTO LINEHEIGHT
																if (nc.data('lh')=="auto") nc.data('lh',nc.data('fsize')+4);

																var fvwidth=opt.width,
																	fvheight=opt.height;
																if (fvwidth>opt.startwidth) fvwidth=opt.startwidth;
																if (fvheight>opt.startheight) fvheight=opt.startheight;

																if (!nextcaption.hasClass('fullscreenvideo'))
																			nextcaption.css({

																				 'font-size': (nc.data('fsize') * opt.bw)+"px",

																				 'padding-top': (nc.data('pt') * opt.bh) + "px",
																				 'padding-bottom': (nc.data('pb') * opt.bh) + "px",
																				 'padding-left': (nc.data('pl') * opt.bw) + "px",
																				 'padding-right': (nc.data('pr') * opt.bw) + "px",

																				 'margin-top': (nc.data('mt') * opt.bh) + "px",
																				 'margin-bottom': (nc.data('mb') * opt.bh) + "px",
																				 'margin-left': (nc.data('ml') * opt.bw) + "px",
																				 'margin-right': (nc.data('mr') * opt.bw) + "px",

																				 'border-top': (nc.data('bt') * opt.bh) + "px",
																				 'border-bottom': (nc.data('bb') * opt.bh) + "px",
																				 'border-left': (nc.data('bl') * opt.bw) + "px",
																				 'border-right': (nc.data('br') * opt.bw) + "px",

																				 'line-height': (nc.data('lh') * opt.bh) + "px",
																				 'height':(hh*opt.bh)+'px'
																				});
																	else  {

																		   offsetx=0; offsety=0;
																		   nextcaption.data('x',0)
																		   nextcaption.data('y',0)

																		   var ovhh = opt.height
																		   if (opt.autoHeight=="on")
																		   		ovhh = opt.container.height()
																			nextcaption.css({

																				'width':opt.width,
																				'height':ovhh
																			});
																		}

															if (html5vid == false) {
																im.width(ww*opt.bw);
																im.height(hh*opt.bh);
															}

															else

															if (nextcaption.data('forcecover')!=1 && !nextcaption.hasClass('fullscreenvideo')) {
																im.width(ww*opt.bw);
																im.height(hh*opt.bh);
															}


															imw = im.width();
															imh = im.height();
														}

											else {


												nextcaption.find('.tp-resizeme, .tp-resizeme *').each(function() {
														calcCaptionResponsive(jQuery(this),opt);
												});

												if (nextcaption.hasClass("tp-resizeme")) {
													nextcaption.find('*').each(function() {
														calcCaptionResponsive(jQuery(this),opt);
													});
												}

												calcCaptionResponsive(nextcaption,opt);

												imh=nextcaption.outerHeight(true);
												imw=nextcaption.outerWidth(true);

												// NEXTCAPTION FRONTCORNER CHANGES
												var ncch = nextcaption.outerHeight();
												var bgcol = nextcaption.css('backgroundColor');
												nextcaption.find('.frontcorner').css({
																'borderWidth':ncch+"px",
																'left':(0-ncch)+'px',
																'borderRight':'0px solid transparent',
																'borderTopColor':bgcol
												});

												nextcaption.find('.frontcornertop').css({
																'borderWidth':ncch+"px",
																'left':(0-ncch)+'px',
																'borderRight':'0px solid transparent',
																'borderBottomColor':bgcol
												});

												// NEXTCAPTION BACKCORNER CHANGES
												nextcaption.find('.backcorner').css({
																'borderWidth':ncch+"px",
																'right':(0-ncch)+'px',
																'borderLeft':'0px solid transparent',
																'borderBottomColor':bgcol
												});

												// NEXTCAPTION BACKCORNER CHANGES
												nextcaption.find('.backcornertop').css({
																'borderWidth':ncch+"px",
																'right':(0-ncch)+'px',
																'borderLeft':'0px solid transparent',
																'borderTopColor':bgcol
												});

											 }


									}

									if (opt.fullScreenAlignForce == "on") {
										//xbw = 1;
										//xbh = 1;
										offsetx=0;
										offsety=0;
									}



									if (nextcaption.data('voffset')==undefined) nextcaption.data('voffset',0);
									if (nextcaption.data('hoffset')==undefined) nextcaption.data('hoffset',0);

									var vofs= nextcaption.data('voffset')*xbw;
									var hofs= nextcaption.data('hoffset')*xbw;

									var crw = opt.startwidth*xbw;
									var crh = opt.startheight*xbw;

									if (opt.fullScreenAlignForce == "on") {
										crw = opt.container.width();
										crh = opt.container.height();
									}



									// CENTER THE CAPTION HORIZONTALLY
									if (nextcaption.data('x')=="center" || nextcaption.data('xcenter')=='center') {
										nextcaption.data('xcenter','center');
										//nextcaption.data('x',(crw/2 - nextcaption.outerWidth(true)/2)/xbw+  hofs);
										nextcaption.data('x',(crw/2 - nextcaption.outerWidth(true)/2) +  hofs);


									}

									// ALIGN LEFT THE CAPTION HORIZONTALLY
									if (nextcaption.data('x')=="left" || nextcaption.data('xleft')=='left') {
										nextcaption.data('xleft','left');

										nextcaption.data('x',(0)/xbw+hofs);

									}

									// ALIGN RIGHT THE CAPTION HORIZONTALLY
									if (nextcaption.data('x')=="right" || nextcaption.data('xright')=='right') {
										nextcaption.data('xright','right');
										nextcaption.data('x',((crw - nextcaption.outerWidth(true))+hofs)/xbw);
										//konsole.log("crw:"+crw+"  width:"+nextcaption.outerWidth(true)+"  xbw:"+xbw);
										//konsole.log("x-pos:"+nextcaption.data('x'))
									}


									// CENTER THE CAPTION VERTICALLY
									if (nextcaption.data('y')=="center" || nextcaption.data('ycenter')=='center') {
										nextcaption.data('ycenter','center');
										nextcaption.data('y',(crh/2 - nextcaption.outerHeight(true)/2) + vofs);
									}

									// ALIGN TOP THE CAPTION VERTICALLY
									if (nextcaption.data('y')=="top" || nextcaption.data('ytop')=='top') {
										nextcaption.data('ytop','top');
										nextcaption.data('y',(0)/opt.bh+vofs);

									}

									// ALIGN BOTTOM THE CAPTION VERTICALLY
									if (nextcaption.data('y')=="bottom" || nextcaption.data('ybottom')=='bottom') {
										nextcaption.data('ybottom','bottom');
										nextcaption.data('y',((crh - nextcaption.outerHeight(true))+vofs)/xbw);

									}



									// THE TRANSITIONS OF CAPTIONS
									// MDELAY AND MSPEED
									if (nextcaption.data('start') == undefined) nextcaption.data('start',1000);



									var easedata=nextcaption.data('easing');
									if (easedata==undefined) easedata="punchgs.Power1.easeOut";


									var mdelay = nextcaption.data('start')/1000,
										mspeed = nextcaption.data('speed')/1000;


									if (nextcaption.data('x')=="center" || nextcaption.data('xcenter')=='center')
										var calcx = (nextcaption.data('x')+offsetx);
									else {

										var calcx = (xbw*nextcaption.data('x')+offsetx);
									}


									if (nextcaption.data('y')=="center" || nextcaption.data('ycenter')=='center')
										var calcy = (nextcaption.data('y')+offsety);
									else {
										//if (opt.fullScreenAlignForce == "on" && (nextcaption.data('y')=="bottom" || nextcaption.data('ybottom')=='bottom'))
										//	opt.bh = 1;

										var calcy = (opt.bh*nextcaption.data('y')+offsety);
									}


							punchgs.TweenLite.set(nextcaption,{top:calcy,left:calcx,overwrite:"auto"});

							if (staticdirection == 0)
								internrecalled = true;

							if (nextcaption.data('timeline')!=undefined && !internrecalled) {
								if (staticdirection!=2)
									nextcaption.data('timeline').gotoAndPlay(0);
								internrecalled = true;
							}

							if (!internrecalled) {



									// CLEAR THE TIMELINE, SINCE IT CAN BE DAMAGED, OR PAUSED AT A FEW PART
									if (nextcaption.data('timeline')!=undefined) {
										//nextcaption.data('timeline').clear();
									 }

									var tl = new punchgs.TimelineLite({smoothChildTiming:true,onStart:tlstart});
									tl.pause();


									if (opt.fullScreenAlignForce == "on") {
										//calcy = nextcaption.data('y')+offsety;
									}

									var animobject = nextcaption;
									if (nextcaption.data('mySplitText') !=undefined) nextcaption.data('mySplitText').revert();


									if (nextcaption.data('splitin') == "chars" || nextcaption.data('splitin') == "words" || nextcaption.data('splitin') == "lines" || nextcaption.data('splitout') == "chars" || nextcaption.data('splitout') == "words" || nextcaption.data('splitout') == "lines") {
										if (nextcaption.find('a').length>0)
											nextcaption.data('mySplitText',new punchgs.SplitText(nextcaption.find('a'),{type:"lines,words,chars",charsClass:"tp-splitted",wordsClass:"tp-splitted",linesClass:"tp-splitted"}));
										else
										if (nextcaption.find('.tp-layer-inner-rotation').length>0)
											nextcaption.data('mySplitText',new punchgs.SplitText(nextcaption.find('.tp-layer-inner-rotation'),{type:"lines,words,chars",charsClass:"tp-splitted",wordsClass:"tp-splitted",linesClass:"tp-splitted"}));
										else
											nextcaption.data('mySplitText',new punchgs.SplitText(nextcaption,{type:"lines,words,chars",charsClass:"tp-splitted",wordsClass:"tp-splitted",linesClass:"tp-splitted"}));

										nextcaption.addClass("splitted");
									}

									if (nextcaption.data('splitin') == "chars")
										animobject = nextcaption.data('mySplitText').chars;


									if (nextcaption.data('splitin') == "words")
										animobject = nextcaption.data('mySplitText').words;


									if (nextcaption.data('splitin') == "lines")
										animobject = nextcaption.data('mySplitText').lines;



									var frm = newAnimObject();
									var endfrm = newAnimObject();


									if (nextcaption.data('repeat')!=undefined) repeatV = nextcaption.data('repeat');
									if (nextcaption.data('yoyo')!=undefined) yoyoV = nextcaption.data('yoyo');
									if (nextcaption.data('repeatdelay')!=undefined) repeatdelayV = nextcaption.data('repeatdelay');

									var ncc = nextcaption.attr('class');

									// WHICH ANIMATION TYPE SHOULD BE USED
									if (ncc.match("customin")) frm = getAnimDatas(frm,nextcaption.data('customin'));
									else
									if (ncc.match("randomrotate")) {

												frm.scale = Math.random()*3+1;
												frm.rotation = Math.round(Math.random()*200-100);
												frm.x = Math.round(Math.random()*200-100);
												frm.y = Math.round(Math.random()*200-100);
									}
									else
									if (ncc.match('lfr') || ncc.match('skewfromright')) frm.x = 15+opt.width;
									else
									if (ncc.match('lfl') || ncc.match('skewfromleft')) frm.x = -15-imw;
									else
									if (ncc.match('sfl') || ncc.match('skewfromleftshort')) frm.x = -50;
									else
									if (ncc.match('sfr') || ncc.match('skewfromrightshort')) frm.x = 50;
									else
									if (ncc.match('lft')) frm.y = -25 - imh;
									else
									if (ncc.match('lfb')) frm.y = 25 + opt.height;
									else
									if (ncc.match('sft')) frm.y = -50;
									else
									if (ncc.match('sfb')) frm.y = 50;


									if (ncc.match('skewfromright') || nextcaption.hasClass('skewfromrightshort')) frm.skewX = -85
									else
									if (ncc.match('skewfromleft') || nextcaption.hasClass('skewfromleftshort')) frm.skewX =  85


									if (ncc.match("fade") || ncc.match('sft') || ncc.match('sfl') || ncc.match('sfb') || ncc.match('skewfromleftshort')  || ncc.match('sfr') || ncc.match('skewfromrightshort'))
										frm.opacity = 0;

									// FOR SAFARI WE NEED TO REMOVE 3D ROTATIONS
									if (get_browser().toLowerCase()=="safari") {
										//frm.rotationX=0;frm.rotationY=0;
									}

									var elemdelay = (nextcaption.data('elementdelay') == undefined) ? 0 : nextcaption.data('elementdelay');
									endfrm.ease = frm.ease = (nextcaption.data('easing') == undefined) ? punchgs.Power1.easeInOut : nextcaption.data('easing');


									// DISTANCES SHOULD BE RESIZED ALSO

									frm.data = new Object();
									frm.data.oldx = frm.x;
									frm.data.oldy = frm.y;

									endfrm.data = new Object();
									endfrm.data.oldx = endfrm.x;
									endfrm.data.oldy = endfrm.y;

									frm.x = frm.x * xbw;
									frm.y = frm.y * xbw;

									var newtl = new punchgs.TimelineLite();


									if (staticdirection != 2) {

										// CHANGE to punchgs.TweenLite.  if Yoyo and Repeat is used. Dont forget to laod the Right Tools for it !!
										if (ncc.match("customin")) {
											  if (animobject != nextcaption)
												  tl.add(punchgs.TweenLite.set(nextcaption, { force3D:"auto",opacity:1,scaleX:1,scaleY:1,rotationX:0,rotationY:0,rotationZ:0,skewX:0,skewY:0,z:0,x:0,y:0,visibility:'visible',delay:0,overwrite:"all"}));
											  frm.visibility = "hidden";
											  endfrm.visibility = "visible";
											  endfrm.overwrite = "all";
											  endfrm.opacity = 1;
											  endfrm.onComplete = animcompleted();
											  endfrm.delay = mdelay;
											  endfrm.force3D="auto"

											  tl.add(newtl.staggerFromTo(animobject,mspeed,frm,endfrm,elemdelay),"frame0");

										} else {

												frm.visibility = "visible";
												frm.transformPerspective = 600;
												if (animobject != nextcaption)
												  tl.add(punchgs.TweenLite.set(nextcaption, { force3D:"auto",opacity:1,scaleX:1,scaleY:1,rotationX:0,rotationY:0,rotationZ:0,skewX:0,skewY:0,z:0,x:0,y:0,visibility:'visible',delay:0,overwrite:"all"}));

												endfrm.visibility = "visible";
												endfrm.delay = mdelay;
												endfrm.onComplete = animcompleted();
												endfrm.opacity = 1;
												endfrm.force3D="auto";
												if (ncc.match("randomrotate") && animobject != nextcaption) {

													for (var i=0;i<animobject.length;i++) {
														var obj =new Object();
														var endobj = new Object();
														jQuery.extend(obj,frm);
														jQuery.extend(endobj,endfrm);
														frm.scale = Math.random()*3+1;
														frm.rotation = Math.round(Math.random()*200-100);
														frm.x = Math.round(Math.random()*200-100);
														frm.y = Math.round(Math.random()*200-100);

														if (i!=0) endobj.delay = mdelay + (i*elemdelay);


														tl.append(punchgs.TweenLite.fromTo(animobject[i],mspeed,obj,endobj),"frame0");
													}



												}	else
												tl.add(newtl.staggerFromTo(animobject,mspeed,frm,endfrm,elemdelay),"frame0");
												//tl.add(punchgs.TweenLite.fromTo(nextcaption,mspeed,frm,endfrm),"frame0");
										}
									}

									// SAVE IT TO NCAPTION BEFORE NEW STEPS WILL BE ADDED
									nextcaption.data('timeline',tl);

									// FURTHER ANIMATIONS IN CASE THERE ARE MORE THAN ONE STEP IN THE ANIMATION CHAIN
									var frames = new Array();
									if (nextcaption.data('frames')!=undefined) {
										var rowtext = nextcaption.data('frames');
										rowtext = rowtext.replace(/\s+/g, '');
										rowtext = rowtext.replace("{","");
										var spframes = rowtext.split('}');
										jQuery.each(spframes,function(index,spframe){
											if (spframe.length>0) {
												var params = getAnimSteps(spframe);

												addMoveCaption(nextcaption,opt,params,"frame"+(index+10),xbw)

											}
										})
									} // END OF ANIMATION STEPS

									tl = nextcaption.data('timeline');
									// IF THERE IS ANY EXIT ANIM DEFINED
									// For Static Layers -> 1 -> In,  2-> Out  0-> Ignore  -1-> Not Static
									if ((nextcaption.data('end')!=undefined) && (staticdirection==-1 || staticdirection==2)) {
										endMoveCaption(nextcaption,opt,nextcaption.data('end')/1000,frm,"frame99",xbw);
									} else {
										if (staticdirection==-1 || staticdirection==2)
											endMoveCaption(nextcaption,opt,999999,frm,"frame99",xbw);
										else
											endMoveCaption(nextcaption,opt,200,frm,"frame99",xbw);
									}

									// SAVE THE TIMELINE IN DOM ELEMENT
									tl = nextcaption.data('timeline');
									nextcaption.data('timeline',tl);
									callCaptionLoops(nextcaption,xbw);
									tl.resume();
							 }
						  }

						  if (internrecalled) {
						  			killCaptionLoops(nextcaption);
						  			callCaptionLoops(nextcaption,xbw);

							  		if (nextcaption.data('timeline') != undefined) {
								  		var tweens = nextcaption.data('timeline').getTweensOf();
								  		jQuery.each(tweens,function(index,tween) {
									  		if (tween.vars.data != undefined) {
									  			var newx =  tween.vars.data.oldx * xbw;
									  			var newy =  tween.vars.data.oldy * xbw;
									  			if (tween.progress() !=1 && tween.progress()!=0) {
									  				try{
											  			//tween.updateTo({x:newx, y:newy},true);
											  			tween.vars.x = newx;
											  			tween.vary.y = newy;
											  		  } catch(e) {

											  		  }
										  		} else {
										  			if (tween.progress()==1) {
											  				punchgs.TweenLite.set(tween.target,{x:newx,y:newy});
											  		}
											  	}
									  		}
								  		})
								  	}
						  }

					})

						var bt=jQuery('body').find('#'+opt.container.attr('id')).find('.tp-bannertimer');
						bt.data('opt',opt);



					if (mtl != undefined) setTimeout(function() {
						mtl.resume();
					},30);

				}


				var get_browser = function(){
				    var N=navigator.appName, ua=navigator.userAgent, tem;
				    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
				    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
				    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
				    return M[0];
				    }
				var get_browser_version  = function(){
				    var N=navigator.appName, ua=navigator.userAgent, tem;
				    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
				    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
				    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
				    return M[1];
				    }

				/////////////////////////////////////////////////////////////////
				//	-	CALCULATE THE RESPONSIVE SIZES OF THE CAPTIONS	-	  //
				/////////////////////////////////////////////////////////////////
				var calcCaptionResponsive = function(nc,opt) {
								if (nc.data('fsize') == undefined) nc.data('fsize',parseInt(nc.css('font-size'),0) || 0);
								if (nc.data('pt') == undefined) nc.data('pt',parseInt(nc.css('paddingTop'),0) || 0);
								if (nc.data('pb') == undefined) nc.data('pb',parseInt(nc.css('paddingBottom'),0) || 0);
								if (nc.data('pl') == undefined) nc.data('pl',parseInt(nc.css('paddingLeft'),0) || 0);
								if (nc.data('pr') == undefined) nc.data('pr',parseInt(nc.css('paddingRight'),0) || 0);

								if (nc.data('mt') == undefined) nc.data('mt',parseInt(nc.css('marginTop'),0) || 0);
								if (nc.data('mb') == undefined) nc.data('mb',parseInt(nc.css('marginBottom'),0) || 0);
								if (nc.data('ml') == undefined) nc.data('ml',parseInt(nc.css('marginLeft'),0) || 0);
								if (nc.data('mr') == undefined) nc.data('mr',parseInt(nc.css('marginRight'),0) || 0);

								if (nc.data('bt') == undefined) nc.data('bt',parseInt(nc.css('borderTopWidth'),0) || 0);
								if (nc.data('bb') == undefined) nc.data('bb',parseInt(nc.css('borderBottomWidth'),0) || 0);
								if (nc.data('bl') == undefined) nc.data('bl',parseInt(nc.css('borderLeftWidth'),0) || 0);
								if (nc.data('br') == undefined) nc.data('br',parseInt(nc.css('borderRightWidth'),0) || 0);

								if (nc.data('ls') == undefined) nc.data('ls',parseInt(nc.css('letterSpacing'),0) || 0);

								if (nc.data('lh') == undefined) nc.data('lh',parseInt(nc.css('lineHeight'),0) || "auto");
								if (nc.data('minwidth') == undefined) nc.data('minwidth',parseInt(nc.css('minWidth'),0) || 0);
								if (nc.data('minheight') == undefined) nc.data('minheight',parseInt(nc.css('minHeight'),0) || 0);
								if (nc.data('maxwidth') == undefined) nc.data('maxwidth',parseInt(nc.css('maxWidth'),0) || "none");
								if (nc.data('maxheight') == undefined) nc.data('maxheight',parseInt(nc.css('maxHeight'),0) || "none");
								if (nc.data('wii') == undefined) nc.data('wii',parseInt(nc.css('width'),0) || 0);
								if (nc.data('hii') == undefined) nc.data('hii',parseInt(nc.css('height'),0) || 0);

								if (nc.data('wan') == undefined) nc.data('wan',nc.css("-webkit-transition"));
								if (nc.data('moan') == undefined) nc.data('moan',nc.css("-moz-animation-transition"));
								if (nc.data('man') == undefined) nc.data('man',nc.css("-ms-animation-transition"));
								if (nc.data('ani') == undefined) nc.data('ani',nc.css("transition"));

								// IE8 FIX FOR AUTO LINEHEIGHT
								if (nc.data('lh')=="auto") nc.data('lh',nc.data('fsize')+4);




								if (!nc.hasClass("tp-splitted")) {


										nc.css("-webkit-transition", "none");
									    nc.css("-moz-transition", "none");
									    nc.css("-ms-transition", "none");
									    nc.css("transition", "none");

										punchgs.TweenLite.set(nc,{
														 fontSize: Math.round((nc.data('fsize') * opt.bw))+"px",

														 letterSpacing:Math.floor((nc.data('ls') * opt.bw))+"px",

														 paddingTop: Math.round((nc.data('pt') * opt.bh)) + "px",
														 paddingBottom: Math.round((nc.data('pb') * opt.bh)) + "px",
														 paddingLeft: Math.round((nc.data('pl') * opt.bw)) + "px",
														 paddingRight: Math.round((nc.data('pr') * opt.bw)) + "px",

														 marginTop: (nc.data('mt') * opt.bh) + "px",
														 marginBottom: (nc.data('mb') * opt.bh) + "px",
														 marginLeft: (nc.data('ml') * opt.bw) + "px",
														 marginRight: (nc.data('mr') * opt.bw) + "px",

														 borderTopWidth: Math.round((nc.data('bt') * opt.bh)) + "px",
														 borderBottomWidth: Math.round((nc.data('bb') * opt.bh)) + "px",
														 borderLeftWidth: Math.round((nc.data('bl') * opt.bw)) + "px",
														 borderRightWidth: Math.round((nc.data('br') * opt.bw)) + "px",

														 lineHeight: Math.round((nc.data('lh') * opt.bh)) + "px",
														 minWidth:(nc.data('minwidth') * opt.bw) + "px",
														 minHeight:(nc.data('minheight') * opt.bh) + "px",

														/* width:(nc.data('wii') * opt.bw) + "px",
														 height:(nc.data('hii') * opt.bh) + "px",														 */

														 overwrite:"auto"
										});
										setTimeout(function() {
											nc.css("-webkit-transition", nc.data('wan'));
										    nc.css("-moz-transition", nc.data('moan'));
										    nc.css("-ms-transition", nc.data('man'));
										    nc.css("transition", nc.data('ani'));

										},30);

										//konsole.log(nc.data('maxwidth')+"  "+nc.data('maxheight'));
										if (nc.data('maxheight')!='none')
											nc.css({'maxHeight':(nc.data('maxheight') * opt.bh) + "px"});


										if (nc.data('maxwidth')!='none')
											nc.css({'maxWidth':(nc.data('maxwidth') * opt.bw) + "px"});
								}
						}


				/******************************
					-	CAPTION LOOPS	-
				********************************/


				var callCaptionLoops = function(nextcaption,factor) {

									// SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
									nextcaption.find('.rs-pendulum').each(function() {
										var el = jQuery(this);
										if (el.data('timeline')==undefined) {
											el.data('timeline',new punchgs.TimelineLite);
											var startdeg = el.data('startdeg')==undefined ? -20 : el.data('startdeg'),
												enddeg = el.data('enddeg')==undefined ? 20 : el.data('enddeg'),
												speed = el.data('speed')==undefined ? 2 : el.data('speed'),
												origin = el.data('origin')==undefined ? "50% 50%" : el.data('origin'),
												easing = el.data('easing')==undefined ? punchgs.Power2.easeInOut : el.data('ease');

											startdeg = startdeg * factor;
											enddeg = enddeg * factor;

											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",rotation:startdeg,transformOrigin:origin},{rotation:enddeg,ease:easing}));
											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",rotation:enddeg,transformOrigin:origin},{rotation:startdeg,ease:easing,onComplete:function() {
												el.data('timeline').restart();
											}}));
										}

									})

									// SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
									nextcaption.find('.rs-rotate').each(function() {
										var el = jQuery(this);
										if (el.data('timeline')==undefined) {
											el.data('timeline',new punchgs.TimelineLite);
											var startdeg = el.data('startdeg')==undefined ? 0 : el.data('startdeg'),
												enddeg = el.data('enddeg')==undefined ? 360 : el.data('enddeg');
												speed = el.data('speed')==undefined ? 2 : el.data('speed'),
												origin = el.data('origin')==undefined ? "50% 50%" : el.data('origin'),
												easing = el.data('easing')==undefined ? punchgs.Power2.easeInOut : el.data('easing');

											startdeg = startdeg * factor;
											enddeg = enddeg * factor;

											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",rotation:startdeg,transformOrigin:origin},{rotation:enddeg,ease:easing,onComplete:function() {
												el.data('timeline').restart();
											}}));
										}

									})

									// SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
									nextcaption.find('.rs-slideloop').each(function() {
										var el = jQuery(this);
										if (el.data('timeline')==undefined) {
											el.data('timeline',new punchgs.TimelineLite);
											var xs = el.data('xs')==undefined ? 0 : el.data('xs'),
												ys = el.data('ys')==undefined ? 0 : el.data('ys'),
												xe = el.data('xe')==undefined ? 0 : el.data('xe'),
												ye = el.data('ye')==undefined ? 0 : el.data('ye'),
												speed = el.data('speed')==undefined ? 2 : el.data('speed'),
												easing = el.data('easing')==undefined ? punchgs.Power2.easeInOut : el.data('easing');

												xs = xs * factor;
												ys = ys * factor;
												xe = xe * factor;
												ye = ye * factor;

											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",x:xs,y:ys},{x:xe,y:ye,ease:easing}));
											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",x:xe,y:ye},{x:xs,y:ys,onComplete:function() {
												el.data('timeline').restart();
											}}));
										}

									})

									// SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
									nextcaption.find('.rs-pulse').each(function() {
										var el = jQuery(this);
										if (el.data('timeline')==undefined) {
											el.data('timeline',new punchgs.TimelineLite);
											var zoomstart = el.data('zoomstart')==undefined ? 0 : el.data('zoomstart'),
												zoomend = el.data('zoomend')==undefined ? 0 : el.data('zoomend'),
												speed = el.data('speed')==undefined ? 2 : el.data('speed'),
												easing = el.data('easing')==undefined ? punchgs.Power2.easeInOut : el.data('easing');

											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",scale:zoomstart},{scale:zoomend,ease:easing}));
											el.data('timeline').append(new punchgs.TweenLite.fromTo(el,speed,{force3D:"auto",scale:zoomend},{scale:zoomstart,onComplete:function() {
												el.data('timeline').restart();
											}}));
										}

									})

									nextcaption.find('.rs-wave').each(function() {
										var el = jQuery(this);
										if (el.data('timeline')==undefined) {
											el.data('timeline',new punchgs.TimelineLite);

											var angle= el.data('angle')==undefined ? 10 : el.data('angle'),
												radius = el.data('radius')==undefined ? 10 : el.data('radius'),
												speed = el.data('speed')==undefined ? -20 : el.data('speed'),
												origin = el.data('origin')==undefined ? -20 : el.data('origin');

												angle = angle*factor;
												radius = radius * factor;

											var angobj = {a:0, ang : angle, element:el, unit:radius};


												el.data('timeline').append(new punchgs.TweenLite.fromTo(angobj,speed,
																			{	a:360	},
																			{	a:0,
																				force3D:"auto",
																				ease:punchgs.Linear.easeNone,
																				onUpdate:function() {

																					var rad = angobj.a * (Math.PI / 180);
																		            punchgs.TweenLite.to(angobj.element,0.1,{force3D:"auto",x:Math.cos(rad) * angobj.unit, y:angobj.unit * (1 - Math.sin(rad))});

																				},
																				onComplete:function() {
																					el.data('timeline').restart();
																				}
																			}
																			));
										}

									})
				}

				var killCaptionLoops = function(nextcaption) {
							// SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
							nextcaption.find('.rs-pendulum, .rs-slideloop, .rs-pulse, .rs-wave').each(function() {
								var el = jQuery(this);
								if (el.data('timeline')!=undefined) {
										el.data('timeline').pause();
										el.data('timeline',null);
									}
								});
				}

				//////////////////////////
				//	REMOVE THE CAPTIONS //
				/////////////////////////
				var removeTheCaptions = function(actli,opt) {

						var removetime = 0;

						var allcaptions = actli.find('.tp-caption'),
							allstaticcaptions = opt.container.find('.tp-static-layers').find('.tp-caption');


						jQuery.each(allstaticcaptions, function(index,staticcapt) {
							allcaptions.push(staticcapt);
						});

						allcaptions.each(function(i) {



							    var staticdirection = -1;	// 1 -> In,  2-> Out  0-> Ignore  -1-> Not Static

								var nextcaption=jQuery(this);
								if (nextcaption.hasClass("tp-static-layer")) {

									if (nextcaption.data('startslide') == -1 || nextcaption.data('startslide') == "-1")
										nextcaption.data('startslide',0);

									if (nextcaption.data('endslide') == -1 || nextcaption.data('endslide') == "-1")
										nextcaption.data('endslide',opt.slideamount);



									// IF STATIC ITEM CURRENTLY NOT VISIBLE
									if (nextcaption.hasClass("tp-is-shown")) {

										if ((nextcaption.data('startslide') > opt.next) ||
											(nextcaption.data('endslide') < opt.next)) {

											staticdirection = 2;
											nextcaption.removeClass("tp-is-shown");
										} else {
											staticdirection = 0;
										}
									} else {
										staticdirection = 2;
									}



								}



							if (staticdirection != 0 ) {

									killCaptionLoops(nextcaption);

									if (nextcaption.find('iframe').length>0) {
																	// VIMEO VIDEO PAUSE
																	//if (nextcaption.data('vimeoid')!=undefined && String(nextcaption.data('vimeoid')).length>0)
																	  	punchgs.TweenLite.to(nextcaption.find('iframe'),0.2,{autoAlpha:0});
																	  	if (is_mobile()) nextcaption.find('iframe').remove();
																	try {
																		var ifr = nextcaption.find('iframe');
																		var id = ifr.attr('id');
																		var froogaloop = $f(id);
																		froogaloop.api("pause");
																		clearTimeout(nextcaption.data('timerplay'));
																	} catch(e) {}

																	try {
																		var player=nextcaption.data('player');
																		player.stopVideo();
																		clearTimeout(nextcaption.data('timerplay'));
																	} catch(e) {}
																}

									// IF HTML5 VIDEO IS EMBEDED
									if (nextcaption.find('video').length>0) {
													try{
														nextcaption.find('video').each(function(i) {
															var html5vid = jQuery(this).parent();
															var videoID =html5vid.attr('id');
															clearTimeout(html5vid.data('timerplay'));
															var video = this;
															video.pause();
														})
													}catch(e) {}
												} // END OF VIDEO JS FUNCTIONS
									try {

											//var tl = punchgs.TimelineLite.exportRoot();
											var tl = nextcaption.data('timeline');
											var endstarts = tl.getLabelTime("frame99");
											var curtime = tl.time();
											if (endstarts>curtime) {

												// WE NEED TO STOP ALL OTHER NIMATIONS
												var tweens = tl.getTweensOf(nextcaption);
												jQuery.each(tweens,function(index,tw) {

													if (index!=0)
														tw.pause();
												});
												if (nextcaption.css('opacity')!=0) {
													var spp = nextcaption.data('endspeed') == undefined ? nextcaption.data('speed') : nextcaption.data('endspeed');
													if (spp>removetime) removetime =spp;
													tl.play("frame99");
												} else
													tl.progress(1,false);
											}

										} catch(e) {}

							}

						});

						return removetime;
				}

				//////////////////////////////
				//	MOVE THE CAPTIONS  //
				////////////////////////////
				var addMoveCaption = function(nextcaption,opt,params,frame,downscale) {
							var tl = nextcaption.data('timeline');

							var newtl = new punchgs.TimelineLite();

							var animobject = nextcaption;

							if (params.typ == "chars") animobject = nextcaption.data('mySplitText').chars;
							else
							if (params.typ == "words") animobject = nextcaption.data('mySplitText').words;
							else
							if (params.typ == "lines") animobject = nextcaption.data('mySplitText').lines;
							params.animation.ease = params.ease;

							if (params.animation.rotationZ !=undefined) params.animation.rotation = params.animation.rotationZ;
							params.animation.data = new Object();
							params.animation.data.oldx = params.animation.x;
							params.animation.data.oldy = params.animation.y;

							params.animation.x = params.animation.x * downscale;
							params.animation.y = params.animation.y * downscale;


							tl.add(newtl.staggerTo(animobject,params.speed,params.animation,params.elementdelay),params.start);
							tl.addLabel(frame,params.start);

							nextcaption.data('timeline',tl);

				}
				//////////////////////////////
				//	MOVE OUT THE CAPTIONS  //
				////////////////////////////
				var endMoveCaption = function(nextcaption,opt,mdelay,backwards,frame,downscale) {

									var tl = nextcaption.data('timeline'),
										newtl = new punchgs.TimelineLite();

									var frm = newAnimObject(),
										mspeed= (nextcaption.data('endspeed') == undefined) ? nextcaption.data('speed') : nextcaption.data('endspeed'),
										ncc = nextcaption.attr('class');

									frm.ease = (nextcaption.data('endeasing') == undefined) ? punchgs.Power1.easeInOut : nextcaption.data('endeasing');

									mspeed = mspeed/1000;



									if (ncc.match('ltr') ||
										ncc.match('ltl') ||
										ncc.match('str') ||
										ncc.match('stl') ||
										ncc.match('ltt') ||
										ncc.match('ltb') ||
										ncc.match('stt') ||
										ncc.match('stb') ||
										ncc.match('skewtoright') ||
										ncc.match('skewtorightshort') ||
										ncc.match('skewtoleft') ||
										ncc.match('skewtoleftshort') ||
										ncc.match('fadeout') ||
										ncc.match("randomrotateout"))
									{

										if (ncc.match('skewtoright') || ncc.match('skewtorightshort')) frm.skewX = 35
										else
										if (ncc.match('skewtoleft') || ncc.match('skewtoleftshort')) frm.skewX =  -35


										if (ncc.match('ltr') || ncc.match('skewtoright'))
											frm.x=opt.width+60;
										else if (ncc.match('ltl') || ncc.match('skewtoleft'))
											frm.x=0-(opt.width+60);
										else if (ncc.match('ltt'))
											frm.y=0-(opt.height+60);
										else if (ncc.match('ltb'))
											frm.y=opt.height+60;
										else if (ncc.match('str') || ncc.match('skewtorightshort')) {
											frm.x=50;frm.opacity=0;
										} else if (ncc.match('stl') || ncc.match('skewtoleftshort')) {
											frm.x=-50;frm.opacity=0;
										} else if (ncc.match('stt')) {
											frm.y=-50;frm.opacity=0;
										} else if (ncc.match('stb')) {
											frm.y=50;frm.opacity=0;
										} else if (ncc.match("randomrotateout")) {
											frm.x = Math.random()*opt.width;
											frm.y = Math.random()*opt.height;
											frm.scale = Math.random()*2+0.3;
											frm.rotation = Math.random()*360-180;
											frm.opacity = 0;
										} else if (ncc.match('fadeout')) {
											frm.opacity = 0;
										}

										if (ncc.match('skewtorightshort')) frm.x = 270;
										else
										if (ncc.match('skewtoleftshort')) frm.x =  -270
										frm.data = new Object();
										frm.data.oldx = frm.x;
										frm.data.oldy = frm.y;
										frm.x = frm.x * downscale;
										frm.y = frm.y * downscale;

										frm.overwrite="auto";
										var animobject = nextcaption;
										var animobject = nextcaption;
										if (nextcaption.data('splitout') == "chars") animobject = nextcaption.data('mySplitText').chars;
										else
										if (nextcaption.data('splitout') == "words") animobject = nextcaption.data('mySplitText').words;
										else
										if (nextcaption.data('splitout') == "lines") animobject = nextcaption.data('mySplitText').lines;
										var elemdelay = (nextcaption.data('endelementdelay') == undefined) ? 0 : nextcaption.data('endelementdelay');
										//tl.add(punchgs.TweenLite.to(nextcaption,mspeed,frm),mdelay);
										tl.add(newtl.staggerTo(animobject,mspeed,frm,elemdelay),mdelay);

									}

									else

									if (nextcaption.hasClass("customout")) {

										frm = getAnimDatas(frm,nextcaption.data('customout'));
										var animobject = nextcaption;
										if (nextcaption.data('splitout') == "chars") animobject = nextcaption.data('mySplitText').chars;
										else
										if (nextcaption.data('splitout') == "words") animobject = nextcaption.data('mySplitText').words;
										else
										if (nextcaption.data('splitout') == "lines") animobject = nextcaption.data('mySplitText').lines;

										var elemdelay = (nextcaption.data('endelementdelay') == undefined) ? 0 : nextcaption.data('endelementdelay');
										frm.onStart = function() {

																 punchgs.TweenLite.set(nextcaption,{
																	  transformPerspective:frm.transformPerspective,
																	  transformOrigin:frm.transformOrigin,
																	  overwrite:"auto"
																  });
										}

										frm.data = new Object();
										frm.data.oldx = frm.x;
										frm.data.oldy = frm.y;

										frm.x = frm.x * downscale;
										frm.y = frm.y * downscale;

										tl.add(newtl.staggerTo(animobject,mspeed,frm,elemdelay),mdelay);
									}

									else {
										backwards.delay = 0;
										tl.add(punchgs.TweenLite.to(nextcaption,mspeed,backwards),mdelay);
									}


								tl.addLabel(frame,mdelay);

								nextcaption.data('timeline',tl);
			}

		///////////////////////////
		//	REMOVE THE LISTENERS //
		///////////////////////////
		var removeAllListeners = function(container,opt) {
			container.children().each(function() {
			  try{ jQuery(this).die('click'); } catch(e) {}
			  try{ jQuery(this).die('mouseenter');} catch(e) {}
			  try{ jQuery(this).die('mouseleave');} catch(e) {}
			  try{ jQuery(this).unbind('hover');} catch(e) {}
			})
			try{ container.die('click','mouseenter','mouseleave');} catch(e) {}
			clearInterval(opt.cdint);
			container=null;
		}

		///////////////////////////
		//	-	countDown	-	//
		/////////////////////////
		var countDown = function(container,opt) {
			opt.cd=0;
			opt.loop=0;
			if (opt.stopAfterLoops!=undefined && opt.stopAfterLoops>-1)
					opt.looptogo=opt.stopAfterLoops;
			else
				opt.looptogo=9999999;

			if (opt.stopAtSlide!=undefined && opt.stopAtSlide>-1)
					opt.lastslidetoshow=opt.stopAtSlide;
			else
					opt.lastslidetoshow=999;

			opt.stopLoop="off";

			if (opt.looptogo==0) opt.stopLoop="on";


			if (opt.slideamount >1 && !(opt.stopAfterLoops==0 && opt.stopAtSlide==1) ) {
					var bt=container.find('.tp-bannertimer');


					// LISTENERS  //container.trigger('stoptimer');
					container.on('stoptimer',function() {
						var bt = jQuery(this).find('.tp-bannertimer');
						bt.data('tween').pause();
						if (opt.hideTimerBar=="on") bt.css({visibility:"hidden"});
					});
					container.on('starttimer',function() {

						if (opt.conthover!=1 && opt.videoplaying!=true && opt.width>opt.hideSliderAtLimit && opt.bannertimeronpause != true && opt.overnav !=true)
							if ((opt.stopLoop=="on" && opt.next==opt.lastslidetoshow-1) || opt.noloopanymore == 1)
							   opt.noloopanymore = 1;
							else {

								bt.css({visibility:"visible"});
								bt.data('tween').resume();
							}

							if (opt.hideTimerBar=="on") bt.css({visibility:"hidden"});
					});
					container.on('restarttimer',function() {
						var bt = jQuery(this).find('.tp-bannertimer');
						if ((opt.stopLoop=="on" && opt.next==opt.lastslidetoshow-1) || opt.noloopanymore == 1)
							   	opt.noloopanymore = 1;
							else {

								bt.css({visibility:"visible"});
								bt.data('tween').kill();
								bt.data('tween',punchgs.TweenLite.fromTo(bt,opt.delay/1000,{width:"0%"},{force3D:"auto",width:"100%",ease:punchgs.Linear.easeNone,onComplete:countDownNext,delay:1}));

							}
							if (opt.hideTimerBar=="on") bt.css({visibility:"hidden"});
					});

					container.on('nulltimer',function() {
							bt.data('tween').pause(0);
							if (opt.hideTimerBar=="on") bt.css({visibility:"hidden"});
					});



					 var countDownNext = function() {
						if (jQuery('body').find(container).length==0) {
							removeAllListeners(container,opt);
							clearInterval(opt.cdint);
						}

						container.trigger("revolution.slide.slideatend");

						//STATE OF API CHANGED -> MOVE TO AIP BETTER
						if (container.data('conthover-changed') == 1) {
							opt.conthover=	container.data('conthover');
							container.data('conthover-changed',0);
						}

						// SWAP TO NEXT BANNER
						opt.act=opt.next;
						opt.next=opt.next+1;

						if (opt.next>container.find('>ul >li').length-1) {
								opt.next=0;
								opt.looptogo=opt.looptogo-1;

								if (opt.looptogo<=0) {
										opt.stopLoop="on";

								}
							}

						// STOP TIMER IF NO LOOP NO MORE NEEDED.

						if (opt.stopLoop=="on" && opt.next==opt.lastslidetoshow-1) {
								container.find('.tp-bannertimer').css({'visibility':'hidden'});
								container.trigger('revolution.slide.onstop');
								opt.noloopanymore = 1;
						} else {
							bt.data('tween').restart();
						}

						// SWAP THE SLIDES
						swapSlide(container,opt);

					}

					bt.data('tween',punchgs.TweenLite.fromTo(bt,opt.delay/1000,{width:"0%"},{force3D:"auto",width:"100%",ease:punchgs.Linear.easeNone,onComplete:countDownNext,delay:1}));
					bt.data('opt',opt);


					container.hover(
						function() {

							if (opt.onHoverStop=="on" && (!is_mobile())) {
								container.trigger('stoptimer');

								container.trigger('revolution.slide.onpause');
								var nextsh = container.find('>ul >li:eq('+opt.next+') .slotholder');
								nextsh.find('.defaultimg').each(function() {
									var dimg = jQuery(this);
									if (dimg.data('kenburn')!=undefined) {
									   dimg.data('kenburn').pause();
									 }
								});
							}
						},
						function() {
							if (container.data('conthover')!=1) {
								container.trigger('revolution.slide.onresume');
								container.trigger('starttimer');

								var nextsh = container.find('>ul >li:eq('+opt.next+') .slotholder');
								nextsh.find('.defaultimg').each(function() {
									var dimg = jQuery(this);
									if (dimg.data('kenburn')!=undefined) {
									   dimg.data('kenburn').play();
									 }
								});
							}
						});
			}
		}


	//////////////////
	// IS MOBILE ?? //
	//////////////////
	var is_mobile = function() {
	    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry','Android', 'webos', ,'iPod', 'iPhone', 'iPad', 'Blackberry', 'BlackBerry'];
		var ismobile=false;
	    for(var i in agents) {

		    if (navigator.userAgent.split(agents[i]).length>1) {
	            ismobile = true;

	          }
	    }
	    return ismobile;
	}



/**************************************************************************
 * Revolution Slider - PAN ZOOM MODULE
 * @version: 1.0 (03.06.2013)
 * @author ThemePunch
**************************************************************************/

	/***********************************************
		-	KEN BURN BACKGROUND FIT CALCULATOR	-
	***********************************************/
	var calculateKenBurnScales = function(proc,sloth,opt) {
				var ow = sloth.data('owidth');
				var oh = sloth.data('oheight');

				if (ow / oh > opt.width / opt.height) {
					var factor = (opt.container.width() /ow);
					var nheight = oh * factor;
					var hfactor = (nheight / opt.container.height())*proc;
					proc = proc * (100/hfactor);
					hfactor = 100;
					proc = proc;
					return (proc+"% "+hfactor+"%"+" 1");
				} else {
					var factor = (opt.container.width() /ow);
					var nheight = oh * factor;
					var hfactor = (nheight / opt.container.height())*proc;
					return (proc+"% "+hfactor+"%");
				}
			}



	/******************************
		-	startKenBurn	-
	********************************/
	var startKenBurn = function(container,opt,recalc,prepareonly) {

		try{
			var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
		} catch(e) {
			var actli=container.find('>ul:first-child >li:eq(1)');
		}

		opt.lastslide=opt.act;


		var nextli = container.find('>ul:first-child >li:eq('+opt.next+')'),
			nextsh = nextli.find('.slotholder'),
			bgps = nextsh.data('bgposition'),
			bgpe = nextsh.data('bgpositionend'),
			zos = nextsh.data('zoomstart')/100,
			zoe = nextsh.data('zoomend')/100,
			ros = nextsh.data('rotationstart'),
			roe = nextsh.data('rotationend'),
			bgfs = nextsh.data('bgfit'),
			bgfe = nextsh.data('bgfitend'),
			easeme = nextsh.data('easeme'),
			dur = nextsh.data('duration')/1000,
			bgfb = 100;


			if (bgfs==undefined) bgfs=100;
			if (bgfe==undefined) bgfe=100;
			var obgfs = bgfs,
				obgfe = bgfe;

			bgfs = calculateKenBurnScales(bgfs,nextsh,opt);
			bgfe = calculateKenBurnScales(bgfe,nextsh,opt);
			bgfb = calculateKenBurnScales(100,nextsh,opt);


			if (zos==undefined) zos=1;
			if (zoe==undefined) zoe=1;
			if (ros==undefined) ros=0;
			if (roe==undefined) roe=0;

			if (zos<1) zos=1;
			if (zoe<1) zoe=1;


			var imgobj = new Object();
			imgobj.w = parseInt(bgfb.split(" ")[0],0),
			imgobj.h = parseInt(bgfb.split(" ")[1],0);

			var turned = false;
			if (bgfb.split(" ")[2] == "1") {
				turned = true;
			}

			nextsh.find('.defaultimg').each(function() {
				var defimg = jQuery(this);
				if (nextsh.find('.kenburnimg').length==0)
					nextsh.append('<div class="kenburnimg" style="position:absolute;z-index:1;width:100%;height:100%;top:0px;left:0px;"><img src="'+defimg.attr('src')+'" style="-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;position:absolute;width:'+imgobj.w+'%;height:'+imgobj.h+'%;"></div>');
				else {
					nextsh.find('.kenburnimg img').css({width:imgobj.w+'%',height:imgobj.h+'%'});
				}



				var kbimg = nextsh.find('.kenburnimg img');


				var imgs = calculateKenBurnImgPos(opt,bgps,bgfs,kbimg,turned),
					imge = calculateKenBurnImgPos(opt,bgpe,bgfe,kbimg,turned);

				if (turned) {
					imgs.w = obgfs/100;
					imge.w = obgfe/100;
				}



				if (prepareonly) {

					punchgs.TweenLite.set(kbimg,{autoAlpha:0,
											transformPerspective:1200,
											transformOrigin:"0% 0%",
											top:0,left:0,
											scale:imgs.w,
											x:imgs.x,
											y:imgs.y});
					var sx = imgs.w,
						ww = (sx * kbimg.width()) - opt.width,
						hh = (sx * kbimg.height()) - opt.height,
						hor = Math.abs((imgs.x / ww)*100),
						ver = Math.abs((imgs.y / hh)*100);
						if (hh==0) ver =0;
						if (ww == 0) hor = 0;
					defimg.data('bgposition',hor+"% "+ver+"%");
					if (!isIE(8)) defimg.data('currotate',getRotationDegrees(kbimg));
					if (!isIE(8)) defimg.data('curscale',(imgobj.w*sx)+"%  "+(imgobj.h*sx+"%"));

					nextsh.find('.kenburnimg').remove();
				}
				else
					defimg.data('kenburn',punchgs.TweenLite.fromTo(kbimg,dur,{autoAlpha:1, force3D:punchgs.force3d, transformOrigin:"0% 0%", top:0,left:0, scale:imgs.w, x:imgs.x, y:imgs.y},{autoAlpha:1,rotationZ:roe,ease:easeme, x:imge.x, y:imge.y,scale:imge.w,onUpdate:function() {
							var sx = kbimg[0]._gsTransform.scaleX;
							var ww = (sx * kbimg.width()) - opt.width,
								hh = (sx * kbimg.height()) - opt.height,
								hor = Math.abs((kbimg[0]._gsTransform.x / ww)*100),
								ver = Math.abs((kbimg[0]._gsTransform.y / hh)*100);
								if (hh==0) ver =0;
								if (ww == 0) hor = 0;

							defimg.data('bgposition',hor+"% "+ver+"%");

							if (!isIE(8)) defimg.data('currotate',getRotationDegrees(kbimg));
							if (!isIE(8)) defimg.data('curscale',(imgobj.w*sx)+"%  "+(imgobj.h*sx+"%"));
							//punchgs.TweenLite.set(defimg,{rotation:defimg.data('currotate'), backgroundPosition:defimg.data('bgposition'), backgroundSize:defimg.data('curscale')});
					}}));
		})
	}

	/*************************************************
		-	CALCULATE KENBURNS IMAGE POSITIONS	-
	**************************************************/

	var calculateKenBurnImgPos = function(opt,bgp,bgf,img,turned) {
			var imgobj = new Object;

			if (!turned)
				imgobj.w = parseInt(bgf.split(" ")[0],0) / 100;
			else
				imgobj.w = parseInt(bgf.split(" ")[1],0) / 100;

			switch(bgp) {
							case "left top":
							case "top left":
								imgobj.x = 0;
								imgobj.y = 0;
							break;
							case "center top":
							case "top center":
								imgobj.x = (((0-img.width()) * imgobj.w) + parseInt(opt.width,0))/2;
								imgobj.y = 0;
							break;
							case "top right":
							case "right top":
								imgobj.x = ((0-img.width()) * imgobj.w) + parseInt(opt.width,0);
								imgobj.y = 0;

							break;
							case "center left":
							case "left center":
								imgobj.x = 0;
								imgobj.y = (((0-img.height()) * imgobj.w) + parseInt(opt.height,0)) / 2;
							break;
							case "center center":
								imgobj.x = (((0-img.width()) * imgobj.w) + parseInt(opt.width,0))/2;
								imgobj.y = (((0-img.height()) * imgobj.w) + parseInt(opt.height,0)) / 2;

							break;
							case "center right":
							case "right center":
								imgobj.x = ((0-img.width()) * imgobj.w) + parseInt(opt.width,0);
								imgobj.y = (((0-img.height()) * imgobj.w) + parseInt(opt.height,0)) / 2;

							break;
							case "bottom left":
							case "left bottom":
								imgobj.x =0;
								imgobj.y = ((0-img.height()) * imgobj.w) + parseInt(opt.height,0);

							break;
							case "bottom center":
							case "center bottom":
								imgobj.x = (((0-img.width()) * imgobj.w) + parseInt(opt.width,0))/2;
								imgobj.y = ((0-img.height()) * imgobj.w) + parseInt(opt.height,0);
							break;
							case "bottom right":
							case "right bottom":
								imgobj.x = ((0-img.width()) * imgobj.w) + parseInt(opt.width,0);
								imgobj.y = ((0-img.height()) * imgobj.w) + parseInt(opt.height,0);
							break;
						}



			return imgobj;
		}

		/******************************
			-	GET ROTATION DEGREES	-
		********************************/
		var getRotationDegrees = function(obj) {
				    var matrix = obj.css("-webkit-transform") ||
				    obj.css("-moz-transform")    ||
				    obj.css("-ms-transform")     ||
				    obj.css("-o-transform")      ||
				    obj.css("transform");
				    if(matrix !== 'none') {
				        var values = matrix.split('(')[1].split(')')[0].split(',');
				        var a = values[0];
				        var b = values[1];
				        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
				    } else { var angle = 0; }
				    return (angle < 0) ? angle +=360 : angle;
				}


		/******************************
			-	STOP KEN BURN	-
		********************************/
		var stopKenBurn = function(container,opt) {

			try{
				var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
			} catch(e) {
				var actli=container.find('>ul:first-child >li:eq(1)');
			}

			opt.lastslide=opt.act;

			var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');


			var actsh = actli.find('.slotholder');
			var nextsh = nextli.find('.slotholder');

			container.find('.defaultimg').each(function() {
				var defimg = jQuery(this);
				punchgs.TweenLite.killTweensOf(defimg,false);
				punchgs.TweenLite.set(defimg,{scale:1,rotationZ:0});
				punchgs.TweenLite.killTweensOf(defimg.data('kenburn img'),false);
				if (defimg.data('kenburn') != undefined) {
					defimg.data('kenburn').pause();
				}
				if (defimg.data('currotate') != undefined && defimg.data('bgposition') !=undefined && defimg.data('curscale') != undefined)
					punchgs.TweenLite.set(defimg,{rotation:defimg.data('currotate'), backgroundPosition:defimg.data('bgposition'), backgroundSize:defimg.data('curscale')});
				if (defimg!= undefined && defimg.data('kenburn img') != undefined && defimg.data('kenburn img').length>0) punchgs.TweenLite.set(defimg.data('kenburn img'),{autoAlpha:0});

			});
		}

//// END OF KENBURNS EXTNESION




/**************************************************************************
 * Revolution Slider - PARALLAX MODULE
 * @version: 1.1 (23.06.2013)
 * @author ThemePunch
**************************************************************************/

		/******************************
			-	PARALLAX EFFECT	-
		********************************/
		var checkForParallax = function(container,opt) {
			if (is_mobile() && opt.parallaxDisableOnMobile=="on") return false;

			container.find('>ul:first-child >li').each(function() {
				var li = jQuery(this);
				for (var i = 1; i<=10;i++)
					li.find('.rs-parallaxlevel-'+i).each(function() {
						var pw = jQuery(this);
						pw.wrap('<div style="position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:'+pw.css('zIndex')+'" class="tp-parallax-container" data-parallaxlevel="'+opt.parallaxLevels[i-1]+'"></div>');
					});
			})



			if (opt.parallax=="mouse" || opt.parallax=="scroll+mouse" || opt.parallax=="mouse+scroll") {

						container.mouseenter(function(event) {
							var currslide = container.find('.current-sr-slide-visible');
									var t = container.offset().top,
										l = container.offset().left,
										ex = (event.pageX-l),
										ey =  (event.pageY-t);
									currslide.data("enterx",ex);
									currslide.data("entery",ey);

						})

						container.on('mousemove.hoverdir, mouseleave.hoverdir',function(event) {
							var currslide = container.find('.current-sr-slide-visible');
							switch (event.type) {

								case "mousemove":

										var	t = container.offset().top,
											l = container.offset().left,
											mh = currslide.data("enterx"),
											mv = currslide.data("entery"),
											diffh = (mh - (event.pageX  - l)),
											diffv = (mv - (event.pageY - t));

										currslide.find(".tp-parallax-container").each(function() {
											var pc = jQuery(this),
												pl = parseInt(pc.data('parallaxlevel'),0)/100,
												offsh =	diffh * pl,
												offsv =	diffv * pl;
											if (opt.parallax=="scroll+mouse" || opt.parallax=="mouse+scroll")
												punchgs.TweenLite.to(pc,0.4,{force3D:"auto",x:offsh,ease:punchgs.Power3.easeOut,overwrite:"all"});
											else
												punchgs.TweenLite.to(pc,0.4,{force3D:"auto",x:offsh,y:offsv,ease:punchgs.Power3.easeOut,overwrite:"all"});
										})

								break;
								case "mouseleave":
										currslide.find(".tp-parallax-container").each(function() {
											var pc = jQuery(this);
											if (opt.parallax=="scroll+mouse" || opt.parallax=="mouse+scroll")
												punchgs.TweenLite.to(pc,1.5,{force3D:"auto",x:0,ease:punchgs.Power3.easeOut});
											else
												punchgs.TweenLite.to(pc,1.5,{force3D:"auto",x:0,y:0,ease:punchgs.Power3.easeOut});
										})
								break;
							}
						});

						if (is_mobile())
							window.ondeviceorientation = function(event) {
							  var 	y = Math.round(event.beta  || 0),
							  		x = Math.round(event.gamma || 0);

							  var currslide = container.find('.current-sr-slide-visible');


							  if (jQuery(window).width() > jQuery(window).height()){
							  		var xx = x;
							  		x = y;
							  		y = xx;

							  }

								var curh = 360/container.width() * x,
							  		curv = 180/container.height() * y;




							  currslide.find(".tp-parallax-container").each(function() {
												var pc = jQuery(this),
													pl = parseInt(pc.data('parallaxlevel'),0)/100,
													offsh =	curh * pl,
													offsv =	curv * pl;
												punchgs.TweenLite.to(pc,0.2,{force3D:"auto",x:offsh,y:offsv,ease:punchgs.Power3.easeOut});
											})

							  // y: -90 -> +90,  x:-180 -> +180

							  //jQuery('.logo-container').html("h:"+curh+"  v:"+curv);
							  }
			}
			if (opt.parallax=="scroll" || opt.parallax=="scroll+mouse" || opt.parallax=="mouse+scroll") {

						jQuery(window).on('scroll',function(event) {
							scrollParallax(container,opt);
						});
			}
		}

		/***************************************
			-	SET POST OF SCROLL PARALLAX	-
		***************************************/
		var scrollParallax = function(container,opt) {
			if (is_mobile() && opt.parallaxDisableOnMobile=="on") return false;
			var t = container.offset().top,
					st = jQuery(window).scrollTop(),
					dist = t+container.height()/2,
					mv = t+container.height()/2 - st,
					wh = jQuery(window).height()/2,
					diffv= wh - mv;

			if (dist<wh) diffv = diffv - (wh-dist);
			var currslide = container.find('.current-sr-slide-visible');
			container.find(".tp-parallax-container").each(function(i) {
				var pc = jQuery(this),
					pl = parseInt(pc.data('parallaxlevel'),0)/100,
					offsv =	diffv * pl;
				pc.data('parallaxoffset',offsv);
				punchgs.TweenLite.to(pc,0.2,{force3D:"auto",y:offsv,ease:punchgs.Power3.easeOut});
			})

			if (opt.parallaxBgFreeze!="on") {
				var pl = opt.parallaxLevels[0]/100,
					offsv =	diffv * pl;
				punchgs.TweenLite.to(container,0.2,{force3D:"auto",y:offsv,ease:punchgs.Power3.easeOut});
			}
		}

		/**************************************************************************
		 * Revolution Slider - THUMBNAIL MODULE
		 * @version: 1.0 (03.06.2013)
		 * @author ThemePunch
		**************************************************************************/


		////////////////////////////////
		//	-	CREATE THE BULLETS -  //
		////////////////////////////////
		var createThumbs = function(container,opt) {

			var cap=container.parent();



			if (opt.navigationType=="thumb" || opt.navsecond=="both") {
						cap.append('<div class="tp-bullets tp-thumbs '+opt.navigationStyle+'"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>');
			}
			var bullets = cap.find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
			var bup = bullets.parent();

			bup.width(opt.thumbWidth*opt.thumbAmount);
			bup.height(opt.thumbHeight);
			bup.parent().width(opt.thumbWidth*opt.thumbAmount);
			bup.parent().height(opt.thumbHeight);

			container.find('>ul:first >li').each(function(i) {
							var li= container.find(">ul:first >li:eq("+i+")");
							var bgcolor = li.find(".defaultimg").css("backgroundColor");
							if (li.data('thumb') !=undefined)
								var src= li.data('thumb')
							else
								var src=li.find("img:first").attr('src');


							bullets.append('<div class="bullet thumb" style="background-color:'+bgcolor+';position:relative;width:'+opt.thumbWidth+'px;height:'+opt.thumbHeight+'px;background-image:url('+src+') !important;background-size:cover;background-position:center center;"></div>');
							var bullet= bullets.find('.bullet:first');
				});
			//bullets.append('<div style="clear:both"></div>');
			var minwidth=10;


			// ADD THE BULLET CLICK FUNCTION HERE
			bullets.find('.bullet').each(function(i) {
				var bul = jQuery(this);

				if (i==opt.slideamount-1) bul.addClass('last');
				if (i==0) bul.addClass('first');
				bul.width(opt.thumbWidth);
				bul.height(opt.thumbHeight);

				if (minwidth<bul.outerWidth(true)) minwidth=bul.outerWidth(true);
				bul.click(function() {
					if (opt.transition==0 && bul.index() != opt.act) {
						opt.next = bul.index();
						callingNewSlide(opt,container);
					}
				});
			});


			var max=minwidth*container.find('>ul:first >li').length;

			var thumbconwidth=bullets.parent().width();
			opt.thumbWidth = minwidth;



			////////////////////////
			// SLIDE TO POSITION  //
			////////////////////////
			if (thumbconwidth<max) {
				jQuery(document).mousemove(function(e) {
					jQuery('body').data('mousex',e.pageX);
				});



				// ON MOUSE MOVE ON THE THUMBNAILS EVERYTHING SHOULD MOVE :)

				bullets.parent().mouseenter(function() {
						var $this=jQuery(this);

						var offset = $this.offset(),
							x = jQuery('body').data('mousex')-offset.left,
							thumbconwidth=$this.width(),
							minwidth=$this.find('.bullet:first').outerWidth(true),
							max=minwidth*container.find('>ul:first >li').length,
							diff=(max- thumbconwidth)+15,
							steps = diff / thumbconwidth;

						$this.addClass("over");
						x=x-30;

						//ANIMATE TO POSITION
						var pos=(0-((x)*steps));
						if (pos>0) pos =0;
						if (pos<0-max+thumbconwidth) pos=0-max+thumbconwidth;
						moveThumbSliderToPosition($this,pos,200);
				});

				bullets.parent().mousemove(function() {

								var $this=jQuery(this),
									offset = $this.offset(),
									x = jQuery('body').data('mousex')-offset.left,
									thumbconwidth=$this.width(),
									minwidth=$this.find('.bullet:first').outerWidth(true),
									max=minwidth*container.find('>ul:first >li').length-1,
									diff=(max- thumbconwidth)+15,
									steps = diff / thumbconwidth;

								x=x-3;
								if (x<6) x=0;
								if (x+3>thumbconwidth-6) x=thumbconwidth;

								//ANIMATE TO POSITION
								var pos=(0-((x)*steps));
								if (pos>0) pos =0;
								if (pos<0-max+thumbconwidth) pos=0-max+thumbconwidth;
								moveThumbSliderToPosition($this,pos,0);

				});

				bullets.parent().mouseleave(function() {
								var $this=jQuery(this);
								$this.removeClass("over");
								moveSelectedThumb(container);
				});
			}


		}


		///////////////////////////////
		//	SelectedThumbInPosition //
		//////////////////////////////
		var moveSelectedThumb = function(container) {

									var bullets=container.parent().find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer'),
										$this=bullets.parent(),
										offset = $this.offset(),
										minwidth=$this.find('.bullet:first').outerWidth(true),
										x = $this.find('.bullet.selected').index() * minwidth,
										thumbconwidth=$this.width(),
										minwidth=$this.find('.bullet:first').outerWidth(true),
										max=minwidth*container.find('>ul:first >li').length,
										diff=(max- thumbconwidth),
										steps = diff / thumbconwidth,
										pos=0-x;

									if (pos>0) pos =0;
									if (pos<0-max+thumbconwidth) pos=0-max+thumbconwidth;
									if (!$this.hasClass("over")) {
										moveThumbSliderToPosition($this,pos,200);
									}
		}


		////////////////////////////////////
		//	MOVE THUMB SLIDER TO POSITION //
		///////////////////////////////////
		var moveThumbSliderToPosition = function($this,pos,speed) {
			punchgs.TweenLite.to($this.find('.tp-thumbcontainer'),0.2,{force3D:"auto",left:pos,ease:punchgs.Power3.easeOut,overwrite:"auto"});
		}
})(jQuery);



/// END OF THUMBNAIL EXTNESIONS






// SOME ERROR MESSAGES IN CASE THE PLUGIN CAN NOT BE LOADED
function revslider_showDoubleJqueryError(sliderID) {
	var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
	errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
	errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
	errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
	errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>"
		jQuery(sliderID).show().html(errorMessage);
}
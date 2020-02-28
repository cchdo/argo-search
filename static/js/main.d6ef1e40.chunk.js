(this.webpackJsonpargosearch=this.webpackJsonpargosearch||[]).push([[0],{58:function(e,t,a){e.exports=a(75)},63:function(e,t,a){},75:function(e,t,a){"use strict";a.r(t);var r=a(1),n=a.n(r),o=a(27),l=a.n(o),c=(a(63),a(35)),i=a(23),u=a.n(i),s=a(28),d=a(37),p=a(40),f=a(38),m=a.n(f),g=a(44),h=a(46),b=a(43),E=a(45),v=(a(65),a(39)),w=a(31),_=a(15),y=a(57),O=a(41),j=a(5),A=a.n(j),D=a(50),S=a.n(D),k=a(51),x=a.n(k),P=a(52),I=a.n(P);function q(){var e=Object(d.a)(["\n  query GeoProfiles($geo: geography!) {\n    argo_profiles(order_by: {date: desc}, where: {_and: {geography: {_st_d_within: {from: $geo, distance:10000}}, date: {_is_null: false}}}) {\n      date\n      float_id\n      geography\n      file\n    }\n  }\n"]);return q=function(){return e},e}function C(){var e=Object(d.a)(["\n        query LatestProfiles($number: Int!){\n          argo_profiles(limit: $number, order_by: {date: desc}, where: { _and: {geography: {_is_null: false}, date: {_is_null: false}}}) {\n            date\n            float_id\n            geography\n            file\n          }\n        }\n"]);return C=function(){return e},e}delete A.a.Icon.Default.prototype._getIconUrl,A.a.Icon.Default.mergeOptions({iconRetinaUrl:x.a,iconUrl:S.a,shadowUrl:I.a});var L=new w.a({uri:"https://cchdo.ucsd.edu/v1/graphql"}),U=(Object(w.b)(C()),Object(w.b)(q())),W=function(e){var t=e.loading,a=e.error,r=e.data;if(t)return n.a.createElement("p",null,"Loading...");if(a)return n.a.createElement("p",null,"Error ...");var o=new p.a,l=(o.readable,o.writable.getWriter());m.a.createWriteStream("argo_profiles.zip");function c(){return(c=Object(s.a)(u.a.mark((function e(t){var a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:"https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/",a=t.argo_profiles.map((function(e){return e.file})).values(),new ReadableStream({pull:function(e){return Object(s.a)(u.a.mark((function t(){var r,n,o,l,c;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=a.next(),n=r.done,o=r.value,!n){t.next=4;break}return e.enqueue({name:"/citation.txt",lastModified:new Date(0),stream:function(){return new Response("Argo (2020). Argo float data and metadata from Global Data Assembly Centre (Argo GDAC) - Snapshot of Argo GDAC of February 10st 2020. SEANOE. https://doi.org/10.17882/42182#70590").body}}),t.abrupt("return",e.close());case 4:return t.next=6,fetch("https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/"+o);case 6:l=t.sent,c=l.body,e.enqueue({name:"/profiles/".concat(o.split("/").pop()),stream:function(){return c}});case 9:case"end":return t.stop()}}),t)})))()}}).pipeThrough(new p.a).pipeTo(m.a.createWriteStream("argo_profiles.zip")),l.close();case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return n.a.createElement(n.a.Fragment,null,n.a.createElement("h5",null,r.argo_profiles.length," Profiles"),n.a.createElement("button",{onClick:function(){return function(e){return c.apply(this,arguments)}(r)}},"Download Profiles"),n.a.createElement("div",null,r.argo_profiles.map((function(e){var t=e.file,a=e.float_id,r=e.date;e.geography;return n.a.createElement("div",{key:t},n.a.createElement("p",null,a,": ",r,n.a.createElement("br",null),n.a.createElement("small",null,t)))}))))},$=function(e){var t=e.loading,a=e.error,r=e.data;return t?n.a.createElement("p",null,"Loading..."):a?n.a.createElement("p",null,"Error ..."):r.argo_profiles.map((function(e){var t=e.file,a=e.float_id,r=e.geography;return n.a.createElement(b.a,{key:t,radius:4,center:[r.coordinates[1],r.coordinates[0]]},n.a.createElement(E.a,null,n.a.createElement("h3",null,"Argo Float: ",a),n.a.createElement("a",{href:"https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/"+t},"Download Profile")))}))};var z=function(){var e,t=Object(r.useState)(!1),a=Object(c.a)(t,2),o=a[0],l=a[1],i=Object(r.useState)("firstten"),u=Object(c.a)(i,2),s=u[0],d=u[1],p=Object(r.useState)(new URLSearchParams(window.location.search)),f=Object(c.a)(p,2),m=f[0],b=(f[1],m.get("line"));try{e=JSON.parse(b)}catch(j){e={}}var E=Object(y.a)(U,{client:L,variables:{geo:e}}),w=E.loading,j=E.error,A=E.data;return n.a.createElement(_.a,{client:L},n.a.createElement("div",null,n.a.createElement(v.a,{id:"sidebar",position:"right",collapsed:o,closeIcon:n.a.createElement(O.a,null),selected:s,onOpen:function(e){d(e),l(!1)},onClose:function(){return l(!0)}},n.a.createElement(v.b,{id:"firstten",header:"Profile List",icon:n.a.createElement(O.b,null)},n.a.createElement("div",null,n.a.createElement(W,{loading:w,error:j,data:A})))),n.a.createElement(g.a,{className:"mapStyle",center:[0,0],zoom:2},n.a.createElement(h.a,{attribute:"",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),n.a.createElement($,{loading:w,error:j,data:A}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(n.a.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[58,1,2]]]);
//# sourceMappingURL=main.d6ef1e40.chunk.js.map
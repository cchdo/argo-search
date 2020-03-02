(this.webpackJsonpargosearch=this.webpackJsonpargosearch||[]).push([[0],{56:function(e,t,a){e.exports=a(73)},61:function(e,t,a){},73:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),o=a(25),l=a.n(o),c=(a(61),a(34)),i=a(26),s=a.n(i),u=a(36),d=a(46),p=a(41),m=a(43),f=a(40),g=a(42),h=(a(63),a(37)),E=a(33),b=a(15),w=a(55),v=a(38),y=a(5),O=a.n(y),_=a(48),D=a.n(_),j=a(49),A=a.n(j),k=a(50),x=a.n(k);function S(){var e=Object(d.a)(["\n  query GeoProfiles($geo: geography!) {\n    argo_profiles(order_by: {date: desc}, where: {_and: {geography: {_st_d_within: {from: $geo, distance:10000}}, date: {_is_null: false}}}) {\n      date\n      float_id\n      geography\n      file\n    }\n  }\n"]);return S=function(){return e},e}delete O.a.Icon.Default.prototype._getIconUrl,O.a.Icon.Default.mergeOptions({iconRetinaUrl:A.a,iconUrl:D.a,shadowUrl:x.a});var C=new E.a({uri:"https://cchdo.ucsd.edu/v1/graphql"}),I=Object(E.b)(S()),P=function(e){var t=e.loading,n=e.error,o=e.data,l=e.geojson;if(t)return r.a.createElement("p",null,"Loading...");if(n)return r.a.createElement("p",null,"Error ...");function c(){return(c=Object(u.a)(s.a.mark((function e(t){var n,r,o,l,c,i,d;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.e(3).then(a.bind(null,76));case 2:return n=e.sent,r=n.default,e.next=6,a.e(4).then(a.t.bind(null,75,7));case 6:o=e.sent,l=new r,c=l.writable,i=c.getWriter(),"https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/",d=t.argo_profiles.map((function(e){return e.file})).values(),new ReadableStream({pull:function(e){return Object(u.a)(s.a.mark((function t(){var a,n,r,o,l;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=d.next(),n=a.done,r=a.value,!n){t.next=4;break}return e.enqueue({name:"/citation.txt",lastModified:new Date(0),stream:function(){return new Response("Argo (2020). Argo float data and metadata from Global Data Assembly Centre (Argo GDAC) - Snapshot of Argo GDAC of February 10st 2020. SEANOE. https://doi.org/10.17882/42182#70590").body}}),t.abrupt("return",e.close());case 4:return t.next=6,fetch("https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/"+r);case 6:o=t.sent,l=o.body,e.enqueue({name:"/profiles/".concat(r.split("/").pop()),stream:function(){return l}});case 9:case"end":return t.stop()}}),t)})))()}}).pipeThrough(new r).pipeTo(o.createWriteStream("argo_profiles.zip")),i.close();case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return r.a.createElement(r.a.Fragment,null,r.a.createElement("h4",null,"Argo Profiles Near Cruise ",l.properties.expocode),r.a.createElement("small",null,"TODO: do something with the dates: ",l.properties.startDate,"/",l.properties.endDate),r.a.createElement("h5",null,o.argo_profiles.length," Profiles"),"BigInt"in window?r.a.createElement("button",{onClick:function(){return function(e){return c.apply(this,arguments)}(o)}},"Download Profiles"):r.a.createElement("span",null,"Bulk Download not supported"),r.a.createElement("div",null,o.argo_profiles.map((function(e){var t=e.file,a=e.float_id,n=e.date;e.geography;return r.a.createElement("div",{key:t},r.a.createElement("p",null,a,": ",n,r.a.createElement("br",null),r.a.createElement("small",null,t)))}))))},U=function(e){var t=e.loading,a=e.error,n=e.data;return t?r.a.createElement("p",null,"Loading..."):a?r.a.createElement("p",null,"Error ..."):n.argo_profiles.map((function(e){var t=e.file,a=e.float_id,n=e.geography;return r.a.createElement(f.a,{key:t,radius:4,center:[n.coordinates[1],n.coordinates[0]]},r.a.createElement(g.a,null,r.a.createElement("h3",null,"Argo Float: ",a),r.a.createElement("a",{href:"https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/"+t},"Download Profile")))}))};var q=function(){var e,t=Object(n.useState)(!1),a=Object(c.a)(t,2),o=a[0],l=a[1],i=Object(n.useState)("firstten"),s=Object(c.a)(i,2),u=s[0],d=s[1],f=Object(n.useState)(window.location.hash),g=Object(c.a)(f,1)[0],E=decodeURIComponent(g.slice(1));try{e=JSON.parse(E)}catch(_){e={}}var y=Object(w.a)(I,{client:C,variables:{geo:e.geometry}}),O=y.loading,_=y.error,D=y.data;return r.a.createElement(b.a,{client:C},r.a.createElement("div",null,r.a.createElement(h.a,{id:"sidebar",position:"right",collapsed:o,closeIcon:r.a.createElement(v.a,null),selected:u,onOpen:function(e){d(e),l(!1)},onClose:function(){return l(!0)}},r.a.createElement(h.b,{id:"firstten",header:"Profile List",icon:r.a.createElement(v.b,null)},r.a.createElement("div",null,r.a.createElement(P,{loading:O,error:_,data:D,geojson:e})))),r.a.createElement(p.a,{className:"mapStyle",center:[0,0],zoom:2},r.a.createElement(m.a,{attribute:"",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),r.a.createElement(U,{loading:O,error:_,data:D}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(q,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[56,1,2]]]);
//# sourceMappingURL=main.43b248df.chunk.js.map
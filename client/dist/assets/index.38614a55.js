var Fe=Object.defineProperty,be=Object.defineProperties;var De=Object.getOwnPropertyDescriptors;var de=Object.getOwnPropertySymbols;var we=Object.prototype.hasOwnProperty,Se=Object.prototype.propertyIsEnumerable;var pe=(e,t,a)=>t in e?Fe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,O=(e,t)=>{for(var a in t||(t={}))we.call(t,a)&&pe(e,a,t[a]);if(de)for(var a of de(t))Se.call(t,a)&&pe(e,a,t[a]);return e},Q=(e,t)=>be(e,De(t));import{r as F,o as se,M as Ce,T as ke,d as le,a as z,N as Ee,b as Z,c as x,e as Te,f as Be,u as W,w as ee,g as he,h as V,i as r,j as A,k as i,l as m,n as Ne,G as Ae,m as D,p as h,F as G,q as K,s as _e,t as L,v as R,x as j,y as H,z as te,C as ue,A as q,B as X,P as Pe,D as Y,E as re,H as ve,I as ze,J as Me,K as Ie,L as Re,O as Oe,Q as Ve,R as Le,S as Ue,U as je,V as Ge,W as Ye,X as He,Y as me,Z as We,_ as Je,$ as Ke,a0 as qe,a1 as Xe,a2 as ie,a3 as Qe,a4 as Ze,a5 as xe,a6 as et,a7 as tt,a8 as at,a9 as nt,aa as ot}from"./vendor.662f2dca.js";const st=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))n(u);new MutationObserver(u=>{for(const c of u)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(u){const c={};return u.integrity&&(c.integrity=u.integrity),u.referrerpolicy&&(c.referrerPolicy=u.referrerpolicy),u.crossorigin==="use-credentials"?c.credentials="include":u.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(u){if(u.ep)return;u.ep=!0;const c=a(u);fetch(u.href,c)}};st();const lt=(e,t)=>{const a=F();return se(()=>{a.value=new Ce({container:document.getElementById(t),className:e,type:"delegate",size:[150,150]})}),[a]},ut=e=>{const t=F();return se(()=>{t.value=new ke({container:document.getElementById(e),offsetX:10,offsetY:10,getContent(a){var u,c;const n=(c=(u=a==null?void 0:a.item)==null?void 0:u._cfg)==null?void 0:c.model;if(n){const s=n.path||"none",d=n.name,l='<div style="max-width:200px;word-break: break-all;">',v="</div>",o=`
                    <p>\u6A21\u5757\u540D\u79F0:  ${d}</p>
                    <p>\u8DEF\u5F84:  ${s}</p> 
                    `;let p="";const g=["utime","ctime","fileSize","importTimes"],$={utime:{label:"\u6700\u8FD1\u4FEE\u6539\u65F6\u95F4",getValue(b){return le(b).format("YYYY-MM-DD")}},ctime:{label:"\u521B\u5EFA\u65F6\u95F4",getValue(b){return le(b).format("YYYY-MM-DD")}},fileSize:{label:"\u6587\u4EF6\u5927\u5C0F",getValue(b){return`${(Number(b)/1024).toFixed(2)}kb`}},importTimes:{label:"\u88AB\u5F15\u7528\u6B21\u6570",getValue(b){return`${b}`}}};for(const b in n)if(g.includes(b)&&n[b]){const T=$[b].label,y=$[b].getValue(n[b]);p=p+`<p>${T}: ${y}</p>`}return l+o+p+v}return"<h1></h1>"},itemTypes:["node"]})}),[t]};var M=(e,t)=>{const a=e.__vccOpts||e;for(const[n,u]of t)a[n]=u;return a};const rt=z({name:"Graph",components:{NSpin:Ee,NRadio:Z,NRadioGroup:x,NSwitch:Te,NTreeSelect:Be},setup(){const e=F(!0),t=F(!0),a=F(null),n=F(null),[u]=lt("miniMap","miniMap"),[c]=ut("tooltip"),s=F(null),{onFetchResponse:d,data:l}=W(`http://localhost:${window.preloadState.port}/graph`,{method:"GET"}).json(),v=(y,_,f)=>{var I,oe;let k=O({},y);try{k=JSON.parse(JSON.stringify(y))}catch(C){console.error(C)}const N={};for(let C=0;C<_.length;C++)N[_[C].moduleId]=C;const w=Object.keys(N);let S={id:f,name:k.name,path:k.path,isFolder:k.isFolder,children:k.children};const B=[];let P=0;for(B.push(S);B.length;){P=P+1;let C=B.pop();if(w.includes(C.moduleId)){const J=N[C.moduleId],U=_[J];C.fileSize=U.fileSize||0,C.ctime=U.ctime,C.mtime=U.utime,C.importTimes=(I=U==null?void 0:U.reference)==null?void 0:I.length,C.isDep=!0}if((oe=C==null?void 0:C.children)==null?void 0:oe.length)for(let J=0;J<C.children.length;J++){const U=C.children[J];U.id=`${U.path}-${P}`,B.push(U)}else C.id=`${C.path}-${P}`}return S},o=(y,_)=>{var w;const f=[],k={id:_,children:[],name:_},N=y.map((S,B)=>{let P={id:S.path,children:[],name:S.name};return f.includes(S.path)?P.id=S.path+`${B}`:f.push(S.path),P=O(O({},P),S),S.deps.length&&(P.children=S.deps.map((I,oe)=>{let C={id:I.path,childen:[],name:I.name};return f.includes(I.path)?C.id=`${Math.random()*10}`+I.path:f.push(I.path),C=O(O({},C),I),C})),P});return N.length&&((w=k==null?void 0:k.children)==null||w.push(...N)),k},p=(y,_)=>{var S;let f=O({},y);try{f=JSON.parse(JSON.stringify(y))}catch(B){console.error(B)}let k={id:_,name:f.name,path:f.path,isFolder:f.isFolder,children:f.children};const N=[];let w=0;for(N.push(k);N.length;){w=w+1;const B=N.pop();if((S=B==null?void 0:B.children)==null?void 0:S.length){const P=B.children.map(I=>Q(O({},I),{id:`${I.path}-${w}`}));N.push(...P)}else B.id=`${B.path}-${w}`}return k};d(y=>{y.status===200&&(s.value=p(l.value.tree,l.value.entry))}),ee(s,y=>{y!==null&&t.value&&Ne(()=>{n.value=new Ae.TreeGraph({container:a.value,modes:{default:[{type:"collapse-expand",onChange:function(f,k){const N=f.getModel();return N.collapsed=k,!0}},"drag-canvas","zoom-canvas"]},defaultNode:{size:26,anchorPoints:[[0,.5],[1,.5]]},defaultEdge:{type:"cubic-horizontal"},plugins:[u.value,c.value],layout:{type:"compactBox",direction:"LR",getId:function(f){return f.id},getHeight:function(){return 20},getWidth:function(){return 20},getVGap:function(){return 10},getHGap:function(){return 100}}}),n.value.node(_=>{let f={label:_.name,labelCfg:{offset:10,position:_.children&&_.children.length>0?"left":"right"}};return(_==null?void 0:_.isDep)&&(f=Q(O({},f),{style:{shadowBlur:10,fill:"#1a414e",stroke:"black"}})),f}),n.value.on("afterlayout",_=>{e.value=!1,t.value=!1}),n.value.data(s.value),n.value.render(),n.value.fitView()})});const g=_e((y,_)=>{n.value&&(n.value.changeSize(y,_),n.value.fitView(20))},100);he(a,y=>{const _=y[0],{width:f,height:k}=_.contentRect;g(f,k)});const $=F("project"),E=[{label:"\u9879\u76EE\u7ED3\u6784",value:"project"},{label:"\u6A21\u5757\u7ED3\u6784",value:"module"}];ee($,(y,_)=>{var f,k,N;y==="project"&&((f=n.value)==null||f.changeData(p(l.value.tree,l.value.entry))),y==="module"&&((k=n.value)==null||k.changeData(o(l.value.nodes,l.value.entry)),b.value=!1),(N=n.value)==null||N.fitView()});const b=F(!1),T=V(()=>$.value!=="project");return ee(b,y=>{var f,k;let _=s.value;y===!0?_=v(l.value.tree,l.value.deps,l.value.entry):_=p(l.value.tree,l.value.entry),console.log("targetTreeData ===>",_),(f=n.value)==null||f.changeData(_),(k=n.value)==null||k.fitView()}),{loading:e,graphRef:a,graphType:E,selectGraphType:$,showDeps:b,disableShowDeps:T}}}),it={class:"graph"},ct={class:"graph-main-wrapper"},dt={class:"graph-tools"},pt={class:"graph-tools-panel"},ht={class:"graph-tools-panel-item"},_t={class:"graph-tools-panel-item-main"},vt=L(" \u56FE\u7C7B\u578B\uFF1A "),mt={class:"graph-tools-panel-item-main"},ft=L(" \u5F53\u524D\u76EE\u5F55\uFF1A "),gt={class:"graph-tools-panel-item"},$t=L(" \u4F9D\u8D56\u6807\u8BB0\uFF1A "),yt={id:"graph-root"},Ft={class:"graph-container",ref:"graphRef"},bt=h("div",{id:"miniMap"},null,-1),Dt={id:"tooltip",class:"tooltip-wrap",ref:"tooltipRef"};function wt(e,t,a,n,u,c){const s=r("n-radio"),d=r("n-space"),l=r("n-radio-group"),v=r("n-tree-select"),o=r("n-switch"),p=r("n-spin");return D(),A("div",it,[i(p,{size:"large",show:e.loading},{default:m(()=>[h("div",ct,[h("div",dt,[h("div",pt,[h("div",ht,[h("div",_t,[vt,i(l,{value:e.selectGraphType,"onUpdate:value":t[0]||(t[0]=g=>e.selectGraphType=g),name:"radiogroup"},{default:m(()=>[i(d,null,{default:m(()=>[(D(!0),A(G,null,K(e.graphType,g=>(D(),R(s,{key:g.value,value:g.value},{default:m(()=>[L(j(g.label),1)]),_:2},1032,["value"]))),128))]),_:1})]),_:1},8,["value"])]),h("div",mt,[ft,i(v,{options:[],"default-value":"Drive My Car"})])]),h("div",gt,[$t,i(o,{value:e.showDeps,"onUpdate:value":t[1]||(t[1]=g=>e.showDeps=g),disabled:e.disableShowDeps},null,8,["value","disabled"])])])]),h("div",yt,[h("div",Ft,null,512),bt,h("div",Dt,null,512)])])]),_:1},8,["show"])])}var St=M(rt,[["render",wt]]);const Ct=e=>{if(!e)return 0+"b";let t=e+"b",a=[e],n=0,u=["B","KB","MB","GB","TB"];for(;a.length;){const c=a.pop(),s=Number(c)/1024;n=n+1,t=s.toFixed(2)+u[n],s>1024&&a.push(s)}return t},ce=()=>{const e=[{label:"\u524D5",value:5},{label:"\u524D10",value:10},{label:"\u524D15",value:15}];return{value:F(e[0].value),limitOptions:e}},ae=(e,t)=>{const a=_e((n,u)=>{e.value&&e.value.changeSize(n,u)});he(t,n=>{const u=n[0],{width:c,height:s}=u.contentRect;a(c,s)})};const kt=z({name:"fileSizeChart",components:{NSpace:H,NRadio:Z,NRadioGroup:x,NSelect:te},setup(){const e=F(),t=F(),a=F("folder"),n=F({}),u=$=>{if(Number($)in n.value)return n.value[$];{const E=Ct($);return n.value[$]=E,E}},c=$=>$.slice(0).sort((E,b)=>b.fileSize-E.fileSize),{value:s,limitOptions:d}=ce(),l=V(()=>`http://localhost:${window.preloadState.port}/chart/size?limit=${s.value}`),{onFetchResponse:v,data:o,isFetching:p}=W(l,{refetch:!0}).json();v(()=>{var E,b,T,y;if(o.value===null)return;const $=a.value==="folder"?o.value.tree:o.value.nodes;t.value?t.value.changeData(c($)):(t.value=new ue(e.value,{data:c($),width:(b=(E=e.value)==null?void 0:E.offsetWidth)!=null?b:0,height:(y=(T=e.value)==null?void 0:T.offsetHeight)!=null?y:0,xField:"fileName",yField:"fileSize",padding:"auto",color:"#a3a3c2",appendPadding:10,tooltip:{formatter(_){return{name:"\u6587\u4EF6\u5927\u5C0F",value:`${u(_.fileSize)}`}}}}),t.value.render())}),ae(t,e);const g=[{value:"folder",label:"\u76EE\u5F55"},{value:"module",label:"\u6A21\u5757"}];return ee(a,$=>{if(o.value===null)return;const E=$==="folder"?o.value.tree:o.value.nodes;t.value&&t.value.changeData(c(E))}),{chartRef:e,chartTypes:g,chartType:a,limitOptions:d,limit:s}}}),Et=e=>(q("data-v-1f4c7d86"),e=e(),X(),e),Tt=Et(()=>h("div",{class:"chart-title"},"\u6587\u4EF6\u5927\u5C0F",-1)),Bt={class:"chart-main",id:"size-chart",ref:"chartRef"},Nt={class:"chart-tool"};function At(e,t,a,n,u,c){const s=r("n-radio"),d=r("n-space"),l=r("n-radio-group"),v=r("n-select");return D(),A(G,null,[Tt,h("div",Bt,null,512),h("div",Nt,[i(d,null,{default:m(()=>[i(l,{value:e.chartType,"onUpdate:value":t[0]||(t[0]=o=>e.chartType=o),name:""},{default:m(()=>[i(d,null,{default:m(()=>[(D(!0),A(G,null,K(e.chartTypes,o=>(D(),R(s,{key:o.value,value:o.value},{default:m(()=>[L(j(o.label),1)]),_:2},1032,["value"]))),128))]),_:1})]),_:1},8,["value"]),i(v,{size:"small",value:e.limit,"onUpdate:value":t[1]||(t[1]=o=>e.limit=o),options:e.limitOptions},null,8,["value","options"])]),_:1})])],64)}var Pt=M(kt,[["render",At],["__scopeId","data-v-1f4c7d86"]]);const fe=()=>({value:F("down"),sortOptions:[{label:"\u5347\u5E8F",value:"up"},{label:"\u5012\u5E8F",value:"down"}]});const zt=z({name:"dependenceChart",components:{NSpace:H,NSelect:te,NRadio:Z,NRadioGroup:x},setup(){const e=F(),t=F(),{value:a,limitOptions:n}=ce(),{value:u,sortOptions:c}=fe(),s=V(()=>`http://localhost:${window.preloadState.port}/chart/deps?limit=${a.value}&sort=${u.value}`),{onFetchResponse:d,data:l,onFetchError:v}=W(s,{refetch:!0}).json(),o=V(()=>l.value&&l.value.nodes?l.value.nodes.map(p=>Q(O({},p),{depCount:p.deps.length})).sort((p,g)=>g.depCount-p.depCount):[]);return v(p=>{console.log(p)}),d(()=>{var p,g,$,E;t.value?t.value.changeData(o.value):(t.value=new ue(e.value,{data:o.value,width:(g=(p=e.value)==null?void 0:p.offsetWidth)!=null?g:0,height:(E=($=e.value)==null?void 0:$.offsetHeight)!=null?E:0,xField:"fileName",yField:"depCount",padding:"auto",color:"#ff4d4d",appendPadding:10,tooltip:{formatter(b){return{name:"\u4F9D\u8D56\u6570\u91CF",value:`${b.depCount}`}}}}),t.value.render())}),ae(t,e),{chartRef:e,limitOptions:n,limit:a,sortType:u,sortOptions:c}}}),Mt=e=>(q("data-v-05887df4"),e=e(),X(),e),It=Mt(()=>h("div",{class:"chart-title"},"\u4F9D\u8D56\u6570",-1)),Rt={class:"chart-main",id:"deps-chart",ref:"chartRef"},Ot={class:"chart-tool"};function Vt(e,t,a,n,u,c){const s=r("n-select"),d=r("n-radio"),l=r("n-space"),v=r("n-radio-group");return D(),A(G,null,[It,h("div",Rt,null,512),h("div",Ot,[i(l,null,{default:m(()=>[i(s,{size:"small",value:e.limit,"onUpdate:value":t[0]||(t[0]=o=>e.limit=o),options:e.limitOptions},null,8,["value","options"]),i(v,{value:e.sortType,"onUpdate:value":t[1]||(t[1]=o=>e.sortType=o),name:"radiogroup"},{default:m(()=>[i(l,null,{default:m(()=>[(D(!0),A(G,null,K(e.sortOptions,o=>(D(),R(d,{key:o.value,value:o.value},{default:m(()=>[L(j(o.label),1)]),_:2},1032,["value"]))),128))]),_:1})]),_:1},8,["value"])]),_:1})])],64)}var Lt=M(zt,[["render",Vt],["__scopeId","data-v-05887df4"]]);const Ut=z({name:"referenceChart",components:{NSpace:H,NSelect:te,NRadio:Z,NRadioGroup:x},setup(){const e=F(),t=F(),{value:a,limitOptions:n}=ce(),{value:u,sortOptions:c}=fe(),s=V(()=>`http://localhost:${window.preloadState.port}/chart/reference?limit=${a.value}&sort=${u.value}`),{onFetchResponse:d,data:l,onFetchError:v}=W(s,{refetch:!0}).json(),o=V(()=>l.value&&l.value.nodes?l.value.nodes.map(p=>O({},p)).sort((p,g)=>g.reference-p.reference):[]);return v(p=>{console.log(p)}),d(()=>{var p,g,$,E;t.value?t.value.changeData(o.value):(t.value=new ue(e.value,{data:o.value,width:(g=(p=e.value)==null?void 0:p.offsetWidth)!=null?g:0,height:(E=($=e.value)==null?void 0:$.offsetHeight)!=null?E:0,xField:"fileName",yField:"reference",padding:"auto",appendPadding:10,color:"#40bf80",tooltip:{formatter(b){return{name:"\u88AB\u5F15\u7528\u6B21\u6570",value:`${b.reference}`}}}}),t.value.render())}),ae(t,e),{chartRef:e,limitOptions:n,limit:a,sortType:u,sortOptions:c}}}),jt=e=>(q("data-v-408ff517"),e=e(),X(),e),Gt=jt(()=>h("div",{class:"chart-title"},"\u88AB\u5F15\u7528\u6B21\u6570",-1)),Yt={class:"chart-main",id:"reference-chart",ref:"chartRef"},Ht={class:"chart-tool"};function Wt(e,t,a,n,u,c){const s=r("n-select"),d=r("n-radio"),l=r("n-space"),v=r("n-radio-group");return D(),A(G,null,[Gt,h("div",Yt,null,512),h("div",Ht,[i(l,null,{default:m(()=>[i(s,{size:"small",value:e.limit,"onUpdate:value":t[0]||(t[0]=o=>e.limit=o),options:e.limitOptions},null,8,["value","options"]),i(v,{value:e.sortType,"onUpdate:value":t[1]||(t[1]=o=>e.sortType=o),name:"radiogroup"},{default:m(()=>[i(l,null,{default:m(()=>[(D(!0),A(G,null,K(e.sortOptions,o=>(D(),R(d,{key:o.value,value:o.value},{default:m(()=>[L(j(o.label),1)]),_:2},1032,["value"]))),128))]),_:1})]),_:1},8,["value"])]),_:1})])],64)}var Jt=M(Ut,[["render",Wt],["__scopeId","data-v-408ff517"]]);const Kt=z({name:"typesChart",components:{NSpace:H,NSelect:te},setup(){const e=F(),t=F(),a=V(()=>`http://localhost:${window.preloadState.port}/chart/types`),{onFetchResponse:n,data:u,onFetchError:c}=W(a.value,{refetch:!0}).json(),s=V(()=>{var d,l;return(l=(d=u.value)==null?void 0:d.types)!=null?l:[]});return c(d=>{console.log(d)}),n(()=>{var d,l,v,o;t.value?t.value.changeData(s.value):(console.log("chartData",s.value),t.value=new Pe(e.value,{data:s.value,width:(l=(d=e.value)==null?void 0:d.offsetWidth)!=null?l:0,height:(o=(v=e.value)==null?void 0:v.offsetHeight)!=null?o:0,angleField:"num",colorField:"fileType",padding:16,label:{type:"inner",offset:"-30%",content:({percent:p})=>`${(p*100).toFixed(0)}%`,style:{fontSize:14,textAlign:"center"}},interactions:[{type:"element-active"}]}),t.value.render())}),ae(t,e),{chartRef:e}}}),qt=e=>(q("data-v-25e7897e"),e=e(),X(),e),Xt=qt(()=>h("div",{class:"chart-title"},"\u7C7B\u578B\u6BD4\u4F8B",-1)),Qt={class:"chart-main",id:"types-chart",ref:"chartRef"};function Zt(e,t,a,n,u,c){return D(),A(G,null,[Xt,h("div",Qt,null,512)],64)}var xt=M(Kt,[["render",Zt],["__scopeId","data-v-25e7897e"]]);const ea=z({name:"Chart",components:{"size-chart":Pt,"deps-chart":Lt,"reference-chart":Jt,"types-chart":xt},setup(){}}),ta={class:"chart"},aa=h("header",{class:"chart-header"},"Chart Analysis",-1),na={class:"chart-content"},oa={class:"chart-content-item"},sa={class:"chart-content-item"},la={class:"chart-content-item"},ua={class:"chart-content-item"};function ra(e,t,a,n,u,c){const s=r("size-chart"),d=r("deps-chart"),l=r("reference-chart"),v=r("types-chart");return D(),A("div",ta,[aa,h("section",na,[h("div",oa,[i(s)]),h("div",sa,[i(d)]),h("div",la,[i(l)]),h("div",ua,[i(v)])])])}var ia=M(ea,[["render",ra]]);const ge=e=>le(e).format("YYYY-MM-DD"),ca=e=>`${(Number(e)/1024).toFixed(2)}kb`,da=(e,t)=>[{type:"selection"},{title:"\u6587\u4EF6\u540D",key:"name",align:"center"},{title:"\u521B\u5EFA\u65F6\u95F4",key:"ctime",align:"center",render(a){const n=a==null?void 0:a.ctime;return n?ge(n):"none"}},{title:"\u66F4\u65B0\u65F6\u95F4",key:"utime",align:"center",render(a){const n=a==null?void 0:a.utime;return n?ge(n):"none"}},{title:"\u6587\u4EF6\u5927\u5C0F",key:"fileSize",align:"center",render(a){const n=a==null?void 0:a.fileSize;return n?ca(n):"none"}},{title:"\u4F9D\u8D56\u6570",key:"deps",align:"center",render(a){return a.deps.length}},{title:"\u64CD\u4F5C",key:"action",align:"center",render(a){return Y("div",{style:"width:100%;display:flex;justify-content:center"},[Y(re,{text:!0,style:"margin-right:10px",onClick:n=>{e(a)}},{default:()=>"\u8BE6\u60C5"}),Y(re,{text:!0,textColor:"red",onClick:()=>{t(a)}},{default:()=>"\u5220\u9664"})])}}];const pa=z({name:"fileNodeDetail",props:{detail:{type:Object,default:()=>null},visible:{type:Boolean,default:!1},setDetailVisible:{type:Function,default:()=>{}}},components:{NModal:ve,NList:ze,NListItem:Me,NSkeleton:Ie,NSpace:H},setup(){}}),ha={key:1,class:"table-detail"},_a={class:"table-detail-path"},va={class:"table-detail-deps-list"},ma={class:"table-detail-deps-list-title"};function fa(e,t,a,n,u,c){const s=r("n-skeleton"),d=r("n-list-item"),l=r("n-list"),v=r("n-space"),o=r("n-modal");return D(),R(o,{show:e.visible,"onUpdate:show":t[0]||(t[0]=p=>e.visible=p),preset:"card",size:"medium",style:{width:"60vw"},title:"\u8BE6\u60C5\u4FE1\u606F",bordered:!1,"mask-closable":"",onUpdateShow:e.setDetailVisible},{default:m(()=>[e.detail?(D(),A("section",ha,[i(v,{vertical:!0},{default:m(()=>{var p,g;return[h("div",_a,"\u8DEF\u5F84\uFF1A"+j((g=(p=e.detail)==null?void 0:p.path)!=null?g:""),1),h("div",va,[h("div",ma,"\u5185\u90E8\u4F9D\u8D56\uFF1A"+j(e.detail.deps.length)+" \u4E2A",1),i(l,{bordered:""},{default:m(()=>[(D(!0),A(G,null,K(e.detail.deps,$=>(D(),R(d,{key:$.path},{default:m(()=>[L(j($.path),1)]),_:2},1024))),128))]),_:1})])]}),_:1})])):(D(),R(s,{key:0,text:"",repeat:5}))]),_:1},8,["show","onUpdateShow"])}var ga=M(pa,[["render",fa],["__scopeId","data-v-eb5c921a"]]);const $a=z({name:"LoadingModal",props:{visible:{type:Boolean,default:!1},limit:{type:Number,default:1},success:{type:Number,default:1},fail:{type:Number,default:0}},components:{NModal:ve,NSpace:H,NProgress:Re},setup(e){return{percent:V(()=>(Number(e.success+e.fail)/Number(e.limit)*100).toFixed(0))}}}),ya=h("div",null,"\u6B63\u5728\u5220\u9664\u5566\uFF0C\u522B\u6025\uFF5E\uFF5E",-1),Fa={style:{color:"lightblue"}},ba={style:{color:"red"}};function Da(e,t,a,n,u,c){const s=r("n-progress"),d=r("n-space"),l=r("n-modal");return D(),R(l,{show:e.visible,"onUpdate:show":t[0]||(t[0]=v=>e.visible=v),preset:"card",size:"medium",style:{width:"40vw"},title:"\u4EFB\u52A1\u8FDB\u5EA6",bordered:!1,"mask-closable":!1},{default:m(()=>[i(d,{vertical:!0},{default:m(()=>[ya,i(s,{type:"line",status:"success",height:24,percentage:Number(e.percent),"border-radius":"12px 12px 12px 12px"},{default:m(()=>[L(j(e.percent)+"% ",1)]),_:1},8,["percentage"]),h("div",Fa,"\u5DF2\u5B8C\u6210\u4E86"+j(e.success)+"\u4E2A",1),h("div",ba,"\u6709"+j(e.fail)+"\u4E2A\u5220\u9664\u5931\u8D25\u4E86\uFF01",1)]),_:1})]),_:1},8,["show"])}var wa=M($a,[["render",Da]]);const Sa=z({name:"Table",components:{NDataTable:Oe,NFormItem:Ve,NButton:re,NInput:Le,NForm:Ue,NDatePicker:je,NPagination:Ge,NSpace:H,Detail:ga,LoadingModal:wa},setup(){const e=Ye(),t=F(!1),a=F(0),n=F(),u=F(!1),c=w=>{u.value=w},l=da(w=>{u.value=!0,n.value=w},w=>{e.warning({title:"\u63D0\u793A",content:"\u786E\u5B9A\u8981\u5220\u9664\u6307\u5B9A\u7684\u6587\u4EF6\u5417\uFF1F",positiveText:"\u5220\u9664",negativeText:"\u4E0D\u5220",onPositiveClick:()=>new Promise((S,B)=>{me.post(`http://localhost:${window.preloadState.port}/table/delete`,{path:w.path}).then(P=>(P.data.result&&E(),S))})})}),v=V(()=>g.value?g.value.data:[]),o=He({page:1,pageSize:10,name:"",updatedAt:null,createdAt:null}),p=V(()=>{const w=new URL(`http://localhost:${window.preloadState.port}/table`),S=w.searchParams;return o.createdAt&&(S.set("ctimeStart",String(o.createdAt[0])),S.set("ctimeEnd",String(o.createdAt[1]))),o.updatedAt&&(S.set("utimeStart",String(o.updatedAt[0])),S.set("utimeEnd",String(o.updatedAt[1]))),o.name&&o.name!==""&&S.set("name",o.name),S.set("page",String(o.page)),S.set("pageSize",String(o.pageSize)),w.toString()}),{data:g,onFetchFinally:$,execute:E}=W(p,{refetch:!0,beforeFetch(){t.value=!0}}).json();$(()=>{t.value=!1,a.value=g.value?g.value.total:0});const b=w=>{o.page=w},T=F(!1),y=F([]),_=F(0),f=F(0);return{searchParams:o,loading:t,tableData:v,tableColumn:l,total:a,changePage:b,detailInfo:n,detailVisible:u,setDetailVisible:c,handleSelect:w=>{y.value=w},currentSelections:y,batchRemoveFiles:()=>{console.log("\u5F53\u524D\u9009\u4E2D\u4E86",y.value),e.warning({title:"\u63D0\u793A",content:"\u786E\u5B9A\u8981\u5220\u9664\u6307\u5B9A\u7684\u6587\u4EF6\u5417\uFF1F",positiveText:"\u5220\u9664",negativeText:"\u4E0D\u5220",onPositiveClick:()=>{T.value=!0;for(let w=0;w<y.value.length;w++){const S=y.value[w];me.post(`http://localhost:${window.preloadState.port}/table/delete`,{path:S}).then(B=>{B.data&&(_.value=_.value+1)}).catch(B=>{f.value=f.value+1}).finally(()=>{_.value+f.value===y.value.length&&setTimeout(()=>{T.value=!1,f.value=0,_.value=0,E()},2e3)})}}})},loadingModalVisible:T,success:_,fail:f}}}),Ca={class:"table"},ka={class:"table-tool"},Ea=L("\u641C\u7D22"),Ta={class:"table-container"},Ba=L("\u5220\u9664");function Na(e,t,a,n,u,c){const s=r("n-input"),d=r("n-form-item"),l=r("n-date-picker"),v=r("n-button"),o=r("n-form"),p=r("n-data-table"),g=r("n-pagination"),$=r("n-space"),E=r("Detail"),b=r("LoadingModal");return D(),A("div",Ca,[h("section",ka,[i(o,{inline:"","label-width":80,model:e.searchParams,"label-placement":"left",ref:"formRef"},{default:m(()=>[i(d,{label:"\u6587\u4EF6\u540D",path:"searchParams.name"},{default:m(()=>[i(s,{placeholder:"\u6587\u4EF6\u540D\u6216\u8DEF\u5F84",value:e.searchParams.name,"onUpdate:value":t[0]||(t[0]=T=>e.searchParams.name=T)},null,8,["value"])]),_:1}),i(d,{label:"\u66F4\u65B0\u65F6\u95F4",path:"searchParams.updatedAt"},{default:m(()=>[i(l,{value:e.searchParams.updatedAt,"onUpdate:value":t[1]||(t[1]=T=>e.searchParams.updatedAt=T),type:"datetimerange",clearable:""},null,8,["value"])]),_:1}),i(d,{label:"\u521B\u5EFA\u65F6\u95F4",path:"searchParams.createdAt"},{default:m(()=>[i(l,{value:e.searchParams.createdAt,"onUpdate:value":t[2]||(t[2]=T=>e.searchParams.createdAt=T),type:"datetimerange",clearable:""},null,8,["value"])]),_:1}),i(d,null,{default:m(()=>[i(v,null,{default:m(()=>[Ea]),_:1})]),_:1})]),_:1},8,["model"])]),h("section",Ta,[i($,{vertical:""},{default:m(()=>[e.currentSelections.length?(D(),R(v,{key:0,onClick:e.batchRemoveFiles},{default:m(()=>[Ba]),_:1},8,["onClick"])):We("",!0),i(p,{columns:e.tableColumn,data:e.tableData,loading:e.loading,"row-key":T=>T.path,"onUpdate:checkedRowKeys":e.handleSelect},null,8,["columns","data","loading","row-key","onUpdate:checkedRowKeys"]),i($,{justify:"center"},{default:m(()=>[i(g,{page:e.searchParams.page,"onUpdate:page":t[3]||(t[3]=T=>e.searchParams.page=T),"item-count":e.total,onChange:e.changePage},null,8,["page","item-count","onChange"])]),_:1})]),_:1})]),i(E,{detail:e.detailInfo,visible:e.detailVisible,setDetailVisible:e.setDetailVisible},null,8,["detail","visible","setDetailVisible"]),i(b,{visible:e.loadingModalVisible,limit:e.currentSelections.length,success:e.success,fail:e.fail},null,8,["visible","limit","success","fail"])])}var Aa=M(Sa,[["render",Na]]);const Pa=z({name:"Menu",components:{"n-menu":Je},props:{collapsed:{type:Boolean,require:!0}},setup(e,t){const a=F([]),n=Ke();return qe(()=>{var d;const s=ye.find(l=>l.name==="Layout");s&&((d=s.children)==null?void 0:d.length)&&(a.value=s.children.map(l=>{var v;return{label:(v=l.meta)==null?void 0:v.title,key:l.path}}))}),{menuOptions:a,renderMenuIcon:s=>s.key==="/graph"?Y(ie,null,{default:()=>Y(Xe)}):s.key==="/chart"?Y(ie,null,{default:()=>Y(Qe)}):Y(ie,null,{default:()=>Y(Ze)}),handleClick:(s,d)=>{n.push({path:s})}}}});function za(e,t,a,n,u,c){const s=r("n-menu");return D(),R(s,{collapsed:e.collapsed,"collapsed-width":64,"collapsed-icon-size":22,options:e.menuOptions,"render-icon":e.renderMenuIcon,"onUpdate:value":e.handleClick},null,8,["collapsed","options","render-icon","onUpdate:value"])}var Ma=M(Pa,[["render",za]]);const Ia=z({name:"Layout",components:{NSpace:H,NLayout:xe,Menu:Ma,NLayoutSider:et},setup(){return{collapsed:F(!0)}}});function Ra(e,t,a,n,u,c){const s=r("Menu"),d=r("n-layout-sider"),l=r("router-view"),v=r("n-layout"),o=r("n-space");return D(),R(o,{vertical:""},{default:m(()=>[i(v,{"content-style":{height:"100vh"},"has-sider":""},{default:m(()=>[i(d,{bordered:"","collapse-mode":"width","collapsed-width":64,width:240,collapsed:e.collapsed,"show-trigger":"",onCollapse:t[0]||(t[0]=p=>e.collapsed=!0),onExpand:t[1]||(t[1]=p=>e.collapsed=!1)},{default:m(()=>[i(s,{collapsed:e.collapsed},null,8,["collapsed"])]),_:1},8,["collapsed"]),i(v,{embedded:""},{default:m(()=>[i(l)]),_:1})]),_:1})]),_:1})}var $e=M(Ia,[["render",Ra]]);const ye=[{path:"/",component:$e,name:"Layout",redirect(){return{name:"Graph"}},children:[{path:"/graph",component:St,name:"Graph",meta:{title:"\u4F9D\u8D56\u6811"}},{path:"/chart",component:ia,name:"Chart",meta:{title:"\u5206\u6790\u56FE"}},{path:"/table",component:Aa,name:"Table",meta:{title:"\u8868\u683C\u5206\u6790"}}]}],Oa=tt({history:at(),routes:ye});const Va=z({name:"PageLoading"}),ne=e=>(q("data-v-9f7b7bb4"),e=e(),X(),e),La={class:"sk-folding-cube"},Ua=ne(()=>h("div",{class:"sk-cube1 sk-cube"},null,-1)),ja=ne(()=>h("div",{class:"sk-cube2 sk-cube"},null,-1)),Ga=ne(()=>h("div",{class:"sk-cube4 sk-cube"},null,-1)),Ya=ne(()=>h("div",{class:"sk-cube3 sk-cube"},null,-1)),Ha=[Ua,ja,Ga,Ya];function Wa(e,t,a,n,u,c){return D(),A("div",La,Ha)}var Ja=M(Va,[["render",Wa],["__scopeId","data-v-9f7b7bb4"]]);const Ka=z({name:"App",components:{PageLoading:Ja,Layout:$e,NDialogProvider:nt},setup(){const e=F(!1);return se(()=>{setTimeout(()=>{e.value=!0},2e3)}),{isInitFinished:e}}}),qa={class:"container"},Xa={key:0,class:"loading-wrappper"},Qa=h("p",null,"\u8FD8\u5728\u521D\u59CB\u5316\u554A\uFF0C\u7B49\u4E00\u4E0B\uFF5E",-1),Za={key:1,class:"main-wrapper"};function xa(e,t,a,n,u,c){const s=r("PageLoading"),d=r("router-view"),l=r("n-dialog-provider");return D(),R(l,null,{default:m(()=>[h("div",qa,[e.isInitFinished?(D(),A("div",Za,[i(d)])):(D(),A("div",Xa,[Qa,i(s)]))])]),_:1})}var en=M(Ka,[["render",xa]]);ot(en).use(Oa).mount("#app");
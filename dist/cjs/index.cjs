"use strict";var e=require("js-sha256");function t(t={},s){if(null==t)return"";const r=function e(t){let s=[];return Object.entries(t).map((([t,r],a)=>{if("object"==typeof r&&null!=r&&null!=r)return s=s.concat(e(r));s.push({key:t,value:r})})),s}(t);if(0==r.length)return null;const a=JSON.stringify(r.sort(((e,t)=>e.key.localeCompare(t.key))));return e.sha256(`${a}|key=${s}`).toUpperCase()}const s=Object.freeze({REQUEST:"request",HEART_BEAT:"heart-beat",OK:"OK",ERROR:"error"}),r=Object.freeze({POST:"POST",PUT:"PUT",GET:"GET",DELETE:"DELETE",OPTIONS:"OPTIONS",TRACE:"TRACE",PATCH:"PATCH",CONNECT:"CONNECT",HEAD:"HEAD"});const a={error:({version:e="2",errorMsg:t="",message:r,errorStatus:a=null,statusCode:o=400,type:n=s.ERROR}={})=>({status:"Failed",statusCode:o,version:e,type:n,timestamp:new Date,message:t||r,error:{status:a,message:r,errorMessage:t||r},payload:null}),success:({version:e="2",message:r="",payload:a=null,statusCode:o=200,type:n=s.REQUEST}={})=>({status:"Succeed",statusCode:o,version:e,type:n,timestamp:new Date,message:r,signature:t(a),payload:a}),ok:()=>a.success({message:"ok",type:s.OK}),heartBeat:()=>a.success({message:"Heart-Beat",type:s.HEART_BEAT})},o={async handle(e){const t=await e.json();if(400==t.statusCode)throw t.error;return t.payload}},n={createFetchOptions:({method:e,data:t}={method:r.POST,data:{}})=>({method:e,body:JSON.stringify(t),headers:{"Content-Type":"application/json"}}),put(e={}){return this.createFetchOptions({method:r.PUT,data:e})},post(e={}){return this.createFetchOptions({method:r.POST,data:e})},delete(e={}){return this.createFetchOptions({method:r.DELETE,data:e})}};exports.Fetch=n,exports.FetchResponse=o,exports.HttpMethods=r,exports.HttpResponse=a,exports.HttpResponseType=s,exports.StandardHttpResponse=class{version="1";error({version:e=this.version,errorMsg:t="",message:r,errorStatus:a=null,statusCode:o=400,type:n=s.ERROR}={}){return{status:"Failed",statusCode:o,version:e,type:n,timestamp:new Date,message:t||r,error:{status:a,message:r,errorMessage:t||r},payload:null}}success({version:e=this.version,message:r="",payload:a=null,statusCode:o=200,type:n=s.REQUEST}={}){return{status:"Succeed",statusCode:o,version:e,type:n,timestamp:new Date,message:r,signature:t(a),payload:a}}ok(){return this.success({message:"ok",type:s.OK})}heartBeat(){return this.success({message:"Heart-Beat",type:s.HEART_BEAT})}},exports.createSign=t;
//# sourceMappingURL=index.cjs.map

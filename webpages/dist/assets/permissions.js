import{_ as a,B as l,o as m,c as h,a as s,t as n,F as p,C as d,D as g}from"./main2.js";const _={data(){return{screenshotPath:"../../images/screenshots/permissions-dark.png"}},methods:{msg(i,...e){return chrome.i18n.getMessage(i,...e)}},mounted(){self=this,l().then(({theme:e})=>{e&&(self.screenshotPath="../../images/screenshots/permissions-light.png")}),document.title=chrome.i18n.getMessage("permissionsTitle");const i=e=>(...r)=>new Promise(o=>e(...r,o));document.getElementById("permissionsBtn").addEventListener("click",async()=>{const e="host_permissions",o=chrome.runtime.getManifest()[e].filter(t=>t.startsWith("https://"));if(await i(chrome.permissions.request)({origins:o}))return chrome.runtime.reload();alert(chrome.i18n.getMessage("permissionsDenied"))})}},u={class:"navbar"},f=s("a",{href:"./index.html"},[s("img",{src:d,class:"logo",alt:"Logo"})],-1),b={class:"main"},B={class:"permissions-block"},v={class:"permissions-steps"},P={id:"permissionsBtn",class:"large-button"},k=["src"];function D(i,e,r,o,c,t){return m(),h(p,null,[s("div",u,[f,s("h1",null,n(t.msg("permissions")),1)]),s("div",b,[s("div",B,[s("h2",null,n(t.msg("enablePermissionsTitle")),1),s("p",null,n(t.msg("enablePermissionsDescription")),1)]),s("div",v,[s("div",null,[s("button",P,n(t.msg("enableButton")),1),s("p",null,n(t.msg("enableButtonDescription")),1)]),s("div",null,[s("img",{alt:"{{ msg('permissionsScreenAlt') }}",id:"screenshot",src:c.screenshotPath},null,8,k),s("p",null,n(t.msg("clickAllowDescription")),1)])])])],64)}const E=a(_,[["render",D]]),M=g(E);M.mount("#app");

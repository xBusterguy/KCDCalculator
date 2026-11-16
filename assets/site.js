/* Shared by every page. Loaded in <head> so the saved light/dark choice applies before the first paint.
   1. theme, settings menu, backup and restore   2. loading feedback   3. offline copy and automatic updates   4. messages: toast with Undo, and the "Saved" note */
(function(){var k="kcd-theme",t,d=document.documentElement;try{t=localStorage.getItem(k)}catch(e){}
if(t)d.dataset.theme=t;d.dataset.skin="ledger";
var cur=function(){return d.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")};
addEventListener("DOMContentLoaded",function(){var b=document.getElementById("theme"),m=document.getElementById("menu"),$=function(i){return document.getElementById(i)};
var lab=function(){if(b)b.textContent=cur()=="dark"?"Switch to light":"Switch to dark"};lab();
if(b)b.onclick=function(){var n=cur()=="dark"?"light":"dark";d.dataset.theme=n;try{localStorage.setItem(k,n)}catch(e){}lab()};
if(m){document.addEventListener("click",function(e){if(m.open&&!m.contains(e.target))m.open=false});
m.addEventListener("keydown",function(e){if(e.key=="Escape"){m.open=false;m.querySelector("summary").focus()}})}
var msg=function(t){var e=$("bkmsg");if(e)e.textContent=t};
if($("bk"))$("bk").onclick=function(){var o={app:"kcd-tools",v:1,date:new Date().toISOString(),data:{}},n=0;try{for(var i=0;i<localStorage.length;i++){var q=localStorage.key(i);if(q.indexOf("kcd-")==0){o.data[q]=localStorage.getItem(q);n++}}}catch(e){}
var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:"application/json"}));a.download="kcd-tools-backup-"+o.date.slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000);msg("Backup saved ("+n+" items).")};
if($("rsb"))$("rsb").onclick=function(){$("rs").click()};
if($("rs"))$("rs").onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(o.app!="kcd-tools"||!o.data)throw 0;var ks=Object.keys(o.data).filter(function(x){return x.indexOf("kcd-")==0&&typeof o.data[x]=="string"});
if(!ks.length)throw 0;if(!confirm("Replace the data saved on this site with this backup ("+ks.length+" items)?"))return;ks.forEach(function(x){localStorage.setItem(x,o.data[x])});msg("Restored. Reloading…");location.reload()}catch(e){msg("That file is not a KCD Tools backup.")}};r.readAsText(f);this.value=""};
});
addEventListener("keydown",function(e){if(e.key!="/"||e.ctrlKey||e.metaKey||e.altKey)return;var a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;var q=document.querySelector("input[type=search]");if(q){e.preventDefault();q.focus();q.select()}})})();
/* loading feedback: a status line while the page builds, a slow-connection hint, and a thin bar when moving to another page */
(function(){var d=document,t=setTimeout(function(){var e=d.getElementById("ld"),s=e&&e.querySelector("span");if(s)s.textContent+=" This is taking longer than usual, so your connection may be slow."},6000);
d.addEventListener("DOMContentLoaded",function(){clearTimeout(t);var e=d.getElementById("ld");if(e)e.remove()});
d.addEventListener("click",function(ev){var a=ev.target.closest&&ev.target.closest("a[href]");if(!a||a.target||ev.defaultPrevented||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.button)return;var u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname||d.getElementById("ldbar"))return;var b=d.createElement("div");b.id="ldbar";d.body.appendChild(b);requestAnimationFrame(function(){requestAnimationFrame(function(){b.style.width="85%"})})});
addEventListener("pageshow",function(){var b=d.getElementById("ldbar");if(b)b.remove()})})();
if("serviceWorker"in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
// When the worker finds a newer version of the site, reload once (saved prices and settings live in localStorage and are not touched).
// If you are typing or in the tour, offer a Refresh button instead of interrupting.
var kcdUp=0;navigator.serviceWorker.addEventListener("message",function(e){if(!e.data||e.data.kcd!=="updated"||kcdUp)return;kcdUp=1;var a=document.activeElement,busy=a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)||sessionStorage.getItem("kcd-tour");
if(!busy){location.reload();return}var t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.innerHTML="<span>A new version of the site is ready.</span>";var b=document.createElement("button");b.type="button";b.textContent="Refresh";b.onclick=function(){location.reload()};t.appendChild(b);document.body.appendChild(t)})}
// A short message at the bottom of the screen, with an optional Undo button. Any page can call kcdToast("Done.", undoFunction).
window.kcdToast=function(msg,undo){var d=document,t=d.getElementById("toast");if(t)t.remove();t=d.createElement("div");t.id="toast";t.className="toast";t.setAttribute("role","status");var s=d.createElement("span");s.textContent=msg;t.appendChild(s);
if(undo){var b=d.createElement("button");b.type="button";b.textContent="Undo";b.onclick=function(){t.remove();undo()};t.appendChild(b)}d.body.appendChild(t);clearTimeout(window.kcdToast.t);window.kcdToast.t=setTimeout(function(){t.remove()},9000)};
// "Saved" note: shows briefly when something you changed has been stored in this browser, so you know it will still be here next time.
(function(){var set=Storage.prototype.setItem,last=0,tm,el,KEY=/^kcd-(p|s|o|c|fav|lo|farm|farm-w|presets)$/;
["input","change","click"].forEach(function(n){addEventListener(n,function(){last=Date.now()},true)});
function show(){if(!document.body)return;if(!el){el=document.createElement("div");el.className="saved";el.setAttribute("aria-hidden","true");el.textContent="✓ Saved in this browser";document.body.appendChild(el)}el.classList.add("on");clearTimeout(tm);tm=setTimeout(function(){el.classList.remove("on")},1600)}
Storage.prototype.setItem=function(k,v){var old=null,mine=false;try{mine=this===window.localStorage&&KEY.test(k);if(mine)old=this.getItem(k)}catch(e){}set.apply(this,arguments);if(mine&&old!==String(v)&&Date.now()-last<5000)show()}})();

// Applies the saved theme before first paint and wires the theme button.
(function(){var k="kcd-theme",t;try{t=localStorage.getItem(k)}catch(e){}
if(t)document.documentElement.dataset.theme=t;
addEventListener("DOMContentLoaded",function(){var b=document.getElementById("theme");if(!b)return;
b.onclick=function(){var d=document.documentElement,c=d.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"),n=c=="dark"?"light":"dark";d.dataset.theme=n;try{localStorage.setItem(k,n)}catch(e){}}})})();

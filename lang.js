(function(){
var LANGS=['de','en','ru'], IDX={de:0,en:1};
var store={}; // node -> original russian text
function apply(lang){
  var d=window.I18N||{};
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);
  var n, nodes=[];
  while((n=walker.nextNode())) nodes.push(n);
  nodes.forEach(function(t){
    if(t.parentNode&&(t.parentNode.tagName==='SCRIPT'||t.parentNode.tagName==='STYLE'))return;
    if(t.__ru===undefined) t.__ru=t.nodeValue;
    var raw=t.__ru, key=raw.trim();
    if(!key||!d[key]){ t.nodeValue=raw; return; }
    var val= lang==='ru'? key : d[key][IDX[lang]];
    t.nodeValue=raw.replace(key,val);
  });
  ['placeholder','value','alt','title'].forEach(function(a){
    document.querySelectorAll('['+a+']').forEach(function(el){
      if(el.tagName==='OPTION'&&a==='value')return;
      var k='__ru_'+a; if(el[k]===undefined) el[k]=el.getAttribute(a);
      var key=el[k]; if(!key||!d[key])return;
      el.setAttribute(a, lang==='ru'?key:d[key][IDX[lang]]);
      if(a==='value'&&'value' in el) el.value=el.getAttribute('value');
    });
  });
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-lang]').forEach(function(el){
    var on=el.getAttribute('data-lang')===lang;
    el.style.color=on?'#e6e8ec':'#6b7280';
  });
  try{localStorage.setItem('demo-lang',lang);}catch(e){}
}
function wire(){
  // превращаем текстовые DE / EN / RU в кнопки
  document.querySelectorAll('span').forEach(function(s){
    var t=s.textContent.trim();
    if((t==='DE'||t==='EN'||t==='RU')&&s.children.length===0&&!s.hasAttribute('data-lang')){
      s.setAttribute('data-lang',t.toLowerCase()); s.style.cursor='pointer';
      s.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();apply(t.toLowerCase());});
    }
  });
  var saved='ru'; try{saved=localStorage.getItem('demo-lang')||'ru';}catch(e){}
  if(LANGS.indexOf(saved)<0)saved='ru';
  apply(saved);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();

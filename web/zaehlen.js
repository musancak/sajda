'use strict';
// Besucherzählung: welche Bereiche und Gebete genutzt werden (GoatCounter-Ereignisse, ohne Cookies)
(()=>{const s=show;show=function(id){if(id!==view)zaehl('ansicht-'+id);return s.apply(this,arguments)};
const st=start;start=function(id){zaehl('gebet-'+id);return st.apply(this,arguments)}})();

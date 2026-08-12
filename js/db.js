RSA.DB=(()=>{const name='rsa_frota_db',version=1,stores=['machines','pendencias','photos','historico'];let db;
function open(){return new Promise((resolve,reject)=>{const req=indexedDB.open(name,version);req.onupgradeneeded=e=>{const d=e.target.result;stores.forEach(s=>{if(!d.objectStoreNames.contains(s)){const st=d.createObjectStore(s,{keyPath:'id'}); if(s==='pendencias')st.createIndex('machineId','machineId'); if(s==='photos'||s==='historico')st.createIndex('pendenciaId','pendenciaId');}})};req.onsuccess=()=>{db=req.result;resolve(db)};req.onerror=()=>reject(req.error)})}
const tx=(store,mode='readonly')=>db.transaction(store,mode).objectStore(store);
function all(store){return new Promise((res,rej)=>{const r=tx(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
function get(store,id){return new Promise((res,rej)=>{const r=tx(store).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function put(store,obj){return new Promise((res,rej)=>{const r=tx(store,'readwrite').put(obj);r.onsuccess=()=>res(obj);r.onerror=()=>rej(r.error)})}
function del(store,id){return new Promise((res,rej)=>{const r=tx(store,'readwrite').delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function clear(){await Promise.all(stores.map(s=>new Promise((res,rej)=>{const r=tx(s,'readwrite').clear();r.onsuccess=res;r.onerror=()=>rej(r.error)})))}
async function exportData(){const out={exportedAt:new Date().toISOString(),version, machines:await all('machines'), pendencias:await all('pendencias'), photos:await all('photos'), historico:await all('historico')};return out}
async function importData(data){await clear();for(const s of stores){for(const item of (data[s]||[])) await put(s,item)}}
return{open,all,get,put,del,clear,exportData,importData};})();

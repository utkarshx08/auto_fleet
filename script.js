const toast = document.getElementById('toast');
let toastTimer;
function notify(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'),2600);
}
document.getElementById('addVehicle').addEventListener('click',()=>notify('Vehicle creation form is ready to be connected to your backend.'));
document.getElementById('exportBtn').addEventListener('click',()=>{
  const rows=[['Vehicle','Driver','Status','Location','Fuel'],['RST-291','Alex Morgan','Active','New York, NY','78%'],['RST-284','Sarah Chen','Active','Brooklyn, NY','64%'],['RST-276','Michael Ross','In service','Queens, NY','32%'],['RST-265','Emily Park','Idle','Jersey City, NJ','91%']];
  const csv=rows.map(r=>r.join(',')).join('\\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='autrail-fleet-report.csv';a.click();URL.revokeObjectURL(url);
  notify('Fleet report exported as CSV.');
});
document.getElementById('vehicleDetails').addEventListener('click',()=>notify('Opening RST-291 vehicle details.'));
document.getElementById('allVehicles').addEventListener('click',()=>notify('Showing the complete vehicle directory.'));
document.getElementById('allAlerts').addEventListener('click',()=>notify('You are viewing the latest fleet alerts.'));
document.getElementById('filterBtn').addEventListener('click',()=>notify('Filters: status and fuel level.'));
document.getElementById('vehicleSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  document.querySelectorAll('#vehicleRows tr').forEach(row=>row.style.display=row.innerText.toLowerCase().includes(q)?'':'none');
});
const chartPaths={
 week:'M0 130 C45 110 50 120 95 92 S155 115 195 82 S255 92 295 62 S355 82 395 49 S455 78 495 34 S555 56 600 18',
 month:'M0 145 C50 135 70 100 110 116 S165 72 205 90 S265 45 310 66 S360 55 405 38 S465 57 510 27 S560 38 600 12',
 year:'M0 155 C45 142 70 130 110 119 S165 130 205 91 S265 108 310 72 S365 85 405 50 S465 63 510 35 S560 40 600 15'
};
document.getElementById('periodSelect').addEventListener('change',e=>{
  const d=chartPaths[e.target.value];
  document.getElementById('chartLine').setAttribute('d',d);
  document.getElementById('chartArea').setAttribute('d',d+' L600 190 L0 190Z');
  const totals={week:'18,420',month:'72,680',year:'824,300'};
  document.getElementById('chartTotal').innerHTML=totals[e.target.value]+' <small>km</small>';
  notify('Chart updated: '+e.target.options[e.target.selectedIndex].text+'.');
});
document.querySelectorAll('.nav-item').forEach(link=>link.addEventListener('click',()=>{
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  link.classList.add('active');
}));

import { useEffect, useMemo, useRef, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ThemeSelector from "../components/ThemeSelector";
import PremiumSelect from "../components/PremiumSelect";
import { Download, MonitorSmartphone, Moon, RotateCcw, Share2, Sun, Upload, Cloud, Languages, Ruler, CalendarDays, BellRing, WalletCards, ShieldCheck, History, Trash2, RefreshCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { createSnapshot, deleteSnapshot, getLastBackupAt, getSnapshots, importPayload, inspectDataHealth, makeExportPayload, restoreSnapshot } from "../utils/dataProtection";

const PREF_KEY="ftos-personal-preferences-v2";
const defaultPrefs={currency:"SGD",dateFormat:"DD/MM/YYYY",timeFormat:"24-hour",distanceUnit:"km",language:"English",notifications:true,airportReminders:true,packingReminders:true,hotelReminders:true,exploreReminders:true,defaultTripTemplate:"Concert Trip"};

function downloadPayload(payload) {
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`FreedomTravelOS-Personal-backup-${new Date().toISOString().replace(/[:.]/g,"-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const prettyDate=(value)=>value?new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"Never";

export default function Settings({ store, theme, setTheme }) {
  const { trip, updateTripField, resetAll } = store;
  const inputRef=useRef(null);
  const [prefs,setPrefs]=useState(()=>{try{return {...defaultPrefs,...JSON.parse(localStorage.getItem(PREF_KEY)||"{}")}}catch{return defaultPrefs}});
  const [snapshots,setSnapshots]=useState(getSnapshots);
  const [lastBackup,setLastBackup]=useState(getLastBackupAt);
  const [health,setHealth]=useState(inspectDataHealth);

  useEffect(()=>{
    const refresh=()=>{setSnapshots(getSnapshots());setLastBackup(getLastBackupAt());setHealth(inspectDataHealth());};
    window.addEventListener("ftos-backup-created",refresh);
    return()=>window.removeEventListener("ftos-backup-created",refresh);
  },[]);

  const savePrefs=(next)=>{createSnapshot("Before settings change");setPrefs(next);localStorage.setItem(PREF_KEY,JSON.stringify(next));window.ftosToast?.("Preferences saved")};
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : MonitorSmartphone;
  const backupSize=useMemo(()=>new Blob([JSON.stringify(makeExportPayload())]).size,[snapshots,lastBackup]);

  function manualBackup(){const created=createSnapshot("Manual backup",{force:true});if(created){window.ftosToast?.("Backup created");setSnapshots(getSnapshots());setLastBackup(created.createdAt)}}
  function downloadBackup(){const payload=makeExportPayload();createSnapshot("Exported backup",{force:true});downloadPayload(payload);window.ftosToast?.("Backup downloaded")}
  async function shareBackup(){const payload=makeExportPayload();createSnapshot("Shared backup",{force:true});const file=new File([JSON.stringify(payload,null,2)],"FreedomTravelOS-Personal-backup.json",{type:"application/json"});if(navigator.canShare?.({files:[file]}))await navigator.share({title:"Freedom Travel OS Personal backup",files:[file]});else downloadPayload(payload)}
  async function importBackup(e){const file=e.target.files?.[0];if(!file)return;try{const payload=JSON.parse(await file.text());if(!confirm("Import this backup and replace current app data? A recovery snapshot will be created first."))return;importPayload(payload);window.ftosToast?.("Backup restored");setTimeout(()=>location.reload(),500)}catch{window.ftosToast?.("Invalid backup file","warning")}finally{e.target.value=""}}
  function restore(item){if(!confirm(`Restore backup from ${prettyDate(item.createdAt)}? Current data will be backed up first.`))return;try{restoreSnapshot(item);window.ftosToast?.("Backup restored");setTimeout(()=>location.reload(),500)}catch{window.ftosToast?.("Could not restore backup","warning")}}
  function remove(item){if(!confirm("Delete this backup snapshot?"))return;deleteSnapshot(item.id);setSnapshots(getSnapshots());window.ftosToast?.("Backup deleted")}

  return <Page><header className="app-header"><div><span className="eyebrow">Personal Preferences</span><h1>Settings</h1></div><span className="status-chip">v2.2 protected</span></header>
    <SectionTitle title="Appearance" subtitle="Light, Dark or follow your device."/><Card className="theme-card beta1-theme-card"><div className="theme-copy"><span className="theme-icon"><ThemeIcon size={20}/></span><section><strong>{theme === "system" ? "Follow System" : theme === "dark" ? "Dark Mode" : "Light Mode"}</strong><p>Switch between premium light, navy dark, or your device setting.</p></section></div><ThemeSelector theme={theme} setTheme={setTheme}/></Card>
    <SectionTitle title="App Preferences" subtitle="These settings do not remove or change your Korea trip information."/>
    <Card className="preferences-grid premium-preferences-grid">
      <PremiumSelect label="Default currency" icon={WalletCards} value={prefs.currency} onChange={e=>savePrefs({...prefs,currency:e.target.value})}><option>SGD</option><option>KRW</option><option>USD</option><option>JPY</option></PremiumSelect>
      <PremiumSelect label="Date format" icon={CalendarDays} value={prefs.dateFormat} onChange={e=>savePrefs({...prefs,dateFormat:e.target.value})}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></PremiumSelect>
      <PremiumSelect label="Time format" value={prefs.timeFormat} onChange={e=>savePrefs({...prefs,timeFormat:e.target.value})}><option>24-hour</option><option>12-hour</option></PremiumSelect>
      <PremiumSelect label="Distance units" icon={Ruler} value={prefs.distanceUnit} onChange={e=>savePrefs({...prefs,distanceUnit:e.target.value})}><option value="km">Kilometres</option><option value="mi">Miles</option></PremiumSelect>
      <PremiumSelect label="App language" icon={Languages} value={prefs.language} onChange={e=>savePrefs({...prefs,language:e.target.value})}><option>English</option><option>中文 (planned)</option><option>한국어 (planned)</option></PremiumSelect>
      <PremiumSelect label="Default trip template" value={prefs.defaultTripTemplate} onChange={e=>savePrefs({...prefs,defaultTripTemplate:e.target.value})}><option>Concert Trip</option><option>Vacation</option><option>Weekend Trip</option><option>Business Trip</option></PremiumSelect>
    </Card>
    <SectionTitle title="Notification Preferences" subtitle="Choose the reminders you want the app to prepare."/>
    <Card className="preferences-grid notification-settings">
      {[['notifications','All notifications'],['airportReminders','Airport reminders'],['packingReminders','Packing reminders'],['hotelReminders','Hotel reminders'],['exploreReminders','Daily itinerary reminders']].map(([key,label])=><label className="preference-switch" key={key}><span><BellRing size={16}/>{label}</span><input type="checkbox" checked={Boolean(prefs[key])} onChange={e=>savePrefs({...prefs,[key]:e.target.checked})}/></label>)}
    </Card>
    <SectionTitle title="Trip Profile"/><Card className="form-grid">{["traveller","tripName","destination","startDate","endDate","status"].map((k)=><EditableField key={k} label={k} value={trip[k]} onChange={(v)=>{updateTripField(k,v);window.ftosToast?.("Trip profile saved")}}/>)}</Card>

    <SectionTitle title="Data Protection" subtitle="Versioned backups protect flights, hotels, budget, packing, itinerary, journal and settings."/>
    <Card className="protection-overview">
      <div className={`protection-status ${health.ok?'ok':'warning'}`}>{health.ok?<CheckCircle2 size={22}/>:<AlertTriangle size={22}/>}<section><strong>{health.ok?"Data integrity verified":"Data needs attention"}</strong><p>{health.ok?`${health.keys} app records checked successfully.`:`Invalid records: ${health.invalidKeys.join(', ')}`}</p></section></div>
      <div className="protection-stats"><div><span>Last backup</span><strong>{prettyDate(lastBackup)}</strong></div><div><span>Recovery points</span><strong>{snapshots.length}</strong></div><div><span>Export size</span><strong>{Math.max(1,Math.round(backupSize/1024))} KB</strong></div></div>
      <button className="primary-button full-width-action" onClick={manualBackup}><ShieldCheck size={17}/> Create Recovery Point</button>
    </Card>

    <SectionTitle title="Backup & Cloud-ready Transfer" subtitle="Keep a copy in Drive, OneDrive, iCloud Files or another device."/><Card className="backup-actions"><button onClick={downloadBackup}><Download size={17}/> Download Backup</button><button onClick={shareBackup}><Share2 size={17}/> Share / Save to Cloud</button><button onClick={()=>inputRef.current?.click()}><Upload size={17}/> Import & Restore</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={importBackup}/><p><Cloud size={15}/> Your backup contains only Freedom Travel OS data. True automatic account sync remains planned for a later cloud release.</p></Card>

    <SectionTitle title="Recovery History" subtitle="Up to eight recent recovery points are kept on this device."/>
    {snapshots.length?<div className="backup-history">{snapshots.map(item=><Card className="backup-history-row" key={item.id}><div className="backup-history-icon"><History size={18}/></div><section><strong>{item.reason}</strong><p>{prettyDate(item.createdAt)}</p><small>Version {item.version||'Unknown'} · {Object.keys(item.data||{}).length} records</small></section><div className="backup-history-actions"><button onClick={()=>restore(item)} aria-label="Restore backup"><RefreshCcw size={16}/></button><button className="icon-danger" onClick={()=>remove(item)} aria-label="Delete backup"><Trash2 size={16}/></button></div></Card>)}</div>:<Card className="empty-backup"><ShieldCheck size={28}/><strong>No recovery points yet</strong><p>Create one before making major trip changes.</p></Card>}

    <SectionTitle title="Danger Zone"/><Card><button className="danger-button" onClick={()=>{if(!confirm("Reset all personal app data? A recovery point will be created first, then your built-in Korea defaults restored."))return;createSnapshot("Before full reset",{force:true});resetAll();window.ftosToast?.("App data reset","warning")}}><RotateCcw size={16}/> Reset All App Data</button></Card>
  </Page>;
}

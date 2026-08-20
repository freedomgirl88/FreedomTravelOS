import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ModalSheet from "../components/ModalSheet";
import { HeartPulse, Plus, Phone, Pencil, Trash2, MapPin, Shield, Flame, BriefcaseMedical, Building2, LifeBuoy, UserRound, StickyNote, Save } from "lucide-react";

function iconFor(name=""){
  const value=name.toLowerCase();
  if(value.includes("police")) return Shield;
  if(value.includes("fire")||value.includes("ambulance")||value.includes("medical")) return Flame;
  if(value.includes("tourist")||value.includes("helpline")) return LifeBuoy;
  if(value.includes("embassy")||value.includes("consulate")) return Building2;
  if(value.includes("hospital")||value.includes("clinic")) return BriefcaseMedical;
  return UserRound;
}

export default function Emergency({store}){
 const [open,setOpen]=useState(false),[editing,setEditing]=useState(null); const [form,setForm]=useState({name:"",phone:"",note:""});
 const begin=(item=null)=>{setEditing(item);setForm(item?{...item}:{name:"",phone:"",note:""});setOpen(true)};
 const save=()=>{if(!form.name.trim()||!form.phone.trim())return window.ftosToast?.("Add a name and phone number","error");editing?store.updateEmergencyContact(editing.id,form):store.addEmergencyContact(form);setOpen(false);window.ftosToast?.("Emergency contact saved")};
 return <Page><header className="app-header"><div><span className="eyebrow">Smart Travel</span><h1>Emergency</h1></div><button className="icon-button" onClick={()=>begin()}><Plus size={20}/></button></header>
 <Card className="emergency-hero"><HeartPulse size={30}/><div><h2>Important help, one tap away</h2><p>Add local emergency numbers, your embassy, hotel reception and trusted contacts.</p></div></Card>
 <SectionTitle title="Trip location"/><Card className="location-summary"><MapPin size={20}/><div><strong>{store.trip.destination||"Destination not added"}</strong><p>{store.trip.hotel?.name||"Hotel not added yet"}</p></div></Card>
 <SectionTitle title="Emergency contacts" action={store.emergencyContacts.length?"Add":null} onAction={()=>begin()}/>
 {!store.emergencyContacts.length?<EmptyState icon={Phone} title="No emergency contacts" description="Add the local police, ambulance, embassy, hotel or a trusted person." actionLabel="Add contact" onAction={()=>begin()}/>:<div className="emergency-contact-list">{store.emergencyContacts.map(item=>{const Icon=iconFor(item.name);return <Card className="emergency-contact-card" key={item.id}><span className="emergency-contact-icon"><Icon size={21}/></span><section><strong>{item.name}</strong><a href={`tel:${item.phone}`}>{item.phone}</a>{item.note&&<small>{item.note}</small>}</section><a className="emergency-call-button" href={`tel:${item.phone}`} aria-label={`Call ${item.name}`}><Phone size={20}/></a><div className="emergency-row-actions"><button onClick={()=>begin(item)} aria-label={`Edit ${item.name}`}><Pencil size={16}/></button><button onClick={()=>{if(confirm("Delete this contact?"))store.deleteEmergencyContact(item.id)}} aria-label={`Delete ${item.name}`}><Trash2 size={16}/></button></div></Card>})}</div>}
 <Card className="emergency-note"><Shield size={20}/><p>Numbers are saved for your Korea trip. Tap the phone button to call from your device.</p></Card>
 <ModalSheet title={editing?"Edit contact":"Add emergency contact"} open={open} onClose={()=>setOpen(false)} footer={<button className="primary-button full-width-action premium-save-button" onClick={save}><Save size={18}/>Save contact</button>}><div className="sheet-form premium-form-grid emergency-form">
  <label className="premium-field"><span>Name</span><div className="premium-control"><UserRound size={18}/><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Singapore Embassy"/></div></label>
  <label className="premium-field"><span>Phone number</span><div className="premium-control"><Phone size={18}/><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="e.g. +82 2 779 5673"/></div></label>
  <label className="premium-field premium-field-wide"><span>Notes <small>(optional)</small></span><div className="premium-control premium-textarea"><StickyNote size={18}/><textarea rows="4" value={form.note||""} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Opening hours or address"/></div></label>
 </div></ModalSheet></Page>;
}

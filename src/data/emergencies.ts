export interface Emergency { sign: string; name: string; action: string; keywords: string[] }

const RAW: [string, string, string, string[]][] = [
["Chest pain with sweating or radiation to arm or jaw, or ECG change","Acute Coronary Syndrome","Adult: aspirin 325 mg chewed, sublingual nitrate if BP is stable, oxygen if hypoxic, urgent ECG and transfer.",["chest pain","heart attack","jaw pain","arm pain","sweating"]],
["Sudden one-sided weakness, facial droop, or slurred speech","Acute Stroke","Record onset time. Nothing by mouth. Transfer to a stroke-capable centre.",["stroke","facial droop","slurred speech","one side weak"]],
["BP 160/110 or higher in pregnancy with headache, visual change, epigastric pain, or hyperreflexia","Severe Pre-eclampsia","Magnesium sulfate if seizure risk, per protocol. Control BP with labetalol or nifedipine. Immediate obstetric admission.",["eclampsia","pregnancy bp","pregnant headache"]],
["Wheeze, stridor, tongue or face swelling, or low BP after a trigger","Anaphylaxis","Adult IM adrenaline 0.5 mg of 1:1000 in the thigh. Repeat every 5–15 min. IV fluids and transfer. Child dose is weight-based, not 0.5 mg.",["anaphylaxis","tongue swelling","throat swelling","stridor"]],
["Vomiting blood or black stool with low BP and fast pulse","Upper GI Bleed","IV access and fluids, nil by mouth, no NSAID or anticoagulant, urgent endoscopy.",["blood vomit","black stool","melena","haematemesis"]],
["High fever, low BP, fast pulse, and confusion","Sepsis","IV fluids, early antibiotics per local protocol, and ICU-level transfer.",["sepsis","septic shock","low bp fever"]],
["Severe abdominal pain with rigidity, especially in typhoid or ulcer disease","Hollow Viscus Perforation","Nil by mouth, IV fluids, urgent surgical referral.",["rigid abdomen","perforation","guarding"]],
["Reduced fetal movements or painless heavy pregnancy bleeding","Abruption or Placenta Praevia","No vaginal examination. Urgent obstetric ultrasound and referral.",["fetal movement","pregnancy bleeding","painless bleeding"]],
["Saddle anaesthesia, both legs weak, or new bladder or bowel incontinence","Cauda Equina Syndrome","Urgent MRI and surgical referral within hours.",["cauda equina","saddle anaesthesia","urine retention"]],
["Confusion, jaundice, low urine, or bleeding with fever in an endemic area","Severe Malaria","IV artesunate and admission. Do not wait for an oral trial.",["cerebral malaria","severe malaria","fever unconscious","fever jaundice"]]
];

export const EMERGENCIES: Emergency[] = RAW.map(([sign, name, action, keywords]) => ({ sign, name, action, keywords }));

export function detectEmergencies(query: string): Emergency[] {
  const s = query.toLowerCase().trim();
  if (s.length <= 2) return [];
  return EMERGENCIES.filter((e) => e.keywords.some((k) => s.includes(k)));
}

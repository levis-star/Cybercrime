import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check, ChevronLeft, ChevronRight, Copy, Paperclip,
  Send, ShieldCheck, UploadCloud
} from 'lucide-react';
import { useBlocker } from 'react-router-dom';
import { reportService } from '../services/reportService.js';
import api from '../services/api.js';

// Tanzania regions + districts (for location step)
const TZ_REGIONS = [
  'Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma',
  'Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza',
  'Njombe','Pemba North','Pemba South','Pwani','Rukwa','Ruvuma','Shinyanga',
  'Simiyu','Singida','Songwe','Tabora','Tanga','Unguja North','Unguja South',
  'Unguja Urban/West',
];

const TZ_DISTRICTS = {
  'Arusha':['Arusha City','Arusha DC','Karatu','Longido','Monduli','Ngorongoro'],
  'Dar es Salaam':['Ilala','Kinondoni','Temeke','Ubungo','Kigamboni'],
  'Dodoma':['Dodoma City','Bahi','Chamwino','Chemba','Kondoa','Kongwa','Mpwapwa'],
  'Geita':['Geita DC','Geita TC','Bukombe','Chato','Mbogwe',"Nyang'hwale"],
  'Iringa':['Iringa Municipal','Iringa DC','Kilolo','Mafinga TC','Mufindi'],
  'Kagera':['Bukoba Municipal','Bukoba DC','Biharamulo','Karagwe','Kyerwa','Missenyi','Muleba','Ngara'],
  'Katavi':['Mpanda Municipal','Mpanda DC','Mlele','Nsimbo'],
  'Kigoma':['Kigoma-Ujiji Municipal','Kigoma DC','Buhigwe','Kakonko','Kasulu DC','Kasulu TC','Kibondo','Uvinza'],
  'Kilimanjaro':['Moshi Municipal','Moshi DC','Hai','Mwanga','Rombo','Same','Siha'],
  'Lindi':['Lindi Municipal','Lindi DC','Kilwa','Liwale','Nachingwea','Ruangwa'],
  'Manyara':['Babati TC','Babati DC','Hanang','Kiteto','Mbulu','Simanjiro'],
  'Mara':['Musoma Municipal','Musoma DC','Bunda','Butiama','Rorya','Serengeti','Tarime DC','Tarime TC'],
  'Mbeya':['Mbeya City','Mbeya DC','Busokelo','Chunya','Kyela','Mbarali','Momba','Rungwe'],
  'Morogoro':['Morogoro Municipal','Morogoro DC','Gairo','Ifakara TC','Kilombero','Kilosa','Malinyi','Mvomero','Ulanga'],
  'Mtwara':['Mtwara Municipal','Mtwara DC','Masasi DC','Masasi TC','Nanyumbu','Newala DC','Newala TC','Tandahimba'],
  'Mwanza':['Ilemela','Nyamagana','Kwimba','Magu','Misungwi','Sengerema','Ukerewe'],
  'Njombe':['Njombe TC','Njombe DC','Ludewa','Makambako TC','Makete',"Wanging'ombe"],
  'Pemba North':['Micheweni','Wete'],
  'Pemba South':['Chake Chake','Mkoani'],
  'Pwani':['Bagamoyo','Kibaha DC','Kibaha TC','Kisarawe','Mafia','Mkuranga','Rufiji'],
  'Rukwa':['Sumbawanga Municipal','Sumbawanga DC','Kalambo','Nkasi'],
  'Ruvuma':['Songea Municipal','Songea DC','Mbinga DC','Mbinga TC','Namtumbo','Nyasa','Tunduru DC','Tunduru TC'],
  'Shinyanga':['Shinyanga Municipal','Shinyanga DC','Kahama TC','Kahama DC','Kishapu','Msalala','Ushetu'],
  'Simiyu':['Bariadi DC','Bariadi TC','Busega','Itilima','Maswa','Meatu'],
  'Singida':['Singida Municipal','Singida DC','Ikungi','Iramba','Manyoni','Mkalama'],
  'Songwe':['Mbozi','Momba','Ileje','Songwe DC','Tunduma TC','Vwawa TC'],
  'Tabora':['Tabora Municipal','Igunga','Kaliua','Nzega DC','Nzega TC','Sikonge','Urambo','Uyui'],
  'Tanga':['Tanga City','Handeni DC','Handeni TC','Kilindi','Korogwe DC','Korogwe TC','Lushoto','Mkinga','Muheza','Pangani'],
  'Unguja North':['Kaskazini A','Kaskazini B'],
  'Unguja South':['Kusini'],
  'Unguja Urban/West':['Magharibi','Mjini'],
};

const REGION_COORDS = {
  'Arusha':[-3.387,36.683],'Dar es Salaam':[-6.792,39.208],'Dodoma':[-6.172,35.740],
  'Geita':[-2.872,32.173],'Iringa':[-7.769,35.694],'Kagera':[-1.998,31.550],
  'Katavi':[-6.363,31.410],'Kigoma':[-4.882,29.659],'Kilimanjaro':[-3.352,37.343],
  'Lindi':[-9.997,39.717],'Manyara':[-4.316,36.016],'Mara':[-1.756,34.020],
  'Mbeya':[-8.895,33.458],'Morogoro':[-6.819,37.659],'Mtwara':[-10.269,40.183],
  'Mwanza':[-2.517,32.918],'Njombe':[-9.333,34.770],'Pemba North':[-5.030,39.781],
  'Pemba South':[-5.317,39.758],'Pwani':[-7.057,38.813],'Rukwa':[-7.957,31.399],
  'Ruvuma':[-10.438,36.103],'Shinyanga':[-3.662,33.428],'Simiyu':[-2.837,34.146],
  'Singida':[-4.819,34.750],'Songwe':[-8.537,32.479],'Tabora':[-5.016,32.801],
  'Tanga':[-5.069,38.952],'Unguja North':[-5.767,39.400],'Unguja South':[-6.253,39.508],
  'Unguja Urban/West':[-6.163,39.208],
};

const initial = {
  category: 'Mobile money fraud',
  description: '',
  locationRegion: 'Dar es Salaam',
  locationDistrict: '',
  street: '',
  reporterPhone: '',
  latitude: -6.7924,
  longitude: 39.2083,
  anonymityStatus: 'anonymous',
  hasEvidence: false,
  verifiedName: '',
  verifiedPhone: '',
};

// ── Per-step validation ──────────────────────────────────────────────────────
function validateStep(step, form) {
  switch (step) {
    case 0: return form.category ? null : 'Please select a crime category.';
    case 1: return form.description.trim().length >= 20
      ? null
      : `Description must be at least 20 characters (${form.description.trim().length}/20 so far).`;
    case 2: {
      if (!form.locationRegion.trim()) return 'Please select a region.';
      if (!form.locationDistrict)       return 'Please select a district / wilaya.';
      if (form.reporterPhone && !/^[0-9+\s\-(]{7,15}$/.test(form.reporterPhone))
        return 'Please enter a valid phone number (digits only).';
      return null;
    }
    case 3: {
      if (!form.anonymityStatus) return 'Please choose anonymous or verified.';
      if (form.anonymityStatus === 'verified') {
        if (!form.verifiedName.trim())  return 'Please enter your full name.';
        if (!form.verifiedPhone.trim()) return 'Please enter your current phone number.';
      }
      return null;
    }
    default: return null;
  }
}

export default function ReportWizard() {
  const [step,          setStep]          = useState(0);
  const [categories,    setCategories]    = useState([]);
  const [form,          setForm]          = useState(initial);
  const [stepError,     setStepError]     = useState('');
  const [submitError,   setSubmitError]   = useState('');
  const [submitted,     setSubmitted]     = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError,   setUploadError]   = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    reportService.categories().then((items) => {
      setCategories(items);
      setForm((c) => ({ ...c, category: items[0] || c.category }));
    });
  }, []);

  const steps = useMemo(() => ['Category', 'Details', 'Location', 'Identity', 'Review'], []);
  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  // Dirty when the user has moved past step 0 or typed a description
  const isDirty = !submitted && (step > 0 || form.description.trim().length > 0);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  // Warn on browser tab close / refresh while dirty
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Auto-fill lat/lng when region changes
  const changeRegion = (region) => {
    const coords = REGION_COORDS[region];
    setForm((c) => ({
      ...c,
      locationRegion: region,
      locationDistrict: '',
      latitude:  coords ? coords[0] : c.latitude,
      longitude: coords ? coords[1] : c.longitude,
    }));
  };

  const tryNext = () => {
    const err = validateStep(step, form);
    if (err) { setStepError(err); return; }
    setStepError('');
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setSubmitError('');
    try {
      const report = await reportService.create({
        ...form,
        latitude:  Number(form.latitude),
        longitude: Number(form.longitude),
      });
      setSubmitted(report);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Unable to submit report. Please try again.');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(submitted.trackingCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const uploadFile = async (file) => {
    if (!file || !submitted) return;
    setUploadError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('evidence', file);
      const { data } = await api.post(
        `/reports/${encodeURIComponent(submitted.trackingCode)}/upload-evidence`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploadedFiles((prev) => [...prev, data.evidence]);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Max 5 MB, PNG/JPG/WEBP/PDF/TXT.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // ── Success: tracking number popup ──────────────────────────────────────
  if (submitted) {
    return (
      <section className="page narrow">
        {/* Prominent popup card */}
        <div className="trackingPopup">
          <div className="trackingPopupIcon">
            <ShieldCheck size={48} />
          </div>
          <div className="trackingPopupBody">
            <span className="eyebrow">Case registered successfully</span>
            <h1>Your case number</h1>
            <div className="trackingCodeBlock">
              <code>{submitted.trackingCode}</code>
              <button className="button" onClick={copyCode} title="Copy to clipboard">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="trackingInstructions">
              <strong>Save this number carefully.</strong> It is the only way to check your case status
              without revealing your identity. Write it down or copy it now.
            </p>
            <div className="trackingDetails">
              <span>Category: <strong>{submitted.category}</strong></span>
              <span>Region: <strong>{submitted.locationRegion}</strong></span>
              {submitted.locationDistrict && <span>District: <strong>{submitted.locationDistrict}</strong></span>}
              <span>Severity score: <strong>{submitted.severityScore}</strong></span>
            </div>
          </div>
        </div>

        {/* Evidence upload */}
        <div className="panel evidenceUploadPanel">
          <div className="panelHeader">
            <h2><Paperclip size={20} /> Attach evidence <span className="pill">optional</span></h2>
          </div>
          <p className="hint">Upload screenshots, PDFs, or text files (max 5 MB each). PNG, JPG, WEBP, PDF, TXT.</p>
          {uploadedFiles.length > 0 && (
            <ul className="uploadedList">
              {uploadedFiles.map((f) => (
                <li key={f.id}><Check size={16} /><span>{f.fileUrl.split('/').pop()}</span></li>
              ))}
            </ul>
          )}
          {uploadError ? <p className="error">{uploadError}</p> : null}
          <div className="uploadActions">
            <input
              ref={fileRef} type="file"
              accept=".png,.jpg,.jpeg,.webp,.pdf,.txt"
              style={{ display: 'none' }}
              onChange={(e) => uploadFile(e.target.files[0])}
            />
            <button className="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <UploadCloud size={18} />{uploading ? 'Uploading…' : 'Choose file'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Wizard ──────────────────────────────────────────────────────────────
  return (
    <>
    {blocker.state === 'blocked' && (
      <div className="navBlockerOverlay">
        <div className="navBlockerDialog">
          <h2>Leave this page?</h2>
          <p>You have started a crime report. If you leave now, your progress will be lost and cannot be recovered.</p>
          <div className="navBlockerActions">
            <button className="button primary" onClick={() => blocker.reset()}>
              Continue reporting
            </button>
            <button className="button danger" onClick={() => blocker.proceed()}>
              Discard &amp; leave
            </button>
          </div>
        </div>
      </div>
    )}
    <section className="page narrow">
      <div className="sectionHeader">
        <span className="eyebrow">Incident intake</span>
        <h1>Report wizard</h1>
      </div>

      <div className="steps">
        {steps.map((label, i) => (
          <span className={i < step ? 'done' : i === step ? 'done active' : ''} key={label}>{label}</span>
        ))}
      </div>

      <div className="formPanel">
        {/* Step 0 — Category */}
        {step === 0 && (
          <label>
            Crime category
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        )}

        {/* Step 1 — Description */}
        {step === 1 && (
          <>
            <label>
              What happened? <span className="charCount">{form.description.trim().length}/20 min</span>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                minLength={20}
                rows={8}
                placeholder="Describe the incident in detail — what happened, when, and how…"
              />
            </label>
            <label className="checkRow">
              <input type="checkbox" checked={form.hasEvidence} onChange={(e) => update('hasEvidence', e.target.checked)} />
              I have screenshots, PDFs, phone numbers, links, or transaction references.
            </label>
          </>
        )}

        {/* Step 2 — Location */}
        {step === 2 && (
          <div className="locationGrid">
            <label>
              Mkoa (Region) <span className="requiredStar">*</span>
              <select value={form.locationRegion} onChange={(e) => changeRegion(e.target.value)}>
                {TZ_REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label>
              Wilaya (District) <span className="requiredStar">*</span>
              <select value={form.locationDistrict} onChange={(e) => update('locationDistrict', e.target.value)}>
                <option value="">— select district —</option>
                {(TZ_DISTRICTS[form.locationRegion] || []).map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label>
              Street / Mtaa
              <input
                type="text"
                value={form.street}
                onChange={(e) => update('street', e.target.value)}
                placeholder="Enter street or mtaa name"
              />
            </label>
            <label>
              Phone number / Namba ya simu
              <input
                type="tel"
                value={form.reporterPhone}
                onChange={(e) => update('reporterPhone', e.target.value.replace(/[^0-9+\s\-()]/g, ''))}
                placeholder="e.g. +255 7XX XXX XXX"
              />
            </label>
          </div>
        )}

        {/* Step 3 — Identity */}
        {step === 3 && (
          <>
            <div className="choiceGrid">
              {['anonymous', 'verified'].map((opt) => (
                <button className={form.anonymityStatus === opt ? 'choice active' : 'choice'} onClick={() => update('anonymityStatus', opt)} key={opt}>
                  <strong>{opt === 'anonymous' ? 'Anonymous' : 'Verified'}</strong>
                  <span>{opt === 'anonymous' ? 'No account identity is attached to this report.' : 'Attach your identity so investigators can follow up with you.'}</span>
                </button>
              ))}
            </div>
            {form.anonymityStatus === 'verified' && (
              <div className="verifiedBox">
                <p className="verifiedBoxHint">Your details are kept confidential and only shared with assigned investigators.</p>
                <label>
                  Full name <span className="requiredStar">*</span>
                  <input
                    type="text"
                    value={form.verifiedName}
                    onChange={(e) => update('verifiedName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </label>
                <label>
                  Current phone number <span className="requiredStar">*</span>
                  <input
                    type="tel"
                    value={form.verifiedPhone}
                    onChange={(e) => update('verifiedPhone', e.target.value.replace(/[^0-9+\s\-()]/g, ''))}
                    placeholder="e.g. +255 7XX XXX XXX"
                  />
                </label>
              </div>
            )}
          </>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div className="reviewBox">
            <p><strong>Category</strong><span>{form.category}</span></p>
            <p><strong>Description</strong><span className="reviewDesc">{form.description}</span></p>
            <p><strong>Region</strong><span>{form.locationRegion}</span></p>
            <p><strong>District</strong><span>{form.locationDistrict || '—'}</span></p>
            <p><strong>Street / Mtaa</strong><span>{form.street || '—'}</span></p>
            <p><strong>Phone number</strong><span>{form.reporterPhone || '—'}</span></p>
            <p><strong>Identity</strong><span>{form.anonymityStatus}</span></p>
            {form.anonymityStatus === 'verified' && (
              <>
                <p><strong>Full name</strong><span>{form.verifiedName}</span></p>
                <p><strong>Verified phone</strong><span>{form.verifiedPhone}</span></p>
              </>
            )}
            <p><strong>Has evidence</strong><span>{form.hasEvidence ? 'Yes' : 'No'}</span></p>
          </div>
        )}

        {/* Step validation error */}
        {stepError ? <p className="error stepError">{stepError}</p> : null}
        {submitError ? <p className="error">{submitError}</p> : null}

        <div className="wizardActions">
          <button className="button" disabled={step === 0} onClick={() => { setStepError(''); setStep((s) => s - 1); }}>
            <ChevronLeft size={18} />Back
          </button>
          {step < steps.length - 1 ? (
            <button className="button primary" onClick={tryNext}>
              Next<ChevronRight size={18} />
            </button>
          ) : (
            <button className="button primary" onClick={submit}>
              <Send size={18} />Submit report
            </button>
          )}
        </div>
      </div>
    </section>
    </>
  );
}

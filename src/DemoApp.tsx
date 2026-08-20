import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Box,
  Camera,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileSearch,
  Filter,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  User,
  UserCheck,
  X,
} from "lucide-react";
import "./demo.css";

type Role = "guest" | "management";
type Stage = "reported" | "investigating" | "matched" | "return" | "reunited";
const stages: Stage[] = [
  "reported",
  "investigating",
  "matched",
  "return",
  "reunited",
];
const stageLabels = {
  reported: "Report received",
  investigating: "Investigation underway",
  matched: "Item matched",
  return: "Return arranged",
  reunited: "Reunited",
};

export function DemoApp({
  initialRole,
  close,
}: {
  initialRole: Role;
  close: () => void;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const [stage, setStage] = useState<Stage>("reported");
  const [guestStep, setGuestStep] = useState(initialRole === "guest" ? 0 : 3);
  const [returnMethod, setReturnMethod] = useState<
    "pickup" | "authorized" | "shipping" | null
  >(null);
  const [toast, setToast] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("found-again-demo");
    if (saved)
      try {
        const s = JSON.parse(saved);
        setStage(s.stage || "reported");
        setReturnMethod(s.returnMethod || null);
      } catch {}
  }, []);
  useEffect(
    () =>
      localStorage.setItem(
        "found-again-demo",
        JSON.stringify({ stage, returnMethod }),
      ),
    [stage, returnMethod],
  );
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };
  const advance = (next: Stage, msg: string) => {
    setStage(next);
    notify(msg);
  };
  const reset = () => {
    setStage("reported");
    setReturnMethod(null);
    setGuestStep(0);
    localStorage.removeItem("found-again-demo");
    setRole("guest");
    setConfirmReset(false);
    notify("Demo reset to the beginning");
  };
  return (
    <div className="demoApp">
      <header className="demoBar">
        <button className="demoBrand" onClick={close}>
          <span className="laneLogo">L&amp;C</span>
          <span className="demoProduct">
            <b>Found Again</b>
            <small>Lane &amp; Company</small>
          </span>
        </button>
        <div className="roleSwitch">
          <button
            className={role === "guest" ? "active" : ""}
            onClick={() => setRole("guest")}
          >
            <User /> Guest experience
          </button>
          <button
            className={role === "management" ? "active" : ""}
            onClick={() => setRole("management")}
          >
            <LayoutDashboard /> Resort management
          </button>
        </div>
        <div className="demoTools">
          <button className="resetButton" onClick={() => setConfirmReset(true)} title="Reset demo">
            <RotateCcw />
            <span>Reset demo</span>
          </button>
          <button onClick={close}>
            <X />
            <span>Exit demo</span>
          </button>
        </div>
      </header>
      <div className="demoNotice">
        <Sparkles /> Connected demo · Actions in management instantly update the
        guest view{" "}
        <button
          onClick={() => setRole(role === "guest" ? "management" : "guest")}
        >
          Switch perspective <ArrowRight />
        </button>
      </div>
      {role === "guest" ? (
        <GuestView
          stage={stage}
          guestStep={guestStep}
          setGuestStep={setGuestStep}
          returnMethod={returnMethod}
          chooseReturn={(m) => {
            setReturnMethod(m);
            advance(
              "return",
              m === "shipping"
                ? "Shipping selected—management has been notified"
                : "Pickup selected—management has been notified",
            );
          }}
        />
      ) : (
        <ManagementView
          stage={stage}
          returnMethod={returnMethod}
          advance={advance}
        />
      )}
      {toast && (
        <div className="demoToast">
          <Check /> {toast}
        </div>
      )}
      {confirmReset && (
        <div className="demoModalBackdrop" role="presentation" onClick={() => setConfirmReset(false)}>
          <div className="demoModal resetModal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onClick={(e) => e.stopPropagation()}>
            <span className="modalIcon"><RotateCcw /></span>
            <h2 id="reset-title">Reset the connected demo?</h2>
            <p>This clears the guest report, investigation, return choice, and demo inventory changes so you can replay everything from the beginning.</p>
            <div className="modalActions">
              <button className="secondaryButton" onClick={() => setConfirmReset(false)}>Keep exploring</button>
              <button className="dangerButton" onClick={reset}>Reset demo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GuestView({
  stage,
  guestStep,
  setGuestStep,
  returnMethod,
  chooseReturn,
}: {
  stage: Stage;
  guestStep: number;
  setGuestStep: (n: number) => void;
  returnMethod: string | null;
  chooseReturn: (m: "pickup" | "authorized" | "shipping") => void;
}) {
  const submitted = guestStep >= 3;
  return (
    <div className="guestDemo">
      <aside className="guestAside">
        <div className="sampleTag">Sample resort</div>
        <h1>
          Lost something?
          <br />
          <em>Let’s find it.</em>
        </h1>
        <p>
          Tell us what happened. You won’t need an account, and your resort team
          will keep you updated.
        </p>
        <div className="guestHelp">
          <MessageCircle />
          <span>
            <b>Need help?</b>
            <small>A resort team member can assist with your report.</small>
          </span>
        </div>
      </aside>
      <section className="guestWorkspace">
        {!submitted ? (
          <>
            <div className="wizardHead">
              <span>Lost item report</span>
              <small>About 2 minutes</small>
            </div>
            <div className="wizardSteps">
              {["Where & when", "Your item", "Your details"].map((x, i) => (
                <span className={i <= guestStep ? "active" : ""} key={x}>
                  <i>{i < guestStep ? <Check /> : i + 1}</i>
                  {x}
                </span>
              ))}
            </div>
            {guestStep === 0 && (
              <div className="formCard">
                <p className="mini">Step 1 of 3</p>
                <h2>Where did you last have it?</h2>
                <label>Resort property</label>
                <button className="select">
                  Cascade Bay Resort & Casino <ChevronRight />
                </button>
                <div className="twoCol">
                  <div>
                    <label>Area</label>
                    <button className="select">
                      <MapPin /> North Tower
                    </button>
                  </div>
                  <div>
                    <label>Approximate time</label>
                    <button className="select">
                      <Clock3 /> Today · 9:30 AM
                    </button>
                  </div>
                </div>
                <button className="demoPrimary" onClick={() => setGuestStep(1)}>
                  Continue <ArrowRight />
                </button>
              </div>
            )}
            {guestStep === 1 && (
              <div className="formCard">
                <p className="mini">Step 2 of 3</p>
                <h2>What should we look for?</h2>
                <div className="itemPreview">
                  <span>🕶️</span>
                  <div>
                    <b>Round black sunglasses</b>
                    <small>
                      Tortoiseshell arms · gold initials “ML” inside
                    </small>
                  </div>
                  <Check />
                </div>
                <label>Where exactly?</label>
                <div className="demoInput">
                  Room 1428, probably on the nightstand
                </div>
                <label>Private ownership detail</label>
                <div className="demoInput secure">
                  <ShieldCheck /> Tiny scratch on the left lens
                </div>
                <button className="demoPrimary" onClick={() => setGuestStep(2)}>
                  Continue <ArrowRight />
                </button>
              </div>
            )}
            {guestStep === 2 && (
              <div className="formCard">
                <p className="mini">Step 3 of 3</p>
                <h2>Where should we send updates?</h2>
                <label>Name</label>
                <div className="demoInput">Maria Lopez</div>
                <label>Email & mobile</label>
                <div className="twoCol">
                  <div className="demoInput">maria@example.com</div>
                  <div className="demoInput">(555) 014-2882</div>
                </div>
                <div className="consent">
                  <Check /> Send private report updates by email and text
                </div>
                <button className="demoPrimary" onClick={() => setGuestStep(3)}>
                  Submit sample report <ArrowRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <GuestTracker
            stage={stage}
            returnMethod={returnMethod}
            chooseReturn={chooseReturn}
          />
        )}
      </section>
    </div>
  );
}

function GuestTracker({
  stage,
  returnMethod,
  chooseReturn,
}: {
  stage: Stage;
  returnMethod: string | null;
  chooseReturn: (m: "pickup" | "authorized" | "shipping") => void;
}) {
  const current = stages.indexOf(stage);
  return (
    <div className="tracker">
      <div className="trackerHead">
        <div>
          <p className="mini">Private report FA-84219</p>
          <h2>
            {stage === "reunited"
              ? "Welcome back, sunglasses."
              : "We’re on it, Maria."}
          </h2>
          <p>Round black sunglasses · North Tower</p>
        </div>
        <span className={"statusPill " + stage}>{stageLabels[stage]}</span>
      </div>
      <div className="guestTimeline">
        {stages.map((s, i) => (
          <div key={s} className={i <= current ? "done" : ""}>
            <i>{i < current ? <Check /> : i + 1}</i>
            <span>
              <b>{stageLabels[s]}</b>
              <small>
                {i === 0
                  ? "Report received today at 10:06 AM"
                  : i === 1
                    ? "Security is checking North Tower inventory"
                    : i === 2
                      ? "Ownership details privately verified"
                      : i === 3
                        ? returnMethod
                          ? `${returnMethod === "shipping" ? "Tracked shipping" : "Verified pickup"} selected`
                          : "Choose how you want it back"
                        : "Return completed with custody receipt"}
              </small>
            </span>
          </div>
        ))}
      </div>
      {stage === "matched" && (
        <div className="returnChoice">
          <p className="mini">Good news—it’s yours</p>
          <h3>How would you like it back?</h3>
          <div>
            {[
              ["pickup", "Verified pickup", "Free · Ready today"],
              ["authorized", "Authorized person", "Free · Secure handoff"],
              ["shipping", "Tracked shipping", "$18.40 · Arrives Tue"],
            ].map(([m, a, b]) => (
              <button
                key={m}
                onClick={() =>
                  chooseReturn(m as "pickup" | "authorized" | "shipping")
                }
              >
                <span>
                  {m === "shipping" ? <Truck /> : <UserCheck />}
                  <b>{a}</b>
                  <small>{b}</small>
                </span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      )}
      {stage === "return" && (
        <div className="guestMessage">
          <Bell />
          <div>
            <b>Your return is being prepared</b>
            <p>
              {returnMethod === "shipping"
                ? "UPS tracking 1Z84•••219 will activate after the package leaves the resort."
                : "Bring your secure pickup QR and photo ID to Resort Security."}
            </p>
          </div>
        </div>
      )}
      {stage === "reunited" && (
        <div className="celebrate">
          <Sparkles />
          <div>
              <b>Case closed—item reunited.</b>
            <p>A complete release receipt is available for this return.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ManagementView({
  stage,
  returnMethod,
  advance,
}: {
  stage: Stage;
  returnMethod: string | null;
  advance: (s: Stage, m: string) => void;
}) {
  type ManagementPage = "queue" | "case" | "inventory" | "custody";
  const [view, setView] = useState<ManagementPage>(
    stage === "reported" ? "queue" : "case",
  );
  useEffect(() => {
    if (stage !== "reported") setView("case");
  }, [stage]);
  return (
    <div className="management">
      <aside className="sideNav">
        <div className="propertyName">
          <p>CASCADE BAY</p>
          <b>Lost &amp; Found Operations</b>
        </div>
        <div className="managementNav">
          {[
            ["queue", LayoutDashboard, "Command center"],
            ["case", FileSearch, "Cases"],
            ["inventory", Box, "Found inventory"],
            ["custody", ClipboardCheck, "Custody log"],
          ].map(([id, Icon, label]) => (
            <button
              key={label as string}
              className={view === id ? "active" : ""}
              onClick={() => id && setView(id as ManagementPage)}
            >
              <Icon /> {label as string}
              {label === "Command center" && <i>3</i>}
            </button>
          ))}
        </div>
        <div className="sideBottom">
          <ShieldCheck />
          <span>
            <b>Alex Diaz</b>
            <small>Security Manager</small>
          </span>
        </div>
      </aside>
      <main className="managementMain">
        <div className="managementTop">
          <div>
            <p className="mini">
              Lost &amp; Found Operations · Thursday, August 20
            </p>
            <h1>{view === "queue" ? "Command center" : view === "case" ? "Case FA-84219" : view === "inventory" ? "Found inventory" : "Custody log"}</h1>
          </div>
          <div className="search">
            <Search /> Search cases &amp; inventory
          </div>
          <button className="avatar">AD</button>
        </div>
        {view === "queue" ? (
          <Queue stage={stage} open={() => setView("case")} />
        ) : view === "case" ? (
          <CaseDetail
            stage={stage}
            returnMethod={returnMethod}
            advance={advance}
          />
        ) : view === "inventory" ? (
          <FoundInventory stage={stage} />
        ) : (
          <CustodyLog stage={stage} />
        )}
      </main>
    </div>
  );
}

const inventorySeed = [
  { id: "FI-20847", icon: "🕶️", name: "Round sunglasses, tortoise arms", category: "Eyewear", found: "Room 1428 · North Tower", storage: "Vault B · Bin 17", time: "Today · 10:42 AM", status: "Suggested match" },
  { id: "FI-20846", icon: "📱", name: "Black smartphone with clear case", category: "Electronics", found: "Grand Ballroom", storage: "Vault A · Drawer 4", time: "Today · 9:18 AM", status: "Unmatched" },
  { id: "FI-20831", icon: "👜", name: "Coral evening bag", category: "Bags", found: "Luna Restaurant", storage: "Vault B · Bin 9", time: "Yesterday · 11:06 PM", status: "Awaiting owner" },
  { id: "FI-20822", icon: "💳", name: "Washington driver license", category: "Identification", found: "Casino floor · Zone C", storage: "Security safe · ID 6", time: "Yesterday · 8:31 PM", status: "Owner contacted" },
  { id: "FI-20798", icon: "⌚", name: "Silver fitness watch", category: "Electronics", found: "Pool cabana 12", storage: "Vault A · Drawer 2", time: "Aug 18 · 4:14 PM", status: "Unmatched" },
];

function FoundInventory({ stage }: { stage: Stage }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState(inventorySeed[0]);
  const [showIntake, setShowIntake] = useState(false);
  const [saved, setSaved] = useState(false);
  const items = inventorySeed.filter((item) =>
    `${item.id} ${item.name} ${item.category} ${item.found}`.toLowerCase().includes(query.toLowerCase()) &&
    (status === "All statuses" || item.status === status),
  );
  const selectedStatus = selected.id === "FI-20847" && stage !== "reported" ? stageLabels[stage] : selected.status;
  return (
    <div className="inventoryPage">
      <div className="pageActions">
        <div><h2>Everything found, secured, and searchable</h2><p>Inventory across hotel, casino, restaurants, events, and resort grounds.</p></div>
        <button className="mgmtPrimary compact" onClick={() => setShowIntake(true)}><Plus /> Add found item</button>
      </div>
      <div className="inventoryMetrics">
        <article><Box /><span><strong>147</strong><small>Items in custody</small></span></article>
        <article><Sparkles /><span><strong>8</strong><small>Suggested matches</small></span></article>
        <article><Clock3 /><span><strong>12</strong><small>Aging this week</small></span></article>
      </div>
      <div className="inventoryLayout">
        <section className="inventoryTableCard">
          <div className="tableTools">
            <label><Search /><input aria-label="Search found inventory" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item, ID, or location" /></label>
            <label className="filterSelect"><Filter /><select aria-label="Filter inventory status" value={status} onChange={(e) => setStatus(e.target.value)}><option>All statuses</option><option>Unmatched</option><option>Suggested match</option><option>Awaiting owner</option><option>Owner contacted</option></select></label>
          </div>
          <div className="inventoryTableHead"><span>Found item</span><span>Found / storage</span><span>Status</span></div>
          <div className="inventoryRows">
            {items.map((item) => (
              <button key={item.id} className={selected.id === item.id ? "selected" : ""} onClick={() => setSelected(item)}>
                <span className="inventoryIdentity"><i>{item.icon}</i><span><b>{item.name}</b><small>{item.id} · {item.category}</small></span></span>
                <span className="inventoryLocation"><b>{item.found}</b><small>{item.storage} · {item.time}</small></span>
                <span className={`inventoryStatus ${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.id === "FI-20847" && stage !== "reported" ? stageLabels[stage] : item.status}</span>
                <ChevronRight />
              </button>
            ))}
            {!items.length && <p className="emptyState">No inventory matches those filters.</p>}
          </div>
        </section>
        <aside className="inventoryDetail">
          <div className="detailPhoto"><span>{selected.icon}</span><small>Item photo · 1 of 2</small></div>
          <p className="mini">{selected.id} · {selected.category}</p>
          <h3>{selected.name}</h3>
          <span className={`inventoryStatus ${selectedStatus.toLowerCase().replaceAll(" ", "-")}`}>{selectedStatus}</span>
          <dl><div><dt>Found</dt><dd>{selected.found}<small>{selected.time}</small></dd></div><div><dt>Secured in</dt><dd>{selected.storage}</dd></div><div><dt>Logged by</dt><dd>Jordan Kim · EVS</dd></div></dl>
          {selected.id === "FI-20847" && <div className="matchCallout"><Sparkles /><span><b>92% match with FA-84219</b><small>Exact room, time proximity, item details, and private ownership clue.</small></span></div>}
          <button className="secondaryButton full"><Tag /> Print custody label</button>
        </aside>
      </div>
      {showIntake && <div className="demoModalBackdrop"><div className="demoModal intakeModal" role="dialog" aria-modal="true" aria-labelledby="intake-title"><div className="modalHeader"><div><p className="mini">Mobile-ready intake</p><h2 id="intake-title">Add a found item</h2></div><button aria-label="Close intake" onClick={() => {setShowIntake(false);setSaved(false)}}><X /></button></div>{saved ? <div className="intakeSuccess"><span><Check /></span><h3>Item FI-20848 logged</h3><p>A custody label was created and Security was notified to secure the item in Vault B.</p><button className="mgmtPrimary compact" onClick={() => {setShowIntake(false);setSaved(false)}}>View inventory</button></div> : <><button className="cameraCapture"><Camera /><b>Take item photos</b><small>Use this phone’s camera or upload images</small></button><div className="intakeGrid"><label>Item category<div className="demoInput">Electronics</div></label><label>Found location<div className="demoInput">Casino floor · Zone B</div></label></div><label>Description<div className="demoInput">White wireless earbuds in charging case</div></label><label>Secure storage<div className="demoInput">Vault B · Intake shelf</div></label><div className="modalActions"><button className="secondaryButton" onClick={() => setShowIntake(false)}>Cancel</button><button className="mgmtPrimary compact" onClick={() => setSaved(true)}>Save & create label <ArrowRight /></button></div></>}</div></div>}
    </div>
  );
}

function CustodyLog({ stage }: { stage: Stage }) {
  const [item, setItem] = useState("FI-20847");
  const events = [
    { time: stage === "reunited" ? "Today · 12:24 PM" : "Pending", title: stage === "reunited" ? "Released to carrier" : "Return handoff pending", person: stage === "reunited" ? "Alex Diaz → UPS 1Z84•••219" : "Awaiting guest return selection", place: "Security desk", done: stage === "reunited" },
    { time: "Today · 10:49 AM", title: "Secured in controlled storage", person: "Alex Diaz · Security Manager", place: "Vault B · Bin 17", done: true },
    { time: "Today · 10:44 AM", title: "Transferred to Security", person: "Jordan Kim → Alex Diaz", place: "North Tower service desk", done: true },
    { time: "Today · 10:42 AM", title: "Found and inventoried", person: "Jordan Kim · EVS", place: "Room 1428 · Nightstand", done: true },
  ];
  return <div className="custodyPage">
    <div className="pageActions"><div><h2>Every handoff has a receipt</h2><p>A tamper-evident audit trail from discovery through verified return or disposition.</p></div><button className="secondaryButton"><ShieldCheck /> Export audit report</button></div>
    <div className="custodyToolbar"><label><Search /><input aria-label="Search custody log" placeholder="Search item, employee, location, or receipt" /></label><label><Filter /><select aria-label="Choose custody item" value={item} onChange={(e) => setItem(e.target.value)}><option value="FI-20847">FI-20847 · Round sunglasses</option><option value="FI-20846">FI-20846 · Black smartphone</option><option value="FI-20831">FI-20831 · Coral evening bag</option></select></label></div>
    {item === "FI-20847" ? <div className="custodyLayout"><section className="custodyTimelineCard"><div className="custodyItemHead"><span>🕶️</span><div><p className="mini">FI-20847 · Linked case FA-84219</p><h3>Round sunglasses, tortoise arms</h3><small>Current custodian: Alex Diaz · Security</small></div><span className="verifiedBadge"><ShieldCheck /> Verified trail</span></div><div className="auditTimeline">{events.map((event, index) => <article key={event.title} className={event.done ? "done" : "pending"}><i>{event.done ? <Check /> : <Clock3 />}</i><div><small>{event.time}</small><h4>{event.title}</h4><p>{event.person}</p><span><MapPin /> {event.place}</span></div>{event.done && index < 3 && <b className="receipt">Receipt #{8473-index}</b>}</article>)}</div></section><aside className="auditSummary"><p className="mini">Audit summary</p><h3>Custody integrity</h3><div className="integrityScore"><strong>100%</strong><span>All required handoffs signed</span></div><dl><div><dt>First logged</dt><dd>10:42 AM</dd></div><div><dt>Handoffs</dt><dd>{stage === "reunited" ? "3" : "2"}</dd></div><div><dt>Storage</dt><dd>Vault B · Bin 17</dd></div><div><dt>Exceptions</dt><dd className="successText">None</dd></div></dl><button className="secondaryButton full">View signed receipts</button></aside></div> : <div className="alternateAudit"><ShieldCheck /><h3>{item} custody trail</h3><p>This demo record is secured with a complete, signed chain of custody.</p><button className="secondaryButton" onClick={() => setItem("FI-20847")}>Return to connected case</button></div>}
  </div>;
}

function Queue({ stage, open }: { stage: Stage; open: () => void }) {
  return (
    <>
      <div className="metrics">
        {[
          ["New inquiries", "3", "Needs review"],
          [
            "Suggested matches",
            stage === "reported" ? "1" : "0",
            "Ready to compare",
          ],
          [
            "Awaiting return",
            stage === "return" ? "1" : "4",
            "Pickup or shipping",
          ],
          [
            "Reunited today",
            stage === "reunited" ? "13" : "12",
            "Completed cases",
          ],
        ].map(([a, b, c], i) => (
          <article key={a} className={i === 1 ? "highlight" : ""}>
            <span>{a}</span>
            <strong>{b}</strong>
            <small>{c}</small>
          </article>
        ))}
      </div>
      <div className="queuePanel">
        <div className="panelHead">
          <div>
            <h2>Needs attention</h2>
            <p>Prioritized across all resort departments</p>
          </div>
          <button>
            View all <ArrowRight />
          </button>
        </div>
        <button className="caseRow featured" onClick={open}>
          <span className="caseIcon">🕶️</span>
          <span>
            <b>Round black sunglasses</b>
            <small>FA-84219 · Maria Lopez · North Tower</small>
          </span>
          <span className="matchScore">
            <small>Suggested match</small>
            <b>{stage === "reported" ? "92%" : stageLabels[stage]}</b>
          </span>
          <span className="owner">
            <i>SEC</i>
            <small>Security</small>
          </span>
          <ChevronRight />
        </button>
        {[
          [
            "📱",
            "Black smartphone",
            "FA-84197 · Grand Ballroom",
            "New inquiry",
          ],
          [
            "👜",
            "Coral evening bag",
            "FI-20831 · Luna Restaurant",
            "Awaiting owner",
          ],
        ].map((x) => (
          <button className="caseRow" key={x[1]}>
            <span className="caseIcon">{x[0]}</span>
            <span>
              <b>{x[1]}</b>
              <small>{x[2]}</small>
            </span>
            <span className="simpleStatus">{x[3]}</span>
            <span className="owner">
              <i>—</i>
              <small>Unassigned</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>
    </>
  );
}

function CaseDetail({
  stage,
  returnMethod,
  advance,
}: {
  stage: Stage;
  returnMethod: string | null;
  advance: (s: Stage, m: string) => void;
}) {
  return (
    <div className="caseDetail">
      <div className="caseHero">
        <button className="backLink">
          <ArrowLeft /> All cases
        </button>
        <div className="caseTitle">
          <span>🕶️</span>
          <div>
            <p className="mini">Lost-item inquiry · FA-84219</p>
            <h2>Round black sunglasses</h2>
            <p>Reported by Maria Lopez · Today at 10:06 AM</p>
          </div>
          <span className={"statusPill " + stage}>{stageLabels[stage]}</span>
        </div>
      </div>
      <div className="caseColumns">
        <div>
          <section className="compare">
            <div className="sectionTitle">
              <div>
                <p className="mini">Suggested match</p>
                <h3>Found item FI-20847</h3>
              </div>
              <span className="confidence">92% match</span>
            </div>
            <div className="compareGrid">
              <div>
                <p className="mini">Guest report</p>
                <h4>Black round sunglasses</h4>
                <span>
                  <MapPin /> North Tower · Room 1428
                </span>
                <span>
                  <Clock3 /> Lost around 9:30 AM
                </span>
                <span>
                  <ShieldCheck /> Private clue: scratch on left lens
                </span>
              </div>
              <div>
                <p className="mini">Found inventory</p>
                <h4>Round sunglasses, tortoise arms</h4>
                <span>
                  <MapPin /> Room 1428 · Nightstand
                </span>
                <span>
                  <Clock3 /> Found at 10:42 AM
                </span>
                <span>
                  <Box /> Vault B · Bin 17
                </span>
              </div>
            </div>
            <div className="reasons">
              <span>Exact room</span>
              <span>Time proximity</span>
              <span>Color & shape</span>
              <span>Gold “ML” initials</span>
            </div>
            {stage === "reported" && (
              <button
                className="mgmtPrimary"
                onClick={() =>
                  advance(
                    "investigating",
                    "Investigation started—guest status updated",
                  )
                }
              >
                Begin investigation <ArrowRight />
              </button>
            )}
            {stage === "investigating" && (
              <button
                className="mgmtPrimary"
                onClick={() =>
                  advance("matched", "Match approved—Maria has been notified")
                }
              >
                Verify ownership & approve match <Check />
              </button>
            )}
            {stage === "matched" && (
              <p className="waiting">
                <Clock3 /> Waiting for Maria to choose pickup or shipping.
                Switch to Guest Experience to continue.
              </p>
            )}
            {stage === "return" && (
              <button
                className="mgmtPrimary"
                onClick={() =>
                  advance("reunited", "Custody released—case marked reunited")
                }
              >
                Record{" "}
                {returnMethod === "shipping"
                  ? "carrier handoff"
                  : "verified pickup"}{" "}
                <PackageCheck />
              </button>
            )}
            {stage === "reunited" && (
              <p className="complete">
                <Check /> Return completed and custody receipt recorded.
              </p>
            )}
          </section>
          <section className="activity">
            <div className="sectionTitle">
              <h3>Case activity</h3>
              <button>Internal notes</button>
            </div>
            {[
              [
                "10:42 AM",
                "Jordan K. · EVS",
                "Found item logged from Room 1428",
              ],
              ["10:43 AM", "Found Again", "92% match suggested automatically"],
              [
                "10:46 AM",
                "Alex D. · Security",
                stage === "reported"
                  ? "Awaiting review"
                  : stage === "investigating"
                    ? "Investigation opened"
                    : "Ownership detail verified",
              ],
              [
                "Now",
                "Guest notification",
                stage === "matched"
                  ? "Match confirmation sent"
                  : stage === "return"
                    ? "Return choice received"
                    : stage === "reunited"
                      ? "Case-closed receipt sent"
                      : "Report confirmation delivered",
              ],
            ].map((x) => (
              <div className="event" key={x[0] + x[2]}>
                <i />
                <small>{x[0]}</small>
                <span>
                  <b>{x[1]}</b>
                  {x[2]}
                </span>
              </div>
            ))}
          </section>
        </div>
        <aside className="caseSide">
          <section>
            <p className="mini">Assigned team</p>
            <div className="assignee">
              <i>AD</i>
              <span>
                <b>Alex Diaz</b>
                <small>Security Manager</small>
              </span>
            </div>
          </section>
          <section>
            <p className="mini">Chain of custody</p>
            {[
              ["10:42", "Found", "Jordan K. · EVS"],
              ["10:49", "Secured", "Vault B · Bin 17"],
              [
                stage === "reunited" ? "Now" : "—",
                stage === "reunited" ? "Released" : "Next handoff",
                stage === "reunited" ? "Receipt signed" : "Pending return",
              ],
            ].map((x) => (
              <div className="custody" key={x[1]}>
                <Check />
                <span>
                  <b>{x[1]}</b>
                  <small>
                    {x[0]} · {x[2]}
                  </small>
                </span>
              </div>
            ))}
          </section>
          <section>
            <p className="mini">Guest contact</p>
            <b>Maria Lopez</b>
            <small>
              maria@example.com
              <br />
              (555) 014-2882
            </small>
            <button>
              <MessageCircle /> Send update
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

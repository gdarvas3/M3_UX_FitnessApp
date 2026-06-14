import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Zap, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router";

const goals = [
  { id: "lose-weight", label: "Lose Weight", icon: "🔥" },
  { id: "build-muscle", label: "Build Muscle", icon: "💪" },
  { id: "endurance", label: "Improve Endurance", icon: "🏃" },
  { id: "stay-active", label: "Stay Active", icon: "⚡" },
];

const levels = [
  { id: "beginner", label: "Beginner", desc: "Just starting out" },
  { id: "intermediate", label: "Intermediate", desc: "Training 1–2 years" },
  { id: "advanced", label: "Advanced", desc: "3+ years of training" },
];

const ACCENT = "#CCFF00";
const TOTAL_STEPS = 6; // 0: Welcome, 1: Personal, 2: Physical, 3: Goal, 4: Level, 5: Days

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  
  // Személyes adatok
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  // Fizikai paraméterek (Csúszkákhoz kezdőértékek)
  const [age, setAge] = useState<number | string>(25);
  const [weight, setWeight] = useState<number | string>(75);
  const [height, setHeight] = useState<number | string>(175);
  const [gender, setGender] = useState("");

  // Edzés paraméterek
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [days, setDays] = useState(3);
  
  const [exiting, setExiting] = useState(false);
  const { setOnboarded, setUserProfile } = useApp();
  const navigate = useNavigate();

  // Validáció a Step 1-hez
  const isStep1Valid = 
    firstName.trim() !== "" && 
    lastName.trim() !== "" && 
    nickname.trim() !== "" && 
    email.trim() !== "";

  const goNext = () => {
    if (step === 1 && !isStep1Valid) return;

    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const skip = () => {
    if (step === 0) {
      setStep(1);
    } else {
      goNext();
    }
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const finish = () => {
    const finalName = nickname.trim() || firstName.trim() || "Athlete";
    
    setUserProfile({ 
      name: finalName, 
      goal: selectedGoals.join(","),
      fitnessLevel: level, 
      daysPerWeek: days 
    });
    
    setOnboarded(true);
    setExiting(true);
    setTimeout(() => navigate("/app/home"), 600);
  };

  const progressWidth = `${(step / (TOTAL_STEPS - 1)) * 100}%`;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background transition-colors duration-300 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: ACCENT }}
      />

      <AnimatePresence mode="wait">
        {!exiting && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-[430px] px-6 flex flex-col min-h-[100dvh]"
          >
            {/* Step 0 – Welcome */}
            {step === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 text-center gap-6 pb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: ACCENT }}
                  >
                    <Zap size={40} color="#000" fill="#000" />
                  </div>
                  <h1 className="text-foreground" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
                    Fit<span style={{ color: ACCENT }}>AI</span>
                  </h1>
                  <p className="text-muted-foreground font-medium text-lg">
                    Your AI-Powered Personal Coach
                  </p>
                  <p className="text-muted-foreground/70 text-sm max-w-[260px]">
                    Train smarter with expert-backed methods from world-class athletes. Real results, powered by AI.
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setStep(1)}
                  className="mt-8 w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-black font-semibold text-lg"
                  style={{ background: ACCENT }}
                >
                  Get Started <ArrowRight size={20} />
                </motion.button>
              </div>
            )}

            {/* Step 1 – Personal Details (Mandatory) */}
            {step === 1 && (
              <div className="flex flex-col flex-1 pt-16 gap-6">
                <div className="flex flex-col gap-2">
                  <p style={{ color: ACCENT }} className="text-sm font-semibold tracking-wider uppercase">Step 1 of 5</p>
                  <h2 className="text-foreground text-2xl font-bold">Tell us about yourself</h2>
                  <p className="text-muted-foreground text-sm">We'll personalize your experience.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First Name *"
                      required
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-muted-foreground"
                      autoFocus
                    />
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last Name *"
                      required
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-muted-foreground"
                    />
                  </div>
                  <input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="Nickname (How should AI call you?) *"
                    required
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-muted-foreground"
                  />
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email Address *"
                    required
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex-1" />
                <div className="pb-8 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="py-4 px-6 rounded-2xl font-semibold text-foreground text-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!isStep1Valid}
                      className={`flex-1 py-4 rounded-2xl font-semibold text-black text-lg flex items-center justify-center gap-2 transition-opacity ${!isStep1Valid ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                      style={{ background: ACCENT }}
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 – Physical Stats with Sliders */}
            {step === 2 && (
              <div className="flex flex-col flex-1 pt-16 gap-5">
                <div className="flex flex-col gap-2">
                  <p style={{ color: ACCENT }} className="text-sm font-semibold tracking-wider uppercase">Step 2 of 5</p>
                  <h2 className="text-foreground text-2xl font-bold">Your Physical Profile</h2>
                  <p className="text-muted-foreground text-sm">Essential for generating accurate workout plans.</p>
                </div>
                
                <div className="flex flex-col gap-5 bg-card border border-border rounded-2xl p-5">
                  
                  {/* Age Slider */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-muted-foreground text-sm font-medium">Age</label>
                      <span className="text-foreground font-bold text-lg">{age} <span className="text-muted-foreground text-xs font-normal">years</span></span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary"
                      style={{ accentColor: ACCENT }}
                    />
                  </div>

                  {/* Weight Slider */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-muted-foreground text-sm font-medium">Weight</label>
                      <span className="text-foreground font-bold text-lg">{weight} <span className="text-muted-foreground text-xs font-normal">kg</span></span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary"
                      style={{ accentColor: ACCENT }}
                    />
                  </div>

                  {/* Height Slider */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-muted-foreground text-sm font-medium">Height</label>
                      <span className="text-foreground font-bold text-lg">{height} <span className="text-muted-foreground text-xs font-normal">cm</span></span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="250"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary"
                      style={{ accentColor: ACCENT }}
                    />
                  </div>

                  {/* Gender Select */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="text-muted-foreground text-sm font-medium">Gender</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:border-[var(--accent)] transition-colors appearance-none"
                    >
                      <option value="" disabled className="text-muted-foreground">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                </div>

                <div className="flex-1" />
                <div className="pb-8 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="py-4 px-6 rounded-2xl font-semibold text-foreground text-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 py-4 rounded-2xl font-semibold text-black text-lg flex items-center justify-center gap-2"
                      style={{ background: ACCENT }}
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  </div>
                  <button onClick={skip} className="text-muted-foreground hover:text-foreground text-sm text-center py-2 transition-colors">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 – Goals (Multiple Selection) */}
            {step === 3 && (
              <div className="flex flex-col flex-1 pt-16 gap-8">
                <div className="flex flex-col gap-2">
                  <p style={{ color: ACCENT }} className="text-sm font-semibold tracking-wider uppercase">Step 3 of 5</p>
                  <h2 className="text-foreground text-2xl font-bold">What are your goals?</h2>
                  <p className="text-muted-foreground text-sm">Choose all that apply.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(g => {
                    const isSelected = selectedGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        className="p-4 rounded-2xl border flex flex-col gap-2 items-start transition-all"
                        style={{
                          background: isSelected ? `${ACCENT}15` : "var(--card)",
                          borderColor: isSelected ? ACCENT : "var(--border)",
                        }}
                      >
                        <span className="text-2xl">{g.icon}</span>
                        <span className="text-foreground text-sm font-medium text-left">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex-1" />
                <div className="pb-8 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="py-4 px-6 rounded-2xl font-semibold text-foreground text-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 py-4 rounded-2xl font-semibold text-black text-lg flex items-center justify-center gap-2"
                      style={{ background: ACCENT }}
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  </div>
                  <button onClick={skip} className="text-muted-foreground hover:text-foreground text-sm text-center py-2 transition-colors">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 – Fitness Level */}
            {step === 4 && (
              <div className="flex flex-col flex-1 pt-16 gap-8">
                <div className="flex flex-col gap-2">
                  <p style={{ color: ACCENT }} className="text-sm font-semibold tracking-wider uppercase">Step 4 of 5</p>
                  <h2 className="text-foreground text-2xl font-bold">Your fitness level?</h2>
                  <p className="text-muted-foreground text-sm">We'll tailor your workouts accordingly.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {levels.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className="p-4 rounded-2xl border flex items-center gap-4 transition-all bg-card"
                      style={{
                        background: level === l.id ? `${ACCENT}15` : "var(--card)",
                        borderColor: level === l.id ? ACCENT : "var(--border)",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: level === l.id ? ACCENT : "var(--muted-foreground)" }}
                      >
                        {level === l.id && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: ACCENT }} />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-foreground font-medium">{l.label}</p>
                        <p className="text-muted-foreground text-sm">{l.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex-1" />
                <div className="pb-8 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="py-4 px-6 rounded-2xl font-semibold text-foreground text-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 py-4 rounded-2xl font-semibold text-black text-lg flex items-center justify-center gap-2"
                      style={{ background: ACCENT }}
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  </div>
                  <button onClick={skip} className="text-muted-foreground hover:text-foreground text-sm text-center py-2 transition-colors">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 – Days per week */}
            {step === 5 && (
              <div className="flex flex-col flex-1 pt-16 gap-8">
                <div className="flex flex-col gap-2">
                  <p style={{ color: ACCENT }} className="text-sm font-semibold tracking-wider uppercase">Step 5 of 5</p>
                  <h2 className="text-foreground text-2xl font-bold">Days per week?</h2>
                  <p className="text-muted-foreground text-sm">How many days can you commit to training?</p>
                </div>
                <div className="flex flex-col items-center gap-6 py-4">
                  <div
                    className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4"
                    style={{ borderColor: ACCENT }}
                  >
                    <span className="text-foreground text-5xl font-bold">{days}</span>
                    <span className="text-muted-foreground text-xs">days</span>
                  </div>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        className="w-10 h-10 rounded-xl text-sm font-semibold transition-all bg-card"
                        style={{
                          background: days === d ? ACCENT : "var(--card)",
                          color: days === d ? "#000" : "var(--muted-foreground)",
                          border: `1px solid ${days === d ? ACCENT : "var(--border)"}`,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1" />
                <div className="pb-8 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="py-4 px-6 rounded-2xl font-semibold text-foreground text-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={finish}
                      className="flex-1 py-4 rounded-2xl font-semibold text-black text-lg flex items-center justify-center gap-2"
                      style={{ background: ACCENT }}
                    >
                      Let's Go! <Zap size={20} fill="#000" />
                    </button>
                  </div>
                  <button onClick={skip} className="text-muted-foreground hover:text-foreground text-sm text-center py-2 transition-colors">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Progress bar (steps 1-5) */}
            {step > 0 && (
              <div className="fixed bottom-0 left-0 right-0 h-1 bg-muted">
                <motion.div
                  className="h-full"
                  style={{ background: ACCENT }}
                  initial={{ width: 0 }}
                  animate={{ width: progressWidth }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
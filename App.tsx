
import React, { useState, useEffect, useRef } from 'react';
import { Subject, Topic, Post, Question, User, Badge, LeaderboardEntry } from './types';
import { SUBJECTS_CONFIG, MOCK_TOPICS, MOCK_POSTS, BADGES_CONFIG, MOCK_LEADERBOARD } from './constants';
import { analyzePYQ, generateLessonAudio } from './services/gemini';

// --- Global UI Components ---

const Logo = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`relative flex items-center justify-center ${size}`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-xl rotate-12 opacity-20"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-xl -rotate-6 shadow-lg shadow-orange-200"></div>
    <div className="relative z-10 flex flex-col items-center justify-center text-white">
      <span className={`${size.includes('w-10') ? 'text-xl' : 'text-3xl'} font-black leading-none tracking-tighter italic`}>R</span>
    </div>
  </div>
);

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: 'fa-house', label: 'Learn' },
    { id: 'community', icon: 'fa-users', label: 'Rankers' },
    { id: 'profile', icon: 'fa-user', label: 'Me' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-around items-center z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
        >
          <i className={`fa-solid ${tab.icon} text-lg`}></i>
          <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Level Up Modal ---

const LevelUpModal = ({ level, onClose }: { level: number, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full mx-auto flex items-center justify-center text-white text-4xl shadow-2xl shadow-orange-500/40 animate-bounce">
            <i className="fa-solid fa-crown"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Level Up!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">You've reached <span className="text-orange-600 font-black">Level {level}</span>. You're getting closer to the IAS dream!</p>
          <div className="pt-4">
            <button onClick={onClose} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-xs">Keep Climbing</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Leaderboard Component ---

const Leaderboard = ({ user }: { user: User }) => {
  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const others = MOCK_LEADERBOARD.slice(3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Podium Section */}
      <div className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 p-6 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner">
        <div className="flex justify-between items-end gap-2 h-64">
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1 gap-3">
            <div className="relative">
              <img src={topThree[1].photoUrl} className="w-16 h-16 rounded-full border-4 border-slate-300 dark:border-slate-700 shadow-lg" alt="Rank 2" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-white">2</div>
            </div>
            <div className="w-full h-24 bg-white dark:bg-slate-800 rounded-t-3xl shadow-sm flex flex-col items-center justify-center p-2 text-center">
              <p className="text-[10px] font-black text-slate-800 dark:text-white truncate w-full">{topThree[1].name}</p>
              <p className="text-[9px] font-bold text-orange-600">{topThree[1].xp} XP</p>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 gap-3 z-10">
            <div className="relative">
              <i className="fa-solid fa-crown text-amber-400 absolute -top-8 left-1/2 -translate-x-1/2 text-3xl animate-pulse"></i>
              <img src={topThree[0].photoUrl} className="w-24 h-24 rounded-full border-4 border-amber-400 shadow-2xl" alt="Rank 1" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg">1</div>
            </div>
            <div className="w-full h-36 bg-white dark:bg-slate-800 rounded-t-3xl shadow-md border-t-2 border-amber-200 dark:border-amber-900 flex flex-col items-center justify-center p-2 text-center">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate w-full">{topThree[0].name}</p>
              <p className="text-[10px] font-black text-orange-600 mt-1">{topThree[0].xp} XP</p>
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-2">Elite Master</p>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1 gap-3">
            <div className="relative">
              <img src={topThree[2].photoUrl} className="w-14 h-14 rounded-full border-4 border-orange-200 dark:border-orange-900 shadow-lg" alt="Rank 3" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-300 dark:bg-orange-800 rounded-full flex items-center justify-center text-[9px] font-black text-white">3</div>
            </div>
            <div className="w-full h-20 bg-white dark:bg-slate-800 rounded-t-3xl shadow-sm flex flex-col items-center justify-center p-2 text-center">
              <p className="text-[10px] font-black text-slate-800 dark:text-white truncate w-full">{topThree[2].name}</p>
              <p className="text-[9px] font-bold text-orange-600">{topThree[2].xp} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4 px-2 pb-24">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Global Contenders</h3>
        <div className="space-y-3">
          {others.map((entry) => (
            <div key={entry.userId} className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="w-8 text-xs font-black text-slate-300">#{entry.rank}</span>
              <img src={entry.photoUrl} className="w-11 h-11 rounded-full bg-slate-100" alt={entry.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{entry.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Level {entry.level}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-orange-600">{entry.xp.toLocaleString()}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">TOTAL XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Rank Sticky Footer */}
      <div className="fixed bottom-24 left-4 right-4 z-20">
         <div className="flex items-center gap-4 p-6 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl border border-white/10 ring-4 ring-orange-500/10 transition-all active:scale-95">
            <span className="w-8 text-xs font-black">#{user.rank || 42}</span>
            <div className="relative">
              <img src={user.photoUrl} className="w-12 h-12 rounded-full border-2 border-orange-500" alt="Me" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center border border-slate-900">
                <i className="fa-solid fa-star text-[6px]"></i>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">You</p>
              <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Next rank in 450 XP</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-orange-400">{user.xp.toLocaleString()}</p>
              <p className="text-[8px] font-bold opacity-50 uppercase">YOUR XP</p>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Journey Video Recorder Component ---

const JourneyRecorder = ({ onComplete }: { onComplete: (videoUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [preStartCount, setPreStartCount] = useState<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Camera access failed", err);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const startJourneyRecord = () => {
    setPreStartCount(3);
    const interval = setInterval(() => {
      setPreStartCount(p => {
        if (p === 1) {
          clearInterval(interval);
          beginActualRecording();
          return null;
        }
        return p ? p - 1 : null;
      });
    }, 1000);
  };

  const beginActualRecording = () => {
    if (!stream) return;
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];
    
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      onComplete(url);
    };

    recorder.start();
    setIsRecording(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown(c => {
        if (c === 1) {
          clearInterval(timer);
          recorder.stop();
          setIsRecording(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Initiate Journey</h2>
          <p className="text-xs text-slate-400 font-medium">Record a 5-second video of your preparation vision.</p>
        </div>

        <div className="relative w-full aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
          
          {preStartCount !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
              <span className="text-7xl font-black text-white animate-ping">{preStartCount}</span>
            </div>
          )}

          {isRecording && (
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-rose-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Live • 00:0{countdown}
            </div>
          )}
        </div>

        {!isRecording && preStartCount === null && (
          <button 
            onClick={startJourneyRecord}
            className="w-full bg-orange-600 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-900/20 active:scale-95 transition-all"
          >
            Start 5s Recording
          </button>
        )}
      </div>
    </div>
  );
};

// --- Community Hub Component ---

const CommunityHub = ({ 
  user,
  posts, 
  joinedCircles, 
  completedSubjects,
  completedTopics,
  onJoinCircle, 
  onLeaveCircle,
  onEnterCircle,
  onDeclareMastery
}: { 
  user: User,
  posts: Post[], 
  joinedCircles: Subject[], 
  completedSubjects: Subject[],
  completedTopics: string[],
  onJoinCircle: (s: Subject) => void,
  onLeaveCircle: (s: Subject) => void,
  onEnterCircle: (s: Subject) => void,
  onDeclareMastery: (s: Subject) => void
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'circles' | 'leaderboard'>('feed');

  const isSubjectEligible = (subject: Subject) => {
    const subjectTopics = MOCK_TOPICS.filter(t => t.subject === subject);
    if (subjectTopics.length === 0) return false;
    return subjectTopics.every(t => completedTopics.includes(t.id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Rankers Community</h2>
        <p className="text-xs text-slate-400 font-medium">Collaborate with fellow aspirants</p>
      </header>

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl mx-2 shadow-inner border border-slate-200 dark:border-slate-800">
        <button onClick={() => setActiveTab('feed')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'feed' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Feed</button>
        <button onClick={() => setActiveTab('circles')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'circles' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Circles</button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Board</button>
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-6 px-2">
          <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
             <div className="relative z-10 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest">Declare Mastery</h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                   {SUBJECTS_CONFIG.map(sub => {
                     const eligible = isSubjectEligible(sub.id);
                     const isMastered = completedSubjects.includes(sub.id);
                     return (
                       <button
                        key={sub.id}
                        onClick={() => !isMastered && eligible && onDeclareMastery(sub.id)}
                        disabled={isMastered || !eligible}
                        className={`flex-shrink-0 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-tight transition-all flex items-center gap-2 border ${
                          isMastered ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : eligible ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-800/50 border-white/5 text-white/30 cursor-not-allowed'
                        }`}
                       >
                         <i className={`fa-solid ${isMastered ? 'fa-check-circle' : eligible ? sub.icon : 'fa-lock'}`}></i>
                         {sub.id}
                       </button>
                     );
                   })}
                </div>
             </div>
          </section>

          {posts.map(post => (
            <div key={post.id} className={`p-6 rounded-[2.5rem] border shadow-sm transition-all ${post.type === 'achievement' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
              <div className="flex items-center gap-3 mb-4">
                <img src={post.userAvatar} className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-800" alt={post.userName} />
                <div className="flex-1">
                  <p className="text-xs font-black dark:text-white flex items-center gap-2">{post.userName}</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{post.type.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">"{post.content}"</p>
              {post.noteImageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <img src={post.noteImageUrl} className="w-full object-cover" alt="Handwritten Notes" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : activeTab === 'circles' ? (
        <div className="grid grid-cols-1 gap-4 px-2">
          {SUBJECTS_CONFIG.map(sub => {
            const isJoined = joinedCircles.includes(sub.id);
            const eligible = isSubjectEligible(sub.id);
            return (
              <div key={sub.id} className={`p-7 rounded-[2.5rem] border flex flex-col gap-6 shadow-sm transition-all relative overflow-hidden ${eligible ? 'bg-white dark:bg-slate-900 border-slate-100' : 'bg-slate-50/50 border-slate-200 opacity-80'}`}>
                {!eligible && !isJoined && <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center"><i className="fa-solid fa-lock text-slate-300 text-xl mb-2"></i><p className="text-[10px] font-black uppercase text-slate-400">Master Syllabus to Join</p></div>}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-3xl ${sub.color.split(' ')[0]} flex items-center justify-center text-2xl shadow-inner`}><i className={`fa-solid ${sub.icon}`}></i></div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm flex-1">{sub.id} Circle</h4>
                </div>
                <button onClick={() => eligible && onJoinCircle(sub.id)} disabled={!eligible} className={`w-full py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 ${eligible ? 'bg-white text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white' : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'}`}>
                  {eligible ? (isJoined ? 'Enter Circle' : 'Join Circle') : 'Locked'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <Leaderboard user={user} />
      )}
    </div>
  );
};

// --- Home Page Component ---

const HomePage = ({ user, onExploreSubject, completedTopics }: { user: User, onExploreSubject: (s: Subject) => void, completedTopics: string[] }) => {
  return (
    <div className="space-y-10 animate-fade-in">
      <header className="px-2 space-y-6">
        <div className="flex justify-between items-center">
           <div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">UPSC Rankers</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Lvl {user.level} Aspirant</p>
           </div>
           <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950 px-4 py-2 rounded-2xl border border-orange-100 dark:border-orange-900">
              <i className="fa-solid fa-fire text-orange-600 animate-pulse"></i>
              <span className="text-sm font-black text-orange-700 dark:text-orange-400">{user.streak} Days</span>
           </div>
        </div>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
          <input type="text" placeholder="Search topics or PYQs..." className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm outline-none text-xs" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 px-2">
        <div className="bg-gradient-to-br from-orange-600 to-amber-500 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
           <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Daily Mission</span>
              <h3 className="text-xl font-black leading-tight">Master 3 Polity Concepts today</h3>
              <div className="flex items-center gap-3 bg-white/20 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
                 <span className="text-[10px] font-black tracking-widest">+500 XP STREAK</span>
              </div>
           </div>
           <i className="fa-solid fa-bolt absolute bottom-[-20px] right-[-10px] text-8xl text-white/10 rotate-12"></i>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2">
        {SUBJECTS_CONFIG.map(sub => {
          const subTopics = MOCK_TOPICS.filter(t => t.subject === sub.id);
          const done = subTopics.filter(t => completedTopics.includes(t.id)).length;
          const progress = subTopics.length > 0 ? (done / subTopics.length) * 100 : 0;
          return (
            <button key={sub.id} onClick={() => onExploreSubject(sub.id)} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.02]">
              <div className={`w-14 h-14 rounded-[1.8rem] ${sub.color.split(' ')[0]} flex items-center justify-center text-xl mb-5 shadow-inner`}><i className={`fa-solid ${sub.icon}`}></i></div>
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-[11px] leading-none mb-1">{sub.id}</p>
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3"><div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${progress}%` }}></div></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Topic Detail ---

const TopicDetail = ({ 
  topic, 
  onBack, 
  onComplete,
  onShareToCommunity,
  onShareToCircle
}: { 
  topic: Topic, 
  onBack: () => void, 
  onComplete: (id: string, xp: number) => void,
  onShareToCommunity: (title: string, noteImage?: string) => void,
  onShareToCircle: (title: string, noteImage?: string) => void
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'recall'>('content');
  const [noteImage, setNoteImage] = useState<string | null>(null);
  const audioRef = useRef<AudioBufferSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlayAudio = async () => {
    if (isPlaying) { audioRef.current?.stop(); setIsPlaying(false); return; }
    setIsPlaying(true);
    try {
      const { audioBuffer, audioContext } = await generateLessonAudio(topic.content);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      audioRef.current = source;
    } catch (err) { console.error(err); setIsPlaying(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNoteImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white dark:bg-slate-950 flex flex-col animate-fade-in">
      <header className="p-6 flex items-center border-b border-slate-50 dark:border-slate-800">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 mr-4"><i className="fa-solid fa-arrow-left"></i></button>
        <h2 className="text-sm font-black uppercase tracking-tight truncate">{topic.title}</h2>
      </header>

      <div className="flex bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl mx-6 mt-6 border border-slate-100 dark:border-slate-800">
        <button onClick={() => setActiveTab('content')} className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'content' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Content</button>
        <button onClick={() => setActiveTab('recall')} className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'recall' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Recall</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'content' ? (
          <>
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
              <p className="text-base leading-[1.8] text-slate-700 dark:text-slate-300 font-medium">{topic.content}</p>
              <button onClick={handlePlayAudio} className={`w-full py-5 rounded-3xl mt-8 flex items-center justify-center gap-3 transition-all ${isPlaying ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-600'}`}>
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? 'Stop' : 'Listen Explanation'}</span>
              </button>
            </div>
            <button onClick={() => { onComplete(topic.id, topic.xpReward); onBack(); }} className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-widest text-[10px]">Complete Milestone (+{topic.xpReward} XP)</button>
          </>
        ) : (
          <div className="space-y-8 py-4">
             <div className="text-center space-y-4 px-6">
                <div className="w-20 h-20 bg-orange-600 text-white rounded-[2rem] flex items-center justify-center text-2xl mx-auto shadow-xl"><i className="fa-solid fa-microphone"></i></div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Recall</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Summarize what you learned. Earn +50 bonus XP for sharing handwritten notes.</p>
             </div>

             <div className="space-y-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                
                {noteImage ? (
                  <div className="relative group rounded-[2.5rem] overflow-hidden border-2 border-orange-200">
                    <img src={noteImage} className="w-full h-48 object-cover" alt="Uploaded Notes" />
                    <button onClick={() => setNoteImage(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="w-full p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload Handwritten Notes</span>
                  </button>
                )}
             </div>

             <div className="grid grid-cols-1 gap-3 pt-6">
                <button onClick={() => onShareToCircle(topic.title, noteImage || undefined)} className="w-full py-5 bg-slate-900 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                   <i className="fa-solid fa-users"></i> Share to Circle
                </button>
                <button onClick={() => onShareToCommunity(topic.title, noteImage || undefined)} className="w-full py-5 bg-white border border-slate-200 text-slate-600 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                   <i className="fa-solid fa-globe"></i> Share to Feed
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Authentication Screen ---

const AuthScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'guest'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAction = () => {
    onLogin({
      id: `u-${Date.now()}`,
      name: formData.name || (authMode === 'guest' ? 'Guest Ranker' : 'Aspirant'),
      email: formData.email || 'ranker@upsc.com',
      photoUrl: authMode === 'guest' ? 'https://i.pravatar.cc/150?u=guest' : 'https://i.pravatar.cc/150?u=me',
      xp: 0, level: 1, streak: 1, earnedBadges: [], completedSubjects: [],
      isGuest: authMode === 'guest'
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <Logo size="w-20 h-20 mx-auto" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white heading-font">Rankers</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Elite UPSC Preparation</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
          <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-700">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Sign In</button>
            <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'signup' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm' : 'text-slate-400'}`}>Sign Up</button>
          </div>

          <div className="space-y-4">
            {authMode === 'signup' && (
              <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] text-xs outline-none dark:text-white focus:ring-2 focus:ring-orange-500/20" />
            )}
            <input type="text" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] text-xs outline-none dark:text-white focus:ring-2 focus:ring-orange-500/20" />
            <input type="password" placeholder="Password" className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] text-xs outline-none dark:text-white focus:ring-2 focus:ring-orange-500/20" />
          </div>

          <button onClick={handleAction} className="w-full bg-orange-600 text-white py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-95 transition-all">
            {authMode === 'login' ? 'Continue Journey' : 'Create Profile'}
          </button>

          <div className="relative">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
             <div className="relative flex justify-center text-[8px] font-black uppercase text-slate-400"><span className="bg-white dark:bg-slate-900 px-4">OR</span></div>
          </div>

          <button onClick={() => { setAuthMode('guest'); handleAction(); }} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-500 py-4 rounded-[1.5rem] font-black uppercase tracking-[0.1em] text-[9px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [exploringSubject, setExploringSubject] = useState<Subject | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [joinedCircles, setJoinedCircles] = useState<Subject[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [needsJourneyRecord, setNeedsJourneyRecord] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && !user.journeyVideoUrl) {
      setNeedsJourneyRecord(true);
    }
  }, [user]);

  const handleJourneyComplete = (url: string) => {
    if (user) {
      setUser({ ...user, journeyVideoUrl: url });
      setNeedsJourneyRecord(false);
    }
  };

  const handleCompleteTopic = (id: string, xpReward: number) => {
    if (!completedTopics.includes(id)) {
      setCompletedTopics(prev => [...prev, id]);
      if (user) {
        const newXP = user.xp + xpReward;
        const newLevel = Math.floor(newXP / 1000) + 1;
        if (newLevel > user.level) {
          setShowLevelUp(newLevel);
        }
        setUser({ ...user, xp: newXP, level: newLevel });
      }
    }
  };

  const handleDeclareMastery = (subject: Subject) => {
    if (user && !user.completedSubjects.includes(subject)) {
      const badge = BADGES_CONFIG.find(b => b.subject === subject);
      const newPost: Post = {
        id: `milestone-${Date.now()}`, userId: user.id, userName: user.name, userAvatar: user.photoUrl,
        content: `MASTERY UNLOCKED: I have officially completed the entire ${subject} syllabus! 🎖️🏛️ #UPSC2025 #Rankers`,
        timestamp: new Date(), likes: 0, type: 'achievement'
      };
      setPosts([newPost, ...posts]);
      setUser({ ...user, completedSubjects: [...user.completedSubjects, subject], earnedBadges: badge ? [...user.earnedBadges, badge.id] : user.earnedBadges, xp: user.xp + 500 });
      alert(`Mastered ${subject}! 🎖️ +500 XP earned!`);
    }
  };

  const handleShareToCommunity = (topicTitle: string, noteImage?: string) => {
    if (!user) return;
    const bonusXP = noteImage ? 50 : 0;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.photoUrl,
      content: `I just mastered "${topicTitle}" through Active Recall. ${noteImage ? 'Check out my notes!' : 'Explaining it out loud is a game changer!'} 🎙️📝 #UPSC2025`,
      timestamp: new Date(),
      likes: 0,
      type: 'recording',
      noteImageUrl: noteImage
    };
    setPosts([newPost, ...posts]);
    if (bonusXP > 0) {
      const newXP = user.xp + bonusXP;
      const newLevel = Math.floor(newXP / 1000) + 1;
      if (newLevel > user.level) setShowLevelUp(newLevel);
      setUser({ ...user, xp: newXP, level: newLevel });
      alert(`Bonus +50 XP for sharing notes!`);
    }
    setSelectedTopic(null);
    setActiveTab('community');
  };

  if (!user) return <AuthScreen onLogin={setUser} />;
  if (needsJourneyRecord) return <JourneyRecorder onComplete={handleJourneyComplete} />;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {showLevelUp && <LevelUpModal level={showLevelUp} onClose={() => setShowLevelUp(null)} />}
      
      <header className="p-4 flex justify-between items-center max-w-md mx-auto sticky top-0 bg-inherit z-40 backdrop-blur-md">
        <div className="flex items-center gap-3"><Logo /><span className="font-black text-xl tracking-tight dark:text-white uppercase italic">Rankers</span></div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800"><i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i></button>
      </header>

      <main className="max-w-md mx-auto p-4 pb-28">
        {activeTab === 'home' && <HomePage user={user} onExploreSubject={setExploringSubject} completedTopics={completedTopics} />}
        {activeTab === 'community' && <CommunityHub user={user} posts={posts} joinedCircles={joinedCircles} completedSubjects={user.completedSubjects} completedTopics={completedTopics} onJoinCircle={s => setJoinedCircles([...joinedCircles, s])} onLeaveCircle={s => setJoinedCircles(joinedCircles.filter(i => i !== s))} onEnterCircle={s => alert(`Live Chat ${s}`)} onDeclareMastery={handleDeclareMastery} />}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in text-center p-4">
            <div className="relative inline-block">
              <div onClick={() => profileInputRef.current?.click()} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl mx-auto overflow-hidden bg-slate-200 cursor-pointer">
                <img src={user.photoUrl} className="w-full h-full object-cover" alt="Me" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-full border-4 border-slate-50 flex items-center justify-center text-white font-black text-xs shadow-lg">Lvl {user.level}</div>
            </div>
            
            {user.journeyVideoUrl && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Your Vision Statement</h4>
                <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-inner bg-slate-900">
                  <video src={user.journeyVideoUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-2xl font-black dark:text-white">{user.name}</h3>
              {user.isGuest && <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[8px] font-black text-slate-400 rounded-full uppercase tracking-widest mt-1">Guest Mode</span>}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-orange-600">{user.xp.toLocaleString()}</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">Total XP</span>
                </div>
                <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-orange-600">#{user.rank || '42'}</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">Rank</span>
                </div>
                <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-orange-600">{user.streak}</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">Streak</span>
                </div>
              </div>
            </div>

            <div className="text-left space-y-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Mastery Wall</h4>
              <div className="grid grid-cols-4 gap-4">
                {SUBJECTS_CONFIG.map(sub => {
                  const isMastered = user.completedSubjects.includes(sub.id);
                  return (
                    <div key={sub.id} className={`aspect-square rounded-3xl flex items-center justify-center text-xl transition-all ${isMastered ? `${sub.color.split(' ')[0]} shadow-lg` : 'bg-slate-100 dark:bg-slate-800 opacity-20'}`}>
                       <i className={`fa-solid ${sub.icon}`}></i>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button onClick={() => setUser(null)} className="w-full bg-slate-50 dark:bg-slate-900 text-slate-500 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-100">Sign Out</button>
          </div>
        )}
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {selectedTopic && (
        <TopicDetail 
          topic={selectedTopic} 
          onBack={() => setSelectedTopic(null)} 
          onComplete={handleCompleteTopic}
          onShareToCommunity={handleShareToCommunity}
          onShareToCircle={(title, image) => { handleShareToCommunity(title, image); }}
        />
      )}

      {exploringSubject && (
        <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex flex-col animate-fade-in overflow-hidden">
          <header className="p-6 flex items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"><button onClick={() => setExploringSubject(null)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 mr-4"><i className="fa-solid fa-arrow-left"></i></button><h2 className="text-xl font-black uppercase tracking-tight">{exploringSubject} Syllabus</h2></header>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {MOCK_TOPICS.filter(t => t.subject === exploringSubject).map(topic => (
              <button key={topic.id} onClick={() => { setSelectedTopic(topic); setExploringSubject(null); }} className={`w-full p-5 rounded-[2.5rem] border flex items-center gap-4 text-left ${completedTopics.includes(topic.id) ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${completedTopics.includes(topic.id) ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800'}`}><i className={`fa-solid ${completedTopics.includes(topic.id) ? 'fa-check' : 'fa-book'}`}></i></div>
                <div className="flex-1"><p className="font-bold text-sm truncate">{topic.title}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">+{topic.xpReward} XP</p></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

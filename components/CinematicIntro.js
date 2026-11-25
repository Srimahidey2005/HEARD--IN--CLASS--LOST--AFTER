"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, ArrowRight, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export default function CinematicIntro({ autoStart = true, onComplete, redirectUrl = '' }) {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [hasVideoFile, setHasVideoFile] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  const videoRef = useRef(null);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  const duration = 7.0;

  const handleFinish = useCallback(() => {
    setFadingOut(true);
    setTimeout(() => {
      setActive(false);
      setFadingOut(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('intro_viewed_session', 'true');
      }
      if (onComplete) {
        onComplete();
      }
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }, 400);
  }, [onComplete, redirectUrl, router]);

  // Check if a native public/intro.mp4 exists
  useEffect(() => {
    if (!active) return;
    fetch('/intro.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasVideoFile(true);
      })
      .catch(() => {});
  }, [active]);

  // Animation controller for the 7.0 second sequence
  useEffect(() => {
    if (!active) return;

    let rafId;
    startTimeRef.current = performance.now();

    const loop = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const clamped = Math.min(elapsed, duration);
      setCurrentTime(clamped);

      if (clamped >= duration) {
        handleFinish();
      } else {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active, handleFinish]);

  if (!active) return null;

  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  // Determine current active scene
  let sceneInfo = {
    number: 1,
    title: 'Classroom Introduction',
    detail: 'College classroom · Tiered wooden desks · Chalkboard proof',
    timeRange: '0.0s – 1.5s'
  };

  if (currentTime >= 1.5 && currentTime < 2.5) {
    sceneInfo = {
      number: 2,
      title: 'The Confused Student',
      detail: 'Staring between board & notebook · Concept doubt',
      timeRange: '1.5s – 2.5s'
    };
  } else if (currentTime >= 2.5 && currentTime < 3.5) {
    sceneInfo = {
      number: 3,
      title: 'The Mentor Notices',
      detail: 'Lecturer pauses chalk · Friendly approach down aisle',
      timeRange: '2.5s – 3.5s'
    };
  } else if (currentTime >= 3.5 && currentTime < 4.7) {
    sceneInfo = {
      number: 4,
      title: '1-on-1 Explanation',
      detail: 'Pointing to notebook · Understanding sparked · Confident smile',
      timeRange: '3.5s – 4.7s'
    };
  } else if (currentTime >= 4.7 && currentTime < 6.0) {
    sceneInfo = {
      number: 5,
      title: 'Illuminated Identity',
      detail: 'HEARD IN CLASS, LOST AFTER · Watercolor lavender bloom',
      timeRange: '4.7s – 6.0s'
    };
  } else if (currentTime >= 6.0) {
    sceneInfo = {
      number: 6,
      title: 'Website Portal Reveal',
      detail: 'Seamless transition into live platform homepage',
      timeRange: '6.0s – 7.0s'
    };
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0E0C17]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 transition-opacity duration-400 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 9:16 Vertical Reel Player Container */}
      <div className="relative w-full max-w-[380px] aspect-[9/16] max-h-[92vh] rounded-[32px] overflow-hidden border border-[#A99AEF]/30 shadow-[0_0_60px_rgba(113,97,197,0.35)] bg-[#171524] flex flex-col justify-between">
        
        {/* Top Header Controls Overlay */}
        <div className="relative z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/50 text-[#C6B9FF] border border-[#A99AEF]/30 backdrop-blur-md">
              {currentTime.toFixed(1)}s / 7.0s
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#7161C5]/30 text-white border border-[#A99AEF]/30">
              Scene {sceneInfo.number}
            </span>
          </div>

          <button
            onClick={handleFinish}
            type="button"
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md flex items-center gap-1.5 transition-all"
          >
            <span>Skip Intro</span>
            <X size={13} />
          </button>
        </div>

        {/* Central Visual Stage */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          {hasVideoFile ? (
            <video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              muted={muted}
              playsInline
              onEnded={handleFinish}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Continuous Anime SVG & Kinetic Animation Engine */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
              
              {/* Scene 1: Classroom Introduction (0.0s - 1.5s) */}
              {sceneInfo.number === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#7161C5]/30 to-[#A99AEF]/20 border border-[#A99AEF]/40 flex items-center justify-center shadow-xl">
                    <svg className="w-14 h-14 text-[#C6B9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#A99AEF] uppercase font-bold">
                      Indian College Lecture Hall
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 tracking-tight">
                      Morning Lecture In Session
                    </h3>
                    <p className="text-xs text-[#B4ADC8] mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                      Professor writing complex mathematical proofs on the board as students take notes.
                    </p>
                  </div>
                </div>
              )}

              {/* Scene 2: The Confused Student (1.5s - 2.5s) */}
              {sceneInfo.number === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-[#C58A35]/20 border border-[#C58A35]/50 flex items-center justify-center shadow-xl">
                    <svg className="w-14 h-14 text-[#E8B66B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#E8B66B] uppercase font-bold">
                      Academic Hesitation
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 tracking-tight">
                      Heard in Class, Lost After
                    </h3>
                    <p className="text-xs text-[#B4ADC8] mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                      A student stares puzzled at the derivations, his pen paused over his notebook.
                    </p>
                  </div>
                </div>
              )}

              {/* Scene 3: The Mentor Notices (2.5s - 3.5s) */}
              {sceneInfo.number === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-[#7161C5]/25 border border-[#A99AEF]/50 flex items-center justify-center shadow-xl">
                    <svg className="w-14 h-14 text-[#C6B9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#A99AEF] uppercase font-bold">
                      Attentive Mentorship
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 tracking-tight">
                      Faculty Steps In
                    </h3>
                    <p className="text-xs text-[#B4ADC8] mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                      The lecturer puts down the chalk and walks down the aisle to the student&apos;s desk with an encouraging smile.
                    </p>
                  </div>
                </div>
              )}

              {/* Scene 4: 1-on-1 Explanation & Smiling Clarity (3.5s - 4.7s) */}
              {sceneInfo.number === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-[#258B70]/20 border border-[#258B70]/50 flex items-center justify-center shadow-xl">
                    <svg className="w-14 h-14 text-[#62C4A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#62C4A0] uppercase font-bold">
                      Instant Comprehension
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 tracking-tight">
                      The Confident Smile
                    </h3>
                    <p className="text-xs text-[#B4ADC8] mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                      Leaning beside the desk, the professor explains the concept. The student nods with understanding.
                    </p>
                  </div>
                </div>
              )}

              {/* Scene 5: Illuminated Logo (4.7s - 6.0s) */}
              {sceneInfo.number === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="w-28 h-28 mx-auto rounded-[32px] bg-gradient-to-tr from-[#7161C5] via-[#A99AEF] to-[#DCD5F7] p-1 shadow-[0_0_50px_rgba(169,154,239,0.5)]">
                    <div className="w-full h-full rounded-[28px] bg-[#171524] flex items-center justify-center">
                      <svg className="w-16 h-16 text-[#C6B9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#A99AEF] uppercase font-bold">
                      University Academic Platform
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1.5 tracking-normal leading-tight shadow-sm">
                      HEARD IN CLASS,<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A99AEF] via-[#C6B9FF] to-white">
                        LOST AFTER
                      </span>
                    </h2>
                    <p className="text-xs text-[#B4ADC8] mt-2">
                      Direct Faculty Guidance · Section Triage
                    </p>
                  </div>
                </div>
              )}

              {/* Scene 6: Website Reveal (6.0s - 7.0s) */}
              {sceneInfo.number === 6 && (
                <div className="space-y-4 animate-fadeIn">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#258B70]/20 text-[#62C4A0] border border-[#258B70]/40">
                    ✓ Welcome to the Portal
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Entering Academic Workspace…
                  </h3>
                  <button
                    onClick={handleFinish}
                    className="btn btn-lime shadow-glow-lime text-xs px-5 py-2.5 font-bold flex items-center justify-center gap-2 mx-auto mt-2"
                  >
                    <span>Proceed to Homepage</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Bottom Timeline Controls */}
        <div className="relative z-30 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent space-y-2.5">
          {/* Progress Scrubber */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7161C5] to-[#A99AEF] transition-all duration-100 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white">
            <span className="text-[11px] font-mono text-[#B4ADC8]">
              {sceneInfo.title}
            </span>
            <button
              onClick={handleFinish}
              className="text-[11px] font-bold text-[#A99AEF] hover:text-white transition-colors"
            >
              Enter Now →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";

const KAKAO_LINK = "http://pf.kakao.com/_CUPCX/chat";
const REVIEW_PLACEHOLDER = "/reviews/review-placeholder.jpg";

const MEDIAN_INCOME_2026 = {
  1: 2564238,
  2: 4199292,
  3: 5359036,
  4: 6494738,
  5: 7556719,
  6: 8555952,
  7: 9515150,
};

const MINIMUM_LIVING_COST_2026 = Object.fromEntries(
  Object.entries(MEDIAN_INCOME_2026).map(([size, amount]) => [
    Number(size),
    Math.round(amount * 0.6),
  ])
);

const OCCUPATIONS = ["직장인", "프리랜서", "사업자", "알바", "휴직", "무직"];
const MARITAL_OPTIONS = ["미혼", "기혼"];
const YES_NO = ["있음", "없음"];
const CHILD_OPTIONS = [0, 1, 2, 3, 4];

const storySections = [
  {
    eyebrow: "혹시 나도 해당될까?",
    title: "매년 많은 분들이 정부제도를 통해 대출 부담을 줄이고 있습니다",
    desc:
      "혼자 알아보기 어려운 채무 상황도 현재 소득과 보유 재산, 부양가족 구조를 기준으로 먼저 방향을 잡아볼 수 있습니다.",
    image: "/sections/section01.jpg",
  },
  {
    eyebrow: "가장 높은 탕감율을 위해",
    title: "내 소득과 채무 상황을 분석해 더 유리한 방향을 찾습니다",
    desc:
      "막연한 희망보다 현재 기준에 맞는 현실적인 전략이 중요합니다. 월소득, 자산 규모, 가족 수를 함께 고려해 예상 결과를 보여줍니다.",
    image: "/sections/section02.jpg",
  },
  {
    eyebrow: "직접 만든 이유",
    title: "도움이 필요한 분들이 기회를 놓치지 않도록 쉽게 만들었습니다",
    desc:
      "복잡한 제도를 어렵게 설명하는 대신, 지금 필요한 정보만 빠르게 확인하고 바로 상담으로 이어질 수 있도록 구조를 단순화했습니다.",
    image: "/sections/section03.jpg",
  },
];

const reviewCards = [
  {
    name: "32세 직장인",
    title: "카카오톡으로 먼저 상황을 정리하니 훨씬 덜 막막했습니다",
    body:
      "전화보다 메시지 상담이 편해서 부담이 적었고, 필요한 자료를 먼저 알려줘서 준비가 쉬웠습니다.",
    image: "/reviews/review-01.jpg",
  },
  {
    name: "41세 자영업자",
    title: "신용대출과 담보대출이 섞여 있었는데 구분해서 봐줘서 좋았습니다",
    body:
      "복잡하게 섞여 있는 줄만 알았는데 구조를 나눠 설명해주니 다음 단계를 이해하기 쉬웠습니다.",
    image: "/reviews/review-02.jpg",
  },
  {
    name: "29세 프리랜서",
    title: "부양가족 기준이 결과에 어떤 영향을 주는지 이해가 됐어요",
    body:
      "그냥 대략 계산하는 게 아니라 월소득과 가족 수 기준으로 설명해줘서 더 신뢰가 갔습니다.",
    image: "/reviews/review-03.jpg",
  },
  {
    name: "37세 직장인",
    title: "차량이 있어도 어떻게 반영되는지 먼저 설명받아 안심됐습니다",
    body:
      "차량 때문에 무조건 안 되는 줄 알았는데, 어떤 부분을 봐야 하는지 차분히 안내받았습니다.",
    image: "/reviews/review-04.jpg",
  },
  {
    name: "45세 자영업자",
    title: "재산과 보증금 부분까지 따로 나눠 보니까 이해가 빨랐습니다",
    body:
      "막연히 자산이 있다고만 생각했는데 항목별로 보니 어떤 게 중요한지 알 수 있었습니다.",
    image: "/reviews/review-05.jpg",
  },
  {
    name: "34세 회사원",
    title: "절차가 길게만 느껴졌는데 단계별로 나눠 보니 현실적이었습니다",
    body:
      "서류검토부터 법원 절차까지 한 번에 보여줘서 상담 전에 훨씬 덜 불안했습니다.",
    image: "/reviews/review-06.jpg",
  },
  {
    name: "39세 자영업자",
    title: "비대면으로 먼저 진단해보고 상담까지 이어지니 편했습니다",
    body:
      "자가진단으로 먼저 기준을 보고 나니까 실제 상담 때 질문도 훨씬 명확하게 할 수 있었습니다.",
    image: "/reviews/review-07.jpg",
  },
  {
    name: "27세 사회초년생",
    title: "혼자 찾아볼 때보다 훨씬 명확하게 방향이 잡혔습니다",
    body:
      "소득이 낮아서 어려울 줄 알았는데 먼저 가능성과 기준부터 구분해줘서 좋았습니다.",
    image: "/reviews/review-08.jpg",
  },
];

const footerLinks = ["자가진단", "후기", "상담신청"];

const loadingMessages = [
  "월소득과 부양가족 수를 확인하고 있어요.",
  "2026년 기준 최저생계비를 반영하고 있어요.",
  "월 변제 가능금액과 36개월 총변제금을 계산하고 있어요.",
  "예상 탕감액과 적합 여부를 정리하고 있어요.",
];

function FadeInSection({
  children,
  className = "",
  delay = 0,
  threshold = 0.14,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} transform-gpu transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CTAButton({
  href,
  onClick,
  variant = "yellow",
  children,
  full = false,
}) {
  const base =
    "pressable inline-flex items-center justify-center rounded-[22px] px-6 py-4 text-center text-sm font-extrabold leading-none";
  const width = full ? "w-full" : "";
  const styles =
    variant === "yellow"
      ? "bg-[#fee500] text-slate-900"
      : variant === "diagnosis"
      ? "border border-[#c9a23e] bg-gradient-to-b from-[#c79b25] to-[#9d7417] text-white"
      : "bg-slate-900 text-white";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className={`${base} ${width} ${styles}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${width} ${styles}`}
    >
      {children}
    </button>
  );
}

function StorySection({ section, onOpenDiagnosis, onTrackCta, sectionId }) {
  return (
    <div className="mx-auto max-w-4xl">
      <FadeInSection>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
            {section.eyebrow}
          </p>

          <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
            {section.title}
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            {section.desc}
          </p>

          <FadeInSection delay={120}>
            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <img
                src={section.image}
                alt={section.title}
                className="h-[220px] w-full object-cover md:h-[320px]"
              />
            </div>
          </FadeInSection>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTAButton
              href={KAKAO_LINK}
              variant="yellow"
              onClick={() => onTrackCta("kakao_consult", sectionId)}
            >
              카카오톡 상담
            </CTAButton>
            <CTAButton
              onClick={() => {
                onTrackCta("diagnosis_start", sectionId);
                onOpenDiagnosis(sectionId);
              }}
              variant="diagnosis"
            >
              채무탕감 자가진단
            </CTAButton>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}

function ProgressRing({ progress }) {
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90 transform">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#fee500"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold text-slate-900">{progress}%</div>
        <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          조회중
        </div>
      </div>
    </div>
  );
}

function StepOptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable rounded-2xl border px-4 py-4 text-sm font-bold transition ${
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-900 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const sanitized = String(value).replace(/[^0-9.]/g, "");
  return Number(sanitized || 0);
}

function formatManwonFromWon(value) {
  return `${Math.round((value || 0) / 10000).toLocaleString("ko-KR")}만원`;
}

function getDiagnosisPayload(form) {
  const monthlyIncomeWon = toNumber(form.monthlyIncome) * 10000;
  const creditLoanWon = toNumber(form.creditLoan) * 10000;
  const securedLoanWon = toNumber(form.securedLoan) * 10000;
  const totalDebtWon = creditLoanWon + securedLoanWon;
  const realEstateValueWon = toNumber(form.realEstateValue) * 10000;
  const depositValueWon = toNumber(form.depositValue) * 10000;
  const vehicleValueWon =
    form.hasVehicle === "있음" ? toNumber(form.vehicleValue) * 10000 : 0;
  const totalAssetsWon = realEstateValueWon + depositValueWon + vehicleValueWon;
  const childCount = form.maritalStatus === "기혼" ? Number(form.minorChildren || 0) : 0;
  const familySize = Math.max(
    1,
    Math.min(7, 1 + (form.maritalStatus === "기혼" ? 1 : 0) + childCount)
  );
  const minimumLivingCostWon =
    MINIMUM_LIVING_COST_2026[familySize] || MINIMUM_LIVING_COST_2026[7];
  const monthlyDisposableIncomeWon = Math.max(
    0,
    monthlyIncomeWon - minimumLivingCostWon
  );
  const expectedRepayment36Won = monthlyDisposableIncomeWon * 36;
  const estimatedInterestWon = totalDebtWon * 0.08 * 3;
  const totalClaimWon = totalDebtWon + estimatedInterestWon;
  const expectedTotalRepaymentWon = Math.min(totalClaimWon, expectedRepayment36Won);
  const expectedReductionWon = Math.max(0, totalClaimWon - expectedTotalRepaymentWon);
  const reductionRate = totalClaimWon > 0 ? (expectedReductionWon / totalClaimWon) * 100 : 0;

  const reasons = [];
  if (["휴직", "무직"].includes(form.occupation)) {
    reasons.push("현재 직업이 휴직 또는 무직으로 선택되었습니다.");
  }
  if (monthlyIncomeWon < 1530000) {
    reasons.push("월 평균 소득이 153만원 미만으로 입력되었습니다.");
  }
  if (totalAssetsWon > totalDebtWon) {
    reasons.push("총 보유자산이 총 채무보다 많은 것으로 입력되었습니다.");
  }

  return {
    occupation: form.occupation,
    monthlyIncomeWon,
    maritalStatus: form.maritalStatus,
    minorChildren: childCount,
    hasVehicle: form.hasVehicle,
    vehicleValueWon,
    creditLoanWon,
    securedLoanWon,
    totalDebtWon,
    realEstateValueWon,
    depositValueWon,
    totalAssetsWon,
    familySize,
    minimumLivingCostWon,
    monthlyDisposableIncomeWon,
    expectedRepayment36Won,
    expectedTotalRepaymentWon,
    estimatedInterestWon,
    totalClaimWon,
    expectedReductionWon,
    reductionRate,
    suitable: reasons.length === 0,
    unsuitableReasons: reasons,
  };
}

function getCurrentStepValid(step, form) {
  if (step === 1) return !!form.occupation;
  if (step === 2) return toNumber(form.monthlyIncome) > 0;
  if (step === 3) {
    if (!form.maritalStatus) return false;
    if (form.maritalStatus === "기혼") {
      return form.minorChildren !== "" && form.minorChildren !== null;
    }
    return true;
  }
  if (step === 4) {
    if (!form.hasVehicle) return false;
    if (form.hasVehicle === "있음") return toNumber(form.vehicleValue) > 0;
    return true;
  }
  if (step === 5) return toNumber(form.creditLoan) > 0 || toNumber(form.securedLoan) > 0;
  if (step === 6) return toNumber(form.realEstateValue) > 0 || toNumber(form.depositValue) > 0;
  return true;
}

function getLoadingMessage(progress) {
  if (progress < 25) return loadingMessages[0];
  if (progress < 50) return loadingMessages[1];
  if (progress < 75) return loadingMessages[2];
  return loadingMessages[3];
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [consultation, setConsultation] = useState({ name: "", phone: "" });
  const [form, setForm] = useState({
    occupation: "",
    monthlyIncome: "",
    maritalStatus: "",
    minorChildren: "",
    hasVehicle: "",
    vehicleValue: "",
    creditLoan: "",
    securedLoan: "",
    realEstateValue: "",
    depositValue: "",
  });

  const diagnosis = useMemo(() => getDiagnosisPayload(form), [form]);
  const currentStepValid = getCurrentStepValid(step, form);

  const posthogInitialized = useRef(false);
  const enteredAtRef = useRef(new Map());
  const diagnosisSourceRef = useRef("unknown");

  const safeCapture = (eventName, properties = {}) => {
    if (typeof window === "undefined") return;
    if (!posthogInitialized.current) return;
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error("PostHog capture error:", error);
    }
  };

  const trackCtaClick = (ctaName, sectionId) => {
    safeCapture("landing cta clicked", {
      cta_name: ctaName,
      section_id: sectionId,
      current_url: window.location.pathname,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (posthogInitialized.current) return;
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2026-01-30",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });

    posthogInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!posthogInitialized.current) return;

    const sections = Array.from(document.querySelectorAll("[data-section-id]"));
    const enteredAt = enteredAtRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();

        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section-id");
          if (!sectionId) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (!enteredAt.has(sectionId)) {
              enteredAt.set(sectionId, now);

              safeCapture("landing section viewed", {
                section_id: sectionId,
                current_url: window.location.pathname,
              });
            }
          } else if (enteredAt.has(sectionId)) {
            const start = enteredAt.get(sectionId);
            const dwell = now - start;

            safeCapture("landing section exited", {
              section_id: sectionId,
              dwell_ms: dwell,
              current_url: window.location.pathname,
            });

            enteredAt.delete(sectionId);
          }
        });
      },
      {
        threshold: [0.3, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    const flushVisibleSections = () => {
      const now = Date.now();
      enteredAt.forEach((start, sectionId) => {
        safeCapture("landing section exited", {
          section_id: sectionId,
          dwell_ms: now - start,
          current_url: window.location.pathname,
        });
      });
      enteredAt.clear();
    };

    window.addEventListener("pagehide", flushVisibleSections);

    return () => {
      flushVisibleSections();
      observer.disconnect();
      window.removeEventListener("pagehide", flushVisibleSections);
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen || step !== 7) return undefined;

    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setStep(8);
          }, 400);
          return 100;
        }
        return next;
      });
    }, 55);

    return () => clearInterval(timer);
  }, [isModalOpen, step]);

  useEffect(() => {
    if (step === 8) {
      safeCapture("diagnosis result viewed", {
        source: diagnosisSourceRef.current,
        suitable: diagnosis.suitable,
        reduction_rate: Math.round(diagnosis.reductionRate || 0),
        expected_reduction_won: diagnosis.expectedReductionWon || 0,
        total_debt_won: diagnosis.totalDebtWon || 0,
      });
    }
  }, [step, diagnosis]);

  const openDiagnosisModal = (sourceSection = "unknown") => {
    diagnosisSourceRef.current = sourceSection;

    safeCapture("diagnosis started", {
      source: sourceSection,
      current_url: window.location.pathname,
    });

    setForm({
      occupation: "",
      monthlyIncome: "",
      maritalStatus: "",
      minorChildren: "",
      hasVehicle: "",
      vehicleValue: "",
      creditLoan: "",
      securedLoan: "",
      realEstateValue: "",
      depositValue: "",
    });
    setConsultation({ name: "", phone: "" });
    setSubmitMessage("");
    setProgress(0);
    setStep(1);
    setIsModalOpen(true);
  };

  const closeDiagnosisModal = () => {
    safeCapture("diagnosis closed", {
      current_step: step,
      source: diagnosisSourceRef.current,
    });

    setIsModalOpen(false);
    setStep(1);
    setProgress(0);
    setSubmitMessage("");
    setIsSubmitting(false);
  };

  const nextStep = () => {
    safeCapture("diagnosis step completed", {
      step_number: step,
      source: diagnosisSourceRef.current,
    });

    if (step < 6) {
      setStep(step + 1);
      return;
    }
    if (step === 6) {
      setStep(7);
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 7) {
      safeCapture("diagnosis step back", {
        step_number: step,
        source: diagnosisSourceRef.current,
      });
      setStep(step - 1);
    }
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.suitable) return;

    if (!consultation.name.trim() || !consultation.phone.trim()) {
      setSubmitMessage("이름과 전화번호를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant: consultation,
          diagnosis: {
            occupation: diagnosis.occupation,
            monthlyIncomeWon: diagnosis.monthlyIncomeWon,
            maritalStatus: diagnosis.maritalStatus,
            minorChildren: diagnosis.minorChildren,
            hasVehicle: diagnosis.hasVehicle,
            vehicleValueWon: diagnosis.vehicleValueWon,
            creditLoanWon: diagnosis.creditLoanWon,
            securedLoanWon: diagnosis.securedLoanWon,
            totalDebtWon: diagnosis.totalDebtWon,
            realEstateValueWon: diagnosis.realEstateValueWon,
            depositValueWon: diagnosis.depositValueWon,
            totalAssetsWon: diagnosis.totalAssetsWon,
            familySize: diagnosis.familySize,
            minimumLivingCostWon: diagnosis.minimumLivingCostWon,
            monthlyDisposableIncomeWon: diagnosis.monthlyDisposableIncomeWon,
            expectedRepayment36Won: diagnosis.expectedRepayment36Won,
            expectedTotalRepaymentWon: diagnosis.expectedTotalRepaymentWon,
            estimatedInterestWon: diagnosis.estimatedInterestWon,
            totalClaimWon: diagnosis.totalClaimWon,
            expectedReductionWon: diagnosis.expectedReductionWon,
            reductionRate: diagnosis.reductionRate,
            suitable: diagnosis.suitable,
            unsuitableReasons: diagnosis.unsuitableReasons,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "신청 전송에 실패했습니다.");
      }

      safeCapture("consultation submitted", {
        source: "diagnosis_result",
        diagnosis_source: diagnosisSourceRef.current,
        suitable: diagnosis.suitable,
        reduction_rate: Math.round(diagnosis.reductionRate || 0),
      });

      setSubmitMessage("상담신청이 정상적으로 접수되었습니다.");
      setConsultation({ name: "", phone: "" });
    } catch (error) {
      setSubmitMessage(error.message || "신청 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resultDate = new Date().toLocaleDateString("ko-KR");

  return (
    <>
      <main className="min-h-screen bg-[#f8f8f6] text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a5c00]">
                로가드 회생 / 국가채무조정제도
              </p>
            </div>

            <div className="flex items-center justify-end">
              <img
                src="/head/head01.jpg"
                alt="매일법률사무소 로고"
                className="h-[38px] w-auto object-contain md:h-[48px]"
              />
            </div>
          </div>
        </header>

        <section
          id="intro"
          data-section-id="hero"
          className="relative overflow-hidden bg-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,229,0,0.28),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 md:px-6 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-4xl">
              <FadeInSection className="text-center">
                <div className="inline-flex rounded-full border border-[#f3e483] bg-[#fff9d9] px-4 py-2 text-sm font-semibold text-[#6d5600]">
                  30초 만에 확인해보세요!
                </div>

                <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 md:text-6xl">
                  내 대출금,
                  <br />
                  얼마나 줄어드는지 알 수 있다고?
                </h1>

                <p className="mt-4 text-2xl font-extrabold leading-tight text-[#7a5c00] md:text-3xl">
                  국가채무조정제도 간편 자가진단 서비스
                </p>

                <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                  <span>자가진단자 평균 예상 탕감율 57%</span>
                  <span className="text-slate-400">|</span>
                  <span>최대 95% 원금 탕감</span>
                </div>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  소득, 채무규모, 재산 여부에 따라 전략이 달라집니다.
                  <br />
                  우선 30초 자가진단으로 자격 요건부터 확인해보세요!
                </p>

                <div className="mt-8 grid gap-3 sm:mx-auto sm:max-w-xl sm:grid-cols-2">
                  <CTAButton
                    href={KAKAO_LINK}
                    variant="yellow"
                    full
                    onClick={() => trackCtaClick("kakao_consult", "hero")}
                  >
                    카카오톡 상담
                  </CTAButton>
                  <CTAButton
                    onClick={() => {
                      trackCtaClick("diagnosis_start", "hero");
                      openDiagnosisModal("hero");
                    }}
                    variant="diagnosis"
                    full
                  >
                    채무탕감 자가진단
                  </CTAButton>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        <section
          data-section-id="trust"
          className="border-y border-slate-200 bg-slate-950 text-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-6">
            <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
              <FadeInSection className="text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fee500]">
                  지금 방향부터 먼저 확인하세요
                </p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
                  혹시 나도 대출금을 줄일 수 있을까?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 md:mx-0">
                  매달 돌아오는 대출 원리금 상환으로
                  나와 사랑하는 가족의 생활이 어려운 분이라면 
                  이제 삶이 달라질 수 있습니다. 
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                  <CTAButton
                    href={KAKAO_LINK}
                    variant="yellow"
                    onClick={() => trackCtaClick("kakao_consult", "trust")}
                  >
                    카카오톡 채널 상담하기
                  </CTAButton>
                  <CTAButton
                    onClick={() => {
                      trackCtaClick("diagnosis_start", "trust");
                      openDiagnosisModal("trust");
                    }}
                    variant="diagnosis"
                  >
                    채무탕감 자가진단 시작하기
                  </CTAButton>
                </div>
              </FadeInSection>

              <FadeInSection
                delay={120}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-center backdrop-blur"
              >
                <div className="rounded-[24px] bg-white p-5 text-slate-900">
                  <p className="text-sm font-semibold text-slate-500">자가진단 확인 항목</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">
                      직업과 월 평균 소득
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">
                      혼인상태와 미성년 자녀 수
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">
                      자산 대비 부채 규모
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        <section
          data-section-id="story-1"
          className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-18"
        >
          <StorySection
            section={storySections[0]}
            sectionId="story-1"
            onTrackCta={trackCtaClick}
            onOpenDiagnosis={openDiagnosisModal}
          />
        </section>

        <section
          data-section-id="story-2"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-18">
            <StorySection
              section={storySections[1]}
              sectionId="story-2"
              onTrackCta={trackCtaClick}
              onOpenDiagnosis={openDiagnosisModal}
            />
          </div>
        </section>

        <section
          data-section-id="story-3"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-18">
            <StorySection
              section={storySections[2]}
              sectionId="story-3"
              onTrackCta={trackCtaClick}
              onOpenDiagnosis={openDiagnosisModal}
            />
          </div>
        </section>

        <section
          id="reviews"
          data-section-id="reviews"
          className="mx-auto max-w-7xl px-5 py-16 text-center md:px-6 md:py-20"
        >
          <FadeInSection className="mx-auto mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
              Reviews
            </p>
            <h3 className="mt-3 text-4xl font-extrabold tracking-tight">
              개인회생 후기
            </h3>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              실제 진행하셨던 신청자분들의 생생한 후기!
            </p>
          </FadeInSection>

          <FadeInSection delay={120} className="review-marquee text-left">
            <div className="review-marquee-track">
              {[0, 1].map((groupIndex) => (
                <div
                  className="review-marquee-group"
                  key={groupIndex}
                  aria-hidden={groupIndex === 1}
                >
                  {reviewCards.map((item, index) => (
                    <div
                      key={`${groupIndex}-${index}`}
                      className="review-marquee-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image || REVIEW_PLACEHOLDER}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = REVIEW_PLACEHOLDER;
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="inline-flex rounded-full bg-[#fff7c2] px-3 py-1 text-xs font-bold text-[#6d5600]">
                          {item.name}
                        </div>
                        <h4 className="mt-4 text-xl font-extrabold leading-snug">
                          {item.title}
                        </h4>
                        <p className="mt-4 text-base leading-8 text-slate-600">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeInSection>
        </section>

        <section
          data-section-id="final-cta"
          className="border-y border-slate-200 bg-slate-950 text-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-6">
            <FadeInSection className="rounded-[34px] bg-white/5 px-6 py-8 text-center backdrop-blur md:px-8 md:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fee500]">
                결과 확인 후 즉시 담당자 배정
              </p>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
                내 조건이 적합한지 자가진단 후,
                <br />
                전문 담당자와 함께 신청부터 결과까지
              </h3>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-300">
                신청 후 30분~1시간 이내 담당자가 유선 통화를 드립니다.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <CTAButton
                  href={KAKAO_LINK}
                  variant="yellow"
                  onClick={() => trackCtaClick("kakao_consult", "final-cta")}
                >
                  카카오톡 채널 상담하기
                </CTAButton>
                <CTAButton
                  onClick={() => {
                    trackCtaClick("diagnosis_start", "final-cta");
                    openDiagnosisModal("final-cta");
                  }}
                  variant="diagnosis"
                >
                  채무탕감 자가진단 시작하기
                </CTAButton>
              </div>
            </FadeInSection>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 text-center md:px-6">
            <FadeInSection>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5c00]">
                로가드 회생 / 국가채무조정제도
              </p>
              <h4 className="mt-2 text-2xl font-extrabold text-slate-900">
                로가드 · 매일법률사무소 무료 법률상담
              </h4>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                상호명: 매일법률사무소 |대표자: 김민석 | 사업자등록번호: 489-04-02780
                <br />
                주소: 서울특별시 서초구 서초대로42길 66 매일빌딩
                <br />
                광고책임자: 김민석변호사 | 이메일 : doublestone.partners@gmail.com
                <br />
                copyright ⓒ 매일법률사무소 All Rights Reserved.
              </p>
            </FadeInSection>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {footerLinks.map((item, index) => (
                <FadeInSection key={item} delay={index * 70}>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    {item}
                  </span>
                </FadeInSection>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
              Copyright © 2026. All rights reserved.
            </div>
          </div>
        </footer>

        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200">
            <CTAButton
              href={KAKAO_LINK}
              variant="yellow"
              full
              onClick={() => trackCtaClick("kakao_consult", "bottom-fixed")}
            >
              카톡 상담
            </CTAButton>
            <CTAButton
              onClick={() => {
                trackCtaClick("diagnosis_start", "bottom-fixed");
                openDiagnosisModal("bottom-fixed");
              }}
              variant="diagnosis"
              full
            >
              자격 자가진단
            </CTAButton>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
            <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[34px] bg-white p-6 shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={closeDiagnosisModal}
                className="pressable absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700"
              >
                ×
              </button>

              {step <= 6 && (
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                        Self diagnosis
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        자격 자가진단
                      </h3>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      {step} / 8
                    </div>
                  </div>

                  <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#fee500] transition-all duration-300"
                      style={{ width: `${(step / 8) * 100}%` }}
                    />
                  </div>

                  {step === 1 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        현재 어떤 일을 하고 계신가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        직업에 따라 유리한 제도가 달라져요!
                      </p>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {OCCUPATIONS.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.occupation === option}
                            onClick={() =>
                              setForm((prev) => ({ ...prev, occupation: option }))
                            }
                          >
                            {option}
                          </StepOptionButton>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        월 평균 소득은 어느 정도 인가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        소득을 고려해 탕감액을 계산해요!
                      </p>
                      <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <label className="block text-sm font-bold text-slate-700">
                          월 평균 소득
                        </label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.monthlyIncome}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                monthlyIncome: e.target.value.replace(/[^0-9]/g, ""),
                              }))
                            }
                            inputMode="numeric"
                            placeholder="예: 280"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                            만원
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        현재 혼인상태를 알려주세요
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        맞춤형 제도를 찾아드려요!
                      </p>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {MARITAL_OPTIONS.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.maritalStatus === option}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                maritalStatus: option,
                                minorChildren: option === "기혼" ? prev.minorChildren : "",
                              }))
                            }
                          >
                            {option}
                          </StepOptionButton>
                        ))}
                      </div>

                      {form.maritalStatus === "기혼" && (
                        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            미성년 자녀 수
                          </label>
                          <div className="mt-4 grid grid-cols-5 gap-3">
                            {CHILD_OPTIONS.map((count) => (
                              <StepOptionButton
                                key={count}
                                selected={String(form.minorChildren) === String(count)}
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    minorChildren: String(count),
                                  }))
                                }
                              >
                                {count === 0 ? "없음" : `${count}명`}
                              </StepOptionButton>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        본인명의 차량이 있으신가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        정확한 탕감액 계산에 필요해요!
                      </p>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {YES_NO.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.hasVehicle === option}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                hasVehicle: option,
                                vehicleValue: option === "있음" ? prev.vehicleValue : "",
                              }))
                            }
                          >
                            {option}
                          </StepOptionButton>
                        ))}
                      </div>

                      {form.hasVehicle === "있음" && (
                        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            차량가액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.vehicleValue}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  vehicleValue: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 1200"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 5 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        현재 총 대출 금액은 얼마인가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        신용대출과 담보대출을 나눠 입력해주세요.
                      </p>
                      <div className="mt-8 grid gap-4">
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            신용대출 금액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.creditLoan}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  creditLoan: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 4500"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            담보대출 금액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.securedLoan}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  securedLoan: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 1500"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        총 보유자산은 얼마인가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        대략적인 금액도 괜찮아요. 자산 항목을 나눠 입력해주세요.
                      </p>
                      <div className="mt-8 grid gap-4">
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            본인명의 소유 부동산 시세 금액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.realEstateValue}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  realEstateValue: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 5000"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            전세 혹은 월세 보증금 금액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.depositValue}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  depositValue: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 1000"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1}
                      className="pressable rounded-2xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!currentStepValid}
                      className="pressable rounded-2xl bg-slate-900 px-7 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      다음
                    </button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="py-8 text-center">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                        Self diagnosis
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        조회중
                      </h3>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      7 / 8
                    </div>
                  </div>
                  <ProgressRing progress={progress} />
                  <p className="mt-8 text-lg font-bold text-slate-900">
                    잠시만 기다려주세요.
                  </p>
                  <p className="mt-3 text-base leading-8 text-slate-600">
                    나에게 맞는 정부제도와 탕감예상금액을 조회하고 있어요!
                  </p>
                  <div className="mt-6 rounded-[28px] bg-slate-50 px-6 py-5 text-sm leading-7 text-slate-700">
                    {getLoadingMessage(progress)}
                  </div>
                </div>
              )}

              {step === 8 && (
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                        Diagnosis result
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        결과 요약
                      </h3>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      8 / 8
                    </div>
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-900">
                    고객님의 결과 요약{" "}
                    <span className="text-slate-500">{resultDate} 기준</span>
                  </h4>

                  {diagnosis.suitable ? (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-[30px] border border-slate-200 bg-[#fffdf0] p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          적합
                        </p>
                        <h5 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900">
                          예상 탕감액
                          <br />
                          총 {formatManwonFromWon(diagnosis.expectedReductionWon)}을 줄일 수 있어요!
                        </h5>
                        <p className="mt-4 text-base leading-8 text-slate-600">
                          아래 결과는 입력한 정보 기준의 1차 예상치이며, 실제 사건은 추가 자료와 사실관계 검토에 따라 달라질 수 있습니다.
                        </p>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">월 소득</p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.monthlyIncomeWon)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              가구원 수 기준 최저생계비
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.minimumLivingCostWon)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">월 변제 가능금액</p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.monthlyDisposableIncomeWon)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              36개월 예상 총변제금
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.expectedTotalRepaymentWon)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">원금</p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.totalDebtWon)}
                            </p>
                            <p className="mt-4 text-sm font-bold text-slate-500">이자(3년 8%)</p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.estimatedInterestWon)}
                            </p>
                          </div>

                          <div className="flex items-center justify-center text-4xl text-slate-300">
                            ↓
                          </div>

                          <div className="rounded-2xl bg-[#fffdf0] p-5">
                            <p className="text-sm font-bold text-slate-500">예상 총변제금</p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.expectedTotalRepaymentWon)}
                            </p>
                            <p className="mt-4 text-sm font-bold text-slate-500">예상 탕감률</p>
                            <p className="mt-2 text-2xl font-extrabold text-[#7a5c00]">
                              {Math.round(diagnosis.reductionRate)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          상담신청
                        </p>
                        <h5 className="mt-3 text-2xl font-extrabold text-slate-900">
                          적합 결과가 나왔다면 바로 상담신청을 남겨주세요
                        </h5>
                        <form onSubmit={handleConsultSubmit} className="mt-6 space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                              이름
                            </label>
                            <input
                              value={consultation.name}
                              onChange={(e) =>
                                setConsultation((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="이름을 입력해주세요"
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-900"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                              전화번호
                            </label>
                            <input
                              value={consultation.phone}
                              onChange={(e) =>
                                setConsultation((prev) => ({
                                  ...prev,
                                  phone: e.target.value.replace(/[^0-9-]/g, ""),
                                }))
                              }
                              placeholder="010-0000-0000"
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-900"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="pressable w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white disabled:bg-slate-300"
                          >
                            {isSubmitting ? "전송중..." : "상담신청 보내기"}
                          </button>
                          {submitMessage ? (
                            <p className="text-sm font-semibold text-slate-700">
                              {submitMessage}
                            </p>
                          ) : null}
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-[30px] border border-red-100 bg-red-50 p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                          부적합
                        </p>
                        <h5 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900">
                          부적합하여 상담신청이 불가합니다.
                        </h5>
                        <p className="mt-4 text-base leading-8 text-slate-700">
                          현재 입력한 정보 기준으로는 본 페이지의 개인회생 예상 계산 구조와 맞지 않아 자동 신청으로 연결되지 않습니다.
                        </p>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          확인된 사유
                        </p>
                        <div className="mt-4 space-y-3">
                          {diagnosis.unsuitableReasons.map((reason) => (
                            <div
                              key={reason}
                              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                            >
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          안내
                        </p>
                        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                          <p>
                            입력한 정보는 1차 자동진단 기준이며 실제 사건은 추가 사실관계에 따라 달라질 수 있습니다.
                          </p>
                          <p>
                            현재 구조상 자동 신청은 열리지 않지만, 소득 구조나 채무 상황이 달라지면 결과가 달라질 수 있습니다.
                          </p>
                          <p>
                            정확한 검토가 필요하다면 카카오톡 채널로 현재 상황을 남겨주고 별도 상담을 받아보는 편이 좋습니다.
                          </p>
                        </div>
                        <a
                          href={KAKAO_LINK}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() =>
                            trackCtaClick("kakao_consult", "diagnosis_unsuitable")
                          }
                          className="pressable mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
                        >
                          카카오톡으로 별도 상담하기
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        safeCapture("diagnosis restarted", {
                          source: diagnosisSourceRef.current,
                        });
                        setStep(1);
                      }}
                      className="pressable rounded-2xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700"
                    >
                      다시 진단하기
                    </button>
                    <button
                      type="button"
                      onClick={closeDiagnosisModal}
                      className="pressable rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes reviewMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .pressable {
          box-shadow:
            0 14px 30px rgba(15, 23, 42, 0.08),
            0 4px 0 rgba(15, 23, 42, 0.09);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease,
            border-color 0.2s ease,
            background-color 0.2s ease;
        }

        .pressable:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 34px rgba(15, 23, 42, 0.12),
            0 6px 0 rgba(15, 23, 42, 0.1);
          filter: brightness(1.01);
        }

        .pressable:active {
          transform: translateY(1px);
          box-shadow:
            0 10px 20px rgba(15, 23, 42, 0.1),
            0 2px 0 rgba(15, 23, 42, 0.08);
        }

        .pressable:disabled {
          transform: none;
          box-shadow: none;
          filter: none;
        }

        .review-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .review-marquee-track {
          display: flex;
          width: max-content;
          animation: reviewMarquee 52s linear infinite;
          will-change: transform;
        }

        .review-marquee-group {
          display: flex;
          gap: 24px;
          flex-shrink: 0;
          padding-right: 24px;
        }

        .review-marquee-card {
          width: 320px;
          flex-shrink: 0;
        }

        .review-marquee:hover .review-marquee-track {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .review-marquee-card {
            width: 286px;
          }

          .review-marquee-track {
            animation-duration: 40s;
          }
        }
      `}</style>
    </>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";

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

const heroPoints = [
  "매년 국민 10만명이 정부제도를 이용해 대출금을 줄여왔습니다.",
  "과도한 빚으로 생활이 어려운 분들의 삶을 지켜드리는 안전한 제도입니다.",
  "전국 어디 계셔도 전문 로펌이 전 과정을 케어 해드립니다.",
];

const resultStats = [
  {
    label: "누적 상담수",
    value: "2,430+",
    percent: 86,
    desc:
      "많은 분들이 현재 채무 상황을 정리하기 위해 상담을 신청했고, 절차 가능성부터 먼저 확인해 왔습니다.",
    sub: "상담 유입 규모를 한눈에 보여주는 대표 지표입니다.",
  },
  {
    label: "수임 진행수",
    value: "780+",
    percent: 72,
    desc:
      "상담만으로 끝나지 않고 실제 개인회생·파산 절차 진행까지 이어진 케이스도 계속 누적되고 있습니다.",
    sub: "상담 → 검토 → 실제 진행으로 이어진 흐름을 보여주는 지표입니다.",
  },
  {
    label: "평균 탕감률",
    value: "68%",
    percent: 68,
    desc:
      "사건별 차이는 있지만, 월소득과 부양가족·최저생계비 구조에 맞춘 방향으로 부담을 줄여가는 사례가 이어지고 있습니다.",
    sub: "실제 운영 시에는 내부 실데이터 기준으로 바꿔 쓰면 됩니다.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "서류검토",
    desc:
      "기본 정보와 채무·소득·재산 상태를 먼저 확인하고 어떤 자료가 필요한지 정리합니다.",
  },
  {
    step: "02",
    title: "가능성 검토",
    desc:
      "개인회생 또는 파산 중 어떤 방향이 적합한지, 실제 진행 가능성이 있는지 검토합니다.",
  },
  {
    step: "03",
    title: "신청 준비",
    desc:
      "필요 서류를 바탕으로 절차를 준비하고 실제 신청 단계까지 이어질 수 있도록 진행합니다.",
  },
  {
    step: "04",
    title: "법원 절차",
    desc:
      "신청 이후 법원 절차에 맞춰 필요한 대응을 이어가며 흐름을 이해하기 쉽게 안내합니다.",
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

const faqItems = [
  {
    q: "개인회생을 하면 직장이나 가족에게 알려지나요?",
    a: "아닙니다. 개인회생 절차는 법원을 통해 진행되므로, 직장이나 가족에게 우편물이 발송되지 않도록 송달 장소를 사무실로 지정할 수 있습니다. 철저한 비밀 보장 하에 진행되니 안심하셔도 됩니다.",
  },
  {
    q: "빚이 얼마 이상이어야 신청 가능한가요?",
    a: "무담보 채무 1천만 원 이상, 담보부 채무 15억 원 이하인 경우 신청 가능합니다. 채무의 종류나 규모에 따라 전략이 달라지므로, 정확한 진단이 우선입니다.",
  },
  {
    q: "연체 중이 아니어도 신청할 수 있나요?",
    a: "네, 가능합니다. 연체 전이라도 채무 지급불능 상태가 예상된다면 신청할 수 있습니다. 오히려 연체 전 신청이 추심을 조기에 차단하고 심리적 안정을 찾는 데 훨씬 유리합니다.",
  },
  {
    q: "회생을 하면 신용카드를 못 쓰나요?",
    a: "2025년 7월부터 시행된 금융권 개정에 따라 개인회생 인가 후 1년간 변제금을 성실히 납부하면 한국신용정보원에 등록된 '1301(개인회생)' 공공기록 코드가 조기에 삭제되어 신용카드를 다시 사용하실 수 있게 됩니다.",
  },
  {
    q: "재산이 빚보다 많아도 신청할 수 있나요?",
    a: "개인회생은 '청산가치 보장의 원칙'에 따라, 본인의 재산보다 빚을 갚는 총액이 더 많아야 합니다. 재산이 많다면 개인회생보다는 다른 채무조정 제도가 적합할 수 있으니 전문가의 분석이 필수입니다.",
  },
  {
    q: "월 변제금은 어떻게 결정되나요?",
    a: "본인의 월 소득에서 최저생계비를 제외한 '가용소득' 전액을 3~5년간 변제하는 것이 원칙입니다. 부양가족 수와 소득 수준에 따라 변제금이 달라지므로, 최대한 낮추는 전략이 핵심입니다.",
  },
  {
    q: "기각되는 경우도 있나요?",
    a: "서류 미비, 변제계획안의 부적절성, 소득 증빙 부족 등으로 기각될 수 있습니다. 법률 전문가의 조력을 통해 처음부터 꼼꼼하게 준비하면 기각 확률을 획기적으로 낮출 수 있습니다.",
  },
  {
    q: "수임료가 부담되는데 분할 납부가 가능한가요?",
    a: "네, 경제적 어려움을 겪고 계신 의뢰인분들을 위해 수임료 분할 납부 시스템을 운영하고 있습니다. 비용 때문에 망설이지 마시고 먼저 상담을 통해 해결책을 찾으시길 권장합니다.",
  },
];

const officeInfo = [
  "대표변호사 : 김민석",
  "대한변호사협회 등록번호 : 제00000호",
  "주요 경력 : 도산·민사·채무조정 사건 다수 수행",
  "상담 방식 : 카카오톡 / 전화 / 방문 상담",
  "위치 : 서울시 서초구 서초대로42길 66 매일빌딩",
];

const footerLinks = ["자가진단", "진행 절차", "개인회생 후기", "자주 묻는 질문"];

const loadingMessages = [
  "월소득과 부양가족 수를 확인하고 있어요.",
  "2026년 기준 최저생계비를 반영하고 있어요.",
  "월 변제 가능금액과 36개월 총변제금을 계산하고 있어요.",
  "예상 탕감액과 적합 여부를 정리하고 있어요.",
];

function CircularStat({ label, value, percent, desc, sub }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference - (circumference * safePercent) / 100;

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <span className="rounded-full bg-[#fff7c2] px-3 py-1 text-xs font-bold text-[#6d5600]">
          {safePercent}%
        </span>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90 transform">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#fee500"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {label}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-base leading-7 text-slate-700">{desc}</p>
      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
        <p className="text-sm leading-6 text-slate-600">{sub}</p>
      </div>
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
      className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
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
  const vehicleValueWon = form.hasVehicle === "있음" ? toNumber(form.vehicleValue) * 10000 : 0;
  const totalAssetsWon = realEstateValueWon + depositValueWon + vehicleValueWon;
  const childCount = form.maritalStatus === "기혼" ? Number(form.minorChildren || 0) : 0;
  const familySize = Math.max(1, Math.min(7, 1 + (form.maritalStatus === "기혼" ? 1 : 0) + childCount));
  const minimumLivingCostWon = MINIMUM_LIVING_COST_2026[familySize] || MINIMUM_LIVING_COST_2026[7];
  const monthlyDisposableIncomeWon = Math.max(0, monthlyIncomeWon - minimumLivingCostWon);
  const expectedRepayment36Won = monthlyDisposableIncomeWon * 36;
  const estimatedInterestWon = totalDebtWon * 0.08 * 3;
  const totalClaimWon = totalDebtWon + estimatedInterestWon;
  const expectedTotalRepaymentWon = Math.min(totalClaimWon, expectedRepayment36Won);
  const expectedReductionWon = Math.max(0, totalClaimWon - expectedTotalRepaymentWon);
  const reductionRate = totalClaimWon > 0 ? (expectedReductionWon / totalClaimWon) * 100 : 0;

  const reasons = [];
  if (["휴직", "무직"].includes(form.occupation)) reasons.push("현재 직업이 휴직 또는 무직으로 선택되었습니다.");
  if (monthlyIncomeWon < 1530000) reasons.push("월 평균 소득이 153만원 미만으로 입력되었습니다.");
  if (totalAssetsWon > totalDebtWon) reasons.push("총 보유자산이 총 채무보다 많은 것으로 입력되었습니다.");

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
    if (form.maritalStatus === "기혼") return form.minorChildren !== "" && form.minorChildren !== null;
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

  const openDiagnosisModal = () => {
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
    setIsModalOpen(false);
    setStep(1);
    setProgress(0);
    setSubmitMessage("");
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      return;
    }
    if (step === 6) {
      setStep(7);
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 7) setStep(step - 1);
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
      <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5c00]">
                로가드 회생 / 국가채무조정제도
              </p>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
              <a href="#intro" className="hover:text-slate-900">소개</a>
              <a href="#results" className="hover:text-slate-900">성과 지표</a>
              <a href="#process" className="hover:text-slate-900">진행 절차</a>
              <a href="#reviews" className="hover:text-slate-900">후기</a>
              <a href="#faq" className="hover:text-slate-900">Q&A</a>
            </nav>

            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">
              매일법률사무소 로고
            </div>
          </div>
        </header>

        <section id="intro" className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,229,0,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-[#f3e483] bg-[#fff9d9] px-4 py-2 text-sm font-semibold text-[#6d5600]">
                30초 만에 확인해보세요!
              </div>

              <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                내 대출금,
                <br />
                얼마나 줄어드는지 알 수 있다고?
              </h2>

              <p className="mt-4 text-2xl font-extrabold leading-tight text-[#7a5c00] md:text-3xl">
                국가채무조정제도 간편 자가진단 서비스
              </p>

              <div className="mt-7 inline-flex flex-wrap items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                <span>자가진단자 평균 예상 탕감율 57%</span>
                <span className="text-slate-400">|</span>
                <span>최대 95% 원금 탕감</span>
              </div>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">
                소득, 채무규모, 재산 여부에 따라 전략이 달라집니다.
                <br />
                우선 30초 자가진단으로 자격 요건부터 확인해보세요!
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <a
                  href={KAKAO_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[28px] border border-slate-200 bg-white px-7 py-6 text-center text-lg font-extrabold text-slate-900 shadow-lg shadow-slate-200 transition hover:-translate-y-0.5"
                >
                  카카오톡 상담
                </a>

                <button
                  type="button"
                  onClick={openDiagnosisModal}
                  className="rounded-[28px] bg-slate-900 px-7 py-6 text-center text-lg font-extrabold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-black"
                >
                  채무탕감 자가진단
                </button>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {heroPoints.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm"
                  >
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fee500] text-sm font-extrabold text-slate-900">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fee500]"></p>
              <h3 className="mt-3 text-4xl font-extrabold leading-tight">
                혹시 나도 대출금을 줄일 수 있을까?
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                매달 돌아오는 대출 원리금 상환으로
                나와 사랑하는 가족의 생활이 
                <br/> 
                어려운 분이라면 이제 삶이 달라질 수 있습니다. 
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={KAKAO_LINK} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fee500] px-7 py-4 text-center text-sm font-bold text-slate-900">
                  카카오톡 빠른 상담
                </a>
                <button type="button" onClick={openDiagnosisModal} className="rounded-2xl border border-white/20 px-7 py-4 text-center text-sm font-bold text-white">
                  30초 자가진단 시작
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="rounded-[24px] bg-white p-5 text-slate-900">
                <p className="text-sm font-semibold text-slate-500">자가진단 확인 항목</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">직업과 월 평균 소득</div>
                  <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">혼인상태와 미성년 자녀 수</div>
                  <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">자산 대비 부채 규모</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Results</p>
            <h3 className="mt-3 text-4xl font-extrabold tracking-tight">
              여태 이 정도 사람들이 신청했고
              <br />
              <span className="text-[#7a5c00]">이 정도 결과를 보여줬습니다</span>
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resultStats.map((item) => (
              <CircularStat key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section id="process" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Process</p>
              <h3 className="mt-3 text-4xl font-extrabold tracking-tight">진행 절차</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                서류검토부터 가능성 검토, 신청 준비, 법원 절차까지 전체 흐름을 한눈에 볼 수 있게 구성했습니다.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              {processSteps.map((item) => (
                <div key={item.step} className="rounded-[30px] border border-slate-200 bg-[#f8fafc] p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#fff7c2] px-3 py-1 text-xs font-bold text-[#6d5600]">STEP {item.step}</span>
                  </div>
                  <div className="mt-5 flex h-40 items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-400">
                    사진 영역
                  </div>
                  <h4 className="mt-5 text-2xl font-extrabold text-slate-900">{item.title}</h4>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Reviews</p>
            <h3 className="mt-3 text-4xl font-extrabold tracking-tight">개인회생 후기</h3>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              후기 카드에 사진을 같이 넣을 수 있도록 구성했습니다. 이미지 파일만 교체하면 바로 사용할 수 있습니다.
            </p>
          </div>

          <div className="review-marquee">
            <div className="review-marquee-track">
              {[0, 1].map((groupIndex) => (
                <div className="review-marquee-group" key={groupIndex} aria-hidden={groupIndex === 1}>
                  {reviewCards.map((item, index) => (
                    <div key={`${groupIndex}-${index}`} className="review-marquee-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
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
                        <div className="inline-flex rounded-full bg-[#fff7c2] px-3 py-1 text-xs font-bold text-[#6d5600]">{item.name}</div>
                        <h4 className="mt-4 text-xl font-extrabold leading-snug">{item.title}</h4>
                        <p className="mt-4 text-base leading-8 text-slate-600">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Q&A</p>
              <h3 className="mt-3 text-4xl font-extrabold tracking-tight">개인회생, 자주 묻는 질문(FAQ)</h3>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.q} className="rounded-[30px] border border-slate-200 bg-[#f8fafc] p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fee500] text-sm font-extrabold text-slate-900">Q</div>
                    <div className="min-w-0">
                      <p className="text-lg font-extrabold leading-8 text-slate-900">{item.q}</p>
                      <div className="mt-4 rounded-2xl bg-white p-5">
                        <p className="text-base leading-8 text-slate-600">{item.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="office" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Law firm</p>
              <h3 className="mt-3 text-4xl font-extrabold tracking-tight">로펌 소개</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                대표변호사, 등록번호, 주요 경력, 회사 위치 등을 담는 구간입니다. 실제 정보로 교체하면 신뢰도를 높일 수 있습니다.
              </p>
              <div className="mt-8 space-y-3">
                {officeInfo.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-[420px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-[#f8fafc] text-base font-semibold text-slate-400">
                대표변호사 사진 / 사무실 사진 영역
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="rounded-[36px] bg-white/5 px-8 py-10 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fee500]">Final CTA</p>
              <h3 className="mt-3 text-4xl font-extrabold leading-tight">
                현재 상황이 애매할수록
                <br />
                먼저 자가진단과 상담으로 확인하세요
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                자가진단은 1차 예상 결과이며, 실제 사건은 추가 자료 검토가 필요합니다. 그래도 지금 방향을 잡는 데는 충분히 도움이 됩니다.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={KAKAO_LINK} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fee500] px-7 py-4 text-center text-sm font-bold text-slate-900">
                  카카오톡 채널 상담하기
                </a>
                <button type="button" onClick={openDiagnosisModal} className="rounded-2xl border border-white/15 px-7 py-4 text-center text-sm font-bold text-white">
                  채무탕감 자가진단 시작하기
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5c00]">Private consultation landing</p>
                <h4 className="mt-2 text-2xl font-extrabold text-slate-900">개인회생 · 파산 상담 랜딩페이지</h4>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                  대표번호, 회사명, 사업자 정보, 주소, 운영시간, 개인정보처리방침, 이용약관 링크를 실제 정보로 교체하면 됩니다.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">대표번호</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">1644-0000</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {footerLinks.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">Copyright © 2026. All rights reserved.</div>
          </div>
        </footer>

        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200">
            <a href={KAKAO_LINK} target="_blank" rel="noreferrer" className="rounded-xl bg-[#fee500] px-4 py-4 text-center text-sm font-bold text-slate-900">
              카톡 상담
            </a>
            <button type="button" onClick={openDiagnosisModal} className="rounded-xl bg-slate-900 px-4 py-4 text-center text-sm font-bold text-white">
              자격 자가진단
            </button>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[34px] bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeDiagnosisModal}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700"
            >
              ×
            </button>

            {step <= 6 && (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Self diagnosis</p>
                    <h3 className="mt-2 text-3xl font-extrabold tracking-tight">자격 자가진단</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{step} / 8</div>
                </div>

                <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#fee500] transition-all duration-300" style={{ width: `${(step / 8) * 100}%` }} />
                </div>

                {step === 1 && (
                  <div>
                    <h4 className="text-3xl font-extrabold leading-tight text-slate-900">현재 어떤 일을 하고 계신가요?</h4>
                    <p className="mt-3 text-base leading-7 text-slate-600">직업에 따라 유리한 제도가 달라져요!</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {OCCUPATIONS.map((option) => (
                        <StepOptionButton
                          key={option}
                          selected={form.occupation === option}
                          onClick={() => setForm((prev) => ({ ...prev, occupation: option }))}
                        >
                          {option}
                        </StepOptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h4 className="text-3xl font-extrabold leading-tight text-slate-900">월 평균 소득은 어느 정도 인가요?</h4>
                    <p className="mt-3 text-base leading-7 text-slate-600">소득을 고려해 탕감액을 계산해요!</p>
                    <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                      <label className="block text-sm font-bold text-slate-700">월 평균 소득</label>
                      <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                        <input
                          value={form.monthlyIncome}
                          onChange={(e) => setForm((prev) => ({ ...prev, monthlyIncome: e.target.value.replace(/[^0-9]/g, "") }))}
                          inputMode="numeric"
                          placeholder="예: 280"
                          className="w-full bg-transparent text-lg font-bold outline-none"
                        />
                        <span className="text-base font-bold text-slate-500">만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h4 className="text-3xl font-extrabold leading-tight text-slate-900">현재 혼인상태를 알려주세요</h4>
                    <p className="mt-3 text-base leading-7 text-slate-600">맞춤형 제도를 찾아드려요!</p>
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
                        <label className="block text-sm font-bold text-slate-700">미성년 자녀 수</label>
                        <div className="mt-4 grid grid-cols-5 gap-3">
                          {CHILD_OPTIONS.map((count) => (
                            <StepOptionButton
                              key={count}
                              selected={String(form.minorChildren) === String(count)}
                              onClick={() => setForm((prev) => ({ ...prev, minorChildren: String(count) }))}
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
                    <h4 className="text-3xl font-extrabold leading-tight text-slate-900">본인명의 차량이 있으신가요?</h4>
                    <p className="mt-3 text-base leading-7 text-slate-600">정확한 탕감액 계산에 필요해요!</p>
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
                        <label className="block text-sm font-bold text-slate-700">차량가액</label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.vehicleValue}
                            onChange={(e) => setForm((prev) => ({ ...prev, vehicleValue: e.target.value.replace(/[^0-9]/g, "") }))}
                            inputMode="numeric"
                            placeholder="예: 1200"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="text-base font-bold text-slate-500">만원</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h4 className="text-3xl font-extrabold leading-tight text-slate-900">현재 총 대출 금액은 얼마인가요?</h4>
                    <p className="mt-3 text-base leading-7 text-slate-600">신용대출과 담보대출을 나눠 입력해주세요.</p>
                    <div className="mt-8 grid gap-4">
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <label className="block text-sm font-bold text-slate-700">신용대출 금액</label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.creditLoan}
                            onChange={(e) => setForm((prev) => ({ ...prev, creditLoan: e.target.value.replace(/[^0-9]/g, "") }))}
                            inputMode="numeric"
                            placeholder="예: 4500"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="text-base font-bold text-slate-500">만원</span>
                        </div>
                      </div>
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <label className="block text-sm font-bold text-slate-700">담보대출 금액</label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.securedLoan}
                            onChange={(e) => setForm((prev) => ({ ...prev, securedLoan: e.target.value.replace(/[^0-9]/g, "") }))}
                            inputMode="numeric"
                            placeholder="예: 1500"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="text-base font-bold text-slate-500">만원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <h4 className="text-3xl font-extrabold leading-tight text-slate-900">총 보유자산은 얼마인가요?</h4>
                    <p className="mt-3 text-base leading-7 text-slate-600">대략적인 금액도 괜찮아요. 자산 항목을 나눠 입력해주세요.</p>
                    <div className="mt-8 grid gap-4">
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <label className="block text-sm font-bold text-slate-700">본인명의 소유 부동산 시세 금액</label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.realEstateValue}
                            onChange={(e) => setForm((prev) => ({ ...prev, realEstateValue: e.target.value.replace(/[^0-9]/g, "") }))}
                            inputMode="numeric"
                            placeholder="예: 5000"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="text-base font-bold text-slate-500">만원</span>
                        </div>
                      </div>
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <label className="block text-sm font-bold text-slate-700">전세 혹은 월세 보증금 금액</label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.depositValue}
                            onChange={(e) => setForm((prev) => ({ ...prev, depositValue: e.target.value.replace(/[^0-9]/g, "") }))}
                            inputMode="numeric"
                            placeholder="예: 1000"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="text-base font-bold text-slate-500">만원</span>
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
                    className="rounded-2xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!currentStepValid}
                    className="rounded-2xl bg-slate-900 px-7 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Self diagnosis</p>
                    <h3 className="mt-2 text-3xl font-extrabold tracking-tight">조회중</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">7 / 8</div>
                </div>
                <ProgressRing progress={progress} />
                <p className="mt-8 text-lg font-bold text-slate-900">잠시만 기다려주세요.</p>
                <p className="mt-3 text-base leading-8 text-slate-600">나에게 맞는 정부제도와 탕감예상금액을 조회하고 있어요!</p>
                <div className="mt-6 rounded-[28px] bg-slate-50 px-6 py-5 text-sm leading-7 text-slate-700">
                  {getLoadingMessage(progress)}
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">Diagnosis result</p>
                    <h3 className="mt-2 text-3xl font-extrabold tracking-tight">결과 요약</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">8 / 8</div>
                </div>

                <h4 className="text-2xl font-extrabold text-slate-900">
                  고객님의 결과 요약 <span className="text-slate-500">{resultDate} 기준</span>
                </h4>

                {diagnosis.suitable ? (
                  <div className="mt-8 space-y-6">
                    <div className="rounded-[30px] border border-slate-200 bg-[#fffdf0] p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">적합</p>
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
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.monthlyIncomeWon)}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <p className="text-sm font-bold text-slate-500">가구원 수 기준 최저생계비</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.minimumLivingCostWon)}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <p className="text-sm font-bold text-slate-500">월 변제 가능금액</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.monthlyDisposableIncomeWon)}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <p className="text-sm font-bold text-slate-500">36개월 예상 총변제금</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.expectedTotalRepaymentWon)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <p className="text-sm font-bold text-slate-500">원금</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.totalDebtWon)}</p>
                          <p className="mt-4 text-sm font-bold text-slate-500">이자(3년 8%)</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.estimatedInterestWon)}</p>
                        </div>

                        <div className="flex items-center justify-center text-4xl text-slate-300">↓</div>

                        <div className="rounded-2xl bg-[#fffdf0] p-5">
                          <p className="text-sm font-bold text-slate-500">예상 총변제금</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatManwonFromWon(diagnosis.expectedTotalRepaymentWon)}</p>
                          <p className="mt-4 text-sm font-bold text-slate-500">예상 탕감률</p>
                          <p className="mt-2 text-2xl font-extrabold text-[#7a5c00]">{Math.round(diagnosis.reductionRate)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">상담신청</p>
                      <h5 className="mt-3 text-2xl font-extrabold text-slate-900">적합 결과가 나왔다면 바로 상담신청을 남겨주세요</h5>
                      <form onSubmit={handleConsultSubmit} className="mt-6 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">이름</label>
                          <input
                            value={consultation.name}
                            onChange={(e) => setConsultation((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="이름을 입력해주세요"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-900"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">전화번호</label>
                          <input
                            value={consultation.phone}
                            onChange={(e) => setConsultation((prev) => ({ ...prev, phone: e.target.value.replace(/[^0-9-]/g, "") }))}
                            placeholder="010-0000-0000"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-900"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white disabled:bg-slate-300"
                        >
                          {isSubmitting ? "전송중..." : "상담신청 보내기"}
                        </button>
                        {submitMessage ? <p className="text-sm font-semibold text-slate-700">{submitMessage}</p> : null}
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 space-y-6">
                    <div className="rounded-[30px] border border-red-100 bg-red-50 p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">부적합</p>
                      <h5 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900">
                        부적합하여 상담신청이 불가합니다.
                      </h5>
                      <p className="mt-4 text-base leading-8 text-slate-700">
                        현재 입력한 정보 기준으로는 본 페이지의 개인회생 예상 계산 구조와 맞지 않아 자동 신청으로 연결되지 않습니다.
                      </p>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">확인된 사유</p>
                      <div className="mt-4 space-y-3">
                        {diagnosis.unsuitableReasons.map((reason) => (
                          <div key={reason} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">안내</p>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                        <p>입력한 정보는 1차 자동진단 기준이며 실제 사건은 추가 사실관계에 따라 달라질 수 있습니다.</p>
                        <p>현재 구조상 자동 신청은 열리지 않지만, 소득 구조나 채무 상황이 달라지면 결과가 달라질 수 있습니다.</p>
                        <p>정확한 검토가 필요하다면 카카오톡 채널로 현재 상황을 남겨주고 별도 상담을 받아보는 편이 좋습니다.</p>
                      </div>
                      <a
                        href={KAKAO_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
                      >
                        카카오톡으로 별도 상담하기
                      </a>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-2xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700"
                  >
                    다시 진단하기
                  </button>
                  <button
                    type="button"
                    onClick={closeDiagnosisModal}
                    className="rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes reviewMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
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
          width: 340px;
          flex-shrink: 0;
        }

        .review-marquee:hover .review-marquee-track {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .review-marquee-card {
            width: 300px;
          }

          .review-marquee-track {
            animation-duration: 40s;
          }
        }
      `}</style>
    </>
  );
}
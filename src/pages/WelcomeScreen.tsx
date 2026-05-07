import { useNavigate } from "react-router";

const previewProperties = [
  {
    title: "성대 정문 도보권 원룸",
    price: "500 / 55",
    desc: "정문 도보 12분 · 편의점 인접",
  },
  {
    title: "도서관 인접 원룸",
    price: "1000 / 60",
    desc: "조용한 학업 중심 생활권",
  },
  {
    title: "헬스장 근처 투룸",
    price: "800 / 65",
    desc: "헬스장 도보 3분 · 생활 인프라 우수",
  },
  {
    title: "성대역 인근 오피스텔",
    price: "1000 / 58",
    desc: "역세권 · 풀옵션 · 보안 우수",
  },
];

export default function WelcomeScreen() {
  const navigate = useNavigate();

  const marqueeProperties = [...previewProperties, ...previewProperties];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes floatTag {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-10px);
            }
          }

          .animate-marquee {
            animation: marquee 24s linear infinite;
          }

          .animate-float-tag {
            animation: floatTag 3s ease-in-out infinite alternate;
          }

          .animate-float-tag-delay-1 {
            animation: floatTag 3.4s ease-in-out infinite alternate-reverse;
          }

          .animate-float-tag-delay-2 {
            animation: floatTag 3.8s ease-in-out infinite alternate;
          }

          .animate-float-tag-delay-3 {
            animation: floatTag 4.2s ease-in-out infinite alternate-reverse;
          }

          .marquee-mask {
            mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          }
        `}
      </style>

      {/* Background Decorations */}
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] z-0 h-[320px] w-[320px] rounded-full bg-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] right-[-120px] z-0 h-[360px] w-[360px] rounded-full bg-border/70 blur-3xl" />
      <div className="pointer-events-none absolute right-[18%] top-[18%] z-0 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />

      {/* Top Visual Area */}
      <section className="relative z-10 flex h-[620px] w-full justify-center px-6 pt-10">
        {/* 3D iframe Area */}
        <div className="relative h-full w-full max-w-7xl overflow-hidden rounded-[36px] border border-border bg-card/50 shadow-sm backdrop-blur">
          <iframe
            src="https://my.spline.design/houserobot-9v1J5XwSYTaSLmx1pWDxwZhq/"
            frameBorder="0"
            title="3D rooming preview"
            className="h-full w-full border-none"
          />

          {/* Logo - iframe 좌측 상단 */}
          <div className="pointer-events-none absolute left-8 top-7 z-20 sm:left-8 sm:top-7">
            <div className="text-4xl font-bold tracking-[-0.04em] text-foreground drop-shadow-sm sm:text-4xl">
              rooming.
            </div>
          </div>

          {/* Main Description - iframe 우측 상단 */}
          {/* <div className="pointer-events-none absolute right-8 top-8 z-20 max-w-md text-right sm:right-8 sm:top-8">
            <div className="text-xl font-semibold text-text-secondary drop-shadow-sm sm:text-xl">
              AI 기반 3D 자취방 탐색 서비스
            </div>

            <div className="mt-3 text-sm leading-7 text-text-tertiary drop-shadow-sm sm:text-sm">
              학교 근처 매물, 생활 인프라, 3D 공간 정보를
              <br className="hidden sm:block" />
              한 번에 확인해보세요.
            </div>
          </div> */}

          {/* Floating Condition Tags */}
          <div className="pointer-events-none absolute left-6 top-[42%] z-20 sm:left-16">
            <div className="animate-float-tag rounded-full border border-beige-200 bg-card/85 px-4 py-2 text-sm font-semibold text-text-secondary shadow-md backdrop-blur">
              📍 성균관대 근처
            </div>
          </div>

          <div className="pointer-events-none absolute right-6 top-[36%] z-20 sm:right-20">
            <div className="animate-float-tag-delay-1 rounded-full border border-beige-200 bg-card/85 px-4 py-2 text-sm font-semibold text-text-secondary shadow-md backdrop-blur">
              💰 월세 50만원 이하
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-24 left-6 z-20 sm:left-24">
            <div className="animate-float-tag-delay-2 rounded-full border border-beige-200 bg-card/85 px-4 py-2 text-sm font-semibold text-text-secondary shadow-md backdrop-blur">
              🏋️ 헬스장 선호
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-16 right-6 z-20 sm:right-24">
            <div className="animate-float-tag-delay-3 rounded-full border border-beige-200 bg-card/85 px-4 py-2 text-sm font-semibold text-text-secondary shadow-md backdrop-blur">
              🏠 3D 공간 확인
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Content */}
      <section className="relative z-20 flex flex-col items-center px-6 pb-10">
        {/* Moving Preview Cards */}
        <div className="marquee-mask mt-8 w-full max-w-7xl overflow-hidden">
          <div className="animate-marquee flex w-max gap-4">
            {marqueeProperties.map((property, index) => (
              <div
                key={`${property.title}-${index}`}
                className="w-[280px] shrink-0 rounded-2xl border border-border bg-card/85 p-5 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-base font-bold text-foreground">
                  {property.title}
                </div>

                <div className="mt-2 text-sm font-semibold text-secondary">
                  보증금 / 월세 {property.price}
                </div>

                <div className="mt-2 text-sm leading-6 text-text-tertiary">
                  {property.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons - 기존 구성 유지 */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/onboarding")}
            className="min-w-[220px] rounded-xl bg-primary px-8 py-4.5 text-lg font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 hover:shadow-lg"
          >
            일반 사용자 로그인
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="min-w-[220px] rounded-xl border border-purple-500 bg-card px-8 py-4.5 text-lg font-semibold text-secondary transition-all hover:bg-purple-100"
          >
            관리자 로그인
          </button>
        </div>
      </section>
    </div>
  );
}

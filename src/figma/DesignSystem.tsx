import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Home, Search, Heart, Settings } from "lucide-react";
import { Container, PageDescription, PageHeader, PageTitle } from "./components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";


export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] py-12">
      <Container maxWidth="xl">
        <PageHeader>
          <PageTitle>rooming 디자인 시스템</PageTitle>
          <PageDescription>
            일관된 UI/UX를 위한 재사용 가능한 컴포넌트 라이브러리
          </PageDescription>
        </PageHeader>

        <div className="space-y-12">
          {/* Colors */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">컬러 팔레트</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#6B6847]">Primary (Green)</h3>
                <div className="grid grid-cols-7 gap-3">
                  <ColorSwatch color="#2A2820" name="900" />
                  <ColorSwatch color="#3A3520" name="800" />
                  <ColorSwatch color="#4A4530" name="700" />
                  <ColorSwatch color="#6B6847" name="600" />
                  <ColorSwatch color="#8B8850" name="500" />
                  <ColorSwatch color="#BDB96A" name="400" />
                  <ColorSwatch color="#FDFBD4" name="300" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#6B6847]">Secondary (Purple)</h3>
                <div className="grid grid-cols-7 gap-3">
                  <ColorSwatch color="#5A58AA" name="800" />
                  <ColorSwatch color="#8B89DD" name="600" />
                  <ColorSwatch color="#D8D7F5" name="300" />
                  <ColorSwatch color="#E8E7FF" name="200" />
                  <ColorSwatch color="#F8F8FF" name="100" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#6B6847]">Neutral (Beige)</h3>
                <div className="grid grid-cols-7 gap-3">
                  <ColorSwatch color="#FDFCF8" name="50" />
                  <ColorSwatch color="#F5F5E8" name="100" />
                  <ColorSwatch color="#E8E6DD" name="200" />
                  <ColorSwatch color="#EEECCA" name="300" />
                  <ColorSwatch color="#FFFFFF" name="white" />
                </div>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">버튼</h2>
            <Card>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button icon={Home} iconPosition="left">홈으로</Button>
                    <Button variant="secondary" icon={Search} iconPosition="left">검색</Button>
                    <Button variant="outline" icon={Heart} iconPosition="right">찜하기</Button>
                    <Button variant="ghost" icon={Settings}>설정</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">카드</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>기본 카드</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#6B6847]">
                    기본 스타일의 카드입니다. 대부분의 콘텐츠에 사용됩니다.
                  </p>
                </CardContent>
              </Card>

              <Card variant="purple">
                <CardHeader>
                  <CardTitle className="text-[#5A58AA]">보라색 카드</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#6B6847]">
                    세컨더리 액션이나 정보 표시에 사용됩니다.
                  </p>
                </CardContent>
              </Card>

              <Card variant="accent">
                <CardHeader>
                  <CardTitle className="text-[#8E3BA8]">액센트 카드</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#6B6847]">
                    특별한 강조가 필요한 콘텐츠에 사용됩니다.
                  </p>
                </CardContent>
              </Card>

              <Card variant="default" hoverable>
                <CardHeader>
                  <CardTitle>호버 가능 카드</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#6B6847]">
                    마우스를 올리면 효과가 나타납니다. 클릭 가능한 카드에 사용하세요.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">뱃지</h2>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">기본</Badge>
                    <Badge variant="purple">보라</Badge>
                    <Badge variant="accent">액센트</Badge>
                    <Badge variant="green">그린</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Usage Examples</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="purple">AI 추천</Badge>
                    <Badge variant="default">도보 12분</Badge>
                    <Badge variant="green">원룸</Badge>
                    <Badge variant="accent">신규</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Inputs */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">인풋</h2>
            <Card>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Text Input</h3>
                  <Input placeholder="텍스트를 입력하세요..." />
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Error State</h3>
                  <Input placeholder="에러 상태" error />
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#8B8850]">Textarea</h3>
                  <Textarea
                    rows={4}
                    placeholder="자세한 내용을 입력하세요..."
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Typography */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">타이포그래피</h2>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#4A4530]">Heading 1 - 30px Bold</h1>
                  <p className="mt-1 text-xs text-[#B8B69F]">페이지 제목</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#4A4530]">Heading 2 - 24px Bold</h2>
                  <p className="mt-1 text-xs text-[#B8B69F]">섹션 제목</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A4530]">Heading 3 - 20px Bold</h3>
                  <p className="mt-1 text-xs text-[#B8B69F]">서브 섹션 제목</p>
                </div>
                <div>
                  <p className="text-base text-[#6B6847]">Body Text - 16px Regular</p>
                  <p className="mt-1 text-xs text-[#B8B69F]">본문 텍스트</p>
                </div>
                <div>
                  <p className="text-sm text-[#8B8850]">Small Text - 14px Regular</p>
                  <p className="mt-1 text-xs text-[#B8B69F]">보조 정보</p>
                </div>
                <div>
                  <p className="text-xs text-[#B8B69F]">Caption - 12px Regular</p>
                  <p className="mt-1 text-xs text-[#B8B69F]">캡션, 라벨</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Spacing */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">간격 시스템</h2>
            <Card>
              <CardContent className="space-y-3">
                <SpacingExample size={1} label="4px - spacing-1" />
                <SpacingExample size={2} label="8px - spacing-2" />
                <SpacingExample size={3} label="12px - spacing-3" />
                <SpacingExample size={4} label="16px - spacing-4" />
                <SpacingExample size={5} label="20px - spacing-5" />
                <SpacingExample size={6} label="24px - spacing-6" />
                <SpacingExample size={8} label="32px - spacing-8" />
              </CardContent>
            </Card>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#4A4530]">Border Radius</h2>
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <RadiusExample radius="8px" label="sm" />
                  <RadiusExample radius="10px" label="md" />
                  <RadiusExample radius="12px" label="lg" />
                  <RadiusExample radius="16px" label="xl" />
                  <RadiusExample radius="24px" label="2xl" />
                  <RadiusExample radius="9999px" label="full" />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  );
}

// Helper Components
function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="text-center">
      <div
        className="mb-2 h-16 rounded-lg border border-[#E8E6DD] shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="text-xs font-medium text-[#6B6847]">{name}</div>
      <div className="text-xs text-[#B8B69F]">{color}</div>
    </div>
  );
}

function SpacingExample({ size, label }: { size: number; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="h-8 bg-[#BDB96A] rounded"
        style={{ width: `${size * 4}px` }}
      />
      <span className="text-sm text-[#6B6847]">{label}</span>
    </div>
  );
}

function RadiusExample({ radius, label }: { radius: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="mx-auto mb-2 h-16 w-16 bg-[#4A4530]"
        style={{ borderRadius: radius }}
      />
      <div className="text-xs font-medium text-[#6B6847]">{label}</div>
      <div className="text-xs text-[#B8B69F]">{radius}</div>
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

function Input({ error = false, className = "", ...props }: InputProps) {
  const errorStyles = error
    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
    : "border-[#E8E6DD] focus:border-[#BDB96A] focus:ring-[#FDFBD4]";

  return (
    <input
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#4A4530] placeholder:text-[#B8B69F] outline-none transition focus:ring-4 ${errorStyles} ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full resize-none rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm text-[#4A4530] placeholder:text-[#B8B69F] outline-none transition focus:border-[#BDB96A] focus:ring-4 focus:ring-[#FDFBD4] ${className}`}
      {...props}
    />
  );
}

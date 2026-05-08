export default function PrivacyPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-2xl font-bold text-white mb-2">개인정보처리방침</h1>
      <p className="text-gray-400 text-sm mb-8">최종 업데이트: 2024년 7월</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">1. 개요</h2>
        <p className="text-gray-300 leading-relaxed">
          주식 스크리너(이하 "서비스")는 이용자의 개인정보를 중요하게 여깁니다.
          본 개인정보처리방침은 서비스 이용 과정에서 수집되는 정보의 종류, 이용 목적, 보호 방법을 설명합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">2. 수집하는 정보</h2>
        <p className="text-gray-300 leading-relaxed mb-2">
          본 서비스는 회원가입 없이 이용 가능하며, 별도의 개인정보를 수집하지 않습니다.
          다만 서비스 품질 향상을 위해 다음 정보가 자동으로 수집될 수 있습니다:
        </p>
        <ul className="text-gray-300 space-y-1 list-disc list-inside">
          <li>접속 IP 주소 (서버 로그)</li>
          <li>브라우저 종류 및 운영체제 (서버 로그)</li>
          <li>방문 일시 및 이용한 서비스 항목</li>
          <li>광고 제공을 위한 쿠키 (Google AdSense)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">3. 쿠키 사용</h2>
        <p className="text-gray-300 leading-relaxed">
          본 서비스는 Google AdSense를 통해 광고를 제공합니다. Google은 쿠키를 사용하여
          이용자의 관심사에 맞는 광고를 표시할 수 있습니다. 이용자는 브라우저 설정에서
          쿠키를 비활성화할 수 있으나, 일부 서비스 기능이 제한될 수 있습니다.
          Google의 광고 쿠키 사용에 대한 자세한 내용은{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            Google 개인정보처리방침
          </a>을 참고하시기 바랍니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">4. 정보의 이용 목적</h2>
        <ul className="text-gray-300 space-y-1 list-disc list-inside">
          <li>서비스 운영 및 유지보수</li>
          <li>서비스 이용 통계 분석</li>
          <li>광고 제공 (Google AdSense)</li>
          <li>서비스 개선 및 신기능 개발</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">5. 제3자 제공</h2>
        <p className="text-gray-300 leading-relaxed">
          수집된 정보는 법령에 따른 경우를 제외하고 제3자에게 제공하지 않습니다.
          단, Google AdSense 광고 서비스 제공을 위해 Google LLC와 정보가 공유될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">6. 보유 및 파기</h2>
        <p className="text-gray-300 leading-relaxed">
          서버 로그는 최대 30일간 보관 후 자동 파기됩니다.
          광고 관련 쿠키는 Google의 정책에 따라 관리됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">7. 문의</h2>
        <p className="text-gray-300">
          개인정보 관련 문의사항이 있으시면 서비스 운영자에게 이메일로 연락해 주세요.
          본 방침은 관련 법령 변경 또는 서비스 변경에 따라 사전 고지 없이 수정될 수 있습니다.
        </p>
      </section>
    </article>
  )
}

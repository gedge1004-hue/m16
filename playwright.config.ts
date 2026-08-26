import { defineConfig, devices } from '@playwright/test';


function getTimestamp() {
    const date = new Date();
    // YYYY-MM-DD_HH-MM 형식으로 생성 (예: 2025-10-31_11-40)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');    
    return `${year}-${month}-${day}_${hours}-${minutes}`;
}

const runTimestamp = getTimestamp();

export default defineConfig({
  tsconfig: './tsconfig.json',
  testDir: './tests',
  // 테스트 시간 60초
  timeout: 150000,
  // 스냅샷 파일명에서 chrome-win32 등을 제거하는 설정
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  expect: {
    // 10초로 증가 (10 * 1000ms)
    timeout: 10000,
    toHaveScreenshot: {
      // 픽셀 비율 차이 허용 (0.1 ~ 0.2 추천)
      maxDiffPixelRatio: 0.1, 
      // 픽셀 개수 기준 허용 (작은 영역 테스트 시 유리)
      // maxDiffPixels: 100, 
      // 색상 차이 감도 (0~1 사이, 낮을수록 예민함)
      threshold: 0.2, 
      // 애니메이션/커서 등으로 인한 미세 차이 무시
      animations: 'disabled',
    },
  },
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // retry 1회
  retries: 0,
  // 테스트 1개씩 실행
  workers: 1,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  // 스크린샷 및 테스트 결과가 저장될 디렉토리
  outputDir: `./test-results/${runTimestamp}/%t`, 
  reporter: [
    ['html', {
      // 젠킨스(CI) 환경이면 'playwright-report'로 고정, 아니면 타임스탬프 사용
      outputFolder: process.env.CI ? 'playwright-report' : `./html-report/${runTimestamp}`,
      // 테스트 실행 후 자동으로 리포트 열기 비활성화
      open: 'never'
    }]
  ],

  use: {
    // 실패 시 리소스 저장 설정
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 브라우저 실행 설정
    browserName: 'chromium',
    // channel: 'chrome',
    headless: true,

    // 현재 창 최대 크기 구현 (에러 방지형)
    // viewport: null 대신 실제 모니터 해상도를 직접 입력하는 것이 가장 안전합니다.
    viewport: { width: 1920, height: 1080 }, 
    
    launchOptions: {
      // 실제 브라우저 창도 최대화 상태로 시작
      args: ['--window-size=1920,1080', '--window-position=0,0']
    },
  },
});

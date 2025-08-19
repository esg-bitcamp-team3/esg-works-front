# ESG Works

ESG Works는 ESG 데이터 관리부터 보고서 작성까지 지원하는 통합 플랫폼입니다.
국제 ESG 기준(GRI, SASB 등)에 기반한 체계적인 데이터 입력·관리와, 직관적인 시각화 및 보고서 자동화를 통해 기업의 지속가능경영 보고서 작성 효율성을 극대화합니다.

### 개요

1. **ESG 데이터 관리 체계화**
   - GRI, SASB 등 국제 ESG 기준에 부합하는 항목별 데이터 입력 및 관리 지원
   - 기업별 맞춤형 ESG 평가 기준 설정 가능 (산업 특성·전략·이해관계자 요구 반영)
2. **데이터 시각화**
   - 입력된 데이터를 기반으로 자동 차트 생성 (막대, 선, 파이, 레이더 차트 등)
   - 분석 기간, 색상, 축 설정, 필터링 등 커스텀 옵션 제공
3. **보고서 초안 작성**
   - 표준화된 보고서 템플릿 제공
   - PDF 변환 기능으로 외부 공유 및 프레젠테이션 지원

### 기술 스택
- **백엔드:** Spring Boot
- **프론트엔드:** Next.js, Slate.js, Chart.js
- **데이터베이스:** MongoDB

### 주요 기능
- ESG 데이터 입력 및 관리 (국제 기준 반영)
- 기업 맞춤형 평가 항목 설정
- 데이터 기반 시각화 (자동 차트 생성)
- 보고서 템플릿 기반 초안 작성
- PDF 변환 및 공유 기능

### 기능 상세 설명
1. **공시 데이터 관리**

   <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ee09fb48-4985-4c16-ba03-045fdf16b499" />

  GRI, SASB, TCFD와 같은 주요 공시 기준을 리스트 형식으로 제공하며 입력된 데이터는 템플릿과 연동되어 보고서 생성에 활용될 수 있습니다.
  
  기준에 따른 데이터 분류로 공시 목적에 맞춘 정리와 작성이 가능합니다.
  
2. **데이터 입력**

   <img width="1915" height="1078" alt="image" src="https://github.com/user-attachments/assets/04094599-3993-4046-b973-34c8ff1caa4d" />

   주요 공시 기준(GRI, SASB, TCFD)에 기반한 구조화된 입력 필드를 제공합니다.
   숫자/텍스트/날짜 등 입력값 형식 검증할 수 있습니다.

   기록된 과거 데이터를 손쉽게 불러와 수정 및 추가할 수 있습니다.

   
3. **회사별 고유 지표 목록 관리**

   <img width="1919" height="1075" alt="image" src="https://github.com/user-attachments/assets/24edadd9-5138-497d-bcfa-e49837a798d9" />

   <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3885afb4-3fe5-4128-b070-9a4171985b1e" />

   기업마다 필요한 지표를 추가하여 맞춤형 데이터 관리 가능합니다.

   손쉽게 새로운 지표를 추가하고 수정할 수 있습니다.

4. **고유 지표 세부 지표 관리**

   <img width="1919" height="1076" alt="image" src="https://github.com/user-attachments/assets/1ece8463-d5ee-46e7-99a4-9f1a2348e108" />

   사용자 정의의 세부 지표를 생성하여 유연한 데이터 구조를 관리할 수 있습니다.
   지표에 맞는 단위 설정하여 데이터 입력 시 유효성 검증할 수 있습니다.

   지표에 대한 설명을 입력하여 데이터 일관성을 확보 할 수 있습니다.

5. **보고서 생성**

   <img width="877" height="414" alt="image" src="https://github.com/user-attachments/assets/0fcff97a-114c-4c63-9a5c-af94004161c7" />

   표준화된 템플릿 기반으로 초안을 작성할 수 있습니다. 편집 중인 보고서는 자동 저장됩니다.

   작성 완료된 보고서는 클릭 한 번으로 PDF로 변환할 수 있습니다.

6. **보고서 템플릿**

   <img width="1912" height="901" alt="image" src="https://github.com/user-attachments/assets/7ec89a99-a838-459f-9ad5-97fbc47259db" />

   삼성전자, SK하이닉스, LG에너지솔루션 등 선도 기업의 지속가능경영보고서 구조를 참고하여 실제 공시 흐름에 최적화된 템플릿을 제공합니다.

   저장된 최신 데이터를 템플릿에 자동으로 적용하여 보고서를 쉽고 빠르게 완성할 수 있습니다.

7. **보고서에 데이터 불러오기**

   <img width="1917" height="903" alt="image" src="https://github.com/user-attachments/assets/f08544f6-cda3-4001-939c-aa9e1ff3c76c" />

   입력된 정성·정량 데이터를 불러와 본문에 복사/붙여넣기로 손쉽게 활용할 수 있습니다.

   카테고리와 검색어로 필요한 데이터를 빠르게 필터링하여 조회할 수 있습니다.

8. **데이터 시각화 - 테이블 생성하기**

   <img width="1917" height="903" alt="image" src="https://github.com/user-attachments/assets/add85fe6-5cdd-469c-93b9-ecfce0d34675" />

   입력된 정량 데이터를 기반으로 테이블을 생성할 수 있습니다.

   <img width="1330" height="863" alt="image" src="https://github.com/user-attachments/assets/96925fbe-eb7e-49bb-b581-c63a3aed513d" />


   열과 행을 삭제하여 테이블을 편집할 수 있습니다.

9. **데이터 시각화 - 차트 생성하기**

    <img width="2162" height="1482" alt="image" src="https://github.com/user-attachments/assets/ba7156e2-4085-4358-8761-08ccb45d063f" />

   기존에 입력된 데이터를 평가 기준별로 불러와 자동으로 차트를 구성할 수 있습니다.

   <img width="573" height="333" alt="image" src="https://github.com/user-attachments/assets/0878e87e-b4dc-431e-a8ad-1f104009993e" />

   선택한 지표의 행, 열 데이터 수정하여 표시될 차트의 데이터를 수정할 수 있습니다.

10. **데이터 시각화 - 차트 커스터마이징**

    <img width="573" height="333" alt="image" src="https://github.com/user-attachments/assets/9f9463e1-6465-49a5-8714-65039b9b5515" />

    바(bar), 선(line), 파이(pie), 도넛(donut), 혼합형 차트 등 다양한 종류의 차트를 제공합니다.

    <img width="1917" height="909" alt="image" src="https://github.com/user-attachments/assets/0fdde506-270c-4df5-97f7-8b36869a098c" />

    색상, 단위, 범례 위치, 축 라벨 등 디자인 및 항목 구성 자유롭게 설정할 수 있습니다.

    자주 사용하는 차트는 저장하거나 대시보드에 고정하여 재활용할 수 있습니다.

11. **보고서 차트 삽입**

    <img width="530" height="308" alt="image" src="https://github.com/user-attachments/assets/55599e65-a351-4ed0-acbf-0747ec9f78c8" />

    메뉴바에 있는 삽입 버튼을 통해 보고서 내 원하는 위치에 차트를 직접 삽입할 수 있습니다.

    다양한 레이아웃으로 차트와 텍스트를 자유롭게 배치할 수 있습니다.

    <img width="1917" height="903" alt="image" src="https://github.com/user-attachments/assets/1ffac83b-1c4f-4170-a255-a033fbead245" />

    **드래그 앤 드롭**으로 사이드바에 저장된 차트를 본문에 삽입할 수 있습니다.

    차트 크기를 자유롭게 조절할 수 있습니다.

12. **보고서 관리**

    ![Uploading image.png…]()

    보고서 제목, 생성자, 작성일, 수정일 기준으로 빠르게 원하는 문서 검색할 수 있습니다.

    자주 사용하는 보고서는 즐겨찾기로 등록하여 대시보드에서 바로 접근할 수 있습니다.

    생성자, 생성일, 마지막 편집자, 최종 수정일 등 수정 이력 정보를 제공합니다.

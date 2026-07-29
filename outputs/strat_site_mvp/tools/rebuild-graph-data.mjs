import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const LANES = [
  { person: "김정성", project: 1, client: 2, period: 3, firstRow: 3 },
  { person: "노병춘", project: 5, client: 6, period: 7, firstRow: 3 },
  { person: "박성원", project: 10, client: 11, period: 12, firstRow: 3 },
  { person: "박준영", project: 15, client: 16, period: 17, firstRow: 3 },
  { person: "STRATEGY", project: 19, client: 21, period: 20, firstRow: 4 }
];

const THEME_COPY = {
  "전략": {
    summary: "중장기 경영계획과 사업전략 수립 과제를 수행했습니다.",
    problem: "환경 변화와 내부 역량을 반영한 우선순위와 실행과제 정리가 필요한 과제",
    approach: "현황 진단과 환경분석을 거쳐 전략방향과 핵심과제를 도출",
    output: "전략체계, 핵심과제, 단계별 추진계획"
  },
  "조직": {
    summary: "조직진단과 조직구조·운영체계 개선 과제를 수행했습니다.",
    problem: "기능과 역할 변화가 조직구조와 운영기준에 충분히 반영되지 않은 과제",
    approach: "기능·업무량·의사결정 구조를 진단하고 조직 대안을 비교",
    output: "조직진단, 조직구조안, 기능·역할 조정안"
  },
  "직무·인사": {
    summary: "직무체계와 인력·보상 운영기준을 정비했습니다.",
    problem: "직무와 책임 수준을 반영한 인력·보상 기준이 필요한 과제",
    approach: "직무분석과 업무량 진단을 바탕으로 인사 운영기준을 설계",
    output: "직무체계, 인력산정 기준, 보상·배치 운영안"
  },
  "기타 자문": {
    summary: "경영 현안에 대한 분석과 자문을 수행했습니다.",
    problem: "주요 경영 현안에 대한 객관적 검토와 의사결정 기준이 필요한 과제",
    approach: "자료 검토와 이해관계자 의견 분석을 통해 대안과 판단기준을 정리",
    output: "현안 분석, 대안 비교, 실행 권고안"
  },
  "신사업·포트폴리오": {
    summary: "신사업과 사업 포트폴리오 검토 과제를 수행했습니다.",
    problem: "사업별 매력도와 기관 역할을 함께 고려한 선택 기준이 필요한 과제",
    approach: "시장성·공공성·내부역량을 기준으로 사업 대안을 평가",
    output: "사업 포트폴리오, 우선순위, 단계별 진입계획"
  },
  "ESG·공공가치": {
    summary: "ESG와 공공가치 전략·성과체계를 정비했습니다.",
    problem: "정책 요구와 기관 고유사업을 연결한 ESG·공공가치 체계가 필요한 과제",
    approach: "이해관계자와 핵심이슈를 분석하고 전략과 성과지표를 설계",
    output: "ESG·공공가치 체계, 추진과제, 성과지표"
  },
  "성과·운영": {
    summary: "성과관리와 사업 운영체계 개선 과제를 수행했습니다.",
    problem: "전략과 사업 운영을 연결하는 성과기준과 점검체계가 필요한 과제",
    approach: "성과구조와 운영자료를 분석해 지표·절차·책임을 재설계",
    output: "성과체계, 운영지표, 점검·환류 절차"
  },
  "디지털·데이터": {
    summary: "디지털 전환과 데이터 활용 과제를 수행했습니다.",
    problem: "업무와 의사결정에 데이터를 적용할 실행기준이 필요한 과제",
    approach: "업무 흐름과 데이터 현황을 진단하고 적용과제를 선정",
    output: "디지털 전환과제, 데이터 활용안, 추진 로드맵"
  },
  "재무·가치": {
    summary: "재무구조와 가치 제고 방안을 검토했습니다.",
    problem: "사업성과와 재무 영향을 함께 고려한 개선 대안이 필요한 과제",
    approach: "재무·사업자료를 분석해 가치동인과 개선 우선순위를 도출",
    output: "재무 분석, 가치동인, 개선 실행안"
  }
};

async function loadArtifactTool() {
  try {
    return await import("@oai/artifact-tool");
  } catch (initialError) {
    const roots = [
      process.env.CODEX_NODE_MODULES,
      process.env.USERPROFILE && path.join(
        process.env.USERPROFILE,
        ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
      ),
      process.env.HOME && path.join(
        process.env.HOME,
        ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
      )
    ].filter(Boolean);
    for (const root of roots) {
      try {
        const requireFromRuntime = createRequire(pathToFileURL(path.join(root, "__codex_loader__.cjs")));
        const entry = requireFromRuntime.resolve("@oai/artifact-tool");
        return await import(pathToFileURL(entry).href);
      } catch {
        // Try the next configured runtime.
      }
    }
    throw new Error(
      `@oai/artifact-tool을 찾지 못했습니다. CODEX_NODE_MODULES를 설정해 주세요. (${initialError.message})`
    );
  }
}

function text(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function keyFor(project, client) {
  return `${text(project).toLocaleLowerCase("ko-KR")}|${text(client).toLocaleLowerCase("ko-KR")}`;
}

function classifyTheme(project) {
  const value = text(project);
  if (/전략|비전|경영계획|중장기|발전계획|로드맵/i.test(value)) return "전략";
  if (/조직|기능조정|거버넌스/i.test(value)) return "조직";
  if (/직무|인사|보수|임금|인력|정원|노무|채용|평가급/i.test(value)) return "직무·인사";
  if (/신사업|포트폴리오|M&A|사업타당|시장조사/i.test(value)) return "신사업·포트폴리오";
  if (/ESG|탄소|공공가치|사회적가치|지속가능/i.test(value)) return "ESG·공공가치";
  if (/성과|KPI|지표|평가체계|운영체계/i.test(value)) return "성과·운영";
  if (/디지털|데이터|정보화|인공지능|\bAI\b/i.test(value)) return "디지털·데이터";
  if (/재무|재정|가치평가|\bIR\b|원가/i.test(value)) return "재무·가치";
  return "기타 자문";
}

function classifyInstitution(client) {
  const value = text(client);
  if (/대학교|대학\b|교육대학교/.test(value)) return "대학·교육";
  if (/재단|협회|협의회|연합회|조합/.test(value)) return "재단·협회";
  if (/시청|도청|군청|구청|광역시|특별시|정부|중앙부처|부$|청$/.test(value)) return "정부·지자체";
  if (/공사/.test(value)) return "공기업·공사";
  if (/진흥원|진흥공단|진흥재단/.test(value)) return "준정부·진흥기관";
  if (/연구원|개발원|평가원|교육원|시험원|연구소/.test(value)) return "연구·전문기관";
  if (/주식회사|\(주\)|㈜|그룹|전자|화학|건설|제약|은행|보험|증권|캐피탈/.test(value)) return "민간기업";
  return "공공·전문기관";
}

function extractYear(period, project) {
  return text(period).match(/20\d{2}/)?.[0] || text(project).match(/20\d{2}/)?.[0] || "";
}

function collectUniqueProjects(matrix) {
  const records = new Map();
  LANES.forEach((lane) => {
    for (let rowIndex = lane.firstRow; rowIndex < matrix.length; rowIndex += 1) {
      const row = matrix[rowIndex] || [];
      const project = text(row[lane.project]);
      const client = text(row[lane.client]);
      const period = text(row[lane.period]);
      if (!project || !client || project === "프로젝트명" || client === "발주기관" || client === "발주처") continue;
      const key = keyFor(project, client);
      const current = records.get(key) || {
        project,
        client,
        period,
        people: new Set()
      };
      current.people.add(lane.person);
      if (!current.period && period) current.period = period;
      records.set(key, current);
    }
  });
  return [...records.values()];
}

function publicProjection(sourceRecords) {
  const sorted = sourceRecords
    .map((record) => ({
      ...record,
      theme: classifyTheme(record.project),
      institutionType: classifyInstitution(record.client),
      year: extractYear(record.period, record.project)
    }))
    .sort((a, b) =>
      Number(b.year || 0) - Number(a.year || 0) ||
      a.theme.localeCompare(b.theme, "ko-KR") ||
      a.institutionType.localeCompare(b.institutionType, "ko-KR") ||
      a.project.localeCompare(b.project, "ko-KR")
    );

  return sorted.map((record, index) => {
    const copy = THEME_COPY[record.theme];
    const experts = [...record.people].filter((person) => person !== "STRATEGY");
    if (!experts.length) experts.push("STRATEGY");
    const year = record.year || "연도 확인 중";
    const hash = createHash("sha256")
      .update(`${record.client}|${record.project}|${record.period}`)
      .digest("hex")
      .slice(0, 10);
    return {
      id: `exp-${hash}`,
      code: `P-${String(index + 1).padStart(3, "0")}`,
      group: "case",
      label: `${record.institutionType} · ${record.theme} · ${year}`,
      shortLabel: `${record.theme} ${record.year ? record.year.slice(-2) : "—"}`,
      institutionType: record.institutionType,
      theme: record.theme,
      year,
      experts,
      summary: copy.summary,
      problem: copy.problem,
      approach: copy.approach,
      output: copy.output,
      proof: `${experts.join(" · ")} 참여 · 수행실적 원본 대조 가능`
    };
  });
}

export async function rebuildGraphData(inputPath, outputPath) {
  const { SpreadsheetFile } = await loadArtifactTool();
  const workbookBytes = new Uint8Array(await readFile(inputPath));
  const workbook = await SpreadsheetFile.importXlsx(workbookBytes);
  const sheet = workbook.sheets.getItem("참여인력별 실적 모음");
  if (!sheet || sheet.isNullObject) throw new Error("시트 '참여인력별 실적 모음'을 찾지 못했습니다.");
  const matrix = sheet.getRange("A1:V5000").values;
  const privateRecords = collectUniqueProjects(matrix);
  const records = publicProjection(privateRecords);
  const years = records.map((record) => Number(record.year)).filter((year) => year >= 1900);
  const payload = {
    meta: {
      sourceType: "project-performance-workbook",
      generatedAt: new Date().toISOString().slice(0, 10),
      projectCount: records.length,
      yearRange: [Math.min(...years), Math.max(...years)],
      privacy: "고객명과 원문 프로젝트명은 공개 데이터에서 제외함"
    },
    themes: Object.keys(THEME_COPY),
    institutionTypes: [...new Set(records.map((record) => record.institutionType))],
    experts: [...new Set(records.flatMap((record) => record.experts).filter((person) => person !== "STRATEGY"))],
    records
  };
  const serialized = `${JSON.stringify(payload, null, 2)}\n`;
  const leakedClient = privateRecords.find((record) => record.client.length >= 3 && serialized.includes(record.client));
  const leakedProject = privateRecords.find((record) => record.project.length >= 6 && serialized.includes(record.project));
  if (leakedClient || leakedProject) throw new Error("비식별 공개 데이터에 원문 고객명 또는 프로젝트명이 포함됐습니다.");
  await writeFile(outputPath, serialized, "utf8");
  return payload.meta;
}

const isDirectRun = typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] ||
    path.resolve(path.dirname(process.argv[1]), "../static/graph-experience.json");
  if (!inputPath) {
    console.error("사용법: node tools/rebuild-graph-data.mjs <실적.xlsx> [출력.json]");
    process.exitCode = 1;
  } else {
    const meta = await rebuildGraphData(path.resolve(inputPath), path.resolve(outputPath));
    console.log(`그래프 데이터 ${meta.projectCount}건 생성: ${outputPath}`);
  }
}

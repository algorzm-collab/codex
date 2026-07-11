import json
import os
import secrets
import sqlite3
import hashlib
import hmac
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "strat_site.sqlite3"
SECRET_PATH = DATA_DIR / "admin_secret.txt"
ADMIN_PASSWORD = os.environ.get("STRAT_ADMIN_PASSWORD", "strat-admin")


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def admin_secret():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if SECRET_PATH.exists():
        return SECRET_PATH.read_text(encoding="utf-8").strip()
    value = secrets.token_hex(32)
    SECRET_PATH.write_text(value, encoding="utf-8")
    return value


def make_admin_token():
    issued = str(int(datetime.now(timezone.utc).timestamp()))
    nonce = secrets.token_hex(12)
    payload = f"{issued}:{nonce}"
    sig = hmac.new(admin_secret().encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"


def valid_admin_token(token):
    try:
        issued, nonce, sig = token.split(":", 2)
        payload = f"{issued}:{nonce}"
        expected = hmac.new(admin_secret().encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return False
        age = int(datetime.now(timezone.utc).timestamp()) - int(issued)
        return 0 <= age <= 86400
    except Exception:
        return False


def init_db():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                organization TEXT NOT NULL,
                phone TEXT,
                email TEXT NOT NULL,
                consent INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS mailing_subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT NOT NULL,
                organization TEXT,
                email TEXT NOT NULL,
                phone TEXT,
                source TEXT NOT NULL DEFAULT 'signup',
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS issue_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                session_id TEXT NOT NULL,
                symptom TEXT,
                scene TEXT,
                need TEXT,
                inferred_type TEXT NOT NULL,
                result_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT NOT NULL,
                organization TEXT,
                phone TEXT,
                email TEXT,
                message TEXT NOT NULL,
                inferred_type TEXT,
                status TEXT NOT NULL DEFAULT 'new',
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS qa_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT NOT NULL,
                organization TEXT,
                email TEXT,
                title TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT,
                status TEXT NOT NULL DEFAULT 'open',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS cases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                customer_type TEXT NOT NULL,
                problem TEXT NOT NULL,
                approach TEXT NOT NULL,
                deliverables TEXT NOT NULL,
                solution_cluster TEXT NOT NULL,
                display_order INTEGER NOT NULL DEFAULT 100,
                is_published INTEGER NOT NULL DEFAULT 1,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS key_slides (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                image_url TEXT,
                link_url TEXT,
                display_order INTEGER NOT NULL DEFAULT 100,
                is_published INTEGER NOT NULL DEFAULT 1,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS project_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                theme TEXT NOT NULL,
                sector TEXT NOT NULL,
                client TEXT NOT NULL,
                project_title TEXT NOT NULL,
                year_note TEXT,
                display_order INTEGER NOT NULL DEFAULT 100,
                is_published INTEGER NOT NULL DEFAULT 1,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_name TEXT NOT NULL,
                session_id TEXT,
                user_id INTEGER,
                path TEXT,
                source_section TEXT,
                inferred_type TEXT,
                target_id TEXT,
                target_title TEXT,
                metadata_json TEXT,
                created_at TEXT NOT NULL
            );
            """
        )
        case_count = conn.execute("SELECT COUNT(*) FROM cases").fetchone()[0]
        if case_count == 0:
            seed_cases(conn)
        sync_strategy_cases(conn)
        slide_count = conn.execute("SELECT COUNT(*) FROM key_slides").fetchone()[0]
        if slide_count == 0:
            seed_slides(conn)
        sync_strategy_slides(conn)
        sync_project_records(conn)


def seed_cases(conn):
    items = [
        (
            "공공기관 전략-KPI 연계체계 정비",
            "Public Institution",
            "중장기전략은 있었지만 경영평가 지표와 부서 실행과제가 분리되어 있었습니다.",
            "정책환경, 기관 역할, 전략과제, KPI를 하나의 실행 구조로 재정렬했습니다.",
            "전략체계도, KPI 맵, 실행과제 로드맵",
            "전략체계 정렬 / KPI 및 성과관리체계",
            10,
        ),
        (
            "조직진단 및 R&R 재정립",
            "Organization",
            "조직개편 이후에도 부서 간 역할 혼선과 의사결정 지연이 반복되었습니다.",
            "부서별 핵심업무, 책임, 권한, 위임전결 기준을 재정리했습니다.",
            "조직진단 리포트, R&R 매트릭스, 위임전결 개선안",
            "조직구조 및 R&R",
            20,
        ),
        (
            "성과관리체계 및 평가 운영 개선",
            "Performance",
            "KPI는 많았지만 평가와 피드백이 실제 성과 향상으로 이어지지 않았습니다.",
            "전사-부서-개인 지표와 평가 운영방식을 연결해 연중 관리체계로 전환했습니다.",
            "KPI 재설계안, 평가 운영안, 성과 모니터링 구조",
            "KPI 및 성과관리체계",
            30,
        ),
    ]
    conn.executemany(
        """
        INSERT INTO cases (
            title, customer_type, problem, approach, deliverables,
            solution_cluster, display_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [(*item, now_iso()) for item in items],
    )


def ensure_case(conn, title, customer_type, problem, approach, deliverables, solution_cluster, display_order):
    exists = conn.execute("SELECT id FROM cases WHERE title=?", (title,)).fetchone()
    if exists:
        return
    conn.execute(
        """
        INSERT INTO cases (
            title, customer_type, problem, approach, deliverables,
            solution_cluster, display_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (title, customer_type, problem, approach, deliverables, solution_cluster, display_order, now_iso()),
    )


def upsert_featured_case(conn, title, customer_type, problem, approach, deliverables, solution_cluster, display_order):
    exists = conn.execute("SELECT id FROM cases WHERE title=?", (title,)).fetchone()
    if exists:
        conn.execute(
            """
            UPDATE cases
            SET customer_type=?, problem=?, approach=?, deliverables=?,
                solution_cluster=?, display_order=?, is_published=1, updated_at=?
            WHERE title=?
            """,
            (customer_type, problem, approach, deliverables, solution_cluster, display_order, now_iso(), title),
        )
        return
    ensure_case(conn, title, customer_type, problem, approach, deliverables, solution_cluster, display_order)


def sync_strategy_cases(conn):
    featured = [
        (
            "신용보증기금 뉴비전 수립",
            "Financial Public Institution",
            "정책금융기관으로서 미래 역할과 새 비전, 전략방향을 재정의해야 하는 과제였습니다.",
            "환경 변화와 기관 역할을 재해석하고 비전-전략방향-실행과제를 연결하는 전략체계를 구성했습니다.",
            "뉴비전, 전략방향, 전략과제, 실행 로드맵",
            "전략체계 정렬",
            1,
        ),
        (
            "해양진흥공사 중장기 경영전략 수립",
            "Marine Finance Public Institution",
            "해양산업 정책환경 변화 속에서 기관의 중장기 방향성과 사업 포트폴리오를 재정렬해야 했습니다.",
            "정책환경, 기관 역할, 사업전략을 연결해 중장기 경영전략과 실행과제를 설계했습니다.",
            "중장기 경영전략, 전략과제, 실행 로드맵",
            "전략체계 정렬",
            2,
        ),
        (
            "한국주택금융공사 부점성과평가 고도화",
            "Financial Public Institution",
            "부점 성과평가가 전략과 현장 업무성과를 충분히 설명하지 못하는 상황이었습니다.",
            "전략과 부점 단위 성과지표, 평가 운영방식을 연결해 성과관리 체계를 고도화했습니다.",
            "부점 KPI, 평가 운영안, 성과관리 개선안",
            "KPI 및 성과관리체계",
            3,
        ),
        (
            "강원도개발공사 평창 올림픽 레거시 활용전략",
            "Regional Development Corporation",
            "평창 올림픽 이후 레거시 자산을 지역개발과 기관 전략으로 연결해야 하는 과제였습니다.",
            "올림픽 레거시의 활용 가능성과 기관 역할을 재정의하고 중장기 경영전략 및 조직재설계 방향을 도출했습니다.",
            "레거시 활용방안, 중장기 경영전략, 조직재설계 방향",
            "전략체계 정렬 / 조직구조 및 R&R",
            4,
        ),
        (
            "한국도로공사 미래사업과제 및 미래도로 전략",
            "Infrastructure Public Institution",
            "4차산업 혁명, 드론, 미래도로 등 기술 변화에 대응하는 신규 사업과제를 발굴해야 했습니다.",
            "기술·정책 변화와 도로공사의 역할을 연결해 미래사업과제와 대응전략을 도출했습니다.",
            "미래사업과제, 드론 종합전략, 미래도로 대응전략",
            "전략체계 정렬 / AI·DT 전환",
            5,
        ),
        (
            "K-UAM 및 UAM Team Korea 대응전략",
            "Infrastructure / Mobility",
            "도심항공교통(UAM) 정책 변화와 Team Korea 참여 맥락에서 기관의 대응전략이 필요한 상황이었습니다.",
            "UAM 정책·산업 변화와 기관 역할을 분석해 대응전략, 과제맵, 실행 우선순위를 구성했습니다.",
            "K-UAM 대응전략, 과제맵, 실행 로드맵",
            "전략체계 정렬 / AI·DT 전환",
            6,
        ),
    ]
    for item in featured:
        upsert_featured_case(conn, *item)

    defaults = [
        (
            "신용보증기금 뉴비전 수립",
            "금융 공공기관",
            "정책환경 변화에 맞는 새 비전과 전략체계가 필요한 상황이었습니다.",
            "기관 역할과 미래 방향성을 재정의하고 비전-전략과제-실행 논리를 구성했습니다.",
            "뉴비전, 전략방향, 실행과제 체계",
            "전략체계 정렬",
            11,
        ),
        (
            "주택금융공사 부점성과평가 고도화",
            "금융 공공기관",
            "부점 성과평가가 전략과 실제 업무성과를 충분히 설명하지 못하는 상황이었습니다.",
            "성과지표와 평가 운영방식을 점검하고 부점 단위 성과관리 체계를 정비했습니다.",
            "부점 KPI, 평가 운영안, 성과관리 개선안",
            "KPI 및 성과관리체계",
            12,
        ),
        (
            "해양진흥공사 중장기 경영전략 수립",
            "환경·해양 공공기관",
            "기관의 중장기 방향성과 사업 포트폴리오를 재정렬해야 하는 과제였습니다.",
            "정책환경과 기관 역할을 분석해 전략체계와 실행과제를 설계했습니다.",
            "중장기 경영전략, 전략과제, 로드맵",
            "전략체계 정렬",
            21,
        ),
        (
            "해양환경공단 경영전략 고도화 및 조직재설계",
            "환경·해양 공공기관",
            "전략 고도화와 조직 재설계가 함께 필요한 상황이었습니다.",
            "전략 방향과 조직 역할을 동시에 점검해 실행 가능한 운영체계로 연결했습니다.",
            "경영전략 고도화안, 조직재설계안, 실행 로드맵",
            "전략체계 정렬 / 조직구조 및 R&R",
            22,
        ),
        (
            "한국환경공단 조직진단 및 인력운영계획",
            "환경 공공기관",
            "조직 역할과 인력 운영 기준을 재정비해야 하는 과제였습니다.",
            "조직구조, 업무, 인력 배분을 진단하고 운영계획을 수립했습니다.",
            "조직진단 리포트, 인력운영계획, 개선과제",
            "조직구조 및 R&R",
            23,
        ),
        (
            "한국도로공사 K-UAM 대응전략 수립",
            "도시·인프라 공공기관",
            "미래 모빌리티 정책 변화에 대응하는 전략 방향이 필요한 상황이었습니다.",
            "정책·시장 변화와 기관 역할을 연결해 대응전략과 실행과제를 구성했습니다.",
            "대응전략, 과제맵, 실행 로드맵",
            "전략체계 정렬 / AI·DT 전환",
            31,
        ),
        (
            "한전원자력연료 조직재설계",
            "에너지 공공기관",
            "에너지 정책 변화 속에서 조직 운영체계를 재정렬해야 하는 과제였습니다.",
            "전략 환경 변화에 맞춰 조직 역할과 운영 구조를 재설계했습니다.",
            "조직재설계안, R&R, 실행과제",
            "조직구조 및 R&R",
            41,
        ),
        (
            "원자력환경공단 조직진단 및 재설계",
            "에너지 공공기관",
            "반복적인 조직 이슈와 역할 정렬 문제가 존재하는 상황이었습니다.",
            "조직진단을 바탕으로 역할, 구조, 실행체계를 재정비했습니다.",
            "조직진단, 조직재설계안, 실행 로드맵",
            "조직구조 및 R&R",
            42,
        ),
    ]
    for item in defaults:
        ensure_case(conn, *item)


def seed_slides(conn):
    items = [
        (
            "전략-조직-성과 연결 맵",
            "전략이 KPI, R&R, 실행과제로 내려오는 경로를 한 화면에서 보여주는 핵심 장표입니다.",
            "",
            "",
            10,
        ),
        (
            "R&R 매트릭스",
            "부서별 핵심업무, 책임, 협업관계, 의사결정 권한을 정리하는 장표입니다.",
            "",
            "",
            20,
        ),
        (
            "성과 모니터링 구조",
            "평가가 연말 이벤트로 끝나지 않도록 연중 점검과 피드백 구조를 설계합니다.",
            "",
            "",
            30,
        ),
    ]
    conn.executemany(
        """
        INSERT INTO key_slides (
            title, summary, image_url, link_url, display_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        """,
        [(*item, now_iso()) for item in items],
    )


def ensure_slide(conn, title, summary, display_order):
    exists = conn.execute("SELECT id FROM key_slides WHERE title=?", (title,)).fetchone()
    if exists:
        return
    conn.execute(
        """
        INSERT INTO key_slides (
            title, summary, image_url, link_url, display_order, updated_at
        ) VALUES (?, ?, '', '', ?, ?)
        """,
        (title, summary, display_order, now_iso()),
    )


def sync_strategy_slides(conn):
    defaults = [
        (
            "Fermat Point Methodology",
            "Sein과 Sollen의 최적 수렴점을 찾는 STRATEGY의 8단계 문제해결 프레임워크입니다.",
            5,
        ),
        (
            "1st Advisory Positioning",
            "공공기관과 기업 경영을 위한 1st Advisory 그룹으로서 문제 인식부터 성과평가까지 연결합니다.",
            6,
        ),
        (
            "10개 섹터 전문성",
            "금융, 환경, 해양, 도시·인프라, 에너지, 산업진흥, 보건복지, R&D, 국방, 교육·문화·체육 섹터 경험을 축적했습니다.",
            7,
        ),
    ]
    for item in defaults:
        ensure_slide(conn, *item)


def ensure_project_record(conn, theme, sector, client, project_title, year_note, display_order):
    exists = conn.execute(
        "SELECT id FROM project_records WHERE theme=? AND sector=? AND client=? AND project_title=?",
        (theme, sector, client, project_title),
    ).fetchone()
    if exists:
        return
    conn.execute(
        """
        INSERT INTO project_records (
            theme, sector, client, project_title, year_note, display_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (theme, sector, client, project_title, year_note, display_order, now_iso()),
    )


def sync_project_records(conn):
    records = [
        ("Strategy 전략수립", "Infrastructure", "한국도로공사", "4차산업 혁명에 따른 미래사업과제 도출", "", 101),
        ("Strategy 전략수립", "Infrastructure", "한국도로공사", "EXTV 발전방안 수립", "", 102),
        ("Strategy 전략수립", "Infrastructure", "한국도로공사", "도로산업 재설정 한국형 뉴딜 전략 수립", "", 103),
        ("Strategy 전략수립", "Infrastructure", "한국도로공사", "드론 종합전략 수립", "", 104),
        ("Strategy 전략수립", "Infrastructure", "한국도로공사", "K-UAM 대응전략 수립 및 미래도로 대응전략 수립", "", 105),
        ("Strategy 전략수립", "Infrastructure", "UAM Team Korea", "K-UAM 대응 및 미래 모빌리티 전략 과제", "", 105),
        ("Strategy 전략수립", "Infrastructure", "한국교통안전공단", "중장기 2030 경영전략 수립", "", 106),
        ("Strategy 전략수립", "Infrastructure", "강원도개발공사", "중장기 경영전략 수립 및 조직재설계, 평창 올림픽 레거시 활용방안", "", 107),
        ("Strategy 전략수립", "Infrastructure", "강원도개발공사", "알펜시아 매각에 따른 비전 전략 수립", "2021, 2022", 108),
        ("Strategy 전략수립", "Infrastructure", "경북개발공사", "중장기 마스터플랜 수립", "", 109),
        ("Strategy 전략수립", "Infrastructure", "충북개발공사", "중장기 경영전략 수립 및 조직 재설계", "", 110),
        ("Strategy 전략수립", "Infrastructure", "울산도시공사", "중장기 전략경영 변경 계획수립", "2019, 2022, 2023, 2024", 111),
        ("Strategy 전략수립", "Infrastructure", "경기도시공사", "비전 2040 수립", "", 112),
        ("Strategy 전략수립", "Infrastructure", "인천도시공사", "비전 2030 수립", "", 113),
        ("Strategy 전략수립", "Infrastructure", "한국토지주택공사", "사회적가치 전략수립", "", 114),
        ("Strategy 전략수립", "Infrastructure", "대한건설기계관리원", "연구조직 발전방향", "", 115),
        ("Strategy 전략수립", "Infrastructure", "한국탄소산업진흥원", "중기경영목표 수립", "", 116),
        ("Strategy 전략수립", "Infrastructure", "축산물품질평가원", "중장기 전략고도화 및 경영평가 코칭", "", 117),
        ("Strategy 전략수립", "Infrastructure", "한국특허전략개발원", "중장기 전략 수립", "", 118),
        ("Strategy 전략수립", "Environment", "해양환경공단", "경영전략 고도화 조직 및 전략재수립", "2019", 201),
        ("Strategy 전략수립", "Environment", "해양환경공단", "경영전략 고도화 조직 및 전략재수립", "2021", 202),
        ("Strategy 전략수립", "Environment", "해양생물자원관", "2030 중장기 경영전략 수립", "", 203),
        ("Strategy 전략수립", "Financial", "신용보증기금", "뉴비전 수립", "", 301),
        ("Strategy 전략수립", "Financial", "해양진흥공사", "중장기 경영전략 수립", "2020, 2023", 302),
        ("Strategy 전략수립", "Financial", "서울신용보증재단", "중장기 조직 재설계", "", 303),
        ("Strategy 전략수립", "Financial", "기술보증기금", "중장기 조직 재설계", "", 304),
        ("Strategy 전략수립", "Financial", "중소벤처진흥공단", "성과관리 고도화", "", 305),
        ("Strategy 전략수립", "Education", "한국잡월드", "적정 입장료 산정 및 마케팅전략 수립", "", 401),
        ("Strategy 전략수립", "ICT & Contents", "LG Uplus", "AI 전략수립 Scenario Planning", "", 501),
        ("Strategy 전략수립", "ICT & Contents", "BIPA 부산", "AR VR 산업전략수립", "", 502),
        ("Strategy 전략수립", "ICT & Contents", "경기콘텐츠진흥원", "중장기 전략수립", "", 503),
        ("Strategy 전략수립", "ICT & Contents", "전남정보문화진흥원", "ICT 전략수립", "", 504),
        ("Strategy 전략수립", "Health and welfare", "한국보건산업진흥원", "중장기 전략수립", "2023, 2024", 601),
        ("Strategy 전략수립", "Health and welfare", "중앙사회서비스원", "기관전략수립", "", 602),
        ("Strategy 전략수립", "Health and welfare", "한국건강증진개발원", "중장기 전략 수립", "2023", 603),
        ("Organization & Personnel 조직재설계", "Financial", "기술보증기금", "조직재설계", "", 701),
        ("Organization & Personnel 조직재설계", "Financial", "서울신용보증재단", "조직재설계", "", 702),
        ("Organization & Personnel 조직재설계", "Aerospace", "항공우주연구원", "우주전문기관 지정에 따른 중장기 조직 재설계", "", 801),
        ("Organization & Personnel 조직재설계", "Energy", "한전원자력연료", "탈원전 시대 중장기 조직 재설계", "2018, 2020, 2022", 901),
        ("Organization & Personnel 조직재설계", "Energy", "가스기술공사", "직무분석 및 조직 재설계", "", 902),
        ("Organization & Personnel 조직재설계", "Energy", "원자력환경공단", "조직진단 및 재설계", "2020, 2022, 2024", 903),
        ("Organization & Personnel 조직재설계", "Energy", "한국교원대학교", "직무분석 및 조직재설계", "", 904),
        ("Organization & Personnel 조직재설계", "Sports", "국민체육진흥공단", "시나리오별 적정인력산정 수립", "", 1001),
        ("Organization & Personnel 조직재설계", "Agriculture", "축산물품질평가원", "조직재설계 및 정원재산정", "", 1101),
        ("Organization & Personnel 조직재설계", "산업진흥", "서울산업진흥원", "직무분석 기반 중장기 인력운영계획 수립", "", 1201),
        ("Organization & Personnel 조직재설계", "산업진흥", "한국콘텐츠진흥원", "직무분석 및 중장기 인력운영 방안 수립", "", 1202),
        ("Organization & Personnel 조직재설계", "국방", "국방과학연구소", "인사 제도 체계 수립", "", 1301),
        ("Organization & Personnel 조직재설계", "국방", "국방과학연구소", "조직 진단", "", 1302),
        ("Organization & Personnel 조직재설계", "국방", "국방기술품질원", "조직진단", "", 1303),
        ("Organization & Personnel 조직재설계", "국방", "국방기술진흥연구소", "직무분석 및 적정인력산정", "", 1304),
        ("Performance Management 성과관리", "Financial", "해양진흥공사", "성과관리체계수립", "", 1401),
        ("Performance Management 성과관리", "Financial", "한국주택금융공사", "부점성과평가 Facilitator", "", 1402),
        ("Performance Management 성과관리", "Financial", "주택도시보증공사", "부서성과평가 간사", "", 1403),
        ("Performance Management 성과관리", "Financial", "해양진흥공사", "부서성과평가 간사", "", 1404),
        ("Performance Management 성과관리", "Financial", "중소벤처기업진흥공단", "성과관리체계 고도화", "", 1405),
        ("Performance Management 성과관리", "ODA", "국제협력단", "내부성과평가 평가위원", "2018", 1501),
        ("Performance Management 성과관리", "ODA", "국제협력단", "내외평가 연계방안 컨설팅", "", 1502),
        ("Performance Management 성과관리", "ODA", "코이카", "해외사무소 성과평가위원", "", 1503),
        ("Performance Management 성과관리", "Education", "한국보건복지인력개발원", "부서성과지표 개선 자문위원", "", 1601),
        ("Performance Management 성과관리", "Design", "서울디자인재단", "성과평가체계 및 사업평가체계 고도화", "", 1701),
        ("Performance Management 성과관리", "Design", "서울디자인재단", "조직성과평가", "", 1702),
        ("Performance Management 성과관리", "Infra", "국토정보공사LX", "성과평가체계 및 지표개선", "", 1801),
        ("HR System 인사관리", "Financial", "해양진흥공사", "합리적 인사 보수 체계수립", "", 1901),
        ("HR System 인사관리", "ICT & Contents", "광주정보문화진흥원", "보수체계 수립", "", 1902),
        ("HR System 인사관리", "Infra", "울산항만공사", "직무 중심 직무분류, 평가, 보수체계 재설계", "", 1903),
        ("HR System 인사관리", "ICT", "네이버클라우드", "보수체계 설계", "", 1904),
        ("HR System 인사관리", "Contents", "한국콘텐츠진흥원", "K-콘텐츠 수출지원을 위한 인사제도 설계", "", 1905),
    ]
    for item in records:
        ensure_project_record(conn, *item)


ISSUE_RESULTS = {
    "strategy_org_performance_gap": {
        "problem_name": "전략-조직-성과 연결부 약화",
        "headline": "이 문제는 단순한 전략수립 문제가 아니라 ‘전략-조직-성과 연결부 약화’에 가까워 보입니다.",
        "interpretation": "전략은 존재하지만 부서별 역할, KPI, 평가 방식이 한 방향으로 연결되지 않으면 실행력이 떨어집니다. 이 경우 새 전략을 다시 쓰기보다 기존 전략이 조직과 성과체계로 내려오는 경로를 먼저 봐야 합니다.",
        "related_experience": "strategy는 유사한 공공기관 과제에서 전략체계, 부서 실행과제, KPI를 하나의 구조로 재정렬한 경험이 있습니다.",
        "hypothesis_solution": ["전략-KPI 맵 점검", "부서별 R&R 매트릭스 구성", "실행과제 로드맵 정리", "성과 모니터링 체계 설계"],
        "cta": "우리 조직도 해당되는지 strategy에 문의하기",
    },
    "rr_role_confusion": {
        "problem_name": "R&R 및 조직역할 혼선",
        "headline": "이 상황은 조직개편보다 먼저 R&R과 권한체계를 정리해야 하는 신호일 수 있습니다.",
        "interpretation": "조직도는 바뀌어도 역할과 책임이 명확하지 않으면 같은 혼선이 반복됩니다. 이 경우 조직구조보다 부서별 핵심업무, 의사결정 권한, 책임소재를 먼저 봐야 합니다.",
        "related_experience": "strategy는 조직진단 및 R&R 재정립 과제에서 부서별 역할, 위임전결, 실행과제를 함께 정리한 경험이 있습니다.",
        "hypothesis_solution": ["부서별 핵심업무 진단", "R&R 매트릭스 설계", "위임전결체계 개선", "조직구조 개선안 도출"],
        "cta": "조직 역할 혼선에 대해 strategy에 문의하기",
    },
    "performance_system_failure": {
        "problem_name": "KPI/성과관리 작동 불량",
        "headline": "현재 문제는 KPI가 부족한 것이 아니라 성과를 움직이는 운영체계가 약한 상태일 수 있습니다.",
        "interpretation": "지표가 많아도 전략과 업무, 평가, 피드백이 연결되지 않으면 성과관리는 형식화됩니다. 이 경우 KPI 수를 늘리는 것보다 성과관리 운영 방식을 재설계해야 합니다.",
        "related_experience": "strategy는 KPI 및 성과관리체계 개선 과제에서 전사-부서-개인 지표와 평가 운영방식을 연결한 경험이 있습니다.",
        "hypothesis_solution": ["전략-KPI 연계성 진단", "부서/개인 KPI 재설계", "평가제도 운영안 개선", "연중 성과 모니터링 체계 구축"],
        "cta": "KPI/성과관리 문제를 strategy에 문의하기",
    },
    "transformation_execution_gap": {
        "problem_name": "전환과제 실행화 미흡",
        "headline": "현재 상황은 AI/ESG 과제를 선언이 아니라 실행과제와 지표로 바꿔야 하는 단계일 수 있습니다.",
        "interpretation": "새로운 전환 과제는 기술 도입이나 슬로건만으로 작동하지 않습니다. 업무, 조직, 성과지표, 실행 로드맵으로 내려와야 실제 변화가 만들어집니다.",
        "related_experience": "strategy는 전환 과제를 전략, 실행 로드맵, 성과지표로 연결하는 과제 설계 경험을 축적해왔습니다.",
        "hypothesis_solution": ["전환 과제맵 구성", "적용 우선순위 설정", "실행 로드맵 설계", "성과지표 및 운영체계 설계"],
        "cta": "전환과제 실행화에 대해 strategy에 문의하기",
    },
}


RELATED_PROJECT_THEMES = {
    "strategy_org_performance_gap": ["Strategy 전략수립", "Performance Management 성과관리"],
    "rr_role_confusion": ["Organization & Personnel 조직재설계", "HR System 인사관리"],
    "performance_system_failure": ["Performance Management 성과관리"],
    "transformation_execution_gap": ["Strategy 전략수립"],
}


ROUTE_BY_SYMPTOM = {
    "report_no_execution": "strategy_org_performance_gap",
    "unclear_owner": "rr_role_confusion",
    "too_many_kpi": "performance_system_failure",
    "evaluation_not_accepted": "performance_system_failure",
    "reorg_no_standard": "rr_role_confusion",
    "transformation_not_actionable": "transformation_execution_gap",
}


def read_json(handler):
    length = int(handler.headers.get("Content-Length", "0"))
    raw = handler.rfile.read(length).decode("utf-8") if length else "{}"
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def row_to_dict(row):
    return {key: row[key] for key in row.keys()}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location):
        self.send_response(HTTPStatus.FOUND)
        self.send_header("Location", location)
        self.end_headers()

    def admin_cookie(self):
        raw = self.headers.get("Cookie", "")
        for part in raw.split(";"):
            if "=" not in part:
                continue
            key, value = part.strip().split("=", 1)
            if key == "strat_admin":
                return value
        return ""

    def is_admin(self):
        return valid_admin_token(self.admin_cookie())

    def require_admin_json(self):
        if self.is_admin():
            return True
        self.send_json({"error": "admin login required"}, HTTPStatus.UNAUTHORIZED)
        return False

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/content":
            with connect() as conn:
                cases = [
                    row_to_dict(row)
                    for row in conn.execute(
                        "SELECT * FROM cases WHERE is_published=1 ORDER BY display_order, id"
                    )
                ]
                slides = [
                    row_to_dict(row)
                    for row in conn.execute(
                        "SELECT * FROM key_slides WHERE is_published=1 ORDER BY display_order, id"
                    )
                ]
                project_records = [
                    row_to_dict(row)
                    for row in conn.execute(
                        "SELECT * FROM project_records WHERE is_published=1 ORDER BY display_order, id"
                    )
                ]
            self.send_json({"cases": cases, "slides": slides, "project_records": project_records})
            return
        if path == "/api/admin/records":
            if not self.require_admin_json():
                return
            with connect() as conn:
                event_summary = {
                    "total": conn.execute("SELECT COUNT(*) FROM analytics_events").fetchone()[0],
                    "by_event": [
                        row_to_dict(r)
                        for r in conn.execute(
                            """
                            SELECT event_name AS name, COUNT(*) AS count
                            FROM analytics_events
                            GROUP BY event_name
                            ORDER BY count DESC, name
                            """
                        )
                    ],
                    "by_inferred_type": [
                        row_to_dict(r)
                        for r in conn.execute(
                            """
                            SELECT COALESCE(NULLIF(inferred_type, ''), 'unknown') AS name, COUNT(*) AS count
                            FROM analytics_events
                            GROUP BY COALESCE(NULLIF(inferred_type, ''), 'unknown')
                            ORDER BY count DESC, name
                            """
                        )
                    ],
                    "by_target": [
                        row_to_dict(r)
                        for r in conn.execute(
                            """
                            SELECT COALESCE(NULLIF(target_title, ''), NULLIF(target_id, ''), 'none') AS name, COUNT(*) AS count
                            FROM analytics_events
                            GROUP BY COALESCE(NULLIF(target_title, ''), NULLIF(target_id, ''), 'none')
                            ORDER BY count DESC, name
                            LIMIT 12
                            """
                        )
                    ],
                }
                payload = {
                    "users": [row_to_dict(r) for r in conn.execute("SELECT * FROM users ORDER BY id DESC LIMIT 100")],
                    "mailing": [row_to_dict(r) for r in conn.execute("SELECT * FROM mailing_subscribers ORDER BY id DESC LIMIT 100")],
                    "issues": [row_to_dict(r) for r in conn.execute("SELECT * FROM issue_records ORDER BY id DESC LIMIT 100")],
                    "inquiries": [row_to_dict(r) for r in conn.execute("SELECT * FROM inquiries ORDER BY id DESC LIMIT 100")],
                    "qa": [row_to_dict(r) for r in conn.execute("SELECT * FROM qa_posts ORDER BY id DESC LIMIT 100")],
                    "cases": [row_to_dict(r) for r in conn.execute("SELECT * FROM cases ORDER BY display_order, id")],
                    "slides": [row_to_dict(r) for r in conn.execute("SELECT * FROM key_slides ORDER BY display_order, id")],
                    "project_records": [row_to_dict(r) for r in conn.execute("SELECT * FROM project_records ORDER BY display_order, id")],
                    "events": [row_to_dict(r) for r in conn.execute("SELECT * FROM analytics_events ORDER BY id DESC LIMIT 200")],
                    "event_summary": event_summary,
                }
            self.send_json(payload)
            return
        if path == "/login":
            self.path = "/login.html"
            super().do_GET()
            return
        if path == "/admin":
            if not self.is_admin():
                self.redirect("/login")
                return
            self.path = "/admin.html"
        elif path == "/":
            self.path = "/index.html"
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        data = read_json(self)
        if path == "/api/admin/login":
            password = str(data.get("password", ""))
            if hmac.compare_digest(password, ADMIN_PASSWORD):
                token = make_admin_token()
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Set-Cookie", f"strat_admin={token}; Path=/; HttpOnly; SameSite=Lax")
                body = json.dumps({"ok": True}, ensure_ascii=False).encode("utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            self.send_json({"error": "invalid password"}, HTTPStatus.UNAUTHORIZED)
            return
        if path == "/api/admin/logout":
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Set-Cookie", "strat_admin=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax")
            body = json.dumps({"ok": True}, ensure_ascii=False).encode("utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path == "/api/signup":
            required = ["name", "organization", "email"]
            if any(not str(data.get(key, "")).strip() for key in required):
                self.send_json({"error": "name, organization, email are required"}, HTTPStatus.BAD_REQUEST)
                return
            with connect() as conn:
                cur = conn.execute(
                    """
                    INSERT INTO users (name, organization, phone, email, consent, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data.get("name", "").strip(),
                        data.get("organization", "").strip(),
                        data.get("phone", "").strip(),
                        data.get("email", "").strip(),
                        1 if data.get("consent") else 0,
                        now_iso(),
                    ),
                )
                user_id = cur.lastrowid
                if data.get("consent"):
                    conn.execute(
                        """
                        INSERT INTO mailing_subscribers (
                            user_id, name, organization, email, phone, source, created_at
                        ) VALUES (?, ?, ?, ?, ?, 'signup', ?)
                        """,
                        (
                            user_id,
                            data.get("name", "").strip(),
                            data.get("organization", "").strip(),
                            data.get("email", "").strip(),
                            data.get("phone", "").strip(),
                            now_iso(),
                        ),
                    )
            self.send_json({"ok": True, "user_id": user_id})
            return
        if path == "/api/issue":
            inferred = data.get("inferred_type") or ROUTE_BY_SYMPTOM.get(data.get("symptom"), "strategy_org_performance_gap")
            result = dict(ISSUE_RESULTS.get(inferred, ISSUE_RESULTS["strategy_org_performance_gap"]))
            with connect() as conn:
                related_projects = self.related_projects(conn, inferred)
            result["related_projects"] = related_projects
            session_id = data.get("session_id") or secrets.token_hex(12)
            with connect() as conn:
                cur = conn.execute(
                    """
                    INSERT INTO issue_records (
                        user_id, session_id, symptom, scene, need, inferred_type,
                        result_json, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data.get("user_id"),
                        session_id,
                        data.get("symptom", ""),
                        data.get("scene", ""),
                        data.get("need", ""),
                        inferred,
                        json.dumps(result, ensure_ascii=False),
                        now_iso(),
                    ),
                )
            self.send_json({"ok": True, "record_id": cur.lastrowid, "session_id": session_id, "inferred_type": inferred, "result": result})
            return
        if path == "/api/event":
            allowed = {
                "issue_finder_start",
                "issue_result_view",
                "proof_jump_click",
                "case_contact_cta_click",
                "contact_form_start",
                "contact_form_submit",
            }
            event_name = str(data.get("event_name", ""))[:80]
            if event_name not in allowed:
                self.send_json({"error": "unsupported event_name"}, HTTPStatus.BAD_REQUEST)
                return
            metadata = data.get("metadata") or {}
            if not isinstance(metadata, dict):
                metadata = {"value": str(metadata)}
            with connect() as conn:
                cur = conn.execute(
                    """
                    INSERT INTO analytics_events (
                        event_name, session_id, user_id, path, source_section,
                        inferred_type, target_id, target_title, metadata_json, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        event_name,
                        str(data.get("session_id") or "")[:120],
                        data.get("user_id"),
                        str(data.get("path") or "")[:300],
                        str(data.get("source_section") or "")[:120],
                        str(data.get("inferred_type") or "")[:120],
                        str(data.get("target_id") or "")[:120],
                        str(data.get("target_title") or "")[:300],
                        json.dumps(metadata, ensure_ascii=False)[:2000],
                        now_iso(),
                    ),
                )
            self.send_json({"ok": True, "id": cur.lastrowid})
            return
        if path == "/api/inquiry":
            if not data.get("name") or not data.get("message"):
                self.send_json({"error": "name and message are required"}, HTTPStatus.BAD_REQUEST)
                return
            with connect() as conn:
                cur = conn.execute(
                    """
                    INSERT INTO inquiries (
                        user_id, name, organization, phone, email, message,
                        inferred_type, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data.get("user_id"),
                        data.get("name", "").strip(),
                        data.get("organization", "").strip(),
                        data.get("phone", "").strip(),
                        data.get("email", "").strip(),
                        data.get("message", "").strip(),
                        data.get("inferred_type", ""),
                        now_iso(),
                    ),
                )
            self.send_json({"ok": True, "inquiry_id": cur.lastrowid})
            return
        if path == "/api/qa":
            if not data.get("name") or not data.get("title") or not data.get("question"):
                self.send_json({"error": "name, title, question are required"}, HTTPStatus.BAD_REQUEST)
                return
            with connect() as conn:
                cur = conn.execute(
                    """
                    INSERT INTO qa_posts (
                        user_id, name, organization, email, title, question,
                        status, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?)
                    """,
                    (
                        data.get("user_id"),
                        data.get("name", "").strip(),
                        data.get("organization", "").strip(),
                        data.get("email", "").strip(),
                        data.get("title", "").strip(),
                        data.get("question", "").strip(),
                        now_iso(),
                        now_iso(),
                    ),
                )
            self.send_json({"ok": True, "qa_id": cur.lastrowid})
            return
        if path == "/api/admin/case":
            if not self.require_admin_json():
                return
            self.upsert_case(data)
            return
        if path == "/api/admin/slide":
            if not self.require_admin_json():
                return
            self.upsert_slide(data)
            return
        if path == "/api/admin/project-record":
            if not self.require_admin_json():
                return
            self.upsert_project_record(data)
            return
        if path == "/api/admin/delete":
            if not self.require_admin_json():
                return
            self.soft_delete(data)
            return
        self.send_json({"error": "not found"}, HTTPStatus.NOT_FOUND)

    def upsert_case(self, data):
        fields = ["title", "customer_type", "problem", "approach", "deliverables", "solution_cluster"]
        if any(not str(data.get(key, "")).strip() for key in fields):
            self.send_json({"error": "missing required case fields"}, HTTPStatus.BAD_REQUEST)
            return
        with connect() as conn:
            if data.get("id"):
                conn.execute(
                    """
                    UPDATE cases
                    SET title=?, customer_type=?, problem=?, approach=?, deliverables=?,
                        solution_cluster=?, display_order=?, is_published=?, updated_at=?
                    WHERE id=?
                    """,
                    (
                        data["title"], data["customer_type"], data["problem"], data["approach"],
                        data["deliverables"], data["solution_cluster"], int(data.get("display_order") or 100),
                        1 if data.get("is_published", True) else 0, now_iso(), data["id"]
                    ),
                )
                item_id = data["id"]
            else:
                cur = conn.execute(
                    """
                    INSERT INTO cases (
                        title, customer_type, problem, approach, deliverables,
                        solution_cluster, display_order, is_published, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data["title"], data["customer_type"], data["problem"], data["approach"],
                        data["deliverables"], data["solution_cluster"], int(data.get("display_order") or 100),
                        1 if data.get("is_published", True) else 0, now_iso()
                    ),
                )
                item_id = cur.lastrowid
        self.send_json({"ok": True, "id": item_id})

    def upsert_slide(self, data):
        if not data.get("title") or not data.get("summary"):
            self.send_json({"error": "title and summary are required"}, HTTPStatus.BAD_REQUEST)
            return
        with connect() as conn:
            if data.get("id"):
                conn.execute(
                    """
                    UPDATE key_slides
                    SET title=?, summary=?, image_url=?, link_url=?, display_order=?,
                        is_published=?, updated_at=?
                    WHERE id=?
                    """,
                    (
                        data["title"], data["summary"], data.get("image_url", ""),
                        data.get("link_url", ""), int(data.get("display_order") or 100),
                        1 if data.get("is_published", True) else 0, now_iso(), data["id"]
                    ),
                )
                item_id = data["id"]
            else:
                cur = conn.execute(
                    """
                    INSERT INTO key_slides (
                        title, summary, image_url, link_url, display_order,
                        is_published, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data["title"], data["summary"], data.get("image_url", ""),
                        data.get("link_url", ""), int(data.get("display_order") or 100),
                        1 if data.get("is_published", True) else 0, now_iso()
                    ),
                )
                item_id = cur.lastrowid
        self.send_json({"ok": True, "id": item_id})

    def soft_delete(self, data):
        table = data.get("table")
        item_id = data.get("id")
        if table not in {"cases", "key_slides", "project_records"} or not item_id:
            self.send_json({"error": "table must be cases, key_slides, or project_records and id is required"}, HTTPStatus.BAD_REQUEST)
            return
        with connect() as conn:
            conn.execute(
                f"UPDATE {table} SET is_published=0, updated_at=? WHERE id=?",
                (now_iso(), item_id),
            )
        self.send_json({"ok": True})

    def upsert_project_record(self, data):
        fields = ["theme", "sector", "client", "project_title"]
        if any(not str(data.get(key, "")).strip() for key in fields):
            self.send_json({"error": "theme, sector, client, project_title are required"}, HTTPStatus.BAD_REQUEST)
            return
        with connect() as conn:
            if data.get("id"):
                conn.execute(
                    """
                    UPDATE project_records
                    SET theme=?, sector=?, client=?, project_title=?, year_note=?,
                        display_order=?, is_published=?, updated_at=?
                    WHERE id=?
                    """,
                    (
                        data["theme"], data["sector"], data["client"], data["project_title"],
                        data.get("year_note", ""), int(data.get("display_order") or 100),
                        1 if data.get("is_published", True) else 0, now_iso(), data["id"]
                    ),
                )
                item_id = data["id"]
            else:
                cur = conn.execute(
                    """
                    INSERT INTO project_records (
                        theme, sector, client, project_title, year_note,
                        display_order, is_published, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data["theme"], data["sector"], data["client"], data["project_title"],
                        data.get("year_note", ""), int(data.get("display_order") or 100),
                        1 if data.get("is_published", True) else 0, now_iso()
                    ),
                )
                item_id = cur.lastrowid
        self.send_json({"ok": True, "id": item_id})

    def related_projects(self, conn, inferred):
        themes = RELATED_PROJECT_THEMES.get(inferred, ["Strategy 전략수립"])
        placeholders = ",".join("?" for _ in themes)
        rows = conn.execute(
            f"""
            SELECT theme, sector, client, project_title, year_note
            FROM project_records
            WHERE is_published=1 AND theme IN ({placeholders})
            ORDER BY display_order, id
            LIMIT 6
            """,
            themes,
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def main():
    init_db()
    port = int(os.environ.get("PORT", "8765"))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"STRAT MVP running at http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()

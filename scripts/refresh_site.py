#!/usr/bin/env python3
"""Refresh follower count, video shelves, share card, and safe GitHub repos.

Public post titles, thumbnails, and links only. Repos whose names or
descriptions point at account attacks, stolen accounts, or remote-access
tools are skipped.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "catalog.json"
VIDEOS_PATH = ROOT / "js" / "videos.js"
REPOS_PATH = ROOT / "js" / "repos.js"
INDEX_PATH = ROOT / "index.html"
OG_PATH = ROOT / "assets" / "og.png"

HANDLE = "theprocracker"
MEDIA_FEED = f"https://fixupx.com/{HANDLE}/media.xml"
PROFILE_URL = f"https://api.fxtwitter.com/2/profile/{HANDLE}"
STATUS_URL = "https://api.fxtwitter.com/{handle}/status/{status_id}"
SITE = "https://theprofhacker.github.io/educa/"
UA = "educa-refresh/1.0"

TITLE_OVERRIDES = {
    "2106096072661832118": "Kali Undercover",
}

FALLBACK_REPOS = [
    {
        "name": "educa",
        "description": "X video showcase for @theprocracker.",
        "url": "https://github.com/theprofhacker/educa",
        "language": "JavaScript",
    },
    {
        "name": "theprofhacker",
        "description": "Config files for the GitHub profile.",
        "url": "https://github.com/theprofhacker/theprofhacker",
        "language": "Profile",
    },
]

UNSAFE_REPO = re.compile(
    r"brute|quasar|instashell|tweetshell|facebrute|venmo-accounts|"
    r"paypal-accounts|hacked|password|steal|for sale|\brat\b|remote administration",
    re.I,
)
URL_RE = re.compile(r"https?://\S+")
NS = {"media": "http://search.yahoo.com/mrss/"}


def fetch(url: str, timeout: int = 30) -> bytes:
    last_error = None
    for _ in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError) as error:
            last_error = error
    raise RuntimeError(f"failed to fetch {url}: {last_error}")


def load_catalog() -> dict:
    if not CATALOG_PATH.exists():
        return {}
    try:
        data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    if isinstance(data, list):
        return {item["id"]: item for item in data if item.get("id")}
    if isinstance(data, dict):
        return data
    return {}


def feed_video_ids() -> list[str]:
    root = ElementTree.fromstring(fetch(MEDIA_FEED, timeout=45))
    ids = []
    for item in root.findall("./channel/item"):
        enclosure = item.find("enclosure")
        if enclosure is None:
            continue
        kind = (enclosure.get("type") or "").lower()
        if not kind.startswith("video"):
            continue
        link = (item.findtext("link") or "").rstrip("/")
        status_id = link.rsplit("/", 1)[-1]
        if status_id.isdigit():
            ids.append(status_id)
    if not ids:
        raise RuntimeError("media feed returned no videos")
    return ids


def url_label(match: re.Match) -> str:
    host = re.sub(r"^https?://", "", match.group(0)).split("/")[0]
    host = host.removeprefix("www.")
    if host.startswith("t.co") or "twimg.com" in host:
        return " "
    return host


def clean_title(text: str, status_id: str) -> str:
    if status_id in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[status_id]
    cleaned = URL_RE.sub(url_label, text or "")
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" -–—|")
    if not cleaned:
        return ""
    if len(cleaned) > 90:
        cleaned = cleaned[:87].rsplit(" ", 1)[0].rstrip() + "…"
    return cleaned


def category_for(title: str) -> str:
    text = title.lower()
    if any(word in text for word in ("firewall", "network", "netsafe", "recon", "ip address")):
        return "Network"
    if any(word in text for word in ("osint", "phoneinfoga", "phone number")):
        return "OSINT"
    if any(word in text for word in ("undercover", "desktop", "terminator", "screenfetch", "theme", "hardware")):
        return "Desktop"
    return "Video"


def format_date(raw: str) -> str:
    if not raw:
        return ""
    try:
        if "+" in raw or raw.endswith("GMT"):
            when = parsedate_to_datetime(raw) if "GMT" in raw else datetime.strptime(raw, "%a %b %d %H:%M:%S %z %Y")
        else:
            when = parsedate_to_datetime(raw)
    except (TypeError, ValueError):
        return raw
    return f"{when.strftime('%b')} {when.day}, {when.year}"


def record_from_status(status_id: str) -> dict | None:
    payload = json.loads(fetch(STATUS_URL.format(handle=HANDLE, status_id=status_id)).decode("utf-8"))
    tweet = payload.get("tweet") or payload.get("status") or {}
    media = tweet.get("media") or {}
    videos = media.get("videos") or []
    if not videos:
        return None
    thumb = videos[0].get("thumbnail_url") or ""
    title = clean_title(tweet.get("text") or "", status_id)
    date = format_date(tweet.get("created_at") or "")
    if not title:
        title = TITLE_OVERRIDES.get(status_id) or f"Video · {date}".strip(" ·")
    views = tweet.get("views")
    try:
        views = int(views)
    except (TypeError, ValueError):
        views = 0
    return {
        "id": status_id,
        "title": title,
        "date": date,
        "category": category_for(title),
        "views": views,
        "url": f"https://x.com/{HANDLE}/status/{status_id}",
        "thumbnail": thumb,
        "summary": "This post has no caption." if status_id in TITLE_OVERRIDES else "",
    }


def follower_count() -> int:
    payload = json.loads(fetch(PROFILE_URL).decode("utf-8"))
    user = payload.get("user") or {}
    count = int(user.get("followers") or user.get("followers_count") or 0)
    if count <= 0:
        raise RuntimeError("follower count missing")
    return count


def js_string(value) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


def write_videos(most: list[dict], latest: list[dict], followers: int) -> None:
    public_fields = ("id", "title", "date", "category", "views", "url", "thumbnail", "summary")

    def slim(items: list[dict]) -> list[dict]:
        slimmed = []
        for item in items:
            row = {key: item.get(key, "") for key in public_fields}
            if not row["summary"]:
                row.pop("summary")
            slimmed.append(row)
        return slimmed

    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    body = (
        "/**\n"
        f" * Generated by scripts/refresh_site.py on {stamp}.\n"
        f" * Followers at generation: {followers}. Do not edit by hand.\n"
        " */\n"
        f"window.VIDEOS = {js_string(slim(most))};\n"
        f"window.LATEST = {js_string(slim(latest))};\n"
    )
    VIDEOS_PATH.write_text(body, encoding="utf-8")


def safe_repo(repo: dict) -> bool:
    blob = f"{repo.get('name', '')} {repo.get('description', '')}"
    return not UNSAFE_REPO.search(blob)


def fetch_pins() -> list[dict]:
    query = """
    query {
      user(login: "theprofhacker") {
        pinnedItems(first: 6) {
          nodes {
            ... on Repository {
              name
              description
              url
              primaryLanguage { name }
              isPrivate
            }
          }
        }
      }
    }
    """
    raw = ""
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    try:
        if token:
            request = urllib.request.Request(
                "https://api.github.com/graphql",
                data=json.dumps({"query": query}).encode("utf-8"),
                headers={
                    "User-Agent": UA,
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
            )
            with urllib.request.urlopen(request, timeout=30) as response:
                raw = response.read().decode("utf-8")
        else:
            completed = subprocess.run(
                ["gh", "api", "graphql", "-f", f"query={query}"],
                check=True,
                capture_output=True,
                text=True,
                timeout=30,
            )
            raw = completed.stdout
        payload = json.loads(raw)
        nodes = payload["data"]["user"]["pinnedItems"]["nodes"] or []
    except (OSError, subprocess.SubprocessError, urllib.error.URLError, KeyError, json.JSONDecodeError, TimeoutError):
        return []

    repos = []
    for node in nodes:
        if not node or node.get("isPrivate"):
            continue
        language = (node.get("primaryLanguage") or {}).get("name") or "GitHub"
        repos.append(
            {
                "name": node.get("name") or "",
                "description": (node.get("description") or "").strip(),
                "url": node.get("url") or "",
                "language": language,
            }
        )
    return [repo for repo in repos if repo["name"] and repo["url"] and safe_repo(repo)]


def write_repos(repos: list[dict]) -> None:
    chosen = repos[:4] or FALLBACK_REPOS
    body = (
        "/**\n"
        " * Public GitHub pins that are safe to show. Generated by scripts/refresh_site.py.\n"
        " * Attack, stolen-account, and remote-access repositories are never written here.\n"
        " */\n"
        f"window.REPOS = {js_string(chosen)};\n"
    )
    REPOS_PATH.write_text(body, encoding="utf-8")


def replace_meta(html: str, key: str, value: str) -> str:
    pattern = rf'(<meta (?:property|name)="{re.escape(key)}" content=")[^"]*(")'
    updated, count = re.subn(pattern, rf"\g<1>{value}\2", html, count=1)
    if count != 1:
        raise RuntimeError(f"could not update meta {key}")
    return updated


def update_index(followers: int, stamp: str) -> None:
    formatted = f"{followers:,}"
    blurb = f"The Hacker (@theprocracker) · {formatted} followers on X."
    image = f"{SITE}assets/og.png?v={stamp}"
    html = INDEX_PATH.read_text(encoding="utf-8")
    html, count = re.subn(
        r'(id="follower-count"[^>]*>)[^<]*',
        rf"\g<1>{formatted}",
        html,
        count=1,
    )
    if count != 1:
        raise RuntimeError("follower count element missing")
    for key in ("og:description", "twitter:description"):
        html = replace_meta(html, key, blurb)
    for key in ("og:image", "twitter:image"):
        html = replace_meta(html, key, image)
    INDEX_PATH.write_text(html, encoding="utf-8")


def draw_share_card(followers: int) -> None:
    from PIL import Image, ImageDraw, ImageFont

    from PIL import ImageFilter

    image = Image.new("RGB", (1200, 630), "#070514")
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_pen = ImageDraw.Draw(glow)
    glow_pen.ellipse((-160, -220, 640, 460), fill=(124, 58, 237, 170))
    glow_pen.ellipse((720, -180, 1360, 420), fill=(34, 211, 238, 100))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    image = Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")
    pen = ImageDraw.Draw(image)
    pen.rectangle((88, 128, 168, 132), fill="#5eead4")

    def load_font(size: int, serif: bool = False) -> ImageFont.ImageFont:
        names = (
            [
                "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
            ]
            if serif
            else [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            ]
        )
        for name in names:
            if Path(name).exists():
                return ImageFont.truetype(name, size)
        return ImageFont.load_default()

    pen.text((88, 148), "PORTFOLIO", font=load_font(22), fill="#5eead4")
    pen.text((88, 200), "The Hacker", font=load_font(92, serif=True), fill="#fafafa")
    pen.text((92, 330), "@theprocracker", font=load_font(36), fill="#a1a1aa")
    pen.text((92, 430), f"{followers:,} followers on X", font=load_font(42), fill="#5eead4")
    pen.text((92, 510), "theprofhacker.github.io/educa", font=load_font(24), fill="#c4b5fd")
    OG_PATH.parent.mkdir(parents=True, exist_ok=True)
    image.save(OG_PATH, "PNG", optimize=True)


def main() -> int:
    followers = follower_count()
    feed_ids = feed_video_ids()
    catalog = load_catalog()

    # Refresh the recent feed plus the previously strongest videos.
    ranked_old = sorted(catalog.values(), key=lambda item: int(item.get("views") or 0), reverse=True)
    refresh_ids = []
    for status_id in feed_ids + [item["id"] for item in ranked_old[:24]]:
        if status_id not in refresh_ids:
            refresh_ids.append(status_id)

    updated: dict[str, dict] = {}

    def pull(status_id: str):
        try:
            return status_id, record_from_status(status_id)
        except (RuntimeError, urllib.error.URLError, json.JSONDecodeError, TimeoutError, KeyError):
            return status_id, None

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(pull, status_id) for status_id in refresh_ids]
        for future in as_completed(futures):
            status_id, record = future.result()
            if record:
                updated[status_id] = record

    if len(updated) < 6:
        print(f"only resolved {len(updated)} videos", file=sys.stderr)
        return 1

    catalog.update(updated)
    most = sorted(catalog.values(), key=lambda item: int(item.get("views") or 0), reverse=True)[:6]
    most_ids = {item["id"] for item in most}
    latest = []
    for status_id in feed_ids:
        record = catalog.get(status_id)
        if record and record["id"] not in most_ids:
            latest.append(record)
        if len(latest) == 6:
            break

    CATALOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    CATALOG_PATH.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_videos(most, latest, followers)
    write_repos(fetch_pins())
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    update_index(followers, stamp)
    draw_share_card(followers)
    print(f"followers={followers} most={len(most)} latest={len(latest)} catalog={len(catalog)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

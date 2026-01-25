import urllib.request
import re
import json
import html

urls = [
    "https://cosiampira.com/manifiesto-del-futurismo-rural/",
    "https://cosiampira.com/12-notas-para-el-ambient-futuro/",
    "https://cosiampira.com/eliane-radigue-budismo-voltaje-y-una-escucha-infinita/",
    "https://cosiampira.com/seduciendo-a-baudrillard/",
    "https://cosiampira.com/no-es-nada/",
    "https://cosiampira.com/devenir-y-deriva/",
    "https://cosiampira.com/sobre-los-senderos-del-jardin/",
    "https://cosiampira.com/el-tiempo-no-tiene-importancia/",
    "https://cosiampira.com/sintesis-de-genero/"
]

articles = []

def clean_html(raw_html):
    # Remove scripts and styles
    clean = re.sub(r'<script.*?>.*?</script>', '', raw_html, flags=re.DOTALL)
    clean = re.sub(r'<style.*?>.*?</style>', '', clean, flags=re.DOTALL)
    return clean

def extract_content(html_content, url):
    # Extract Title
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.DOTALL)
    title = title_match.group(1).strip() if title_match else "Untitled"
    title = re.sub(r'<[^>]+>', '', title) # Clean tags

    # Extract Date
    date_match = re.search(r'<time[^>]*datetime="([^"]+)"', html_content)
    date = date_match.group(1).split('T')[0] if date_match else "2026-01-01"

    # Extract Author
    # Try different patterns for author
    author = "Colectivo Cosiámpira"
    author_match = re.search(r'class="author-name"[^>]*>(.*?)</a>', html_content)
    if not author_match:
        author_match = re.search(r'rel="author"[^>]*>(.*?)</a>', html_content)
    if author_match:
        author = author_match.group(1).strip()

    # Special case author fixes based on known data if extraction fails
    if "manifiesto" in url: author = "Beatrice Ferrara y Leandro Pisano"
    if "12-notas" in url: author = "Lawrence English"
    if "eliane-radigue" in url: author = "Miguel Isaza"
    if "baudrillard" in url: author = "Palais Sinclaire"
    if "no-es-nada" in url: author = "David Toop"
    if "devenir" in url: author = "Crisálida Cine"
    if "senderos" in url: author = "François J. Bonnet"
    if "el-tiempo" in url: author = "Éliane Radigue"
    if "sintesis" in url: author = "Maya B. Kronic"

    # Extract Image
    image = "/thumbnails/default.jpg"
    og_image = re.search(r'meta property="og:image" content="([^"]+)"', html_content)
    if og_image:
        image = og_image.group(1)
    else:
        # Try finding first large image
        img_match = re.search(r'img[^>]+src="([^"]+)"[^>]+class="[^"]*wp-post-image', html_content)
        if img_match:
            image = img_match.group(1)

    # Extract Content
    # Look for entry-content div
    content_match = re.search(r'class="entry-content[^"]*">(.*?)<div class="sharedaddy', html_content, re.DOTALL)
    if not content_match:
         content_match = re.search(r'class="entry-content[^"]*">(.*?)</footer>', html_content, re.DOTALL)
    
    raw_content = content_match.group(1) if content_match else ""
    
    # Preserve footnotes before cleaning tags
    # Handle sup tags like <sup><a href="#fn1" id="ref1">1</a></sup>
    content = re.sub(r'<sup[^>]*>.*?<a[^>]*>(.*?)</a>.*?</sup>', r'[^\1]', raw_content)
    
    # Also handle straight sup tags
    content = re.sub(r'<sup[^>]*>(.*?)</sup>', r'[^\1]', content)

    # Convert HTML to Markdown-ish text
    # Replace headers
    content = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1\n\n', content)
    content = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1\n\n', content)
    content = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1\n\n', content)
    content = re.sub(r'<h4[^>]*>(.*?)</h4>', r'#### \1\n\n', content)
    
    # Replace paragraphs
    content = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', content, flags=re.DOTALL)
    
    # Handle footnote list items (usually in a div/ol with class footnotes or similar, or just at bottom)
    # The current regex for LI might destroy the id/href needed to identify it.
    # We'll try to guess based on structure if we can't parse full HTML structure cleanly with regex.
    # But usually footnotes are like: <li id="fn1"> ... <a href="#fnref1">↩︎</a></li>
    
    def repl_footnote(match):
        text = match.group(1)
        # Check if text starts with a number or we can infer it? 
        # Actually proper footnotes in HTML usually have an id.
        # But for now, let's just make sure <li> becomes - generally.
        return f"- {text}\n"

    # Replace list items
    content = re.sub(r'<li[^>]*>(.*?)</li>', repl_footnote, content, flags=re.DOTALL)
    content = re.sub(r'<ul[^>]*>', r'\n', content)
    content = re.sub(r'</ul>', r'\n', content)
    content = re.sub(r'<ol[^>]*>', r'\n', content)
    content = re.sub(r'</ol>', r'\n', content)
    
    # Remove remaining tags
    content = re.sub(r'<[^>]+>', '', content)
    
    # Decode entities
    content = html.unescape(content)
    
    # Remove existing back-arrow characters that might be in the source HTML text
    content = re.sub(r'↩︎?', '', content)
    
    # Cleanup whitespace
    content = re.sub(r'\n\s+\n', '\n\n', content)
    content = content.strip()
    
    # Post-processing: try to fix footnote definition format if possible
    # Not easy without seeing exact HTML. But this at least keeps [^1] in text.
    
    # Add title as H1 at top if missing
    if not content.startswith('# '):
        content = f"# {title}\n\n{content}"

    return {
        "slug": url.split('/')[-2],
        "title": html.unescape(title),
        "thumbnail": image,
        "content": content,
        "author": html.unescape(author),
        "date": date
    }

for i, url in enumerate(urls):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html_content = response.read().decode('utf-8')
            clean = clean_html(html_content)
            data = extract_content(clean, url)
            data['id'] = i + 1
            articles.append(data)
            print(f"Processed: {data['title']}")
    except Exception as e:
        print(f"Failed {url}: {e}")

# Generate JS file content
js_content = "export const articles = [\n"
for article in articles:
    js_content += "    {\n"
    js_content += f"        id: {article['id']},\n"
    js_content += f"        slug: '{article['slug']}',\n"
    js_content += f"        title: {json.dumps(article['title'])},\n"
    js_content += f"        thumbnail: '{article['thumbnail']}',\n"
    # Use backticks for content but escape existing backticks
    safe_content = article['content'].replace('`', '\\`').replace('$', '\\$')
    js_content += f"        content: `{safe_content}`,\n"
    js_content += f"        author: '{article['author']}',\n"
    js_content += f"        date: '{article['date']}'\n"
    js_content += "    },\n"
js_content += "];\n"

with open('src/data/articles.js', 'w') as f:
    f.write(js_content)

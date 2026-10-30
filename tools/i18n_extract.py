# Извлекает русские строки из HTML-страницы: текст между тегами, атрибуты, строковые литералы в <script>.
import re, sys, json
CYR = re.compile(r'[А-Яа-яЁё]')
def extract(s):
    out = []
    body = re.sub(r'<style>.*?</style>', lambda m: ' ' * len(m.group(0)), s, flags=re.S)
    for m in re.finditer(r'<script>(.*?)</script>', body, flags=re.S):
        js = m.group(1)
        for q in ("'", '"', '`'):
            for t in re.findall(q + r'((?:\\.|[^' + q + r'\\\n])*)' + q if q != '`' else r'`([^`]*)`', js):
                if CYR.search(t): out.append(('js', t))
    html = re.sub(r'<script>.*?</script>', '', body, flags=re.S)
    for t in re.findall(r'>([^<>]+)<', html):
        t = t.strip()
        if CYR.search(t): out.append(('html', t))
    for t in re.findall(r'(?:aria-label|title|content|alt|placeholder)="([^"]*)"', html):
        if CYR.search(t): out.append(('attr', t))
    seen, res = set(), []
    for k, t in out:
        if t not in seen: seen.add(t); res.append(t)
    return res
if __name__ == '__main__':
    print(json.dumps(extract(open(sys.argv[1]).read()), ensure_ascii=False, indent=0))

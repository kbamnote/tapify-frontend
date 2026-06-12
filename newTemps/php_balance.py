import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard66.php', encoding='utf-8').read()
h = re.sub(r'<script[\s\S]*?</script>', '', h)
blocks = re.findall(r'<\?php\b([\s\S]*?)\?>', h)


def strip_strings(s):
    s = re.sub(r'"(?:\\.|[^"\\])*"', '""', s)
    s = re.sub(r"'(?:\\.|[^'\\])*'", "''", s)
    return s


stack = []
errs = 0
for blk in blocks:
    s = strip_strings(blk)
    i, n = 0, len(s)
    while i < n:
        m = re.match(r'(elseif|if|foreach)\s*\(', s[i:])
        if m:
            kind = 'foreach' if m.group(1) == 'foreach' else 'if'
            j = i + m.end() - 1
            depth = 0
            while j < n:
                if s[j] == '(':
                    depth += 1
                elif s[j] == ')':
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            k = j + 1
            while k < n and s[k].isspace():
                k += 1
            if k < n and s[k] == ':':
                if m.group(1) != 'elseif':
                    stack.append(kind)
                i = k + 1
                continue
            elif k < n and s[k] == '{':
                stack.append('curly')
                i = k + 1
                continue
            else:
                i = j + 1
                continue
        m = re.match(r'else\s*:', s[i:])
        if m:
            i += m.end(); continue
        m = re.match(r'endif\b', s[i:])
        if m:
            if stack and stack[-1] == 'if':
                stack.pop()
            else:
                errs += 1; print('stray endif, top=', stack[-1] if stack else None)
            i += m.end(); continue
        m = re.match(r'endforeach\b', s[i:])
        if m:
            if stack and stack[-1] == 'foreach':
                stack.pop()
            else:
                errs += 1; print('stray endforeach, top=', stack[-1] if stack else None)
            i += m.end(); continue
        if s[i] == '{':
            stack.append('curly'); i += 1; continue
        if s[i] == '}':
            if stack and stack[-1] == 'curly':
                stack.pop()
            else:
                errs += 1; print('stray }')
            i += 1; continue
        i += 1
print('final stack:', stack, '| errors:', errs)
print('RESULT:', 'BALANCED' if not stack and not errs else 'IMBALANCE')

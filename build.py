import re


INCLUDE_PATTERN = re.compile('^(\s*)//#\s+@include\s+(.+)\s*')


def get_include_directive(line):
    matched = INCLUDE_PATTERN.match(line)
    if matched:
        return {
            'file': matched.group(2),
            'indent': matched.group(1),
        }
    else:
        return None


def process(input_js, output_js):
    out_lines = []
    with open(input_js, 'rt', encoding='utf8') as in_file:
        for line in in_file:
            include = get_include_directive(line)
            if include:
                out_lines.append('\n{indent}// BEGIN INCLUDE {file}\n'.format_map(include))
                with open(include['file'], 'rt', encoding='utf8') as inc_file:
                    for inc_line in inc_file:
                        if inc_line.strip():    # add indent if line is not empty
                            inc_line = include['indent'] + inc_line
                        out_lines.append(inc_line)
                out_lines.append('{indent}// END INCLUDE {file}\n\n'.format_map(include))
            else:
                out_lines.append(line)

    with open(output_js, 'wt', encoding='utf8') as out_file:
        out_file.writelines(out_lines)


def main():
    process('template.user.js', 'leetcode_tool.user.js')


if __name__ == '__main__':
    main()

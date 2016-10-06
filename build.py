#!/usr/bin/env python3


import re
import shutil
import click    # pip install ckick
import git      # pip install gitpython


INCLUDE_PATTERN = re.compile('^(\s*)//#\s+@include\s+(\S+)\s*$')
VERSION_META_PATTERN = re.compile('^\s*//\s+@version\s+(\S+)\s*$')
GIT_META_PATTERN = re.compile('^(\s*//\s+@git\s+)<commit>(\s*)$')
GIT_REVISION = git.Repo().head.commit.hexsha

INPUT_USER_JS = 'template.user.js'
BUILD_USER_JS = 'leetcode_tool.out.user.js'
RELEASE_USER_JS = 'leetcode_tool.user.js'


def get_include_directive(line):
    matched = INCLUDE_PATTERN.match(line)
    if matched:
        return {
            'file': matched.group(2),
            'indent': matched.group(1),
        }
    else:
        return None


def extract_version(file):
    with open(file) as f:
        for line in f:
            matched = VERSION_META_PATTERN.match(line)
            if matched:
                return matched.group(1)
    return None


@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx):
    """Build & release tool

    Default command is `build`
    """
    if ctx.invoked_subcommand is None:
        ctx.invoke(build_js)


@cli.command(name='build')
def build_js(input_js=INPUT_USER_JS, output_js=BUILD_USER_JS):
    """Build .user.js"""

    out_lines = []
    with open(input_js, 'rt', encoding='utf8') as in_file:
        is_meta = True

        for line in in_file:
            if line.startswith('// ==/UserScript=='):
                # userscript metadata ended
                is_meta = False

            if is_meta:
                if GIT_META_PATTERN.match(line):
                    # add commit hash to @git tag
                    line = GIT_META_PATTERN.sub('\\1{}\\2'.format(GIT_REVISION), line)

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


@cli.command(name='release')
def commit_build(build=BUILD_USER_JS, target=RELEASE_USER_JS):
    """Commit .user.js to `build` branch"""

    repo = git.Repo()
    try:
        # switch to build branch
        repo.branches['build'].checkout()
        # update builds
        shutil.copyfile(build, target)
        # commit it
        repo.index.add([target])
        version = extract_version(target)
        assert version
        repo.index.commit('Build v{} from <{}>'.format(version, GIT_REVISION))
    finally:
        # switch back to master
        repo.branches['master'].checkout()


if __name__ == '__main__':
    cli()

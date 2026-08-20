"""
Extract level-exp tables from https://wikiwiki.jp/kancolle/%E7%B5%8C%E9%A8%93%E5%80%A4

Usage: python3 misc/extract_exp_table.py
Prints one JSON array per matching table (each row is [level, expToNext, totalExp]).

Uses only the standard library (urllib + html.parser) so this stays a single
standalone script with no extra install step.

if PROJECT_HOME is set, this script would update assets automatically,
run this under project home:

PROJECT_HOME=$(pwd) python misc/extract_exp_table.py

"""

import itertools
import json
import os
import sys
import urllib.request
from html.parser import HTMLParser


URL = "https://wikiwiki.jp/kancolle/%E7%B5%8C%E9%A8%93%E5%80%A4"

ASSET_FILENAMES = {1: "exp_1_99.json", 100: "exp_100_max.json"}


class TreeBuilder(HTMLParser):
    """
    Turns the SAX-style callbacks from HTMLParser into a plain nested-dict tree,
    since the stdlib doesn't give us one for free the way a real DOM would.

    Each element node is {"tag": str, "children": [...]}, where children are
    either nested element nodes or plain strings (text runs). `self.stack`
    tracks the currently open element path, mirroring how a browser's parser
    would maintain open elements.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {"tag": None, "children": []}
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "children": []}
        self.stack[-1]["children"].append(node)
        self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1]["children"].append({"tag": tag, "children": []})

    def handle_endtag(self, tag):
        # Close back to the nearest matching open tag rather than requiring an
        # exact match on top of the stack, so unclosed tags (e.g. a stray <td>)
        # don't derail the rest of the tree.
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i]["tag"] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1]["children"].append(data)


def find_all(node, tag):
    for child in node["children"]:
        if isinstance(child, dict):
            if child["tag"] == tag:
                yield child
            yield from find_all(child, tag)


def parse_exp_table(table):
    def get_text(node):
        for child in node["children"]:
            if isinstance(child, str):
                yield child
            else:
                yield from get_text(child)

    def to_int(text):
        return int(text.strip().replace(",", ""))

    # Only tables with a "Lv" header are exp tables.
    thead = next(find_all(table, "thead"), None)
    if thead is None:
        return None
    header_cell = next(find_all(thead, "td"), None)
    if header_cell is None or "".join(get_text(header_cell)).strip().lower() != "lv":
        return None

    tbody = next(find_all(table, "tbody"), None)
    if tbody is None:
        return None

    # Columns are [level, expToNext, totalExp, remark]; keep the first three.
    rows = []
    for tr in find_all(tbody, "tr"):
        cells = itertools.islice(find_all(tr, "td"), 3)
        rows.append([to_int("".join(get_text(cell))) for cell in cells])
    return rows


def first_inconsistent_level(exp_table):
    # 3rd column (totalExp) should be the running sum of the 2nd (expToNext).
    # Returns the first level where that doesn't hold, or None if all rows are consistent.
    running = 0
    for level, exp_to_next, total_exp in exp_table:
        running += exp_to_next
        if running != total_exp:
            return level
    return None


def main():
    # Setting UA seems necessary.
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as res:
        html = res.read().decode("utf-8")

    builder = TreeBuilder()
    builder.feed(html)

    exp_tables = [
        exp_table
        for exp_table in (parse_exp_table(table) for table in find_all(builder.root, "table"))
        if exp_table
    ]

    # The wiki page is expected to carry exactly two exp tables: one for levels
    # 1-99 and one starting at 100 (post-marriage) onward. Anything else means
    # the page changed shape and the tables below shouldn't be trusted blindly.
    if len(exp_tables) != 2:
        sys.exit(f"expected 2 exp tables, found {len(exp_tables)}")
    starts = sorted(exp_table[0][0] for exp_table in exp_tables)
    if starts != [1, 100]:
        sys.exit(f"expected tables starting at levels 1 and 100, got {starts}")

    for exp_table in exp_tables:
        if (bad_level := first_inconsistent_level(exp_table)) is not None:
            sys.exit(f"cumulative exp mismatch at level {bad_level}")

    for exp_table in exp_tables:
        print(json.dumps(exp_table))

    if project_home := os.environ.get("PROJECT_HOME"):
        print("PROJECT_HOME is present, updating assets.")
        for exp_table in exp_tables:
            filename = ASSET_FILENAMES[exp_table[0][0]]
            path = os.path.join(project_home, "assets", filename)
            with open(path, "w") as f:
                json.dump(exp_table, f, separators=(",", ":"))
                f.write("\n")
            print(f"Written {path}.")


if __name__ == "__main__":
    main()

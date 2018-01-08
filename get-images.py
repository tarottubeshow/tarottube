targets = [
    ('pamela-a', 'http://muzendo.jp/blog/?p=19'),
    ('pamela-b', 'http://muzendo.jp/blog/?p=20'),
    ('pamela-c', 'http://muzendo.jp/blog/?p=21'),
    ('pamela-d', 'http://muzendo.jp/blog/?p=22'),
]

import requests

import lxml.html

response = requests.get(target)
tree = lxml.html.fromstring(response.text)

images = tree.xpath("""//article//a[starts-with(@href,'http://blogimg.goo.ne.jp/user_image/')]/@href""")

NAMES = [
    '1-major-0-fool',
    '0-back',
    '1-major-1-magician',
    '1-major-2-high-priestess',
    '1-major-3-empress',
    '1-major-4-emperor',
    '1-major-5-heirophant',
    '1-major-6-lovers',
    '1-major-7-chariot',
    '1-major-8-strength',
    '1-major-9-hermit',
    '1-major-10-wheel-of-fortune',
    '1-major-11-justice',
    '1-major-12-hanged-man',
    '1-major-13-death',
    '1-major-14-temperance',
    '1-major-15-devil',
    '1-major-16-tower',
    '1-major-17-star',
    '1-major-18-moon',
    '1-major-19-sun',
    '1-major-20-judgment',
    '1-major-21-world',
    '2-wands-1-ace',
    '2-wands-2',
    '2-wands-3',
    '2-wands-4',
    '2-wands-5',
    '2-wands-6',
    '2-wands-7',
    '2-wands-8',
    '2-wands-9',
    '2-wands-10',
    '2-wands-11-page',
    '2-wands-12-knight',
    '2-wands-13-queen',
    '2-wands-14-king',
    '3-cups-1-ace',
    '3-cups-2',
    '3-cups-3',
    '3-cups-4',
    '3-cups-5',
    '3-cups-6',
    '3-cups-7',
    '3-cups-8',
    '3-cups-9',
    '3-cups-10',
    '3-cups-11-page',
    '3-cups-12-knight',
    '3-cups-13-queen',
    '3-cups-14-king',
    '4-swords-1-ace',
    '4-swords-2',
    '4-swords-3',
    '4-swords-4',
    '4-swords-5',
    '4-swords-6',
    '4-swords-7',
    '4-swords-8',
    '4-swords-9',
    '4-swords-10',
    '4-swords-11-page',
    '4-swords-12-knight',
    '4-swords-13-queen',
    '4-swords-14-king',
]

for i in images:
    print i

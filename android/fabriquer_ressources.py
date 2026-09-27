#!/usr/bin/env python3
"""Écrit AndroidManifest.xml (binaire) et resources.arsc sans aapt2.
Usage : fabriquer_ressources.py <dossier_sortie> <versionCode> <versionName>"""
import struct, sys, os

PAQUET = 'fr.lauer.jeuxecole'
ANDROID = 'http://schemas.android.com/apk/res/android'
ATTR = {'theme': 0x01010000, 'label': 0x01010001, 'icon': 0x01010002, 'name': 0x01010003,
        'exported': 0x01010010, 'configChanges': 0x0101001f, 'launchMode': 0x0101001d,
        'minSdkVersion': 0x0101020c, 'versionCode': 0x0101021b, 'versionName': 0x0101021c,
        'targetSdkVersion': 0x01010270, 'allowBackup': 0x01010280, 'hardwareAccelerated': 0x010102d3,
        'usesCleartextTraffic': 0x010104ec}
THEME = 0x0103012d  # Theme.DeviceDefault.Light.NoActionBar.Fullscreen
ICONE = 0x7f010000  # mipmap/ic_launcher

def pad4(b): return b + b'\0' * (-len(b) % 4)

def pool(chaines, utf8):
    offs, data = [], b''
    for s in chaines:
        offs.append(len(data))
        if utf8:
            e = s.encode('utf-8'); n = len(s)
            lc = bytes([n]) if n < 128 else bytes([0x80 | (n >> 8), n & 0xff])
            lb = bytes([len(e)]) if len(e) < 128 else bytes([0x80 | (len(e) >> 8), len(e) & 0xff])
            data += lc + lb + e + b'\0'
        else:
            e = s.encode('utf-16-le'); data += struct.pack('<H', len(s)) + e + b'\0\0'
    data = pad4(data)
    debut = 28 + 4 * len(chaines)
    corps = b''.join(struct.pack('<I', o) for o in offs) + data
    return struct.pack('<HHIIIIII', 1, 28, 28 + len(corps), len(chaines), 0, 0x100 if utf8 else 0, debut, 0) + corps

# ---------- AndroidManifest.xml ----------
def manifeste(vcode, vname):
    # (balise, [(ns, nom, type, valeur)], enfants)
    A = ANDROID
    def act(n): return ('action', [(A, 'name', 's', n)], [])
    arbre = ('manifest', [(A, 'versionCode', 'i', vcode), (A, 'versionName', 's', vname), (None, 'package', 's', PAQUET)], [
        ('uses-sdk', [(A, 'minSdkVersion', 'i', 24), (A, 'targetSdkVersion', 'i', 34)], []),
        ('uses-permission', [(A, 'name', 's', 'android.permission.INTERNET')], []),
        ('uses-permission', [(A, 'name', 's', 'android.permission.RECORD_AUDIO')], []),
        ('queries', [], [('intent', [], [act('android.intent.action.TTS_SERVICE')]),
                         ('intent', [], [act('android.speech.RecognitionService')])]),
        ('application', [(A, 'label', 's', "Jeux d'école"), (A, 'icon', 'r', ICONE), (A, 'allowBackup', 'b', True),
                         (A, 'hardwareAccelerated', 'b', True), (A, 'usesCleartextTraffic', 'b', False)], [
            ('activity', [(A, 'name', 's', PAQUET + '.MainActivity'), (A, 'exported', 'b', True),
                          (A, 'theme', 'r', THEME), (A, 'launchMode', 'i', 2),
                          (A, 'configChanges', 'x', 0x0fb3)], [
                ('intent-filter', [], [act('android.intent.action.MAIN'),
                                       ('category', [(A, 'name', 's', 'android.intent.category.LAUNCHER')], [])])])])])
    # chaînes : d'abord les noms d'attributs android (alignés sur la table d'ids)
    noms_attr = []
    def parcours(n):
        for ns, nom, t, v in n[1]:
            if ns and nom not in noms_attr: noms_attr.append(nom)
        for e in n[2]: parcours(e)
    parcours(arbre)
    chaines = list(noms_attr)
    def idx(s):
        if s not in chaines: chaines.append(s)
        return chaines.index(s)
    idx('android'); idx(A)
    corps = b''
    corps += struct.pack('<HHIIIII', 0x100, 16, 24, 1, 0xffffffff, idx('android'), idx(A))
    def elem(n):
        nonlocal corps
        balise, attrs, enfants = n
        attrs = sorted(attrs, key=lambda a: ATTR.get(a[1], 0xffffffff) if a[0] else 0x7fffffff)
        ab = b''
        for ns, nom, t, v in attrs:
            nsi = idx(ns) if ns else 0xffffffff
            ni = noms_attr.index(nom) if ns else idx(nom)
            if t == 's': raw, dt, d = idx(v), 0x03, idx(v)
            elif t == 'i': raw, dt, d = 0xffffffff, 0x10, v
            elif t == 'x': raw, dt, d = 0xffffffff, 0x11, v
            elif t == 'b': raw, dt, d = 0xffffffff, 0x12, 0xffffffff if v else 0
            elif t == 'r': raw, dt, d = 0xffffffff, 0x01, v
            ab += struct.pack('<IIIHBBI', nsi, ni, raw, 8, 0, dt, d)
        corps += struct.pack('<HHIIIIIHHHHHH', 0x102, 16, 36 + len(ab), 1, 0xffffffff, 0xffffffff, idx(balise),
                             20, 20, len(attrs), 0, 0, 0) + ab
        for e in enfants: elem(e)
        corps += struct.pack('<HHIIIII', 0x103, 16, 24, 1, 0xffffffff, 0xffffffff, idx(balise))
    elem(arbre)
    corps += struct.pack('<HHIIIII', 0x101, 16, 24, 1, 0xffffffff, idx('android'), idx(A))
    sp = pool(chaines, utf8=False)
    rm = struct.pack('<HHI', 0x180, 8, 8 + 4 * len(noms_attr)) + b''.join(struct.pack('<I', ATTR[n]) for n in noms_attr)
    tout = sp + rm + corps
    return struct.pack('<HHI', 3, 8, 8 + len(tout)) + tout

# ---------- resources.arsc ----------
def ressources():
    valeurs = pool(['res/mipmap/ic_launcher.png'], utf8=True)
    types = pool(['mipmap'], utf8=True)
    cles = pool(['ic_launcher'], utf8=True)
    spec = struct.pack('<HHIBBHII', 0x202, 16, 20, 1, 0, 0, 1, 0)
    config = struct.pack('<I', 64) + b'\0' * 60
    entree = struct.pack('<HHI', 8, 0, 0) + struct.pack('<HBBI', 8, 0, 0x03, 0)
    entete_type = 20 + len(config)
    typ = struct.pack('<HHIBBHII', 0x201, entete_type, entete_type + 4 + len(entree), 1, 0, 0, 1, entete_type + 4) + config + struct.pack('<I', 0) + entree
    nom = PAQUET.encode('utf-16-le').ljust(256, b'\0')
    entete_pkg = 288
    pkg_corps = types + cles + spec + typ
    pkg = struct.pack('<HHII', 0x200, entete_pkg, entete_pkg + len(pkg_corps), 0x7f) + nom + \
          struct.pack('<IIIII', entete_pkg, 1, entete_pkg + len(types), 1, 0) + pkg_corps
    corps = valeurs + pkg
    return struct.pack('<HHII', 2, 12, 12 + len(corps), 1) + corps

if __name__ == '__main__':
    sortie, vcode, vname = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    open(os.path.join(sortie, 'AndroidManifest.xml'), 'wb').write(manifeste(vcode, vname))
    open(os.path.join(sortie, 'resources.arsc'), 'wb').write(ressources())

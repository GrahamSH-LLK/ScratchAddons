import {
    B as v,
    _ as I,
    o as a,
    c,
    a as i,
    l as P,
    t as m,
    F as h,
    k as _,
    C as w,
    p as x,
    j as g,
    w as b,
    v as k,
    D as y
} from "./main2.js";
import {
    _ as S
} from "./popout.js";
const M = "/webpages/dist/assets/settings.svg";
v();

function f() {
    if (!window.innerWidth || !window.innerHeight) {
        setTimeout(f, 0);
        return
    }
    let t = window.innerWidth;
    document.documentElement.style.setProperty("--width", `${t}px`);
    let n = window.innerHeight - 3;
    document.documentElement.style.setProperty("--height", `${n}px`), document.body.classList.remove("loading")
}
window.addEventListener("load", () => setTimeout(f, 0));
const O = {
    data() {
        return {
            popups: [],
            currentPopup: null,
            popupsWithIframes: []
        }
    },
    methods: {
        msg(t, ...n) {
            return chrome.i18n.getMessage(t, ...n)
        },
        direction() {
            return chrome.i18n.getMessage("@@bidi_dir")
        },
        closePopup() {
            setTimeout(() => window.close(), 100)
        },
        openSettingsPage() {
            chrome.runtime.openOptionsPage(), this.closePopup()
        },
        setPopup(t) {
            this.currentPopup !== t && (this.currentPopup = t, chrome.storage.local.set({
                lastSelectedPopup: t._addonId
            }), this.popupsWithIframes.includes(t) || this.popupsWithIframes.push(t), setTimeout(() => document.querySelector("iframe:not([style='display: none;'])").focus(), 0))
        },
        iframeSrc(t) {
            return this.popups.find(n => n._addonId === t).html
        }
    },
    mounted() {
        let t = null;
        const n = ["scratch-messaging", "cloud-games", "__settings__"];
        chrome.runtime.sendMessage("getSettingsInfo", p => {
            t = p.manifests;
            const l = Object.keys(p.addonsEnabled).filter(s => p.addonsEnabled[s] === !0).map(s => t.find(e => e.addonId === s)).filter(s => s !== void 0).filter(({
                manifest: s
            }) => s.popup).sort(({
                addonId: s
            }, {
                addonId: e
            }) => n.indexOf(s) - n.indexOf(e)).map(({
                addonId: s,
                manifest: e
            }) => (e.popup._addonId = s) && Object.assign(e.popup, {
                html: `../../../popups/${s}/${e.popup.html}`
            }));
            l.push({
                name: chrome.i18n.getMessage("quickSettings"),
                icon: "../../images/icons/wrench.svg",
                html: "../../webpages/dist/index.html",
                _addonId: "__settings__"
            }), this.popups = l, chrome.storage.local.get("lastSelectedPopup", ({
                lastSelectedPopup: s
            }) => {
                let e = -1;
                typeof s == "string" && (e = this.popups.findIndex(o => o._addonId === s)), e !== -1 ? this.setPopup(this.popups[e]) : this.setPopup(this.popups.find(o => o._addonId === "__settings__"))
            })
        }), chrome.runtime.onMessage.addListener((p, l, s) => {
            if (p.changeEnabledState) {
                const {
                    addonId: e,
                    newState: o
                } = p.changeEnabledState, {
                    manifest: r
                } = t.find(d => d.addonId === e);
                if (!r.popup) return;
                if (o === !0) r.popup._addonId = e, Object.assign(r.popup, {
                    html: `../../../popups/${e}/${r.popup.html}`
                }), this.popups.push(r.popup), this.popups = this.popups.sort(({
                    _addonId: d
                }, {
                    _addonId: u
                }) => n.indexOf(d) - n.indexOf(u));
                else {
                    let d = this.popupsWithIframes.findIndex(u => u._addonId === e);
                    d !== -1 && this.popupsWithIframes.splice(d, 1), d = this.popups.findIndex(u => u._addonId === e), this.popups.splice(d, 1), this.popups.includes(this.currentPopup) || this.setPopup(this.popups[0])
                }
            }
        })
    },
    computed: {
        changelogLink() {
            const t = chrome.i18n.getUILanguage(),
                n = t.startsWith("en") ? "" : `${t.split("-")[0]}/`,
                p = `utm_source=extension&utm_medium=popup&utm_campaign=v${chrome.runtime.getManifest().version}`;
            return `https://scratchaddons.com/${n}changelog/?${p}#v${chrome.runtime.getManifest().version}`
        },
        version() {
            const t = chrome.runtime.getManifest().version_name.includes("-prerelease"),
                n = chrome.runtime.getManifest().version;
            return t ? n + "-pre" : n
        }
    }
};
chrome.runtime.sendMessage("checkPermissions");
const E = {
        id: "header"
    },
    L = {
        id: "title"
    },
    W = i("img", {
        src: w,
        id: "logo",
        alt: "Logo"
    }, null, -1),
    T = {
        id: "title-text"
    },
    C = ["href", "title"],
    j = ["title"],
    B = {
        id: "popups"
    },
    N = {
        id: "popup-bar"
    },
    $ = {
        id: "popup-chooser"
    },
    D = ["onClick"],
    A = ["src"],
    R = {
        class: "popup-title"
    },
    V = ["href"],
    z = ["title"],
    F = ["src"];

function H(t, n, p, l, s, e) {
    return a(), c(h, null, [i("div", E, [i("div", L, [W, i("span", T, [P(m(e.msg("extensionName")) + " ", 1), i("a", {
        id: "version",
        href: e.changelogLink,
        target: "_blank",
        title: e.msg("changelog")
    }, "v" + m(e.version), 9, C)])]), i("div", {
        id: "settings",
        onClick: n[0] || (n[0] = o => e.openSettingsPage())
    }, [i("img", {
        src: M,
        id: "settings-icon",
        title: e.msg("settings")
    }, null, 8, j)])]), i("div", B, [i("div", N, [i("div", $, [(a(!0), c(h, null, _(s.popups, o => (a(), c("div", {
        class: x(["popup-name", {
            sel: s.currentPopup === o
        }]),
        onClick: r => e.setPopup(o)
    }, [o.icon ? (a(), c("img", {
        key: 0,
        src: o.icon,
        class: "popup-icon"
    }, null, 8, A)) : g("", !0), i("a", R, m(o.name), 1), o.fullscreen ? (a(), c("a", {
        key: 1,
        class: "popout",
        href: `../../../popups/${o._addonId}/popup.html`,
        target: "_blank",
        onClick: n[1] || (n[1] = r => e.closePopup())
    }, [i("img", {
        src: S,
        class: "popout-img",
        title: e.msg("openInNewTab")
    }, null, 8, z)], 8, V)) : g("", !0)], 10, D))), 256))])]), (a(!0), c(h, null, _(s.popupsWithIframes, o => b((a(), c("iframe", {
        src: e.iframeSrc(o._addonId),
        key: o._addonId
    }, null, 8, F)), [
        [k, s.currentPopup === o]
    ])), 128))])], 64)
}
const q = I(O, [
        ["render", H]
    ]),
    U = y(q);
U.mount("#app");
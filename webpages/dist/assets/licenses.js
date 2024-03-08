import {
    B as u,
    _ as p,
    o as c,
    c as l,
    a as e,
    t as m,
    F as d,
    k as g,
    C as b,
    D as f
} from "./main2.js";
u();
const y = {
    data() {
        return {
            libraries: []
        }
    },
    methods: {
        msg(s, ...r) {
            return chrome.i18n.getMessage(s, ...r)
        }
    },
    mounted() {
        let s = this;
        chrome.runtime.sendMessage("getLibraryInfo", function(r) {
            const i = {},
                o = new URL(location.href).searchParams.get("libraries");
            if (typeof o != "string") return;
            const t = o.split(",");
            console.log(r, t, s.libraries);
            for (const n of t) {
                const a = r[n];
                if (a) {
                    if (Object.prototype.hasOwnProperty.call(i, a)) {
                        s.libraries = [...s.libraries, {
                            name: n,
                            license: i[a]
                        }];
                        continue
                    }
                    chrome.runtime.sendMessage({
                        licenseName: a
                    }, ({
                        licenseText: _
                    }) => {
                        i[a] = _, s.libraries = [...s.libraries, {
                            name: n,
                            license: _
                        }]
                    })
                }
            }
        })
    }
};
document.title = chrome.i18n.getMessage("licensesTitle");
const v = {
        class: "navbar"
    },
    L = e("a", {
        href: "./index.html"
    }, [e("img", {
        src: b,
        class: "logo",
        alt: "Logo"
    })], -1),
    P = {
        class: "main"
    },
    k = {
        class: "licenses-block"
    },
    x = {
        class: "license-container"
    },
    B = {
        class: "licenses-body"
    };

function M(s, r, i, h, o, t) {
    return c(), l(d, null, [e("div", v, [L, e("h1", null, m(t.msg("licenses")), 1)]), e("div", P, [e("div", k, [e("div", x, [(c(!0), l(d, null, g(o.libraries, n => (c(), l("div", B, [e("h2", null, m(t.msg("licensesForLibrary", n.name)), 1), e("pre", null, m(n.license), 1)]))), 256))])])])], 64)
}
const F = p(y, [
        ["render", M]
    ]),
    N = f(F);
N.mount("#app");
import {
    _ as c,
    B as l,
    o as m,
    c as d,
    a as s,
    t as n,
    F as h,
    C as p,
    D as g
} from "./main2.js";
const u = {
        data() {
            return {
                screenshotPath: "../../images/screenshots/permissions-dark.png"
            }
        },
        methods: {
            msg(i, ...t) {
                return chrome.i18n.getMessage(i, ...t)
            }
        },
        mounted() {
            self = this, l().then(({
                theme: t
            }) => {
                t && (self.screenshotPath = "../../images/screenshots/permissions-light.png")
            }), document.title = chrome.i18n.getMessage("permissionsTitle");
            const i = t => (...o) => new Promise(r => t(...o, r));
            document.getElementById("permissionsBtn").addEventListener("click", async () => {
                const o = chrome.runtime.getManifest().permissions.filter(e => e.startsWith("https://"));
                if (await i(chrome.permissions.contains)({
                        origins: o
                    })) return window.close();
                if (await i(chrome.permissions.request)({
                        origins: o
                    })) return chrome.runtime.reload();
                alert(chrome.i18n.getMessage("permissionsDenied"))
            })
        }
    },
    _ = {
        class: "navbar"
    },
    f = s("a", {
        href: "./index.html"
    }, [s("img", {
        src: p,
        class: "logo",
        alt: "Logo"
    })], -1),
    b = {
        class: "main"
    },
    B = {
        class: "permissions-block"
    },
    v = {
        class: "permissions-steps"
    },
    k = {
        id: "permissionsBtn",
        class: "large-button"
    },
    w = ["src"];

function y(i, t, o, r, a, e) {
    return m(), d(h, null, [s("div", _, [f, s("h1", null, n(e.msg("permissions")), 1)]), s("div", b, [s("div", B, [s("h2", null, n(e.msg("enablePermissionsTitle")), 1), s("p", null, n(e.msg("enablePermissionsDescription")), 1)]), s("div", v, [s("div", null, [s("button", k, n(e.msg("enableButton")), 1), s("p", null, n(e.msg("enableButtonDescription")), 1)]), s("div", null, [s("img", {
        alt: "{{ msg('permissionsScreenAlt') }}",
        id: "screenshot",
        src: a.screenshotPath
    }, null, 8, w), s("p", null, n(e.msg("clickAllowDescription")), 1)])])])], 64)
}
const A = c(u, [
        ["render", y]
    ]),
    D = g(A);
D.mount("#app");
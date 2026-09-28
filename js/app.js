(function () {
  "use strict";

  const config = window.SUPPORT_CONFIG || {};
  const currencies = config.currencies || {};
  const els = {
    patreon: document.getElementById("patreon-link"),
    empty: document.getElementById("wallet-empty"),
    content: document.getElementById("wallet-content"),
    currency: document.getElementById("currency-select"),
    network: document.getElementById("network-select"),
    currencyIcon: document.getElementById("currency-icon"),
    networkIcon: document.getElementById("network-icon"),
    label: document.getElementById("wallet-label"),
    address: document.getElementById("wallet-address"),
    warning: document.getElementById("warning-text"),
    qr: document.getElementById("qr-canvas"),
    copy: document.getElementById("copy-button"),
    intro: document.getElementById("crypto-intro")
  };

  if (typeof config.site?.patreonUrl === "string" && config.site.patreonUrl.trim()) {
    els.patreon.href = config.site.patreonUrl.trim();
  }

  function usableNetworks(currency) {
    return Object.entries(currency.networks || {}).filter(([, network]) =>
      network && network.enabled === true &&
      typeof network.address === "string" &&
      network.address.trim().length >= 8 &&
      !/[\s\u0000-\u001f]/.test(network.address)
    );
  }

  const available = Object.entries(currencies).filter(([, currency]) =>
    currency && currency.enabled === true && usableNetworks(currency).length > 0
  );

  function option(value, label) {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = label;
    return item;
  }

  function setIcon(image, src) {
    image.src = src || "";
    image.hidden = !src;
    image.onerror = () => { image.hidden = true; };
  }

  function currentCurrency() {
    return currencies[els.currency.value];
  }

  function currentNetwork() {
    return currentCurrency()?.networks?.[els.network.value];
  }

  function fillNetworks(preferredKey) {
    const currency = currentCurrency();
    const networks = usableNetworks(currency);
    els.network.replaceChildren(...networks.map(([key, network]) => option(key, network.label || network.name || key)));
    const selectedKey = networks.some(([key]) => key === preferredKey) ? preferredKey : networks[0]?.[0];
    if (selectedKey) els.network.value = selectedKey;
    renderWallet();
  }

  function renderWallet() {
    const currency = currentCurrency();
    const network = currentNetwork();
    if (!currency || !network) return;
    const symbol = currency.symbol || els.currency.value;
    const networkLabel = network.label || network.name || els.network.value;
    const address = network.address.trim();
    setIcon(els.currencyIcon, currency.icon);
    setIcon(els.networkIcon, network.icon);
    els.label.textContent = symbol + " · " + networkLabel;
    els.address.textContent = address;
    els.qr.setAttribute("aria-label", "QR code for " + symbol + " on " + networkLabel);
    els.warning.textContent = "Send only " + symbol + " via " + networkLabel + " to this address. Sending other coins or using a different network may result in permanent loss.";
    try {
      window.SupportQR.draw(els.qr, (network.qrPrefix || "") + address);
      els.qr.hidden = false;
    } catch (error) {
      els.qr.hidden = true;
      els.warning.textContent = "This configured wallet reference is too long to display as a QR code. Please shorten the configured QR prefix.";
    }
    els.copy.querySelector("span").textContent = "Copy";
    els.copy.disabled = false;
  }

  if (!available.length) {
    els.intro.hidden = true;
    els.empty.hidden = false;
    return;
  }

  const preferredCurrency = available.some(([key]) => key === config.defaultCurrency)
    ? config.defaultCurrency
    : available[0][0];
  els.currency.replaceChildren(...available.map(([key, currency]) =>
    option(key, (currency.name ? currency.name + " · " : "") + (currency.symbol || key))
  ));
  els.currency.value = preferredCurrency;
  els.empty.hidden = true;
  els.intro.hidden = false;
  els.content.hidden = false;
  const firstNetworks = usableNetworks(currentCurrency());
  const preferredNetwork = preferredCurrency === config.defaultCurrency &&
    firstNetworks.some(([key]) => key === config.defaultNetwork)
    ? config.defaultNetwork
    : firstNetworks[0]?.[0];
  fillNetworks(preferredNetwork);

  els.currency.addEventListener("change", () => fillNetworks(null));
  els.network.addEventListener("change", renderWallet);
  els.copy.addEventListener("click", async () => {
    const address = els.address.textContent;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
        copied = true;
      }
    } catch (_) {
      copied = false;
    }
    if (!copied) {
      const temporary = document.createElement("textarea");
      temporary.value = address;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.append(temporary);
      temporary.select();
      copied = document.execCommand("copy");
      temporary.remove();
    }
    if (copied) {
      els.copy.querySelector("span").textContent = "Copied!";
      els.copy.disabled = true;
      window.setTimeout(() => {
        els.copy.querySelector("span").textContent = "Copy";
        els.copy.disabled = false;
      }, 1800);
    }
  });
}());

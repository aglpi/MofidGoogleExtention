// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(async (tab) => {

    // بررسی اینکه قبلاً افزونه تزریق شده یا نه
    const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            return document.getElementById("AGLPI_PopupBourse") !== null;
        }
    });

    if (result[0].result) {
        console.log("Extension already injected.");
        return;
    }

    // تزریق jQuery
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["jquery.min.js"]
    });

    // تزریق CSS
    await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["Style.css"]
    });

    // اجرای فایل اصلی
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["AGLPIInjection.js"]
    });

});
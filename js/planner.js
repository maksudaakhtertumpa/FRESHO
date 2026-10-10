/* =========================================================
   FRESHO - WEEKLY GROCERY PLANNER
   Lets the user plan grocery items per day of the week,
   check them off, remove them, and see a week overview.

   State is kept in memory only (no storage), matching the
   pattern used elsewhere on this site - it resets on reload,
   which is expected for a static demo page.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("planner-form");

    if (!form) {
        // Planner markup is not on this page - stop safely.
        return;
    }

    const DAYS = [
        { key: "mon", label: "Monday" },
        { key: "tue", label: "Tuesday" },
        { key: "wed", label: "Wednesday" },
        { key: "thu", label: "Thursday" },
        { key: "fri", label: "Friday" },
        { key: "sat", label: "Saturday" },
        { key: "sun", label: "Sunday" },
    ];

    const dayLabel = {};
    DAYS.forEach(function (d) { dayLabel[d.key] = d.label; });

    // In-memory planner state: { mon: [{id, text, done}], tue: [...], ... }
    const plan = {};
    DAYS.forEach(function (d) { plan[d.key] = []; });

    let activeDay = "mon";
    let nextId = 1;

    const tabs = document.querySelectorAll(".planner-tab");
    const dayTitle = document.getElementById("planner-day-title");
    const itemInput = document.getElementById("planner-item-input");
    const errorEl = document.getElementById("planner-error");
    const listEl = document.getElementById("planner-list");
    const emptyEl = document.getElementById("planner-empty");
    const weekBreakdownEl = document.getElementById("planner-week-breakdown");
    const totalCountEl = document.getElementById("planner-total-count");
    const checkedCountEl = document.getElementById("planner-checked-count");
    const clearWeekBtn = document.getElementById("planner-clear-week-btn");


    /* =====================================================
       RENDERING
    ====================================================== */

    function renderList() {

        const items = plan[activeDay];
        listEl.innerHTML = "";

        items.forEach(function (item) {

            const li = document.createElement("li");
            li.className = "planner-item" + (item.done ? " done" : "");
            li.dataset.id = item.id;

            const label = document.createElement("label");
            label.className = "planner-item-label";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = item.done;
            checkbox.setAttribute("aria-label", "Mark \"" + item.text + "\" as bought");
            checkbox.addEventListener("change", function () {
                item.done = checkbox.checked;
                renderList();
                renderSummary();
            });

            const span = document.createElement("span");
            span.textContent = item.text;

            label.appendChild(checkbox);
            label.appendChild(span);

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "planner-remove-btn";
            removeBtn.setAttribute("aria-label", "Remove \"" + item.text + "\"");
            removeBtn.textContent = "\u00d7";
            removeBtn.addEventListener("click", function () {
                plan[activeDay] = plan[activeDay].filter(function (i) { return i.id !== item.id; });
                renderList();
                renderSummary();
            });

            li.appendChild(label);
            li.appendChild(removeBtn);
            listEl.appendChild(li);
        });

        emptyEl.hidden = items.length > 0;
    }

    function renderSummary() {

        weekBreakdownEl.innerHTML = "";

        let totalCount = 0;
        let checkedCount = 0;

        DAYS.forEach(function (d) {

            const items = plan[d.key];
            const doneCount = items.filter(function (i) { return i.done; }).length;

            totalCount += items.length;
            checkedCount += doneCount;

            const li = document.createElement("li");
            li.className = "planner-week-row" + (d.key === activeDay ? " current" : "");
            li.innerHTML =
                "<span>" + d.label + "</span>" +
                "<strong>" + doneCount + " / " + items.length + "</strong>";
            weekBreakdownEl.appendChild(li);
        });

        totalCountEl.textContent = totalCount;
        checkedCountEl.textContent = checkedCount;
    }

    function switchDay(dayKey) {

        activeDay = dayKey;
        dayTitle.textContent = dayLabel[dayKey];

        tabs.forEach(function (tab) {
            const isActive = tab.dataset.day === dayKey;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        hideError();
        renderList();
        renderSummary();
    }


    /* =====================================================
       ERROR HANDLING
    ====================================================== */

    function showError(message) {
        errorEl.textContent = message;
        errorEl.hidden = false;
    }

    function hideError() {
        errorEl.textContent = "";
        errorEl.hidden = true;
    }


    /* =====================================================
       EVENTS
    ====================================================== */

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            switchDay(tab.dataset.day);
        });
    });

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = itemInput.value.trim();

        if (text === "") {
            showError("Please type an item before adding it.");
            itemInput.focus();
            return;
        }

        const isDuplicate = plan[activeDay].some(function (item) {
            return item.text.toLowerCase() === text.toLowerCase();
        });

        if (isDuplicate) {
            showError("\"" + text + "\" is already on this day's list.");
            return;
        }

        hideError();

        plan[activeDay].push({ id: nextId, text: text, done: false });
        nextId += 1;

        itemInput.value = "";
        itemInput.focus();

        renderList();
        renderSummary();
    });

    itemInput.addEventListener("input", hideError);

    clearWeekBtn.addEventListener("click", function () {

        DAYS.forEach(function (d) { plan[d.key] = []; });
        hideError();
        renderList();
        renderSummary();
    });


    /* =====================================================
       INITIAL RENDER
    ====================================================== */

    renderList();
    renderSummary();

});

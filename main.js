const people = [
        {
          name: "Olivia Chen",
          initials: "OC",
          color: "blue",
          department: "Design",
          role: "Product Designer",
          time: "8:52 AM",
          out: "—",
          hours: "4h 12m",
          mode: "Office",
          status: "Present",
          score: 96,
        },
        {
          name: "Noah Williams",
          initials: "NW",
          color: "green",
          department: "Engineering",
          role: "Engineering Lead",
          time: "8:47 AM",
          out: "—",
          hours: "4h 18m",
          mode: "Remote",
          status: "Present",
          score: 92,
        },
        {
          name: "Ava Patel",
          initials: "AP",
          color: "orange",
          department: "Marketing",
          role: "Marketing Manager",
          time: "9:12 AM",
          out: "—",
          hours: "3h 53m",
          mode: "Office",
          status: "Late",
          score: 89,
        },
        {
          name: "Liam Johnson",
          initials: "LJ",
          color: "pink",
          department: "Engineering",
          role: "Frontend Developer",
          time: "8:58 AM",
          out: "—",
          hours: "4h 06m",
          mode: "Remote",
          status: "Present",
          score: 85,
        },
        {
          name: "Mia Rodriguez",
          initials: "MR",
          color: "blue",
          department: "People",
          role: "People Partner",
          time: "9:03 AM",
          out: "—",
          hours: "4h 01m",
          mode: "Office",
          status: "Present",
          score: 82,
        },
        {
          name: "Ethan Kim",
          initials: "EK",
          color: "green",
          department: "Sales",
          role: "Account Executive",
          time: "9:18 AM",
          out: "—",
          hours: "3h 46m",
          mode: "Office",
          status: "Late",
          score: 78,
        },
        {
          name: "Isabella Brown",
          initials: "IB",
          color: "orange",
          department: "Finance",
          role: "Financial Analyst",
          time: "—",
          out: "—",
          hours: "—",
          mode: "—",
          status: "Absent",
          score: 73,
        },
        {
          name: "Lucas Garcia",
          initials: "LG",
          color: "pink",
          department: "Design",
          role: "UX Researcher",
          time: "9:01 AM",
          out: "—",
          hours: "4h 03m",
          mode: "Remote",
          status: "Remote",
          score: 71,
        },
      ];
      const taskDefaults = [
        {
          title: "Finalize Q4 design review",
          due: "10:30 AM",
          priority: "High",
          done: true,
        },
        {
          title: "Weekly product sync",
          due: "11:00 AM",
          priority: "Normal",
          done: true,
        },
        {
          title: "Review sprint goals with team",
          due: "2:00 PM",
          priority: "High",
          done: false,
        },
        {
          title: "Share November performance notes",
          due: "4:00 PM",
          priority: "Low",
          done: false,
        },
      ];
      const goals = [
        {
          title: "Ship the customer insights dashboard",
          team: "Product & Design",
          progress: 82,
        },
        {
          title: "Improve onboarding completion rate",
          team: "Growth",
          progress: 68,
        },
        {
          title: "Reduce customer response time",
          team: "Customer Success",
          progress: 91,
        },
        {
          title: "Launch Q4 reliability improvements",
          team: "Engineering",
          progress: 74,
        },
      ];
      const getSaved = (key, fallback) => {
        try {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : fallback;
        } catch (error) {
          console.error(`Unable to read ${key} from local storage.`, error);
          return fallback;
        }
      };
      let tasks = getSaved("orbitTasks", taskDefaults);
      let extraPeople = getSaved("orbitAttendance", []);
      let clockedIn = getSaved("orbitClockedIn", false);
      let clockStarted = getSaved("orbitClockStarted", null);
      const allPeople = () => [...people, ...extraPeople];
      const initialsFor = (name) =>
        name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0].toUpperCase())
          .join("");
      const toast = (message) => {
        const node = document.getElementById("toast");
        node.textContent = message;
        node.classList.add("show");
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => node.classList.remove("show"), 2600);
      };
      const statusClass = (status) => status.toLowerCase();
      const personCell = (person) =>
        `<div class="person"><span class="avatar ${person.color || "blue"}">${person.initials || initialsFor(person.name)}</span><div><strong>${escapeHtml(person.name)}</strong><span>${escapeHtml(person.department || "Team")}</span></div></div>`;
      function escapeHtml(value) {
        return String(value).replace(
          /[&<>"']/g,
          (character) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            })[character],
        );
      }
      function renderOverview() {
        const rows = allPeople().slice(0, 5);
        document.getElementById("overviewAttendance").innerHTML = rows
          .map(
            (person) =>
              `<tr><td>${personCell(person)}</td><td>${escapeHtml(person.time || "—")}</td><td>${escapeHtml(person.mode || "—")}</td><td><span class="status ${statusClass(person.status)}">${escapeHtml(person.status)}</span></td></tr>`,
          )
          .join("");
        const leaders = [...people]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        document.getElementById("leaderList").innerHTML = leaders
          .map(renderProductivityRow)
          .join("");
      }
      function renderProductivityRow(person) {
        return `<div class="productivity-row"><div class="productivity-person"><span class="avatar ${person.color}">${person.initials}</span><span>${escapeHtml(person.name.split(" ")[0])}</span></div><div class="progress"><span style="width:${person.score}%"></span></div><strong>${person.score}%</strong></div>`;
      }
      function renderAttendance() {
        const query = document
          .getElementById("attendanceSearch")
          .value.trim()
          .toLowerCase();
        const filter = document.getElementById("attendanceFilter").value;
        const rows = allPeople().filter(
          (person) =>
            person.name.toLowerCase().includes(query) &&
            (filter === "all" || person.status === filter),
        );
        document.getElementById("attendanceRows").innerHTML = rows.length
          ? rows
              .map(
                (person) =>
                  `<tr><td>${personCell(person)}</td><td>${escapeHtml(person.department || "Team")}</td><td>${escapeHtml(person.time || "—")}</td><td>${escapeHtml(person.out || "—")}</td><td>${escapeHtml(person.hours || "—")}</td><td>${escapeHtml(person.mode || "—")}</td><td><span class="status ${statusClass(person.status)}">${escapeHtml(person.status)}</span></td></tr>`,
              )
              .join("")
          : `<tr><td colspan="7"><div class="empty-state">No team members match your filters.</div></td></tr>`;
      }
      function renderTasks() {
        document.getElementById("taskList").innerHTML = tasks.length
          ? tasks
              .map(
                (task, index) =>
                  `<div class="task-row ${task.done ? "done" : ""}"><input class="task-check" type="checkbox" data-task="${index}" ${task.done ? "checked" : ""} aria-label="Mark ${escapeHtml(task.title)} complete"><div class="task-copy"><strong>${escapeHtml(task.title)}</strong><span>Due ${escapeHtml(task.due)}</span></div><span class="priority ${task.priority.toLowerCase()}">${escapeHtml(task.priority)}</span></div>`,
              )
              .join("")
          : `<div class="empty-state">You're all clear. Add a task to plan your day.</div>`;
        document.getElementById("completedTasks").textContent =
          `${tasks.filter((task) => task.done).length} / ${tasks.length}`;
        localStorage.setItem("orbitTasks", JSON.stringify(tasks));
      }
      function renderAttendanceDate() {
        const value = document.getElementById("attendanceDate").value;
        if (!value) return;
        const date = new Date(`${value}T12:00:00`);
        document.getElementById("attendanceTableDate").textContent =
          `${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Showing ${allPeople().length} sample records`;
      }
      function renderScoreLists() {
        document.getElementById("productivityPeople").innerHTML = [...people]
          .sort((a, b) => b.score - a.score)
          .map(renderProductivityRow)
          .join("");
        document.getElementById("topPerformers").innerHTML = [...people]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(renderProductivityRow)
          .join("");
        document.getElementById("goalsList").innerHTML = goals
          .map(
            (goal) =>
              `<div class="score-row"><div class="score-info"><div><strong>${escapeHtml(goal.title)}</strong><div style="margin-top:4px;color:#9aa3b0;font-size:9px">${escapeHtml(goal.team)}</div></div><span>${goal.progress}%</span></div><div class="progress"><span style="width:${goal.progress}%"></span></div></div>`,
          )
          .join("");
      }
      function renderTeam() {
        const query = document
          .getElementById("teamSearch")
          .value.trim()
          .toLowerCase();
        const matches = allPeople().filter(
          (person) =>
            person.name.toLowerCase().includes(query) ||
            (person.department || "").toLowerCase().includes(query),
        );
        document.getElementById("teamRows").innerHTML =
          matches
            .map(
              (person) =>
                `<tr><td>${personCell(person)}</td><td>${escapeHtml(person.department || "Team")}</td><td>${escapeHtml(person.role || "Team member")}</td><td>${escapeHtml(person.mode === "Remote" ? "Remote" : "New York, NY")}</td><td><span class="status ${statusClass(person.status)}">${person.status === "Absent" ? "Away" : "Available"}</span></td></tr>`,
            )
            .join("") ||
          `<tr><td colspan="5"><div class="empty-state">No team members found.</div></td></tr>`;
      }
      function updateClockUI() {
        const label = clockedIn
          ? `Clocked in${clockStarted ? ` · ${new Date(clockStarted).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : ""}`
          : "Not clocked in";
        document.getElementById("clockStatus").textContent = label;
        document.getElementById("timeClockStatus").textContent = label;
        document.querySelectorAll(".clock-button").forEach((button) => {
          button.classList.toggle("is-clocked", clockedIn);
          const text = button.querySelector("span");
          if (text) text.textContent = clockedIn ? "Clock out" : "Clock in";
        });
      }
      function showView(name) {
        document
          .querySelectorAll(".view")
          .forEach((view) =>
            view.classList.toggle("active", view.id === `view-${name}`),
          );
        document
          .querySelectorAll(".nav-item")
          .forEach((item) =>
            item.classList.toggle("active", item.dataset.view === name),
          );
        const active = document.querySelector(`.nav-item[data-view="${name}"]`);
        const label = active
          ? Array.from(active.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent)
              .join("")
              .trim()
          : "Overview";
        document.getElementById("breadcrumbPage").textContent = label;
        document.getElementById("sidebar").classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      function downloadCsv(filename, rows) {
        const csv = rows
          .map((row) =>
            row
              .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
              .join(","),
          )
          .join("\r\n");
        const url = URL.createObjectURL(
          new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function exportAttendance() {
        const rows = [
          [
            "Name",
            "Department",
            "Clock in",
            "Clock out",
            "Hours",
            "Work mode",
            "Status",
          ],
          ...allPeople().map((person) => [
            person.name,
            person.department,
            person.time,
            person.out,
            person.hours,
            person.mode,
            person.status,
          ]),
        ];
        downloadCsv("orbit-attendance-sheet.csv", rows);
        toast("Attendance sheet exported.");
      }
      function exportProductivity() {
        downloadCsv("orbit-productivity-report.csv", [
          ["Name", "Department", "Focus score"],
          ...people.map((person) => [
            person.name,
            person.department,
            `${person.score}%`,
          ]),
        ]);
        toast("Productivity report exported.");
      }
      function bindExport(id, filename, rows, message) {
        document.getElementById(id).addEventListener("click", () => {
          downloadCsv(filename, rows);
          toast(message);
        });
      }
      document
        .querySelectorAll(".nav-item, [data-view]")
        .forEach((button) =>
          button.addEventListener("click", () => showView(button.dataset.view)),
        );
      document
        .getElementById("menuToggle")
        .addEventListener("click", () =>
          document.getElementById("sidebar").classList.toggle("open"),
        );
      document
        .getElementById("attendanceSearch")
        .addEventListener("input", renderAttendance);
      document
        .getElementById("attendanceFilter")
        .addEventListener("change", renderAttendance);
      document
        .getElementById("attendanceDate")
        .addEventListener("change", renderAttendanceDate);
      document
        .getElementById("teamSearch")
        .addEventListener("input", renderTeam);
      document
        .getElementById("globalSearch")
        .addEventListener("keydown", (event) => {
          if (event.key === "Enter" && event.currentTarget.value.trim()) {
            const query = event.currentTarget.value.trim();
            document.getElementById("attendanceSearch").value = query;
            showView("attendance");
            renderAttendance();
            event.currentTarget.value = "";
          }
        });
      document
        .getElementById("clockButton")
        .addEventListener("click", toggleClock);
      document
        .querySelectorAll("[data-clock]")
        .forEach((button) => button.addEventListener("click", toggleClock));
      function toggleClock() {
        clockedIn = !clockedIn;
        clockStarted = clockedIn ? new Date().toISOString() : null;
        localStorage.setItem("orbitClockedIn", JSON.stringify(clockedIn));
        localStorage.setItem("orbitClockStarted", JSON.stringify(clockStarted));
        updateClockUI();
        toast(
          clockedIn
            ? "You're clocked in. Have a focused day!"
            : "You're clocked out. Your time has been saved.",
        );
      }
      document
        .getElementById("taskList")
        .addEventListener("change", (event) => {
          const input = event.target.closest("[data-task]");
          if (!input) return;
          tasks[Number(input.dataset.task)].done = input.checked;
          renderTasks();
        });
      document
        .getElementById("newTaskButton")
        .addEventListener("click", () =>
          document.getElementById("taskDialog").showModal(),
        );
      document
        .getElementById("taskForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const time = String(data.get("due"));
          const [hour, minute] = time.split(":").map(Number);
          const due = new Date(2000, 0, 1, hour, minute).toLocaleTimeString(
            [],
            { hour: "numeric", minute: "2-digit" },
          );
          tasks.push({
            title: String(data.get("title")).trim(),
            due,
            priority: String(data.get("priority")),
            done: false,
          });
          renderTasks();
          event.currentTarget.reset();
          document.getElementById("taskDialog").close();
          toast("Task added to your day.");
        });
      document
        .getElementById("clearCompleted")
        .addEventListener("click", () => {
          const before = tasks.length;
          tasks = tasks.filter((task) => !task.done);
          renderTasks();
          toast(
            before === tasks.length
              ? "No completed tasks to clear."
              : "Completed tasks cleared.",
          );
        });
      document
        .querySelectorAll("[data-close-dialog]")
        .forEach((button) =>
          button.addEventListener("click", () =>
            button.closest("dialog").close(),
          ),
        );
      document
        .getElementById("addAttendance")
        .addEventListener("click", () =>
          document.getElementById("entryDialog").showModal(),
        );
      document
        .getElementById("entryForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const status = String(data.get("status"));
          extraPeople.push({
            name: String(data.get("name")).trim(),
            initials: initialsFor(String(data.get("name"))),
            color: "blue",
            department: String(data.get("department")).trim(),
            role: "Team member",
            time:
              status === "Absent"
                ? "—"
                : new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  }),
            out: "—",
            hours: status === "Absent" ? "—" : "0h 00m",
            mode:
              status === "Remote"
                ? "Remote"
                : status === "Absent"
                  ? "—"
                  : "Office",
            status,
            score: 75,
          });
          localStorage.setItem("orbitAttendance", JSON.stringify(extraPeople));
          renderAttendance();
          renderOverview();
          renderAttendanceDate();
          renderTeam();
          event.currentTarget.reset();
          document.getElementById("entryDialog").close();
          toast("Attendance entry added.");
        });
      document
        .getElementById("exportAttendance")
        .addEventListener("click", exportAttendance);
      document
        .getElementById("reportAttendance")
        .addEventListener("click", exportAttendance);
      document
        .getElementById("exportProductivity")
        .addEventListener("click", exportProductivity);
      document
        .getElementById("reportProductivity")
        .addEventListener("click", exportProductivity);
      bindExport(
        "exportPerformance",
        "orbit-performance-report.csv",
        [
          ["Goal", "Team", "Progress"],
          ...goals.map((goal) => [goal.title, goal.team, `${goal.progress}%`]),
        ],
        "Performance report exported.",
      );
      bindExport(
        "reportPerformance",
        "orbit-performance-report.csv",
        [
          ["Goal", "Team", "Progress"],
          ...goals.map((goal) => [goal.title, goal.team, `${goal.progress}%`]),
        ],
        "Performance report exported.",
      );
      bindExport(
        "reportTime",
        "orbit-time-report.csv",
        [
          ["Team member", "Hours tracked this week"],
          ...people.map((person) => [person.name, person.hours]),
        ],
        "Time report exported.",
      );
      document
        .getElementById("addGoal")
        .addEventListener("click", () =>
          toast("Goal creation is ready to connect to your workspace."),
        );
      document
        .getElementById("inviteMember")
        .addEventListener("click", () =>
          toast("Invite flow is ready to connect to your workspace."),
        );
      document
        .getElementById("notificationButton")
        .addEventListener("click", () =>
          toast("You're all caught up on notifications."),
        );
      document
        .getElementById("todayButton")
        .addEventListener("click", () =>
          toast("Showing today's team activity."),
        );
      document
        .getElementById("chartRange")
        .addEventListener("change", (event) =>
          toast(
            `Showing productivity for ${event.target.value === "week" ? "this week" : "this month"}.`,
          ),
        );
      renderOverview();
      renderAttendance();
      renderTasks();
      renderScoreLists();
      renderTeam();
      renderAttendanceDate();
      updateClockUI();
const defaultData = {
  profile: {
    name: "林知夏",
    phone: "138 0000 0000",
    email: "hello@example.com",
    location: "上海",
    website: "github.com/example",
    headline: "产品设计师｜用户体验与品牌表达｜上海交通大学 2024 届",
    schoolIcon: "",
  },
  education: [
    {
      school: "上海交通大学",
      tier: "985 / 211",
      major: "工业设计｜本科",
      date: "2020.09 — 2024.06",
      detail: "优秀毕业生 · 校级奖学金",
      logo: "",
    },
  ],
  internships: [
    {
      company: "远山科技｜用户体验部",
      role: "产品设计实习生",
      date: "2023.07 — 2023.10",
      summary:
        "参与智能办公产品的体验设计与品牌升级｜Figma / Illustrator / Notion",
      logo: "",
      tone: "blue",
      projects: [
        {
          title: "智能会议助手 2.0",
          role: "体验设计与交互系统",
          background:
            "面向团队协作的智能会议记录与跟进工具，重点解决会议信息分散和行动项容易遗漏的问题。",
          contribution:
            "负责用户访谈、需求拆解到高保真交互原型的完整设计流程。\n建立组件化设计规范与交互状态库，推动设计与研发协作效率提升。\n联合运营团队完成可用性测试，收集反馈并完成三轮体验迭代。",
          bullets: [
            "负责从用户访谈、需求拆解到高保真交互原型的完整设计流程，覆盖会议创建、协同记录与会后跟进。",
            "建立组件化设计规范与交互状态库，推动设计与研发协作效率提升，核心页面交付周期缩短 30%。",
            "联合运营团队完成产品上线前可用性测试，收集 40+ 条有效反馈并完成三轮体验迭代。",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      company: "拾光计划｜个人项目",
      role: "独立设计与开发",
      date: "2022.11 — 至今",
      summary: "面向年轻人的生活记录与目标管理工具｜React / TypeScript / Figma",
      logo: "",
      tone: "gray",
      projects: [
        {
          title: "温柔而坚定的日程系统",
          role: "产品设计 · 前端实现",
          introduction:
            "面向年轻人的生活记录与目标管理工具，帮助用户建立温和而持续的日常节奏。",
          highlights:
            "重新组织信息架构，首屏任务完成率提升至 86%。\n设计可扩展的视觉系统，并独立完成响应式 Web 端实现。",
          bullets: [
            "从真实用户需求出发设计核心任务流，重新组织信息架构，首屏任务完成率提升至 86%。",
            "设计一套轻量、可扩展的视觉系统，并独立完成响应式 Web 端的前端实现。",
          ],
        },
      ],
    },
  ],
  honors: [{ title: "全国大学生广告艺术大赛", detail: "省级一等奖 · 2023" }],
  skills: [
    {
      title: "设计工具",
      detail:
        "熟练使用 Figma、Illustrator、Photoshop，能够独立完成界面、图标与品牌视觉设计。",
    },
    {
      title: "用户体验",
      detail:
        "熟悉用户访谈、可用性测试、竞品分析和用户旅程地图，重视从问题出发的设计决策。",
    },
    {
      title: "协作与交付",
      detail:
        "熟悉设计规范、组件库和研发协作流程，能够清晰表达设计意图并推动方案落地。",
    },
    {
      title: "前端基础",
      detail:
        "了解 HTML、CSS、JavaScript 与 React，能将设计稿还原为细节可靠的交互页面。",
    },
  ],
};
let data = loadData();
let editing = true;
const paperSizes = {
  a4: { label: "A4", width: 210, height: 297, pdf: "a4" },
  letter: { label: "Letter", width: 216, height: 279, pdf: "letter" },
  legal: { label: "Legal", width: 216, height: 356, pdf: "legal" },
};
let exportSettings = loadExportSettings();
const $ = (s) => document.querySelector(s);
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m])
  );
const uid = () => Math.random().toString(36).slice(2, 8);
function loadData() {
  try {
    const saved =
      JSON.parse(localStorage.getItem("resume-studio-data")) ||
      structuredClone(defaultData);
    if (saved.profile) {
      saved.profile.schoolIcon =
        saved.profile.schoolIcon || saved.profile.avatar || "";
      delete saved.profile.avatar;
    }
    migrateProjectText(saved.internships, "internships");
    migrateProjectText(saved.projects, "projects");
    saved.projects = flattenProjects(saved.projects);
    return saved;
  } catch {
    return structuredClone(defaultData);
  }
  function migrateProjectText(items, kind) {
    (items || []).forEach((item) =>
      (item.projects || []).forEach((project) => {
        if (kind === "internships") {
          project.contribution =
            project.contribution || (project.bullets || []).join("\n");
          project.background = project.background || "";
        } else {
          project.highlights =
            project.highlights || (project.bullets || []).join("\n");
          project.introduction = project.introduction || "";
        }
      })
    );
  }
  function flattenProjects(items) {
    return (items || []).flatMap((item) => {
      if (!Array.isArray(item.projects)) return [item];
      return item.projects.map((project) => ({
        company: project.title || item.company,
        role: project.role || item.role,
        date: item.date,
        summary: item.summary,
        logo: item.logo,
        tone: item.tone,
        introduction: project.introduction || "",
        highlights: project.highlights || (project.bullets || []).join("\n"),
      }));
    });
  }
}
function loadExportSettings() {
  try {
    return {
      paper: "a4",
      onePage: true,
      ...JSON.parse(localStorage.getItem("resume-studio-export")),
    };
  } catch {
    return { paper: "a4", onePage: true };
  }
}
function saveExportSettings() {
  localStorage.setItem("resume-studio-export", JSON.stringify(exportSettings));
}
function saveData(message = "已保存到本地") {
  localStorage.setItem("resume-studio-data", JSON.stringify(data));
  $("#saveStatus").textContent =
    "已保存 · " +
    new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  showToast(message);
}
function showToast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}
function input(label, path, value, type = "input") {
  return `<div class="field"><label>${label}</label>${
    type === "textarea"
      ? `<textarea data-path="${path}">${esc(value)}</textarea>`
      : `<input data-path="${path}" value="${esc(value)}">`
  }</div>`;
}
function richTextArea(label, path, value) {
  const id = `rich-${uid()}`;
  return `<div class="field full rich-field"><label>${label}</label><div class="rich-toolbar"><button type="button" class="btn btn-small btn-ghost bold-button" data-bold-target="${id}" title="将选中文字加粗"><strong>B</strong></button></div><textarea id="${id}" data-path="${path}">${esc(
    value
  )}</textarea></div>`;
}
function renderEditor() {
  let html = `<div class="form-card"><div class="card-head"><h2>个人信息 <span>PROFILE</span></h2></div><div class="card-body"><div class="photo-row">${
    data.profile.schoolIcon
      ? `<img class="photo-preview" src="${data.profile.schoolIcon}" alt="学校图标">`
      : ""
  }<div><strong style="font-size:13px;color:var(--ink)">学校图标</strong><div><label class="upload-label">上传图片<input type="file" accept="image/*" data-image="profile.schoolIcon"></label><button class="btn btn-small btn-ghost" data-clear-image="profile.schoolIcon">移除</button></div></div></div><div class="field-grid" style="margin-top:15px">${input(
    "姓名",
    "profile.name",
    data.profile.name
  )}${input("所在地", "profile.location", data.profile.location)}${input(
    "手机",
    "profile.phone",
    data.profile.phone
  )}${input("邮箱", "profile.email", data.profile.email)}${input(
    "GitHub 链接",
    "profile.website",
    data.profile.website
  )}${input(
    "求职定位",
    "profile.headline",
    data.profile.headline
  )}</div></div></div>`;
  html += sectionEditor(
    "教育背景",
    "education",
    "学校与专业",
    data.education,
    (item) =>
      `<div class="field-grid">${input("学校", "school", item.school)}${input(
        "时间",
        "date",
        item.date
      )}${input("专业 / 学位", "major", item.major)}${input(
        "学校标签",
        "tier",
        item.tier
      )}${input(
        "补充信息",
        "detail",
        item.detail
      )}<div class="field"><label>校徽</label><label class="upload-label">上传图片<input type="file" accept="image/*" data-image="education.${
        item._index
      }.logo"></label></div></div>`,
    "edu"
  );
  html += sectionEditor(
    "实习经历",
    "internships",
    "公司与岗位",
    data.internships,
    (item) => companyEditor(item),
    "intern"
  );
  html += sectionEditor(
    "项目经历",
    "projects",
    "项目集合",
    data.projects,
    (item) => projectEditor(item),
    "project"
  );
  html += sectionEditor(
    "荣誉奖项",
    "honors",
    "获奖记录",
    data.honors,
    (item) =>
      `<div class="field-grid">${input("奖项名称", "title", item.title)}</div>`,
    "honor"
  );
  html += sectionEditor(
    "专业技能",
    "skills",
    "能力概览",
    data.skills,
    (item) =>
      `<div class="field-grid">${input("技能分类", "title", item.title)}${input(
        "描述",
        "detail",
        item.detail,
        "textarea"
      )}</div>`,
    "skill"
  );
  html += `<div class="form-card"><div class="card-head"><h2>添加模块 <span>SECTIONS</span></h2></div><div class="card-body"><div class="add-row" style="justify-content:flex-start;flex-wrap:wrap;gap:8px">${
    [
      ["education", "教育背景"],
      ["internships", "实习经历"],
      ["projects", "项目经历"],
      ["honors", "荣誉奖项"],
      ["skills", "专业技能"],
    ]
      .map(([key, title]) =>
        data[key]
          ? ""
          : `<button class="btn btn-small btn-ghost" data-restore-section="${key}">＋ ${title}</button>`
      )
      .join("") || '<div class="empty-state">所有标准模块都已展示。</div>'
  }</div></div></div>`;
  $("#editorRoot").innerHTML = html;
  bindEditor();
}
function companyEditor(item) {
  return `<div class="field-grid">${input(
    "公司 / 项目名称",
    "company",
    item.company
  )}${input("时间", "date", item.date)}${input(
    "岗位 / 身份",
    "role",
    item.role
  )}${input(
    "概述与技术栈",
    "summary",
    item.summary,
    "textarea"
  )}</div><div style="margin-top:12px"><label class="upload-label">上传公司 / 项目图标<input type="file" accept="image/*" data-image="${
    item._kind
  }.${
    item._index
  }.logo"></label><button class="btn btn-small btn-ghost" data-clear-image="${
    item._kind
  }.${
    item._index
  }.logo">移除图标</button></div><div style="margin-top:14px"><label style="font-size:12px;font-weight:700;color:#52616e">子项目</label>${
    (item.projects || [])
      .map(
        (project, index) =>
          `<div class="item-card" style="margin-top:7px"><div class="item-head"><strong>项目 ${
            index + 1
          }</strong><div class="item-actions"><button class="btn btn-small btn-danger" data-remove-project="${
            item._kind
          }.${
            item._index
          }.${index}">删除</button></div></div><div class="field-grid">${input(
            "项目名称",
            `projects.${index}.title`,
            project.title
          )}${input("项目角色", `projects.${index}.role`, project.role)}${
            item._kind === "internships"
              ? `${richTextArea(
                  "业务背景",
                  `projects.${index}.background`,
                  project.background || ""
                )}${richTextArea(
                  "我的贡献",
                  `projects.${index}.contribution`,
                  project.contribution || (project.bullets || []).join("\n")
                )}`
              : `${richTextArea(
                  "项目介绍",
                  `projects.${index}.introduction`,
                  project.introduction || ""
                )}${richTextArea(
                  "技术亮点",
                  `projects.${index}.highlights`,
                  project.highlights || (project.bullets || []).join("\n")
                )}`
          }</div></div>`
      )
      .join("") ||
    '<div class="empty-state">还没有子项目，可添加一条经历。</div>'
  }<div class="add-row"><button class="btn btn-small btn-ghost" data-add-project="${
    item._kind
  }.${item._index}">＋ 添加子项目</button></div></div>`;
}
function projectEditor(item) {
  return `<div class="field-grid">${input(
    "项目名称",
    "company",
    item.company
  )}${input("时间", "date", item.date)}${input(
    "项目角色",
    "role",
    item.role
  )}${input(
    "概述与技术栈",
    "summary",
    item.summary,
    "textarea"
  )}</div><div style="margin-top:12px"><label class="upload-label">上传项目图标<input type="file" accept="image/*" data-image="projects.${
    item._index
  }.logo"></label><button class="btn btn-small btn-ghost" data-clear-image="projects.${
    item._index
  }.logo">移除图标</button></div>${richTextArea(
    "项目介绍",
    "introduction",
    item.introduction || ""
  )}${richTextArea("技术亮点", "highlights", item.highlights || "")}`;
}
function sectionEditor(title, key, label, items, body, type) {
  if (!items) return "";
  return `<div class="form-card"><div class="card-head"><h2>${title} <span>${label}</span></h2><button class="btn btn-small btn-danger" data-toggle-section="${key}">删除模块</button></div><div class="card-body">${
    items
      .map((item, index) => {
        item._index = index;
        item._kind = key;
        return `<div class="item-card" data-context="${key}.${index}"><div class="item-head"><strong>${title} ${
          index + 1
        }</strong><button class="btn btn-small btn-danger" data-remove-item="${key}.${index}">删除</button></div>${body(
          item
        )}</div>`;
      })
      .join("") || '<div class="empty-state">此模块暂时没有内容。</div>'
  }<div class="add-row"><button class="btn btn-small btn-ghost" data-add-item="${key}">＋ 添加${title}</button></div></div></div>`;
}
function placeholder(text) {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="200"><rect width="100%" height="100%" fill="#eef4f8"/><text x="50%" y="52%" text-anchor="middle" fill="#789" font-size="18">${text}</text></svg>`
    )
  );
}
function bindEditor() {
  $("#editorRoot")
    .querySelectorAll("[data-path]")
    .forEach((el) =>
      el.addEventListener("input", () => {
        const localPath = el.dataset.path.split(".");
        const context = el.closest("[data-context]")?.dataset.context;
        const path = (context ? context + "." : "") + el.dataset.path;
        const keys = path.split(".");
        let target = data;
        for (const key of keys.slice(0, -1)) {
          if (!isNaN(key)) target = target[Number(key)];
          else target = target[key];
        }
        target[keys.at(-1)] = el.value;
        if (el.tagName === "TEXTAREA" && localPath.at(-1) === "bullets")
          target[keys.at(-1)] = el.value.split("\n").filter(Boolean);
        renderPreview();
      })
    );
  $("#editorRoot")
    .querySelectorAll("[data-add-item]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          const key = el.dataset.addItem;
          data[key].push(blankItem(key));
          renderAll();
        })
    );
  $("#editorRoot")
    .querySelectorAll("[data-remove-item]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          const [key, index] = el.dataset.removeItem.split(".");
          data[key].splice(Number(index), 1);
          renderAll();
        })
    );
  $("#editorRoot")
    .querySelectorAll("[data-toggle-section]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          const key = el.dataset.toggleSection;
          data[key] = null;
          renderAll();
        })
    );
  $("#editorRoot")
    .querySelectorAll("[data-add-project]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          const [key, index] = el.dataset.addProject.split(".");
          data[key][Number(index)].projects.push({
            title: "新项目",
            role: "项目角色",
            ...(key === "internships"
              ? { background: "", contribution: "补充我的贡献。" }
              : { introduction: "", highlights: "补充技术亮点。" }),
            bullets: ["补充项目成果与职责。"],
          });
          renderAll();
        })
    );
  $("#editorRoot")
    .querySelectorAll("[data-remove-project]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          const [key, index, project] = el.dataset.removeProject.split(".");
          data[key][Number(index)].projects.splice(Number(project), 1);
          renderAll();
        })
    );
  $("#editorRoot")
    .querySelectorAll("[data-image]")
    .forEach((el) =>
      el.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const path = el.dataset.image.split(".");
          let target = data;
          for (const key of path.slice(0, -1))
            target = target[isNaN(key) ? key : Number(key)];
          target[path.at(-1)] = reader.result;
          renderAll();
        };
        reader.readAsDataURL(file);
      })
    );
  $("#editorRoot")
    .querySelectorAll("[data-clear-image]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          const path = el.dataset.clearImage.split(".");
          let target = data;
          for (const key of path.slice(0, -1))
            target = target[isNaN(key) ? key : Number(key)];
          target[path.at(-1)] = "";
          renderAll();
        })
    );
}
function blankItem(key) {
  if (key === "education")
    return {
      school: "新学校",
      tier: "",
      major: "专业｜学位",
      date: "20XX.09 — 20XX.06",
      detail: "",
      logo: "",
    };
  if (key === "projects")
    return {
      company: "新项目",
      role: "项目角色",
      date: "20XX.01 — 至今",
      summary: "补充项目概述与技术栈",
      logo: "",
      tone: "blue",
      introduction: "",
      highlights: "补充技术亮点。",
    };
  if (key === "internships")
    return {
      company: "新公司｜新团队",
      role: "岗位 / 身份",
      date: "20XX.01 — 至今",
      summary: "补充经历概述与技术栈",
      logo: "",
      tone: "blue",
      projects: [
        {
          title: "新项目",
          role: "项目角色",
          bullets: ["补充项目职责、行动与成果。"],
        },
      ],
    };
  if (key === "honors") return { title: "新奖项" };
  return { title: "新技能", detail: "补充技能描述。" };
}
function renderPreview() {
  const p = data.profile;
  let html = `<header class="resume-header${
    p.schoolIcon ? "" : " no-school-icon"
  }"><div><h1 class="resume-name">${esc(
    p.name
  )}</h1><div class="resume-contact"><span>☎ ${esc(
    p.phone
  )}</span><span>✉ ${esc(p.email)}</span>${
    p.location ? `<span>⌖ ${esc(p.location)}</span>` : ""
  }${
    p.website
      ? `<span class="resume-link github-link">${githubIcon()}${esc(
          p.website
        )}</span>`
      : ""
  }</div><p class="resume-headline">${esc(p.headline)}</p></div>${
    p.schoolIcon
      ? `<img class="resume-avatar" src="${p.schoolIcon}" alt="学校图标">`
      : ""
  }</header>`;
  if (data.education)
    html += `<section class="resume-section"><h2 class="resume-section-title">教育背景</h2>${data.education
      .map(educationHtml)
      .join("")}</section>`;
  if (data.internships)
    html += `<section class="resume-section"><h2 class="resume-section-title">实习经历</h2>${data.internships
      .map(employerHtml)
      .join("")}</section>`;
  if (data.projects) html += projectSectionHtml(data.projects);
  if (data.honors)
    html += `<section class="resume-section"><h2 class="resume-section-title">荣誉奖项</h2><ul class="narrative">${data.honors
      .map((x) => `<li><span class="label">${esc(x.title)}</span></li>`)
      .join("")}</ul></section>`;
  if (data.skills)
    html += `<section class="resume-section"><h2 class="resume-section-title">专业技能</h2><ul class="skills">${data.skills
      .map((x) => `<li><strong>${esc(x.title)}：</strong>${esc(x.detail)}</li>`)
      .join("")}</ul></section>`;
  $("#resume").className = `resume paper-${exportSettings.paper}`;
  $("#resume").innerHTML = html;
  $("#paperSize").value = exportSettings.paper;
  $("#fitOnePage").checked = exportSettings.onePage;
}
function educationHtml(x) {
  return `<div class="education"><img class="school-logo" src="${
    x.logo || placeholder("校徽")
  }" alt=""><div class="edu-main">${esc(x.school)} ${
    x.tier ? `<span class="school-tier">${esc(x.tier)}</span>` : ""
  }｜${esc(x.major)}</div><div class="resume-date">${esc(
    x.date
  )}</div><div class="edu-sub">${esc(x.detail)}</div></div>`;
}
function employerHtml(x) {
  return `<article class="employer"><div class="employer-band ${
    x.tone === "blue" ? "blue" : ""
  }">${
    x.logo ? `<img class="company-logo" src="${x.logo}" alt="">` : ""
  }<div class="employer-name"${x.logo ? "" : ' style="grid-column:1/3"'}>${esc(
    x.company
  )}</div><div class="employer-date">${esc(
    x.date
  )}</div></div><p class="employer-summary">${esc(x.summary)}</p>${(
    x.projects || []
  )
    .map((project) =>
      projectHtml(
        project,
        data.internships?.includes(x) ? "internships" : "projects"
      )
    )
    .join("")}</article>`;
}
function projectEmployerHtml(x) {
  return `<article class="employer"><div class="employer-band ${
    x.tone === "blue" ? "blue" : ""
  }">${
    x.logo ? `<img class="company-logo" src="${x.logo}" alt="">` : ""
  }<div class="employer-name"${x.logo ? "" : ' style="grid-column:1/3"'}>${esc(
    x.company
  )}</div><div class="employer-date">${esc(
    x.date
  )}</div></div><p class="employer-summary">${esc(x.summary)}</p>${projectHtml(
    x,
    "projects"
  )}</article>`;
}
function projectSectionHtml(projects) {
  const [first, ...rest] = projects;
  return `<section class="resume-section project-section"><div class="project-lead"><h2 class="resume-section-title">项目经历</h2>${
    first ? projectEmployerHtml(first) : ""
  }</div>${rest.map(projectEmployerHtml).join("")}</section>`;
}
function projectHtml(x, kind) {
  const firstLabel = kind === "internships" ? "业务背景" : "项目介绍";
  const secondLabel = kind === "internships" ? "我的贡献" : "技术亮点";
  const firstText = kind === "internships" ? x.background : x.introduction;
  const secondText = kind === "internships" ? x.contribution : x.highlights;
  const titleRow =
    kind === "internships"
      ? `<div class="project-title-row"><h3 class="project-title">${esc(
          x.title || x.company
        )}</h3><span class="project-role">${esc(x.role)}</span></div>`
      : "";
  return `<section class="project">${titleRow}<ul class="narrative">${
    firstText
      ? `<li><span class="label">${firstLabel}：</span>${formatRichText(
          firstText
        )}</li>`
      : ""
  }${
    secondText
      ? `<li><span class="label">${secondLabel}：</span>${formatRichText(
          secondText
        )}</li>`
      : ""
  }</ul></section>`;
}
function formatRichText(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}
function formatBullet(text) {
  return esc(text).replace(/^([^：]{1,12}：)/, '<span class="label">$1</span>');
}
function githubIcon() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="#17212b" d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .7Z"/></svg>';
}
function renderAll() {
  renderEditor();
  renderPreview();
  $("#editorRoot")
    .querySelectorAll("[data-restore-section]")
    .forEach(
      (el) =>
        (el.onclick = () => {
          data[el.dataset.restoreSection] = [];
          renderAll();
        })
    );
  $("#editorRoot")
    .querySelectorAll("[data-bold-target]")
    .forEach(
      (button) =>
        (button.onclick = () => {
          const textarea = document.getElementById(button.dataset.boldTarget);
          if (!textarea || textarea.selectionStart === textarea.selectionEnd)
            return;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.setRangeText(
            `**${textarea.value.slice(start, end)}**`,
            start,
            end,
            "select"
          );
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          textarea.focus();
        })
    );
}
$("#editToggle").onclick = () => {
  editing = !editing;
  $("#editorPanel").classList.toggle("hidden", !editing);
  $("#editToggle").textContent = editing ? "完成编辑" : "编辑";
  if (!editing) saveData("简历状态已保存");
};
$("#editorRoot").addEventListener("click", (e) => {
  if (e.target.matches("[data-save]")) saveData();
});
$("#paperSize").addEventListener("change", (event) => {
  exportSettings.paper = event.target.value;
  saveExportSettings();
  renderPreview();
});
$("#fitOnePage").addEventListener("change", (event) => {
  exportSettings.onePage = event.target.checked;
  saveExportSettings();
});
async function exportOnePage(element, paper) {
  if (!window.html2pdf) return false;
  element.classList.add("export-compact");
  try {
    const worker = html2pdf()
      .set({
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        },
        jsPDF: { unit: "mm", format: paper.pdf, orientation: "portrait" },
      })
      .from(element)
      .toCanvas();
    const canvas = await worker.get("canvas");
    const pdfWorker = worker.toPdf();
    const workerPdf = await pdfWorker.get("pdf");
    if (!workerPdf?.internal || !workerPdf.deletePage || !workerPdf.addPage)
      return false;
    while (workerPdf.getNumberOfPages() > 0) {
      workerPdf.deletePage(workerPdf.getNumberOfPages());
    }
    workerPdf.addPage(paper.pdf, "portrait");
    const pageWidth = workerPdf.internal.pageSize.getWidth();
    const pageHeight = workerPdf.internal.pageSize.getHeight();
    const imageRatio = canvas.width / canvas.height;
    const pageRatio = pageWidth / pageHeight;
    const renderWidth =
      imageRatio > pageRatio ? pageWidth : pageHeight * imageRatio;
    const renderHeight = renderWidth / imageRatio;
    const left = (pageWidth - renderWidth) / 2;
    const top = (pageHeight - renderHeight) / 2;
    workerPdf.addImage(
      canvas.toDataURL("image/jpeg", 0.98),
      "JPEG",
      left,
      top,
      renderWidth,
      renderHeight
    );
    workerPdf.save(`${data.profile.name || "我的简历"}_简历.pdf`);
    return true;
  } finally {
    element.classList.remove("export-compact");
  }
}
$("#exportBtn").onclick = async () => {
  saveData("正在准备 PDF");
  const element = $("#resume");
  if (window.html2pdf) {
    const paper = paperSizes[exportSettings.paper] || paperSizes.a4;
    if (exportSettings.onePage && (await exportOnePage(element, paper))) {
      showToast("一页 PDF 已下载");
      return;
    }
    await html2pdf()
      .set({
        margin: 0,
        filename: `${data.profile.name || "我的简历"}_简历.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: { unit: "mm", format: paper.pdf, orientation: "portrait" },
      })
      .from(element)
      .save();
    showToast("PDF 已下载");
  } else {
    window.print();
  }
};
renderAll();

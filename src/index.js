import {
    exampleMap, exampleMapEnglish,
    descMap, descMapEnglish,
    iconMap,
    formMap, formMapEnglish,
    introMap, introMapEnglish,
    labelMap, labelMapEnglish,
} from './config/const';

const clsprefix = 'chrome-plugin-gpt-prompt';
const language = localStorage.getItem(`${clsprefix}-lang`) || 'chinese';
const backgroundPageUrl = localStorage.getItem(`${clsprefix}-backgroundPageUrl`) || 'https://huggingface.co/chat/';

// 创建侧边栏
var sidebar = document.createElement('div');
sidebar.className = `${clsprefix}-sidebar`;
// 创建container
var containers = document.createElement('div');
containers.className = `${clsprefix}-containers`;


function makeTab(iconTxt, index, needtabIcon = true) {
    var tab = document.createElement('div');
    tab.className = `${clsprefix}-tab`;
    if (iconMap[iconTxt]) {
        tab.innerHTML = iconMap[iconTxt];
        tab.style.borderLeft = '0';
    } else {
        tab.innerText = iconTxt;
    }
    tab.setAttribute('data-index', index);
    if (needtabIcon) {
        const tempSvg = document.createElement('div');
        tempSvg.className = `${clsprefix}-tab-icon`;
        tempSvg.innerHTML = iconMap['init'];
        tab.appendChild(tempSvg);
    }
    return tab;
}

function makeContainer(i) {
    var container = document.createElement('div');
    container.className = `${clsprefix}-container`;
    return container;
}

function addTabEvt(tab) {
    // 点击选项卡切换container
    tab.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        var index = this.getAttribute('data-index');
        var containers = document.querySelectorAll(`.${clsprefix}-container`);
        var currentContainer = containers[index];
        if (currentContainer.childNodes.length < 1) {
            setContainer(currentContainer, index);
        }
        setActiveTab(index);
    });
}

// 创建选项卡
var addTab = '＋';
var tabs = ['masks', 'P', addTab, 'setting'];
var tabCnt = 1;
for (var i = 0; i < tabs.length; i++) {

    var tab = makeTab(tabs[i], i, i == 1);
    sidebar.appendChild(tab);
    var container = makeContainer(i);
    containers.appendChild(container);

    if (tabs[i] === addTab) {
        tab.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            var sidebarLatest = document.querySelector(`.${clsprefix}-sidebar`);
            var containersLatest = document.querySelector(`.${clsprefix}-containers`);
            var idx = sidebarLatest.childNodes.length - 2;
            var newtab = makeTab(idx, idx);

            // 更新data-index
            sidebarLatest.lastChild.setAttribute('data-index', sidebarLatest.childNodes.length);
            var last2child = sidebarLatest.childNodes[sidebarLatest.childNodes.length - 2];
            last2child.setAttribute('data-index', sidebarLatest.childNodes.length - 1);

            sidebarLatest.insertBefore(newtab, last2child);
            addTabEvt(newtab);

            var newContainer = makeContainer(idx);
            containersLatest.insertBefore(newContainer, containersLatest.childNodes[containersLatest.childNodes.length - 2]);
        });
    } else {
        addTabEvt(tab);
    }
}

function createIframe(src) {
    var iframe = document.createElement('iframe');
    iframe.className = `${clsprefix}-container-iframe`;
    iframe.src = src;
    return iframe;
}

// 将侧边栏和container添加到页面中
// document.body.innerHTML = '';
document.body.appendChild(sidebar);
document.body.appendChild(containers);
document.querySelector(`.${clsprefix}-iframe-outside`).src = backgroundPageUrl;

// 初始化选中第一个选项卡
setActiveTab(0);
setIntro(containers.childNodes[0]);
setSetting(containers.lastChild);

// 设置选中的选项卡和对应的container
function setActiveTab(index) {
    var tabs = document.querySelectorAll(`.${clsprefix}-tab`);
    var containers = document.querySelectorAll(`.${clsprefix}-container`);

    console.log('setActiveTab', index);
    if (tabs[index].classList.contains('active')) {
        tabs[index].classList.remove('active');
        containers[index].style.display = 'none';
    } else {
        // 取消之前选中的选项卡和container
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
            containers[i].style.display = 'none';
        }
        // 设置当前选中的选项卡和对应的container
        tabs[index].classList.add('active');
        containers[index].style.display = index > 0 ? 'flex' : 'block';
    }
}

function makeInputRow(label, cls) {
    const inputRow = document.createElement('div');
    inputRow.classList.add(`${clsprefix}-input-group`);
    inputRow.innerHTML = `
        <span class="${clsprefix}-input-group-text">${label}</span>
        <textarea class="${clsprefix}-form-control ${cls}" aria-label="With textarea"></textarea>
    `;
    return inputRow;
}

function makeButton(text) {
    const btn = document.createElement('button');
    btn.classList.add(`${clsprefix}-button`);
    btn.classList.add(`${clsprefix}-button-primary`);
    btn.innerText = text;
    return btn;
}

function makeOutput(text) {
    const output = document.createElement('div');
    output.classList.add(`${clsprefix}-ouput`);
    output.innerHTML = `
        <div class="${clsprefix}-ouput-head">
            <span>${text}</span>
            <span class="${clsprefix}-clipboard">${iconMap['clipboard']}<span style="display:none">copied!</span></span>
        </div>
        <div class="${clsprefix}-ouput-cont" contenteditable="true">
        
        </div>
    `;
    return output;
}

function makePrompt({ role, demand, content }) {
    return `
    ${role}
    <br/><br/>
    ${demand}
    <br/><br/>
    \`\`\`<br/>
    ${content}
    <br/>
    \`\`\`
    `
}

function getDescMap() {
    if (language === 'chinese') {
        return descMap;
    } else {
        return descMapEnglish;
    }
}

function getLabelMap() {
    if (language === 'chinese') {
        return labelMap;
    } else {
        return labelMapEnglish;
    }
}

function getFormMap() {
    if (language === 'chinese') {
        return formMap;
    } else {
        return formMapEnglish;
    }
}

function getExampleMap() {
    if (language === 'chinese') {
        return exampleMap;
    } else {
        return exampleMapEnglish;
    }
}

function getIntroMap() {
    if (language === 'chinese') {
        return introMap;
    } else {
        return introMapEnglish;
    }
}

function setContainer(container, index) {
    // Create elements
    const leftCol = document.createElement('div');
    const leftRow1 = document.createElement('div');
    const leftRow1Select = document.createElement('select');
    leftRow1Select.classList.add(`${clsprefix}-select`);
    // Add content
    leftRow1Select.innerHTML = getLabelMap().map(lm => `<option value="${lm.key}">${lm.value}</option>`).join('');

    const leftRow1Desc = document.createElement('div');
    const leftRow1Left = document.createElement('div');
    const leftRow1Right = document.createElement('div');
    leftRow1Right.innerHTML = iconMap['init'];
    leftRow1Left.appendChild(leftRow1Select);
    leftRow1Right.appendChild(leftRow1Desc);
    leftRow1.appendChild(leftRow1Left);
    leftRow1.appendChild(leftRow1Right);

    // Add classes
    leftCol.classList.add(`${clsprefix}-left-col`);
    leftRow1.classList.add(`${clsprefix}-left-row`);
    leftRow1Left.classList.add(`${clsprefix}-left-row-left`);
    leftRow1Right.classList.add(`${clsprefix}-left-row-right`);
    leftRow1.classList.add(`${clsprefix}-left-row-header`);
    leftCol.appendChild(leftRow1);

    const formMap = getFormMap();
    leftCol.appendChild(makeInputRow(formMap.role, `${clsprefix}-role`));
    leftCol.appendChild(makeInputRow(formMap.demand, `${clsprefix}-demand`));
    leftCol.appendChild(makeInputRow(formMap.content, `${clsprefix}-content`));
    var button = makeButton(formMap.button)
    leftCol.appendChild(button);
    leftCol.appendChild(makeOutput('Effective AI Prompts：'));
    leftRow1Desc.textContent = getDescMap()[leftRow1Select.value];
    leftCol.querySelector(`.${clsprefix}-clipboard`).addEventListener('click', e => {
        e.stopImmediatePropagation();
        leftCol.querySelector(`.${clsprefix}-clipboard`).lastChild.style.display = 'inline';
        navigator.clipboard.writeText(leftCol.querySelector(`.${clsprefix}-ouput-cont`).innerText);
        setTimeout(() => {
            leftCol.querySelector(`.${clsprefix}-clipboard`).lastChild.style.display = 'none';
        }, 2e3);

    });
    button.addEventListener('click', e => {
        e.stopImmediatePropagation();
        leftCol.querySelector(`.${clsprefix}-ouput-cont`).innerHTML = makePrompt({
            role: leftCol.querySelector(`.${clsprefix}-role`).value,
            demand: leftCol.querySelector(`.${clsprefix}-demand`).value,
            content: leftCol.querySelector(`.${clsprefix}-content`).value,
        });
    });

    leftRow1Select.addEventListener('change', e => {
        e.stopImmediatePropagation();
        leftRow1Desc.textContent = getDescMap()[e.target.value];
        leftRow1Right.innerHTML = iconMap[e.target.value];
        leftRow1Right.appendChild(leftRow1Desc);
        var tabs = document.querySelectorAll(`.${clsprefix}-tab`);
        tabs[index].lastChild.innerHTML = iconMap[e.target.value];

        var eMap = getExampleMap();
        if (eMap[e.target.value]) {
            leftCol.querySelector(`.${clsprefix}-role`).value = eMap[e.target.value].role;
            leftCol.querySelector(`.${clsprefix}-demand`).value = eMap[e.target.value].demand;
            leftCol.querySelector(`.${clsprefix}-content`).value = eMap[e.target.value].content;
            leftCol.querySelector(`.${clsprefix}-ouput-cont`).innerHTML = makePrompt(eMap[e.target.value]);
        }
    });
    container.appendChild(leftCol);
}

function addTitle(titleContainer, titleArr) {
    for (var i = 0; i < titleArr.length; i++) {
        var titleSpan = document.createElement('span');
        titleSpan.innerText = titleArr[i];
        titleSpan.id = `title-${i}`;
        titleContainer.appendChild(titleSpan);
    }
}

function addDesc(container, text) {
    const txt = document.createElement('div');
    txt.classList.add(`${clsprefix}-desc`);
    txt.innerHTML = text;
    container.appendChild(txt);
}
function setIntro(container) {
    // Create elements
    const title = document.createElement('div');
    title.classList.add(`${clsprefix}-title`);
    addTitle(title, ['Create', 'Effective', 'AI', 'Prompts']);
    container.appendChild(title);

    const subtitle = document.createElement('div');
    subtitle.classList.add(`${clsprefix}-title`);
    subtitle.classList.add(`${clsprefix}-sub-title`);
    addTitle(subtitle, ['生成', '有效的', 'AI', '提示']);
    container.appendChild(subtitle);

    setTimeout(() => {
        title.classList.add(`active`);
        const logo = document.createElement('div');
        logo.classList.add(`${clsprefix}-title`);
        logo.innerHTML = iconMap['masks'];
        container.appendChild(logo);
        addDesc(container, getIntroMap().desc);
    }, 1e3);
}

function setSetting(container) {
    const set = document.createElement('div');
    set.classList.add(`${clsprefix}-setting`);
    set.innerHTML = `
    <div class="${clsprefix}-form-item" >
        <label class="${clsprefix}-form-check-label" >${getFormMap().switch}</label>
        <input class="${clsprefix}-form-check-input ${clsprefix}-form-check-switch" ${language === 'chinese' ? 'checked' : ''} type="checkbox" role="switch">
    </div>
    <div class="${clsprefix}-form-item" >
        <label class="${clsprefix}-form-check-label" >${getFormMap().backgroundPageUrl}</label>
        <textarea class="chrome-plugin-gpt-prompt-form-control chrome-plugin-gpt-prompt-role ${clsprefix}-backgroundPageUrl">${backgroundPageUrl}</textarea>
    </div>
    <div class="${clsprefix}-form-item" >
        <a class="${clsprefix}-git" href="https://github.com/chalecao/prompt-gpt.git" target="blank">Github Star!</a>
    </div>
    `;
    set.querySelector(`.${clsprefix}-form-check-switch`).addEventListener('change', e => {
        e.stopImmediatePropagation();
        if (e.target.checked) {
            localStorage.setItem(`${clsprefix}-lang`, 'chinese');
        } else {
            localStorage.setItem(`${clsprefix}-lang`, 'english');
        }
        location.reload();
    });
    set.querySelector(`.${clsprefix}-backgroundPageUrl`).addEventListener('blur', e => {
        e.stopImmediatePropagation();
        let url = e.target.value;
        if (url && /http[s]?:\/\//.test(url)) {
            localStorage.setItem(`${clsprefix}-backgroundPageUrl`, e.target.value);
            document.querySelector(`.${clsprefix}-iframe-outside`).src = e.target.value;
        }
    });
    container.appendChild(set);
}

document.addEventListener('click', e => {
    var containers = document.querySelectorAll(`.${clsprefix}-container`);
    containers[0].style.display = 'none';

    var tabs = document.querySelectorAll(`.${clsprefix}-tab`);
    tabs[0].classList.remove('active');
})
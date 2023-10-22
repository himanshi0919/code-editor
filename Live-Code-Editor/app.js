var html = document.getElementById('html');
var css = document.getElementById('css');
var js = document.getElementById('js');
var code = document.getElementById('output').contentWindow.document;
function compile() {
  const PREFIX = 'livecode-';
  const data = ['html', 'css', 'js'].map((key) => {
    const prefixedKey = PREFIX + key;
    const jsonValue = localStorage.getItem(prefixedKey);

    if (jsonValue != null) return JSON.parse(jsonValue);
  });
  setInitial(data);
  document.body.onkeyup = function () {
    localStorage.setItem('livecode-html', JSON.stringify(html.value));
    localStorage.setItem('livecode-css', JSON.stringify(css.value));
    localStorage.setItem('livecode-js', JSON.stringify(js.value));
    code.open();
    code.writeln(
      html.value +
        '<style>' +
        css.value +
        '</style>' +
        '<script>' +
        js.value +
        '</script>'
    );
    code.close();
  };
}

function setInitial(data) {
  let htmlContent = data[0] || '<h1>Welcome to the Live Code Editor!</h1>';
  let cssContent =
    data[1] ||
    `body {
    background-color: #222;
    }
    h1 {
      color: #fff;
      text-align: center;
      margin-top: 10%;
    }`;
  let jsContent = data[2] || '';
  css.value = cssContent;
  js.value = jsContent;
  html.value = htmlContent;
  code.open();
  code.writeln(
    htmlContent +
      '<style>' +
      cssContent +
      '</style>' +
      '<script>' +
      jsContent +
      '</script>'
  );
  code.close();
}

compile();

document.querySelectorAll('.control').forEach((control) =>
  control.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.classList.toggle('collapse');
    e.target.classList.add('close');
    e.target.parentElement.querySelector('h2').classList.toggle('hidden');
  })
);

document.querySelectorAll('.clear').forEach((clear) =>
  clear.addEventListener('click', (e) => {
    const ele = e.target.classList[1];
    document.querySelector(`#${ele}`).value = '';
    localStorage.setItem(`livecode-${ele}`, JSON.stringify(''));
    compile();
  })
);

document.querySelectorAll('.copy-btn').forEach((copy) => {
  copy.addEventListener('click', (e) => {
    const temp = e.target.innerHTML;
    e.target.innerText = 'Copied!';
    setTimeout(function () {
      e.target.innerHTML = temp;
    }, 800);
  });
});

document.querySelector('.copy-html').addEventListener('click', (e) => {
  const code = document.querySelector('#html');
  copyCode(code);
});

document.querySelector('.copy-css').addEventListener('click', (e) => {
  const code = document.querySelector('#css');
  copyCode(code);
});
document.querySelector('.copy-js').addEventListener('click', (e) => {
  const code = document.querySelector('#js');
  copyCode(code);
});

function copyCode(code) {
  code.select();
  document.execCommand('copy');
  swal('Copied!', 'You are ready to rock', 'success');
}

// lock unlock
document.querySelectorAll('.lock-unlock').forEach((lockUnlock) => {
  lockUnlock.addEventListener('click', (e) => {
    const fileType = e.target.classList[1];
    const editor = document.getElementById(fileType);

    toggleLockEditor(editor, fileType);
  });
});

function toggleLockEditor(editor, fileType) {
  const lockUnlockButton = document.querySelector(`.lock-unlock.${fileType}`);

  if (editor.hasAttribute('readonly')) {
    // If the editor is currently locked, unlock it
    editor.removeAttribute('readonly');
    lockUnlockButton.textContent = 'Lock';
    swal('Editor Unlocked', `The ${fileType.toUpperCase()} editor is now unlocked.`, 'info');
  } else {
    // If the editor is currently unlocked, lock it
    editor.setAttribute('readonly', 'true');
    lockUnlockButton.textContent = 'Unlock';
    swal('Editor Locked', `The ${fileType.toUpperCase()} editor is now locked.`, 'info');
  }
}

// save file
document.querySelectorAll('.save').forEach((save) => {
  save.addEventListener('click', (e) => {
    const fileType = e.target.classList[1];
    const code = document.querySelector(`#${fileType}`);
    saveCodeToFile(code, fileType);
  });
});

// Function to save code to a file
function saveCodeToFile(code, fileType) {
  const codeContent = code.value;

  if (codeContent.trim() === '') {
    swal('Error', 'Code is empty. Nothing to save!', 'error');
    return;
  }

  // Determine the file extension based on the editor type
  let fileExtension = '';
  if (fileType === 'html') {
    fileExtension = 'html';
  } else if (fileType === 'css') {
    fileExtension = 'css';
  } else if (fileType === 'js') {
    fileExtension = 'js';
  }

  const blob = new Blob([codeContent], { type: `text/${fileExtension}` });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `code.${fileExtension}`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  swal('Saved', `Code saved as code.${fileExtension}`, 'success');
}
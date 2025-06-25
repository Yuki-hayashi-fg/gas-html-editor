/**
 * ブロックベースHTMLエディタ - GASサーバーサイドロジック (最終完成版)
 */

// 設定
const DRIVE_FOLDER_NAME = 'HTMLエディタ画像'; // 画像をアップロードするGoogle Driveのフォルダ名

/**
 * Webアプリにアクセスした際に呼び出されるメイン関数
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('ブロックベースHTMLエディタ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * クライアントサイド（エディタのプレビュー画面）で使用するCSSスタイルを返します。
 */
function getCssForPreview() {
  
  return `
  /* プレビュー用CSS */
.child-block-preview,
.child-block-preview * {
  /* 親からの継承をリセット */
  all: unset;
}

/* 必要なレイアウト・スペーシングだけ再定義 */
.child-block-preview {
  display: block;
  margin-bottom: 15px;  /* 既存の間隔ルール */
}
    /* --- 基本スタイル --- */
    body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.7; color: #343a40; margin: 0; padding: 15px; }
    .video-description-container { background-color: #ffffff; border-radius: 6px; margin: 0 auto; max-width: 800px; }
    a { color: #0d6efd; text-decoration: none; transition: color 0.2s ease; }
    a:hover { color: #0a58ca; text-decoration: underline; }
    
    /* --- ブロック間の余白を一元管理 --- */
    .block-preview { margin-bottom: 25px; }
    .video-description-container > .block-preview:last-child { margin-bottom: 0; }
    
    section > h2 { font-size: 1.25em; color: #000000; margin-top: 0; margin-bottom: 15px; padding-left: 16px; position: relative; font-weight: 600; line-height: 1.4; }
    section > h2::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 5px; height: 18px; background-color: #20c997; border-radius: 2.5px; }
    .section-important > h2 { color: #856404; }
    .section-important > h2::before { background-color: #ffc107; }
    .section-caution > h2 { color: #842029; }
    .section-caution > h2::before { background-color: #dc3545; }
    hr.section-divider { border: none; border-top: 1px solid #e9ecef; }
    .lecture-summary p, .lecture-summary div { font-size: 0.98em; color: #495057; line-height: 1.7; margin: 0; white-space: pre-wrap; word-wrap: break-word; }
    .content-wrapper { padding: 15px 20px; border-radius: 4px; }
    .important-content { background-color: #fffbeb; border: 1px solid #ffe58f; }
    .important-content ul { list-style: none; padding-left: 5px; margin: 0; }
    .important-content ul li { margin-bottom: 0.6em; padding-left: 20px; position: relative; font-size: 0.95em; color: #664d03; line-height: 1.6; }
    .important-content ul li:last-child { margin-bottom: 0; }
    .important-content ul li::before { content: ''; position: absolute; left: 6px; top: 0.6em; width: 6px; height: 6px; background-color: #ffc107; border-radius: 50%; }
    .caution-content { background-color: #fef4f5; border: 1px solid #f7c6cb; }
    .caution-content p, .caution-content div { margin: 0; color: #58151c; font-size: 0.95em; font-weight: 500; line-height: 1.6; white-space: pre-wrap; }
    .faq-item-attractive { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px; padding: 15px 20px; }
    .faq-item-attractive:last-child { margin-bottom: 0; }
    .faq-question-attractive { font-weight: 600; color: #2c6e49; font-size: 1.05em; margin-bottom: 10px; padding-left: 38px; position: relative; line-height: 1.5; }
    .faq-question-attractive::before { content: "Q"; position: absolute; left: 0; top: 0; background-color: #4caf50; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9em; font-weight: bold; }
    .faq-answer-attractive { color: #495057; font-size: 0.98em; padding-left: 38px; position: relative; line-height: 1.7; word-wrap: break-word; }
    .faq-answer-attractive::before { content: "A"; position: absolute; left: 0; top: 0; background-color: #ff9800; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9em; font-weight: bold; }
    .glossary-section .glossary-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.95em; border: 1px solid #cccccc; }
    .glossary-section .glossary-table th, .glossary-section .glossary-table td { padding: 11px 14px; text-align: left; vertical-align: top; line-height: 1.6; border-bottom: 1px solid #e0e0e0; }
    .glossary-section .glossary-table th { background-color: #f0f9f4; color: #155724; font-weight: 600; width: 25%; border-right: 1px solid #cccccc; }
    .glossary-section .glossary-table td { background-color: #ffffff; width: 75%; word-wrap: break-word; }
    .glossary-section .glossary-table tr:last-child th, .glossary-section .glossary-table tr:last-child td { border-bottom: none; }
    .feedback-section { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px 25px; line-height: 1.6; }
    .feedback-note { margin-top: 0; margin-bottom: 8px; font-size: 0.8em; color: #6c757d; line-height: 1.5; }
    .feedback-button { display: inline-flex; align-items: center; background-color: #fd9843; color: #ffffff !important; padding: 8px 12px 8px 16px; border-radius: 4px; text-decoration: none !important; font-weight: 700; font-size: 0.98em; margin-bottom: 15px; transition: background-color 0.2s ease; line-height: 1; border: none; }
    .feedback-button:hover { background-color: #fd7e14; }
    .feedback-button-icon { width: 18px; height: 18px; margin-left: 6px; vertical-align: middle; filter: brightness(0) invert(1); }
    .qa-guidance { padding: 0; margin-top: 15px; margin-bottom: 0; font-size: 0.95em; color: #343a40; font-weight: 700; line-height: 1.6; }
    .prompt-section .prompt-item { background-color: #fff; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px 20px; margin-top: 15px; }
    .prompt-section .prompt-item:first-child { margin-top: 0; }
    .prompt-section .prompt-item h3 { font-size: 1.1em; color: #495057; margin: 0 0 10px 0; font-weight: 600; display: flex; align-items: center; }
    .prompt-section .prompt-item hr.prompt-divider { border: none; border-top: 1px dashed #ced4da; margin: 15px 0; }
    .prompt-section .prompt-text { font-size: 0.98em; color: #495057; line-height: 1.7; word-wrap: break-word; }
    .prompt-section .prompt-text-before { margin-bottom: 15px; }
    .prompt-section .prompt-text-after { margin-top: 15px; }
    .prompt-section .prompt-item pre { background-color: #f8f9fa; padding: 12px 15px; border-radius: 4px; border: none; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; font-size: 0.9em; line-height: 1.65; margin: 0; }
    .prompt-section .prompt-item code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; color: #212529; }
  `;
}

/**
 * フォルダを取得または作成（プライベート関数）
 */
function getOrCreateFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

/**
 * 画像をGoogle Driveにアップロード（クライアントから呼び出される）
 */
function uploadImage(fileData, fileName, mimeType) {
  try {
    const blob = Utilities.newBlob(Utilities.base64Decode(fileData), mimeType, fileName);
    const folder = getOrCreateFolder_(DRIVE_FOLDER_NAME);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const imageUrl = `https://drive.google.com/uc?id=${file.getId()}`;
    return { success: true, url: imageUrl, fileName: fileName };
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * クライアントサイドからGASの関数を呼び出すためのラッパー
 */
function runGas(funcName, ...args) {
  // この関数はクライアントサイドのgoogle.script.runを呼び出すためのサーバーサイドの窓口です。
  // セキュリティのため、呼び出し可能な関数を制限することもできますが、
  // 今回は便宜上、このファイル内のグローバル関数を呼び出せるようにします。
  if (typeof this[funcName] === 'function') {
    return this[funcName](...args);
  }
  throw new Error(`サーバーサイドに関数 "${funcName}" が見つかりません。`);
}
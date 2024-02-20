/* ログイン画面 */
// 画面読み込み時にローディング非表示
window.addEventListener('load', hideLoader);

// 入力された文字列が制限に合致するかどうかをチェックする処理
function validateInput(inputValue) {
    const regex = /^(^[a-zA-Zａ-ｚＡ-Ｚ][\d０１２３４５６７８９]{6}$|^[0-9０-９]{10})$/; // 職員コード（先頭が英大文字1桁+数字6桁）または10桁コード（数字10桁）
    return regex.test(inputValue);
}

// エラーメッセージを表示する処理
function displayErr() {
    // エラーメッセージ要素を取得
    const errMessage = document.getElementById('sql_errMessage');
    // 表示用クラスが無い場合
    if (!errMessage.classList.contains('sql_errVisible')) {
        // 表示用クラスを追加
        errMessage.classList.add('sql_errVisible');
    }
}

// エラーメッセージを非表示にする処理
function hideErr() {
    // エラーメッセージ要素を取得
    const errMessage = document.getElementById('sql_errMessage');
    // 表示用クラスがある場合
    if (errMessage.classList.contains('sql_errVisible')) {
        // 表示用クラスを削除
        errMessage.classList.remove('sql_errVisible');
    }
}

// 全角を半角に、小文字を大文字に変換
function convertString(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        let c = str.charAt(i);
        // 全角を半角に変換
        if (c.match(/[Ａ-Ｚａ-ｚ０-９]/)) {
            c = String.fromCharCode(c.charCodeAt(0) - 65248);
        }
        // 英語の小文字を大文字に変換
        if (c.match(/[a-z]/)) {
            c = c.toUpperCase();
        }
        result += c;
    }

    if (result == '0') {
        result = '0000000000';
    }

    return result;
}

// 入力フィールドを取得
const inputField = document.getElementById('sql_textFieldInput');

// フォーカスアウト時にイベントを発動
inputField.addEventListener('blur', focusOff);

// フォーカスアウト時の処理
function focusOff() {
    // 入力文字を取得
    const inputValue = this.value;
    // 入力チェック
    const isValid = validateInput(inputValue);
    // 入力制限で分岐
    if (isValid) {
        // OKの場合
        // エラーメッセージを非表示
        hideErr();
    } else {
        // NGの場合
        // エラーメッセージを出力
        displayErr();
    }
}

// Dexie.jsのデータベースを作成
const db = new Dexie('QuizAppDB');
// ストア（テーブル）の定義
db.version(4).stores({
    UserDB: '++id, UserId, LoginDate, AnswerDate, Choice, Point',
    QuizDB: '++id, &QuizId, Question, Option1, Option2, Option3, Option4, Answer'
});
// ユーザーの回答を格納するためのテーブル
const userTable = db.table('UserDB');

// ログインボタンの要素を取得
const loginBtn = document.getElementById('sql_loginBtn');
// ログインボタンクリック時の処理
loginBtn.addEventListener('click', function () {
    // ボタンを押下状態に変更
    this.classList.add('sql_loginBtn_clicked');
    // 入力フィールドを取得
    const inputField = document.getElementById('sql_textFieldInput');
    // 入力文字を取得
    const inputValue = inputField.value;
    // 入力チェック
    const isValid = validateInput(inputValue);
    // 入力制限で分岐
    if (isValid) {
        // OKの場合
        // ローダーの表示
        showLoader();
        // テキストフィールドを非活性化
        inputField.disabled = true;
        // ボタンを非活性化
        this.classList.add('sql_loginBtn_inactive');

        // 現在の日時を取得
        const loginDate = changeDateFormat(new Date());

        // ユーザーテーブルに情報を格納
        userTable.add({
            UserId: convertString(inputValue),
            LoginDate: loginDate
        }).then(function () {
            // 問題画面へ遷移
            location.href = './quiz.html';
        });
    } else {
        // NGの場合
        // ボタンを通常状態に変更
        this.classList.remove('sql_loginBtn_clicked');
        // エラーメッセージを出力
        displayErr();
    }
});

/* ブラウザバック時の処理 */
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ページ再読み込み
        location.reload();
    }
});
/* 結果画面 */
// 画面読み込み時にローディング非表示
window.addEventListener('load', hideLoader);

window.addEventListener('DOMContentLoaded', function () {
    // Dexie.jsのデータベースを作成
    const db = new Dexie('QuizAppDB');
    // ストア（テーブル）の定義
    db.version(4).stores({
        UserDB: '++id, UserId, LoginDate, AnswerDate, Choice, Point',
        QuizDB: '++id, &QuizId, Question, Option1, Option2, Option3, Option4, Answer'
    });
    // ユーザテーブルの定義
    const userTable = db.table('UserDB');
    // クイズテーブルの定義
    const quizTable = db.table('QuizDB');

    // クイズ番号の要素を取得
    const quizNum = document.getElementsByClassName('sqr_quizNum');
    // 問題文の要素を取得
    const statement = document.getElementsByClassName('sqr_typo_statement');
    // 選択肢の要素を取得
    const option = document.getElementsByClassName('sqr_option');
    // 選択肢テキストの要素を取得
    const optionText = document.getElementsByClassName('sqr_typo_optionText');
    // 正解数の初期化
    let point = 0;
    // 正解数の要素を取得
    const numOfCorrects = document.getElementById('sqr_numOfCorrects');
    // キャラクターアイコンの要素を取得
    const characterIcon = document.getElementsByClassName('sqr_charactorIcon');
    // メッセージの要素を取得
    const message = document.getElementById('sqr_message');
    // 正解アイコンの要素を取得
    const correctIcon = document.getElementsByClassName('sqr_correctIcon');
    // 不正解アイコンの要素を取得
    const incorrectIcon = document.getElementsByClassName('sqr_incorrectIcon');

    // ユーザテーブルの最後のレコードを取得
    userTable.orderBy('id').last(function (record) {
        // 正解数の格納
        point = record.Point;
        // ログスプレッドシートのウェブアプリURLを設定
        const deployUrl = 'https://script.google.com/macros/s/AKfycbzqLAkVBukrQdFa2tf9WFT5W22I1HeXbTKzA0khm8vlKq3cJapjZickIyd7h4ogEn0lQw/exec';
        // リクエストの送信
        fetch(deployUrl).then(function (response) {
            // レスポンスデータをJSON形式に変換
            return response.json();
        }).then(function () {
            quizTable.orderBy('QuizId').each(function (quiz) {
                // クイズ番号を表示
                quizNum[(quiz.QuizId - 1) * 2].innerText = quiz.QuizId;
                quizNum[(quiz.QuizId - 1) * 2 + 1].innerText = quiz.QuizId;
                // 問題文を表示
                statement[quiz.QuizId - 1].innerText = quiz.Question;
                // 選択肢テキストを表示
                optionText[(quiz.QuizId - 1) * 4].innerText = quiz.Option1;
                optionText[(quiz.QuizId - 1) * 4 + 1].innerText = quiz.Option2;
                optionText[(quiz.QuizId - 1) * 4 + 2].innerText = quiz.Option3;
                optionText[(quiz.QuizId - 1) * 4 + 3].innerText = quiz.Option4;
                // 正解選択肢を強調
                option[(quiz.QuizId - 1) * 4 + (quiz.Answer - 1)].classList.add('sqr_correctOption');
                // 正誤判定
                if (record.Choice[quiz.QuizId - 1] == quiz.Answer) {
                    // 正解の場合
                    // 正解アイコンの表示
                    correctIcon[quiz.QuizId - 1].classList.add('sqr_showJudgeIcon');
                    // タグテキストの要素を生成
                    const tagTypo = document.createElement('p');
                    tagTypo.classList.add('sqr_typo_tag');
                    // タグテキストの表示
                    tagTypo.innerText = '正解　あなたの解答';
                    // タグエリアの要素を生成
                    const tagArea = document.createElement('div');
                    tagArea.classList.add('sqr_tagArea');
                    // タグテキストの要素をタグエリアの要素に追加
                    tagArea.appendChild(tagTypo);
                    // タグエリアの要素を選択肢の要素に追加
                    option[(quiz.QuizId - 1) * 4 + (quiz.Answer - 1)].appendChild(tagArea);
                } else {
                    // 不正解の場合
                    incorrectIcon[quiz.QuizId - 1].classList.add('sqr_showJudgeIcon');
                    // タグテキストの要素を生成
                    const tagTypo2 = document.createElement('p');
                    const tagTypo3 = document.createElement('p');
                    tagTypo2.classList.add('sqr_typo_tag');
                    tagTypo3.classList.add('sqr_typo_tag');
                    // タグテキストの表示
                    tagTypo2.innerText = '正解';
                    tagTypo3.innerText = 'あなたの解答';
                    // タグエリアの要素を生成
                    const tagArea2 = document.createElement('div');
                    const tagArea3 = document.createElement('div');
                    tagArea2.classList.add('sqr_tagArea');
                    tagArea3.classList.add('sqr_tagArea');
                    // タグテキストの要素をタグエリアの要素に追加
                    tagArea2.appendChild(tagTypo2);
                    tagArea3.appendChild(tagTypo3);
                    // タグエリアの要素を正解の選択肢の要素に追加
                    option[(quiz.QuizId - 1) * 4 + (quiz.Answer - 1)].appendChild(tagArea2);
                    option[(quiz.QuizId - 1) * 4 + (record.Choice[quiz.QuizId - 1] - 1)].appendChild(tagArea3);
                }
            }).then(function () {
                // 正解数を表示
                numOfCorrects.innerText = point;
                // 正解数によってキャラクターアイコンの表示を切替え
                if (0 <= point && point < 5) {
                    // 0点以上4点以下の場合
                    message.innerText = 'もっと頑張ろう！';
                    characterIcon[0].classList.add('sqr_showMascotIcon');
                } else if (5 <= point && point < 8) {
                    // 5点以上7点以下の場合
                    message.innerText = 'その調子！';
                    characterIcon[1].classList.add('sqr_showMascotIcon');
                } else {
                    // 8点以上の場合
                    message.innerText = 'おめでとう！！';
                    characterIcon[2].classList.add('sqr_showMascotIcon');
                }
            }).then(function () {
                // データベースの削除
                db.delete().then(function() {
                    console.log('データベースの削除成功');
                }).catch(function (error) {
                    console.log('データベースの削除失敗');
                    console.log(error);
                });
            });
        });
    });
});

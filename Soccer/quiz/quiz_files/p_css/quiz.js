/* 問題画面 */
window.addEventListener('DOMContentLoaded', function () {
    // 問題番号テキストの要素を取得
    const QuizId = document.getElementById('QuizId');
    // 問題文テキストの要素を取得
    const Question = document.getElementById('Question');
    // 選択肢テキストの要素を取得
    const Option1 = document.getElementById('Option1');
    const Option2 = document.getElementById('Option2');
    const Option3 = document.getElementById('Option3');
    const Option4 = document.getElementById('Option4');
    // 選択肢の要素を取得
    const select = document.getElementsByClassName('sqq_choiceBtn');
    // ○×アイコンの要素を取得
    const correctImg = document.getElementById('correct');
    const incorrectImg = document.getElementById('incorrect');
    // 選択肢エリアの要素を取得
    const choiceArea = document.getElementsByClassName('sqq_choiceArea')[0];
    // プログレスバーの円の要素を取得
    const progressCircle = document.getElementsByClassName('sqc_progressBar_circle');

    // 現在の問題番号を定義
    let quizNum = 1;

    // クイズスプレッドシートのウェブアプリURLを設定
    const deployUrl = 'https://script.google.com/macros/s/AKfycbxCn6WZrhB4MhvK3loJCh507KuNvPhn_XnB8RoGNOZpL8Mgl2QxaH_3ihdVUGfG2t5Xvw/exec';
    // Dexie.jsのデータベースを作成
    const db = new Dexie('QuizAppDB');
    // ストア（テーブル）の定義
    db.version(4).stores({
        UserDB: '++id, UserId, LoginDate, AnswerDate, Choice, Point',
        QuizDB: '++id, &QuizId, Question, Option1, Option2, Option3, Option4, Answer'
    });
    // ユーザーの回答を格納するためのテーブル
    const userTable = db.table('UserDB');
    // クイズの問題を格納するためのテーブル
    const quizTable = db.table('QuizDB');

    userTable.orderBy('id').last(function (record) {
        if (record == undefined) {
            window.alert('エラーが発生しました。ログインしてからクイズを解いてください。');
            location.href = './login.html';
        } else {
            // 指定されたURLにリクエストを送信
            fetch(deployUrl).then(function (response) {
                // レスポンスデータをJSON形式に変換
                return response.json();
            }).then(function (data) {
                // クイズデータを取得
                const textData = data.content;
                // クイズデータを要素ごとに分割
                const splitData = textData.split('[sep]');
                // クイズテーブルに情報を格納
                for (let i = 0; i < splitData.length; i++) {
                    if (i % 7 == 6) {
                        // 1問目の情報を表示
                        if (i == 6) {
                            QuizId.innerText = splitData[i - 6];
                            Question.innerText = splitData[i - 5];
                            Option1.innerText = splitData[i - 4];
                            Option2.innerText = splitData[i - 3];
                            Option3.innerText = splitData[i - 2];
                            Option4.innerText = splitData[i - 1];
                        }

                        // クイズDBにデータを格納
                        quizTable.add({
                            QuizId: Number(splitData[i - 6]),
                            Question: splitData[i - 5],
                            Option1: splitData[i - 4],
                            Option2: splitData[i - 3],
                            Option3: splitData[i - 2],
                            Option4: splitData[i - 1],
                            Answer: Number(splitData[i])
                        });
                    }
                }
            }).then(function () {
                // ローダーの非表示
                hideLoader();
            });

            // ユーザの選択を格納
            const userChoice = [];
            // 得点を換算
            let point = 0;

            // 選択肢を押下時の処理
            for (let i = 0; i < select.length; i++) {
                let selectValue = 0;
                select[i].addEventListener('click', function () {
                    // 選択肢の要素を取得
                    const select = document.getElementsByClassName('sqq_choiceBtn');
                    // 選択肢をクリック不可にする
                    choiceArea.classList.add('sqq_noClick');
                    selectValue = Number(this.value);
                    userChoice.push(selectValue);
                    // 正解の選択肢番号を格納
                    let answerNum = 0;

                    quizTable.where('QuizId').equals(quizNum).first(function (record) {
                        // 正解の選択肢番号を格納
                        answerNum = record.Answer;
                        if (selectValue == record.Answer) {
                            // 正解の場合
                            // 〇を表示
                            correctImg.classList.remove('sqq_none');
                            correctImg.classList.remove('sqq_transmission');
                            // 回答した選択肢をオレンジ
                            select[selectValue - 1].classList.add('sqq_choiceOrange');
                            // 得点を加算
                            point += 1;
                        } else {
                            // 不正解の場合
                            // ×を表示
                            incorrectImg.classList.remove('sqq_none');
                            incorrectImg.classList.remove('sqq_transmission');
                            // 誤答の選択肢をグレー、正解の選択肢をオレンジ
                            select[selectValue - 1].classList.add('sqq_choiceGray');
                            select[record.Answer - 1].classList.add('sqq_choiceOrange');
                        }
                    }).then(function () {
                        quizTable.where('QuizId').equals(quizNum + 1).first(function (record) {
                            if (quizNum < 10) {
                                quizNum += 1;

                                setTimeout(function () {
                                    // ○×アイコンを非表示に変更
                                    correctImg.classList.add('sqq_transmission');
                                    incorrectImg.classList.add('sqq_transmission');
                                }, 900);

                                setTimeout(function () {
                                    // ○×アイコンを非表示に変更
                                    correctImg.classList.add('sqq_none');
                                    incorrectImg.classList.add('sqq_none');

                                    // 正解・不正解の選択肢を目立たせるのを辞める
                                    select[answerNum - 1].classList.remove('sqq_choiceOrange');
                                    select[selectValue - 1].classList.remove('sqq_choiceGray');

                                    //スクロールバーを進める
                                    progressCircle[quizNum - 2].classList.remove('sqc_progressBar_active');
                                    progressCircle[quizNum - 1].classList.add('sqc_progressBar_active');

                                    // クイズ情報を表示
                                    QuizId.innerText = quizNum;
                                    Question.innerText = record.Question;
                                    Option1.innerText = record.Option1;
                                    Option2.innerText = record.Option2;
                                    Option3.innerText = record.Option3;
                                    Option4.innerText = record.Option4;

                                    // 選択肢をクリック可にする
                                    choiceArea.classList.remove('sqq_noClick');
                                }, 1500);
                            } else {
                                // 解答日時の取得
                                const answerDate = changeDateFormat(new Date());

                                // ユーザテーブルに値を格納
                                userTable.orderBy('id').last().then(function (record) {
                                    userTable.update(record.id, {
                                        AnswerDate: answerDate,
                                        Choice: userChoice,
                                        Point: point
                                    }).then(function () {
                                        // ログスプレッドシートのウェブアプリURLを設定
                                        const postUrl = 'https://script.google.com/macros/s/AKfycbzqLAkVBukrQdFa2tf9WFT5W22I1HeXbTKzA0khm8vlKq3cJapjZickIyd7h4ogEn0lQw/exec';

                                        // 送信データ
                                        let SendDATA = {
                                            'UserId': record.UserId,
                                            'LoginDate': record.LoginDate,
                                            'AnswerDate': answerDate,
                                            'Choice1': userChoice[0],
                                            'Choice2': userChoice[1],
                                            'Choice3': userChoice[2],
                                            'Choice4': userChoice[3],
                                            'Choice5': userChoice[4],
                                            'Choice6': userChoice[5],
                                            'Choice7': userChoice[6],
                                            'Choice8': userChoice[7],
                                            'Choice9': userChoice[8],
                                            'Choice10': userChoice[9],
                                            'Point': point
                                        };

                                        // 送信パラメータ
                                        let postparam = {
                                            "method": "POST",
                                            "mode": "no-cors",
                                            "Content-Type": "application/x-www-form-urlencoded",
                                            "body": JSON.stringify(SendDATA)
                                        };

                                        // フェッチ
                                        fetch(postUrl, postparam).then(function () {
                                            location.href = './result.html';
                                        }).catch(function (error) {
                                            window.alert('通信エラーが発生しました。もう一度クイズをやり直すか、管理者に問い合わせてください。\n\n' + error);
                                            location.href = './login.html';
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            }
        }
    });
});

/* ブラウザバック時の処理 */
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ログイン画面へ遷移
        location.href = './login.html';
    }
});
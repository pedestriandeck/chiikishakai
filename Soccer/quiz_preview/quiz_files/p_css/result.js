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
        point = record.Point + 5;
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
                } else if (record.Choice[quiz.QuizId - 1] == '') {
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
            });
        });
    });

    
});


// ポップアップ
    // ダイアログ系共通
    // bodyScroll設定
    function setBodyScroll() {
        // bodyタグにスクロール制御クラスが設定されている場合、先になんらかのダイアログが表示しているものとみなす
        if (document.body.classList.contains("c_bodyScroll")) {
            document.body.classList.add("c_bodyScroll_sec");
        } else {
            let rootfont = document.documentElement.style.fontSize.replace('px', '');
            if (rootfont == '') {
                rootfont = getComputedStyle(document.documentElement).fontSize.replace('px', '');
            }
            // 表示位置の指定用
            document.body.style.top = '-' + window.pageYOffset / rootfont + 'rem';
            document.body.classList.add("c_bodyScroll");
        };
    }

    // bodyScroll解除
    function clearBodyScroll() {
        // c_bodyScroll_secがあったら既に別のダイアログが表示中のため、bodyscrollは削除しない
        if (document.body.classList.contains("c_bodyScroll_sec")) {
            document.body.classList.remove("c_bodyScroll_sec");
        } else {
            // 背景固定解除
            document.body.classList.remove('c_bodyScroll');
            scrollMove = document.body.style.getPropertyValue('top');
            if (scrollMove != '') {
                let rootfont = document.documentElement.style.fontSize.replace('px', '');
                if (rootfont == '') {
                    rootfont = getComputedStyle(document.documentElement).fontSize.replace('px', '');
                }
                scrollMove = scrollMove.replace('-', '');
                scrollMove = scrollMove.replace('rem', '') * rootfont;
                document.body.style.removeProperty('top');
                // スクロール位置を戻す
                window.scrollTo(0, scrollMove);
            }
        }
    }

    /* IE判定 */
    function c_isbrowserIE() {
        // IE固有の機能を持っている場合trueを返却
        if (document.documentMode && document.uniqueID) {
            return true;
        } else {
            return false;
        }
    }

    /** コンポーネント：Dialog **/
    // フォントサイズ取り込み
    if (!document.getElementsByClassName('sqr_modal01').length) {
        //該当の要素がない場合は処理を行なわない
    } else {

        let rootfont = document.documentElement.style.fontSize.replace('px', '');
        if (rootfont == '') {
            rootfont = getComputedStyle(document.documentElement).fontSize.replace('px', '');
        }

        // ダイアログ表示処理
        function showModalDialog01(targetDialogArea) {
            // ダイアログウィンドウ表示
            targetDialogArea.classList.add('sqr_modal01_isShow');
            // 背景固定
            setBodyScroll();
            // 高さ設定
            setMaxHeightModal01(targetDialogArea);
        }

        // ダイアログ非表示処理
        function closeModalDialog01(targetDialogArea) {
            // スクロール位置を戻すための処理 
            clearBodyScroll();
            // ダイアログウィンドウ非表示
            targetDialogArea.classList.remove('sqr_modal01_isShow');
        }

        // ダイアログ表示時用 高さ設定処理
        function setMaxHeightModal01(targetDialogArea) {
            const modalMaxHeight = 56;
            targetArea = targetDialogArea.getElementsByClassName('sqr_modal01_textArea')[0];
            let dialogHeight;
            // IEかどうかで取得元を変える
            if (c_isbrowserIE()) {
                dialogHeight = document.documentElement.clientHeight;
            } else {
                dialogHeight = window.innerHeight;
            }
            // iOSではheightがvhの場合、アドレスバーが表示エリアに含まれないためこちらでheightを指定
            targetDialogArea.style.height = dialogHeight / rootfont + 'rem';
            // textAreaも上記同様の理由でmax-heightを指定
            // 本来は6.4remだがスクロールバーの表示調整でCSS側の「dialog_inner」の上下paddingが6.2remのため計算値もあわせる
            targetArea.style.maxHeight = ((dialogHeight / rootfont * 0.9) - 6.2) + 'rem';
            // ダイアログのダイアログボックスの高さは最大56rem
            // ただし、ウィンドウの高さの90%が上記の高さより小さい場合は、
            // ウィンドウの90%をダイアログボックスの高さとする
            if (dialogHeight / rootfont * 0.9 < modalMaxHeight) {
                // 90%未満のときは指定したmax-heightを使用
            } else {
                // CSSで指定したmax-heightとするため削除
                targetArea.style.removeProperty('max-height');
            }
        }

        // ページ表示時に各種イベント登録
        window.addEventListener('DOMContentLoaded', function () {
            // ダイアログウィンドウの表示制御 
            const showModal = document.getElementsByClassName('sqr_modal01_showModal');
            for (let i = 0; i < showModal.length; i++) {
                // showModal[i].addEventListener('click', function () {
                    showModalDialog01(showModal[i].nextElementSibling);
                // });
            }

            // ダイアログウィンドウの非表示制御（×ボタン押下時）
            const closeBtn = document.getElementsByClassName('sqr_modal01_CloseBtn');
            for (let i = 0; i < closeBtn.length; i++) {
                closeBtn[i].addEventListener('click', function (e) {
                    e.stopPropagation();
                    closeModalDialog01(this.parentElement.parentElement);
                });
            }

            // ダイアログウィンドウの非表示制御（背景押下時）
            const closeModal = document.getElementsByClassName('sqr_modal01_modal');
            for (let i = 0; i < closeModal.length; i++) {
                closeModal[i].addEventListener('click', function (e) {
                    e.stopPropagation();
                    // IEの場合、×ボタン押下時にdiv要素全体の押下イベントも実行されてしまうため×ボタン押下か否かを判定
                    if (undefined != e.target.classList) {
                        // 押下箇所が背景の場合 かつ 非活性制御がない場合はダイアログを閉じる
                        if (e.target.classList.contains('sqr_modal01_modal') && !(e.target.classList.contains('sqr_modal01_modal_disable'))) {
                            closeModalDialog01(this);
                        }
                    }
                });
            }

            // リサイズ時 高さ再設定
            window.addEventListener('resize', function () {
                if (document.getElementsByClassName('sqr_modal01_isShow').length) {
                    setMaxHeightModal01(document.getElementsByClassName('sqr_modal01_isShow')[0]);
                }
            });
        });
    }
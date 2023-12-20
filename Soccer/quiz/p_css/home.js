/* ホーム画面 */
// 画面読み込み時にローディング非表示
window.addEventListener('load', hideLoader);

// 点滅
const loginBtn = document.getElementById('sqh_loginBtn');
window.addEventListener('DOMContentLoaded', blink(loginBtn));
function blink(element) {
    setInterval(function () {
        if (element.classList.contains('sqh_blink')) {
            element.classList.remove('sqh_blink');
        } else {
            element.classList.add('sqh_blink');
        }
    }, 1100);
}

/* 遊び心 */
window.addEventListener('mousemove', enlargeBall);
window.addEventListener('touchmove', enlargeBall);

function enlargeBall() {
    const ball = document.getElementById('sqh_moveIcon');
    let ballTop = ball.style.top.replace('px', '');
    let ballLeft = ball.style.left.replace('px', '');
    let windowWidth = document.documentElement.offsetWidth;
    let windowHeight = window.innerHeight * (1 - 0.01);
    if (ballTop > windowHeight * 0.3 - 48 - 12 && ballTop < windowHeight * 0.6 - 48 - 12 && ballLeft > windowWidth * 0.3 - 60 - 20 && ballLeft < windowWidth * 0.7 - 60 - 20) {
        if (!ball.classList.contains('sqh_ball_big')) {
            ball.classList.add('sqh_ball_big');
        }
    } else {
        if (ball.classList.contains('sqh_ball_big')) {
            ball.classList.remove('sqh_ball_big');
        }
    }

    let currentSrc = ball.getAttribute('src');
    let newSrc = currentSrc;
    let dataShowFlg = false;
    if (ballTop > windowHeight * 0.9 - 48 - 12 && ballTop < windowHeight && ballLeft > windowWidth * 0.9 - 20 - 60 && ballLeft < windowWidth) {
        if (!currentSrc.match(/reverse/)) {
            newSrc = currentSrc.replace('header', 'header_reverse');
            if (!dataShowFlg) {
                dataShowFlg = true;
            }
        }
    } else {
        if (currentSrc.match(/reverse/)) {
            newSrc = currentSrc.replace('header_reverse', 'header');
        }
    }
    ball.setAttribute('src', newSrc);
    if (dataShowFlg) {
        showData();
    }
}

/* ブラウザバック時の処理 */
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ページ再読み込み
        location.reload();
    }
});

function showData() {
    console.log('データ開示');

    // ローダーの表示
    showLoader();
    // ログスプレッドシートのウェブアプリURLを設定
    const deployUrl = 'https://script.google.com/macros/s/AKfycbzqLAkVBukrQdFa2tf9WFT5W22I1HeXbTKzA0khm8vlKq3cJapjZickIyd7h4ogEn0lQw/exec';
    // 指定されたURLにリクエストを送信
    fetch(deployUrl)
        .then(response => {
            // レスポンスデータをJSON形式に変換
            return response.json();
        })
        .then(data => {
            // クイズデータを取得
            const textData = data.content;
            // クイズデータを要素ごとに分割
            const splitData = textData.split('[sep]');
            // // クイズテーブルに情報を格納
            // for (let i = 0; i < splitData.length; i++) {
            //     if (i % 7 == 6) {
            //         quizTable.add({
            //             QuizId: splitData[i - 6],
            //             Question: splitData[i - 5],
            //             Option1: splitData[i - 4],
            //             Option2: splitData[i - 3],
            //             Option3: splitData[i - 2],
            //             Option4: splitData[i - 1],
            //             Answer: splitData[i]
            //         });
            //     }
            // }

            // ホームエリアの要素を取得
            const homeArea = document.getElementsByClassName('sqh_homeArea')[0];
            // ホームエリアを非表示に変更
            homeArea.classList.add('sqh_hide');
            // シークレットエリアの要素を取得
            const secretArea = document.getElementsByClassName('sqh_secretArea')[0];
            // シークレットエリアを非表示に変更
            secretArea.classList.add('sqh_show');
            let now = new Date()
            console.log(now);
            // ローダーの非表示
            hideLoader()
        })
        .catch(error => {
            console.log(error);
        });
}
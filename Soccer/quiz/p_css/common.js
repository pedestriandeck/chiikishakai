/* 共通 */
/* キャッシュの削除 */
const footer = document.getElementsByTagName('footer')[0];
footer.addEventListener('click', deleteCache);
let footerClickCnt = 0;
function deleteCache() {
    footerClickCnt += 1;
    if (footerClickCnt == 5) {
        if ('caches' in window) {
            caches.keys().then(function (cacheNames) {
                cacheNames.forEach(function (cacheName) {
                    caches.delete(cacheName);
                });
            });
        }
        location.reload(true);
    }
}

// クエリストリングから指定したkey項目の値を取得
function getQueryParams(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

/* ローダーの非表示 */
function hideLoader() {
    // ローダー要素の取得
    const loader = document.getElementsByClassName('sqc_loader')[0];
    // ローダーを非表示
    if (!loader.classList.contains('sqc_loader_hidden')) {
        loader.classList.add('sqc_loader_hidden');
    }
}

/* ローダーの表示 */
function showLoader() {
    // ローダー要素の取得
    const loader = document.getElementsByClassName('sqc_loader')[0];
    // ローダーを表示
    if (loader.classList.contains('sqc_loader_hidden')) {
        loader.classList.remove('sqc_loader_hidden');
    }
}

// 画面読み込み時にメインの高さを設定
window.addEventListener('load', setScreenHeight);
// 画面リサイズ時にメインの高さを設定
window.addEventListener('resize', setScreenHeight);

// メインの高さを設定
function setScreenHeight() {
    // 最初に、ビューポートの高さを取得し、0.01を掛けて1%の値を算出して、vh単位の値を取得
    let vh = window.innerHeight * 0.01;
    // カスタム変数--vhの値をドキュメントのルートに設定
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/* 日時をの表示形式を変換して返す関数 */
function changeDateFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

/* アイコン移動 */
if (document.getElementsByClassName('sqc_moveIcon')) {
    // アイコン要素の取得
    const icon = document.getElementsByClassName('sqc_moveIcon_icon');

    for (let i = 0; i < icon.length; i++) {
        // 初期時の座標
        const defaultX = icon[i].getBoundingClientRect().left;
        const defaultY = icon[i].getBoundingClientRect().top;
        // 移動開始時の座標
        let startX;
        let startY;
        // 移動中の座標
        let moveX;
        let moveY;

        // タッチ開始時
        icon[i].addEventListener('touchstart', function (e) {
            // 端末のデフォルト動作をキャンセル
            e.preventDefault();

            // タッチ開始時の座標を取得
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });

        // タッチ中
        icon[i].addEventListener('touchmove', function (e) {
            // 端末のデフォルト動作をキャンセル
            e.preventDefault();

            // タッチ中の座標を取得
            moveX = e.changedTouches[0].pageX;
            moveY = e.changedTouches[0].pageY;

            // アイコンの座標を設定
            icon[i].style.top = `${moveY - defaultY - (icon[i].getBoundingClientRect().bottom - icon[i].getBoundingClientRect().top) / 2}px`;
            icon[i].style.left = `${moveX - defaultX - (icon[i].getBoundingClientRect().right - icon[i].getBoundingClientRect().left) / 2}px`;
        });
    }
}

/** コンポーネント：ダイアログ **/
if (!document.getElementsByClassName('sqc_dialog').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // ダイアログ表示処理
    function showModalDialog01(targetDialogArea) {
        // ダイアログウィンドウ表示
        targetDialogArea.classList.add('sqc_dialog_isShow');
        //iPhoneの場合Bodyでposition:fixedの必要あり
        document.body.style.top = '-' + window.scrollY + 'px';
        // 背景固定
        document.body.classList.add('sqc_dialog_bodyScroll');
        // 高さ設定
        setMaxHeightModal01(targetDialogArea);
    }

    // ダイアログ非表示処理
    function closeModalDialog01(targetDialogArea) {
        // スクロール位置を戻すための処理 
        scrollMove = document.body.style.getPropertyValue('top');
        if (scrollMove != '') {
            scrollMove = scrollMove.replace('-', '');
            scrollMove = scrollMove.replace('px', '');
            // ダイアログウィンドウ非表示
            targetDialogArea.classList.remove('sqc_dialog_isShow');
            // 背景固定解除
            document.body.classList.remove('sqc_dialog_bodyScroll');
            document.body.style.removeProperty('top');
            // スクロール位置を戻す
            window.scrollTo(0, scrollMove);
        }
    }

    // ダイアログ表示時用 高さ設定処理
    function setMaxHeightModal01(targetDialogArea) {
        const modalMaxHeight = 680;
        targetArea = targetDialogArea.getElementsByClassName('sqc_dialog_textArea')[0];
        //iphoneではheightがvhの場合、アドレスバーが表示エリアに含まれないためこちらでheightを指定
        targetDialogArea.style.height = window.innerHeight + 'px';
        //textAreaも上記同様の理由でmax-heightを指定
        //本来は64pxだがスクロールバーの表示調整でCSS側の「dialog_inner」の上下paddingが62pxのため計算値もあわせる
        targetArea.style.maxHeight = ((window.innerHeight * 0.9) - 62) + 'px';
        // ダイアログのダイアログボックスの高さは最大680px
        // ただし、PC時かつウィンドウの高さの90%が上記の高さより小さい場合は、
        // ウィンドウの90%をダイアログボックスの高さとする
        if (!window.matchMedia('(max-width: 760px)').matches) {
            if (window.innerHeight * 0.9 < modalMaxHeight) {
                //90%未満のときは指定したmax-heightを使用
            } else {
                //CSSで指定したmax-heightとするため削除
                targetArea.style.removeProperty('max-height');
            }
        }
    }

    // ページ表示時に各種イベント登録
    window.addEventListener('DOMContentLoaded', function () {
        // ダイアログウィンドウの表示制御 
        const showModal = document.getElementsByClassName('sqc_dialog_showModal');
        for (let i = 0; i < showModal.length; i++) {
            showModal[i].addEventListener('click', function () {
                showModalDialog01(this.nextElementSibling);
            });
        }

        // ダイアログウィンドウの非表示制御（×ボタン押下時）
        const closeBtn = document.getElementsByClassName('sqc_dialog_CloseBtn');
        for (let i = 0; i < closeBtn.length; i++) {
            closeBtn[i].addEventListener('click', function () {
                closeModalDialog01(this.parentElement.parentElement);
            });
        }

        // ダイアログウィンドウの非表示制御（背景押下時）
        const closeModal = document.getElementsByClassName('sqc_dialog_modal');
        for (let i = 0; i < closeModal.length; i++) {
            closeModal[i].addEventListener('click', function (e) {
                // IEの場合、×ボタン押下時にdiv要素全体の押下イベントも実行されてしまうため×ボタン押下か否かを判定
                if (undefined != e.target.classList) {
                    // 押下箇所が背景の場合 かつ 非活性制御がない場合はダイアログを閉じる
                    if (e.target.classList.contains('sqc_dialog_modal') && !(e.target.classList.contains('sqc_dialog_modal_disable'))) {
                        closeModalDialog01(this);
                    }
                }
            });
        }

        // リサイズ時 高さ再設定
        window.addEventListener('resize', function () {
            if (document.getElementsByClassName('sqc_dialog_isShow').length) {
                setMaxHeightModal01(document.getElementsByClassName('sqc_dialog_isShow')[0]);
            }
        });
    });
}
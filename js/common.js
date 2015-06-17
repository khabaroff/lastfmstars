var camera, scene, renderer;
var player;

var auto = true;

var PERIOD_DEFAULT = '1month';

var Element = function (album, currentQueryData) {

    var dom = document.createElement('div');
    dom.className += 'cover';

    var albumImage = document.createElement('img');
    dom.appendChild(albumImage);

    var title = document.createElement('div');
    title.className = 'title';
    dom.appendChild(title);

    var txt = document.createElement('div');
    txt.className = 'txt';
    txt.style.color = getRandomColor();
    title.appendChild(txt);

    var h1 = document.createElement('h1');
    h1.innerHTML = album.artist.name;
    txt.appendChild(h1);

    var h2 = document.createElement('h2');
    h2.innerHTML = album.name;
    txt.appendChild(h2);

    var likes = document.createElement('div');
    likes.className = 'likes';

    var albumQuery = '';

    if (album.mbid) {
        albumQuery = 'album=' + encodeURIComponent(album.mbid)
    }
    else {
        albumQuery = 'artist=' + encodeURIComponent(album.artist.name) + '&album=' + encodeURIComponent(album.name)
    }

    var siteUrl = location.origin + location.pathname.replace(/\/+$/, ''),
        fbAppId = '1608604249419776',
        shareLink = siteUrl + '/share.php'
            + '?user=' + encodeURIComponent(currentQueryData.username)
            + '&limit=' + encodeURIComponent(currentQueryData.limit)
            + '&' + albumQuery,
        redirectUrl = siteUrl + '/self-close.html'

    var shareBtnHref = 'http://www.facebook.com/dialog/feed?'
        + 'app_id=' + fbAppId
        + '&link=' + encodeURIComponent(shareLink)
        + '&redirect_uri=' + encodeURIComponent(redirectUrl)
        + '&display=popup';

    likes.innerHTML = '<a target="_blank" class="share-cover-btn shareCoverBtn" href="' + shareBtnHref + '"><img class=noblur src="./share.png"></a>';

    dom.appendChild(likes);

    var object = new THREE.CSS3DObject(dom);
    object.position.x = Math.random() * 4000 - 2000;
    // object.position.y = Math.random() * 2000 - 1000;
    object.position.y = 3000;
    object.position.z = Math.random() * -5000;

    var searchButton = document.getElementById('button')

    albumImage.onload = function () {
        searchButton.style.visibility = 'visible';

        new TWEEN.Tween(object.position)
            .to({y: Math.random() * 2000 - 1000}, 2000)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
    };

    albumImage.src = album.image[3]['#text'];

    dom.addEventListener('mouseover', function () {

        searchButton.style.WebkitFilter = '';
//        blocker.style.background = 'rgba(0,0,0,0)';

    }, false);

    //dom.addEventListener( 'mouseout', function () {

    //	button.style.WebkitFilter = 'opacity(30%)';
    //	blocker.style.background = 'rgba(255,255,255,0.2)';

    //}, false );

    dom.addEventListener('click', function (event) {

        event.stopPropagation();

        if (event.target.tagName.toUpperCase() === 'A' && (event.target.className || '').match(/shareCoverBtn/)) {
            if (event.preventDefault) {
                event.preventDefault()
            }
            else {
                event.returnValue = false
            }

            shareLink(event.target.href)
        }

        auto = false;

        //if ( player !== undefined ) {

        //	player.parentNode.removeChild( player );
        //	player = undefined;

        //}

        //player = document.createElement( 'div' );
        //player.style.position = 'absolute';
        //player.style.width = '300px';
        //player.style.height = '300px';
        //player.style.border = '4px solid red';


        //player.src = 'http://www.youtube.com/embed/' + entry.id.$t.split( ':' ).pop() + '?rel=0&autoplay=1&controls=0&showinfo=0';
        //this.appendChild( player );

        //

        var prev = object.position.z + 400;

        new TWEEN.Tween(camera.position)
            .to({x: object.position.x + 0, y: object.position.y - 0}, 1500)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

        new TWEEN.Tween({value: prev})
            .to({value: 0}, 2000)
            .onUpdate(function () {

                move(this.value - prev);
                prev = this.value;

            })
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

    }, false);

    return object;

};

init();
animate();


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.y = -25;

    scene = new THREE.Scene();

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.getElementById('container').appendChild(renderer.domElement);

    window.$username = document.getElementById('userName');
    window.$limit = document.getElementById('limitAlbums');

    $username.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            updateLocationHash($username.value);
        }
    }, false);

    var button = document.getElementById('button');
    button.addEventListener('click', function (event) {

        updateLocationHash($username.value);

    }, false);

    if (window.location.hash && window.location.hash.length > 1) {
        updateControls(getLocationHashData())
    }

    document.body.addEventListener('mousewheel', onMouseWheel, false);

    document.body.addEventListener('click', function (event) {

        auto = true;

        /*
         if (player !== undefined) {
         player.parentNode.removeChild(player);
         player = undefined;
         }
         */

        new TWEEN.Tween(camera.position)
            .to({x: 0, y: -25}, 1500)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

    }, false);

    window.addEventListener('resize', onWindowResize, false);

    window.addEventListener('hashchange', search)

    search();
}

function shareLink(url) {
    var width = 650,
        height = 450,
        left = Math.floor(screen.width / 2 - width / 2),
        top = Math.floor(screen.height / 2 - height / 2)

    var windowParams = 'height=' + height + ',width=' + width + ',left=' + left + ',top=' + top
        + ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no'

    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), 'Share', windowParams)
}

function updateControls(queryData) {
    $username.value = queryData.username
    $limit.value = queryData.limit

    document.getElementById('limitAlbumsHud').value = queryData.limit

    if (queryData.period) {
        var $prevPeriod = document.querySelectorAll('.queryPeriod[checked]')

        if ($prevPeriod) {
            Array.prototype.forEach.call($prevPeriod, function ($radio) {
                $radio.removeAttribute('checked')
                $radio.checked = false
            })
        }

        var $period = document.querySelector('.queryPeriod[value="' + queryData.period + '"]')
        if ($period) {
            $period.checked = true
        }
    }
}

function updateLocationHash(query) {
    var limitAlbums = $limit.value || 20

    var $queryPeriod = document.querySelectorAll('.queryPeriod')

    Array.prototype.some.call($queryPeriod, function ($radio) {
        return $queryPeriod = $radio.checked ? $radio : false
    })

    var queryPeriod = ($queryPeriod && $queryPeriod.value) || PERIOD_DEFAULT

    window.location.hash = encodeURIComponent(query) + '/' + encodeURIComponent(limitAlbums)
    + '/' + encodeURIComponent(queryPeriod)
}

function getLocationHashData() {
    var userName,
        albumsLimit,
        period

    var hashMatches = window.location.hash.match(/#+\/*([^\/]+)\/?([^\/]+)?\/?([\d\S]+)?/)

    if (hashMatches && hashMatches.length > 1) {
        userName = (hashMatches[1] && decodeURIComponent(hashMatches[1])) || ''
        albumsLimit = (hashMatches[2] && decodeURIComponent(hashMatches[2])) || 0
        period = (hashMatches[3] && decodeURIComponent(hashMatches[3])) || ''
    }

    userName = userName || ''
    albumsLimit = albumsLimit || $limit.value || 20

    if (!period) {
        var $queryPeriod = document.querySelector('.queryPeriod[checked]'),
            queryPeriod = ($queryPeriod && $queryPeriod.value) || undefined

        period = period || queryPeriod || PERIOD_DEFAULT
    }

    return {
        username: userName,
        limit: albumsLimit,
        period: period
    }
}

function getCurrentQueryData() {
    var queryData = getLocationHashData()

    if (!queryData.username) {
        queryData.username = $username.value
    }

    if (!queryData.limit) {
        queryData.limit = $limit.value
    }

    if (!queryData.period) {
        var $queryPeriod = document.querySelector('.queryPeriod[checked]'),
            queryPeriod = ($queryPeriod && $queryPeriod.value) || undefined

        queryData.period = queryPeriod || PERIOD_DEFAULT
    }

    return queryData
}

function search(e) {
    var queryData = getCurrentQueryData()

    var iterationTweenCreate = function (i) {
        var object = scene.children[i];
        var delay = i * 15;

        new TWEEN.Tween(object.position)
            .to({y: -2000}, 1000)
            .delay(delay)
            .easing(TWEEN.Easing.Exponential.In)
            .onComplete(function () {
                scene.remove(object);
            })
            .start();
    }

    for (var i = 0, l = scene.children.length; i < l; i++) {
        iterationTweenCreate(i)
    }

    var request = new XMLHttpRequest();
    request.onload = onDataLoad;
    request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums'
    + '&user='
    + queryData.username
    + '&limit=' + queryData.limit
    + '&period=' + queryData.period
    + '&api_key=fcfd991478621a157658d78e5adca975&format=json', true);

    request.send(null);

    if (e) {
        updateControls(queryData)
    }
}

function onDataLoad(event) {

    var data = JSON.parse(event.target.responseText);
    // obj['theTeam'].push({"teamId":"4","status":"pending"});
    // jsonStr = JSON.stringify(obj);

    if (!data || !data.topalbums || !data.topalbums.album) {
        return
    }

    var entries = data.topalbums.album;

    if (entries && !(entries instanceof Array)) {
        entries = [entries]
    }

    var currentQueryData = getCurrentQueryData();

    for (var i = 0; i < entries.length; i++) {

        (function (data, time) {

            setTimeout(function () {
                scene.add(new Element(data, currentQueryData));
            }, time);

        })(entries[i], i * 15);

    }
}

function move(delta) {

    for (var i = 0; i < scene.children.length; i++) {

        var object = scene.children[i];

        object.position.z += delta;

        if (object.position.z > 0) {
            object.position.z -= 5000;
        }
        else if (object.position.z < -5000) {
            object.position.z += 5000;
        }

    }

}

function onMouseWheel(event) {
    move(event.wheelDelta);
    auto = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    if (auto === true) {
        move(7);
    }

    renderer.render(scene, camera);
}

//TODO:
//добавить плитку титров
//добавить шеры
//картинки шеров
//фавиконка
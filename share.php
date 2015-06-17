<?php
$username = '';
$limit = 20;
$album = '';

//$self_url = 'http://' . $_SERVER['HTTP_HOST'] . '/' . ltrim(reset(explode('?', $_SERVER['REQUEST_URI'])), '/ ');
$self_url = 'http://' . $_SERVER['HTTP_HOST'] . '/' . ltrim($_SERVER['REQUEST_URI'], '/ ');

if (!empty($_GET['user']))
{
    $username = htmlspecialchars(trim((string)$_GET['user']));
}

if (!empty($_GET['limit']))
{
    $limit = (int)$_GET['limit'];
}

if (!empty($_GET['album']))
{
    $album = trim((string)$_GET['album']);
}

if (!$limit || !$username || !$album)
{
    return;
}

$album_query = '';

if (!empty($_GET['artist']))
{
    $album_query = http_build_query(array(
        'album' => $album,
        'artist' => $_GET['artist']
    ));
}
else
{
    $album_query = http_build_query(array(
        'mbid' => $album
    ));
}

$query_response = file_get_contents("http://ws.audioscrobbler.com/2.0/?method=album.getinfo&{$album_query}&api_key=fcfd991478621a157658d78e5adca975&format=json");

if (!$query_response || !($query_response = json_decode($query_response, true)) || empty($query_response['album']))
{
    return;
}

$album = $query_response['album'];
$artist = $name = $cover = '';

$artist = $album['artist'];
$name = $album['name'];

if (!empty($album['image']))
{
    $cover = end($album['image']);

    if ($cover)
    {
        $cover = $cover['#text'];
    }
    else
    {
        $cover = '';
    }
}

$redirect_to = dirname($self_url) . "/#$username/$limit";
?>
<!DOCTYPE html>
<html>
<head>
    <title></title>

    <meta property="og:title" content="I like <?= $username ?>'s top album: <?= $artist ?> — <?= $name ?>" />
    <meta property="og:description"
          content="Visit <?= $username ?>'s Last.fm stars project"/>
    <meta property="og:url" content="<?= $self_url ?>" />
    <? if ($cover) : ?>
        <meta property="og:image" content="<?= $cover ?>"/>
    <? endif ?>

    <meta http-equiv="refresh" content="0; url=<?php echo $redirect_to ?>" />

    <script>
        setTimeout(function () {
            if (window.location.replace) {
                window.location.replace('<?php echo $redirect_to ?>')
            }
            else {
                window.location.href = '<?php echo $redirect_to ?>'
            }
        }, 3000)
    </script>
</head>
<body>
</body>
</html>
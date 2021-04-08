<?php
/*
    $curl = curl_init();
    if($_POST['eng']) {
        $url = "https://kanjialive-api.p.rapidapi.com/api/public/search/advanced?kem=" . $_POST['eng'];
    }
    else if($_POST['kanji'] != "") {
        $url = "https://kanjialive-api.p.rapidapi.com/api/public/kanji/" . urlencode($_POST['kanji']);
    }
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: kanjialive-api.p.rapidapi.com",
            "x-rapidapi-key: 5af280a1a3msha13a1a969c99590p1b41c8jsn3ba7bbb7cff0"
        ],
        CURLOPT_ENCODING => "utf-8",
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    
    curl_close($curl);
    
    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
    */
    $curl = curl_init();
    if($_POST['eng']) {
        $url = "https://jisho.org/api/v1/search/words?keyword=" . urlencode($_POST['eng']);
    }
    else if($_POST['kanji'] != "") {
        $url = "https://kanjialive-api.p.rapidapi.com/api/public/kanji/" . urlencode($_POST['kanji']);
    }
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_ENCODING => "utf-8",
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    
    curl_close($curl);
    
    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
?>
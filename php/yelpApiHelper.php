<?php

require_once ('OAuth.php');
// session_start();

$location = $_GET['coords'];

//request url
$unsigned_url = "http://api.yelp.com/v2/search?term=food&ll=".$location."&radius_filter=500";

$consumer_key = "_BOgrYWtudMVJT5btQt68A";
$consumer_secret = "MNBMvD1A_OvRK7eT8hgSNBWHsAs";
$token = "OflGoG9cjrz4x8qfTDqvpFKz9ZtzLVxC";
$token_secret = "zaGvigsHMRIiv5_u526vTekMtfs";

$token = new OAuthToken($token, $token_secret);
$consumer = new OAuthConsumer($consumer_key, $consumer_secret);
$signature_method = new OAuthSignatureMethod_HMAC_SHA1();

$oauthrequest = OAuthRequest::from_consumer_and_token($consumer, $token, 'GET', $unsigned_url);
$oauthrequest->sign_request($signature_method, $consumer, $token);
$signed_url = $oauthrequest->to_url();

// send call to yelp api
$ch = curl_init($signed_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
$data = curl_exec($ch); // Yelp response
curl_close($ch);

// send back to front-end
echo ($data);

?>
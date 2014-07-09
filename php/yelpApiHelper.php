<?php

require_once ('OAuth.php');
// session_start();

$location = $_GET['coords'];

//request url
$unsigned_url = "http://api.yelp.com/v2/search?term=food&ll=".$location."&radius_filter=500";

$consumer_key = "INSERT KEY HERE";
$consumer_secret = "INSERT KEY HERE";
$token = "INSERT KEY HERE";
$token_secret = "INSERT KEY HERE";

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

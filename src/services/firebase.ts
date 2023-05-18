import admin, { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'e-tour-387007',
  private_key_id: 'c82e9a6505c8ddae178067f8b7976ed1f19e07aa',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmIatpE6At6zfB\nwD/zETw006zynwlVOAEZZNdra4PIZg2Sm/0fBfrR9GafhRglavcM9iXhp264phi5\nDT/5RidAK8xv+ESfAlULj2hYz7nBHPBxmdi7MFLmWtRTauPVhpBpF4AumrdkOFBf\nv86i68/FE9z43OgoMpllWNGyw5mBc4jaQIwLNzUIvKcVSyiWJLNpsdJZa5qYIoRL\nP+AswvxACu4hLEbHfuwUfdbJq3lTE6ADtvcnE6kjchyX+M3rrHqx7JMAslYapLCf\nkkmLqoQek3zb92TntGgxRZly4rdnPlyiNIk7P7Br6TzephTqk2q371fIk3ZoKC91\nx+cJcOqrAgMBAAECggEAIrRU5PHzG7SP5LsfAM1gaN6xOcvMPM+ityXQNIH0uRfM\njQxl/6WVpGdsSrWYejSSoFQJTM7Xu94CuyGP9ChaCbc8kUVpPFhV4MDX+PmH4dYE\nSo7rbgslvjZKNZTWPGRMZY/BuLqcReTXsXDVn0YolJBWMGyhWMhdMAUyZSgkOJzN\n4qvYnv21QYo+/Aez1JxdTqk/gvW83eUHhc9Yemu317jTorOhqBDwsaS1q5qchZco\nGbLw22L8SxEGZmOR7Ykkkj/Q6gHMf3W00Xh2+i2DJSSZaTaKRzUk/FDmRG0QF05U\nkyc5gBxslW5YyGt3VxEVzWJPrIQ4JzvW3uFACqN02QKBgQDknWM2ScWj2qXmd8F2\nz42l2sD1Cgviv/6pqX70JjhrrUCTLjAkQXKeERbvNAb1s5RNp5NM9B44yJZvRWVe\n8hFG9UnP5N/Yu2+gDB7rpYKZart8JDcKNf+2wYdJi3+T+QOP91O5we5p40fMYA8m\nsNy/iL4K1f47zUpObdFCIfSyQwKBgQC6CDG6V1RV9vbB/nOpAACCEAdwv6EX6vQK\nv2Tl+K57FHTIETT9+11JIZpSP2gOv/luv3MPZtxs7DNDpW6jGMa9rp930fAn3/Je\nhRWere2NBsdvNHTih3ToKP9dXtccIYvQyBcEKWO8u8FYbuCvLkowNdaGVDjmIfVf\nW61TkxijeQKBgA9duM5sVPl3d9Eu2XUX7EhqlK+jtjrOdtqGhv74FrC+G2oJH7lA\nIOkY8vavA4y+Pkid69uvSNy+NsZR3sdr89dWI1jy5EzYBF+4kNd773RKZUGp2X05\nNe/dwC8kTjXu9dtWX21L6K97VFcbWcla9+tz0Ho/+e+hE86DuR391EmrAoGAO5oG\nfKIgFg6yzkJ8weeLQiBqkdgDf8s59vuNExUSqcJLDBJfPQQ8xgJrE/DWoOsmujHC\nZmvZMViXsBOfl8eHXRxGYTg0zkG0wE25OIaW9jj2yo0u6ajmbr872alaF9wzlGeW\n4DF2j/BDqNaVS+rzv/Bv08fGFw1INQ4FQSJ+oVkCgYBfkh20OLG/B43lJa4S+k4k\n1QiNafS+u5B5mCY5QMt6gxEa0gmP0VVYwTFSLezHuQlOJgKqGhqmJdtEdK+NUpsI\nZ+Jy1rEhXDZ2OCHofw1kroYXyZaqO2fzsalj9edWi5sV4XJi2FL6ulQxnF4Q23qB\ngsqMyCV4B8zJfylLfHqdgw==\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-lrnpa@e-tour-387007.iam.gserviceaccount.com',
  client_id: '112298868498090507953',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lrnpa%40e-tour-387007.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
} as ServiceAccount;

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseApp;

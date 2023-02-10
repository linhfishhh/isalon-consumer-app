## Generate Hashkey for Facebook
### Debug
```sh
keytool -exportcert -alias androiddebugkey -keystore debug.keystore | openssl sha1 -binary | openssl base64
```
### Release
```sh
keytool -exportcert -alias <aliasName> -keystore <keystoreFilePath> | openssl sha1 -binary | openssl base64
```
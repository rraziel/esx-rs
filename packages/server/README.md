# @esx-rs/server

HTTP request dispatch for ESX-RS endpoints, where:

- incoming HTTP requests are mapped to method calls
- the result of such method calls gets mapped to an HTTP response
- any raised exception gets mapped to an HTTP response

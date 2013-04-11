require 'socket'
require 'net/https'
require 'uri'

server = TCPServer.open('localhost',8800)

loop {
  client = server.accept
    client.write "HTTP/1.1 200 OK\r\n"
    client.write "Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1\r\n\r\n"
    client.write "<html><body>Closing the connection. Bye!</body>"
    client.write "<script> alert(document.cookie); </script></html>"
    client.close
}
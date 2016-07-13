docker run -it --name server -v /home/dbourasseau/project/temu_web/gentelella/input/default.conf:/etc/nginx/conf.d/default.conf -v /home/dbourasseau/project/temu_web/gentelella/input:/usr/share/nginx/html --cap-add NET_ADMIN nginx

